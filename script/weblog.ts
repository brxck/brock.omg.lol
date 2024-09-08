import { watch } from "fs/promises";
import { omg } from "./omg";
import { reloader, reloadScript } from "./reloader";
import { simpleGit } from "simple-git";
import mime from "mime";
import path from "path";

const WEBLOG_TYPES = ["entry", "file", "template"];
type WebLogType = (typeof WEBLOG_TYPES)[number];

function isValidType(type: string): type is WebLogType {
  return WEBLOG_TYPES.includes(type as WebLogType);
}

function setUnlisted(content: string) {
  if (content.match(/^Status: \w+/)) {
    return content.replace(/^Status: \w+/, "Status: Unlisted");
  } else {
    return "Status: Unlisted\n" + content;
  }
}

async function update(options: {
  fileName: string;
  type: WebLogType;
  publish?: boolean;
}) {
  const { fileName, type, publish } = options;
  const entryName = path.parse(fileName).name;
  let body = await Bun.file(`weblog/${type}/${fileName}`).text();

  if (!publish && type === "entry") {
    body = setUnlisted(body);
    body += reloadScript;
  }

  if (type === "file") {
    const contentType = mime.getType(fileName);
    body = `Type: file\nContent-Type: ${contentType}\nTitle: ${entryName}\nLocation: ${fileName}\n\n${body}`;
  } else if (type === "template") {
    body = `Type: Template\nTitle: ${entryName}\n\n${body}`;
  }

  const data = await omg(`address/brock/weblog/entry/${entryName}`, {
    method: "POST",
    body,
  });
  console.log(data.message);
}

function del(name: string) {
  const entryName = path.parse(name).name;
  return omg(`address/brock/web/${entryName}`, { method: "DELETE" });
}

async function previewWatch(name: string) {
  console.log("Starting weblog watcher");
  await update({ fileName: name, type: "entry" });

  const watcher = watch("weblog", { recursive: true });
  const { reload } = reloader();

  for await (const event of watcher) {
    console.log(`Detected ${event.eventType} in ${event.filename}`);
    await update({ fileName: name, type: "entry" });
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
      await del(fileName);
    } else {
      await update({ fileName, type, publish });
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
  } else {
    console.error("Unknown command");
    process.exit(1);
  }
}

main();
