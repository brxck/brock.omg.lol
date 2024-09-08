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

  container.innerHTML = `<a href="${post.location}">${post.title}</a>`;
}

main();
