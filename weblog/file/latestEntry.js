"use strict";

async function main() {
  const container = document.createElement("span");
  container.className = "weblogentry";
  document.currentScript.parentNode.insertBefore(
    container,
    document.currentScript
  );

  const response = await fetch(
    `https://api.omg.lol/address/brock/weblog/post/latest`
  );
  const data = await response.json();
  const post = data.response.post;
  const date = new Date(post.date * 1000);
  const dateString = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });

  container.innerHTML = `<a href="https://${post.address}.weblog.lol${post.location}">"${post.title}" (${dateString})</a>`;
}

main();
