export function omg(
  path: string,
  init?: Omit<RequestInit, "body"> & { body?: unknown }
) {
  return fetch("https://api.omg.lol/" + path, {
    headers: {
      Authorization: "Bearer " + process.env.OMG_KEY,
    },
    ...init,
    body: init?.body ? JSON.stringify(init.body) : undefined,
  }).then((res) => res.json());
}
