import { watch } from "fs/promises";
import { omg } from "./omg";

async function update(options?: { prod: boolean }) {
  const dev = await Bun.file("web/dev.md").text();

  const body = {
    css: await Bun.file("web/style.css").text(),
    content: await Bun.file("web/content.md").text(),
    head: await Bun.file("web/head.html").text(),
    metadata: await Bun.file("web/metadata.json").json(),
    theme: "naked",
  };

  if (!options?.prod) {
    body.content += "\n\n" + dev;
  }

  const data = await omg("address/brock/web", { method: "POST", body });
  if (data.error && !options?.prod) {
    console.error(data.error);
    process.exit(1);
  }
  console.log(data);
}

async function publish() {
  const data = await omg("address/brock/web", {
    method: "POST",
    body: { publish: true },
  });
  if (data.error) {
    console.error(data.error);
    process.exit(1);
  }
  console.log(data);
}

async function updateWatch() {
  console.log("Starting web watcher");
  await update();

  const watcher = watch("web");
  const server = Bun.serve({
    port: 4242,
    fetch(req, server) {
      const success = server.upgrade(req);
      console.log(success ? "Websocket connected" : "Websocket failed");
    },
    websocket: {
      message(ws, message) {},
      open(ws) {
        ws.subscribe("reload");
      },
    },
  });

  for await (const event of watcher) {
    console.log(`Detected ${event.eventType} in ${event.filename}`);
    await update();
    console.log("Reloading browser");
    server.publish("reload", "reload");
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
    await update({ prod: true });
    await publish();
  } else {
    console.error("Unknown command");
    process.exit(1);
  }
}

main();
