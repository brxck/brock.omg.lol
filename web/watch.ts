import { watch } from "fs/promises";

async function update() {
  const response = await fetch("https://api.omg.lol/address/brock/web", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.OMG_KEY,
    },
    body: JSON.stringify({
      css: await Bun.file("web/style.css").text(),
      content: await Bun.file("web/content.md").text(),
      head: await Bun.file("web/head.html").text(),
      metadata: await Bun.file("web/metadata.json").json(),
      theme: "naked",
    }),
  });
  const data = await response.json();
  console.log(data);
}

console.log("Starting web watcher");
await update();

const watcher = watch(import.meta.dir);

for await (const event of watcher) {
  console.log(`Detected ${event.eventType} in ${event.filename}`);
  await update();
}
