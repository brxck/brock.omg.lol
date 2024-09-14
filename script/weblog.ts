import { watch } from "fs/promises";
import { omg } from "../lib/omg";
import { reloader, reloadScript } from "../lib/reload";
import { simpleGit } from "simple-git";
import mime from "mime";
import path from "path";

const WEBLOG_TYPES = ["entry", "file", "template"];
type WebLogType = (typeof WEBLOG_TYPES)[number];

function isValidType(type: string): type is WebLogType {
  return WEBLOG_TYPES.includes(type as WebLogType);
}

function mergeMeta(entry: string, values: Record<string, string | null>) {
  let updated = entry;
  let newMeta = "";
  for (const [key, value] of Object.entries(values)) {
    const pattern = new RegExp(`^${key}: .+$`, "gm");
    if (updated.match(pattern)) {
      updated = updated.replace(pattern, `${key}: ${value}`);
    } else {
      newMeta += `${key}: ${value}\n`;
    }
  }

  if (newMeta.length === 0) {
    return updated;
  }

  const pattern = /^\w+: .+$/gm;
  if (updated.match(pattern)) {
    return updated.replace(pattern, newMeta + "$&");
  } else {
    return newMeta + "\n" + updated;
  }
}

async function updateEntry(options: {
  fileName: string;
  type: WebLogType;
  publish?: boolean;
}) {
  const { fileName, type, publish } = options;
  const entryName = path.parse(fileName).name;
  let body = await Bun.file(`weblog/${type}/${fileName}`).text();

  if (!publish && type === "entry") {
    body = mergeMeta(body, {
      Status: "Unlisted",
      // Should not be returned by the /latest API
      Date: "1970-01-01 00:00",
    });
    body += reloadScript;
  }

  if (type === "file") {
    const contentType = mime.getType(fileName);
    body = mergeMeta(body, {
      Type: "file",
      "Content-Type": contentType,
      Title: entryName,
      Location: fileName,
      Date: "1970-01-01 00:00",
    });
  } else if (type === "template") {
    body = mergeMeta(body, {
      Type: "Template",
      Title: entryName,
      Date: "1970-01-01 00:00",
    });
  }

  const data = await omg(`address/{address}/weblog/entry/${entryName}`, {
    method: "POST",
    body,
  });
  console.log(data.message);
}

function deleteEntry(name: string) {
  const entryName = path.parse(name).name;
  return omg(`address/{address}/web/${entryName}`, { method: "DELETE" });
}

async function updateConfig() {
  await omg(`address/{address}/weblog/configuration`, {
    method: "POST",
    body: await Bun.file("weblog/weblog.conf").text(),
  });
  await omg(`address/{address}/weblog/template`, {
    method: "POST",
    body: await Bun.file("weblog/template.html").text(),
  });
}

async function previewWatch(name: string) {
  console.log("Starting weblog watcher");
  await updateEntry({ fileName: name, type: "entry" });

  const watcher = watch("weblog", { recursive: true });
  const { reload } = reloader();

  for await (const event of watcher) {
    console.log(`Detected ${event.eventType} in ${event.filename}`);
    await updateEntry({ fileName: name, type: "entry" });
    console.log("Reloading browser");
    reload();
  }
}

async function updateAll(options: {
  base: string;
  head: string;
  publish: boolean;
}) {
  const { base, head, publish } = options;
  console.log((publish ? "Publishing" : "Previewing") + " weblog...");
  console.log(`Base: ${base}, Head: ${head}`);

  const diff = await simpleGit()
    .fetch(`origin ${base}`)
    .diffSummary(["--name-status", "--no-renames", base, head]);

  for (const file of diff.files) {
    const [dir, type, fileName] = file.file.split("/");

    if (dir !== "weblog" || !isValidType(type) || !fileName) {
      continue;
    }

    console.log(`${file.status} ${fileName}`);

    if (file.status === "D" && publish) {
      await deleteEntry(fileName);
    } else {
      await updateEntry({ fileName, type, publish });
    }
  }

  console.log("Updated successfully!");
}

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (command === "watch") {
    await previewWatch(args[0]);
  } else if (command === "preview") {
    const [base, head] = args;
    await updateAll({ base, head, publish: false });
  } else if (command === "publish") {
    const [base, head] = args;
    await updateAll({ base, head, publish: true });
    await updateConfig();
  } else {
    console.error("Unknown command");
    process.exit(1);
  }
}

main();
