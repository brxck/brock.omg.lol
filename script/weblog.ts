import { watch } from "fs/promises";
import { omg } from "./omg";
import { reloader, reloadScript } from "./reloader";
import { simpleGit } from "simple-git";
import mime from "mime";
import path from "path";

function setUnlisted(content: string) {
  if (content.match(/^Status: \w+/)) {
    return content.replace(/^Status: \w+/, "Status: Unlisted");
  } else {
    return "Status: Unlisted\n" + content;
  }
}

async function update(options: {
  fileName: string;
  type: "entry" | "file" | "template";
  prod?: boolean;
}) {
  const { fileName, type, prod = false } = options;
  const entryName = path.parse(fileName).name;
  let body = await Bun.file(`weblog/${type}/${fileName}`).text();

  if (!prod) {
    body = setUnlisted(body);
    body += reloadScript;
  }

  if (type === "file") {
    const contentType = mime.getType(fileName);
    body = `Type: File\nContent-Type: ${contentType}\n${body}`;
  } else if (type === "template") {
    body = `Type: Template\n${body}`;
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

async function publish() {
  const diff = await simpleGit().diffSummary();
  const files = diff.files.filter((file) => file.file.endsWith(".md"));

  for (const file of files) {
    const [_, type, fileName] = file.file.split("/");
    if (file.status === "deleted") {
      await del(fileName);
    } else {
      await update({
        fileName,
        type: type as "entry" | "file" | "template",
        prod: true,
      });
    }
  }

  console.log("Published successfully!");
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const name = args[1];

  if (command === "watch") {
    await previewWatch(name);
  } else if (command === "preview") {
    await update({ fileName: name, type: "entry" });
  } else if (command === "publish") {
    await publish();
  } else {
    console.error("Unknown command");
    process.exit(1);
  }
}

main();
