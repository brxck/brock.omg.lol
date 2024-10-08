import { watch } from "fs/promises";
import { omg } from "../lib/omg";
import { reloader, reloadScript } from "../lib/reload";

async function update(options?: { publish?: boolean }) {
  const body = {
    css: await Bun.file("web/style.css").text(),
    content: await Bun.file("web/content.md").text(),
    head: await Bun.file("web/head.html").text(),
    metadata: await Bun.file("web/metadata.json").json(),
    theme: "naked",
    publish: options?.publish,
  };

  if (!options?.publish) {
    body.content += "\n\n" + reloadScript;
  }

  const data = await omg("address/{address}/web", { method: "POST", body });
  console.log(data);
}

async function updateWatch() {
  console.log("Starting web watcher");
  await update();

  const watcher = watch("web");
  const { reload } = reloader();

  for await (const event of watcher) {
    console.log(`Detected ${event.eventType} in ${event.filename}`);
    await update();
    console.log("Reloading browser");
    reload();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === "watch") {
    await updateWatch();
  } else if (command === "preview") {
    await update();
  } else if (command === "publish") {
    await update({ publish: true });
  } else {
    console.error("Unknown command");
    process.exit(1);
  }
}

main();
