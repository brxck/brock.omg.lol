type OmgResponse<T> = T & {
  message: string;
};

export async function omg<T>(
  path: string,
  init?: Omit<RequestInit, "body"> & { body?: string | Record<string, unknown> }
): Promise<OmgResponse<T>> {
  const url = `https://api.omg.lol/${path}`.replace(
    "{address}",
    process.env.OMG_ADDRESS!
  );

  const response = await fetch(url, {
    headers: {
      Authorization: "Bearer " + process.env.OMG_KEY,
    },
    ...init,
    body:
      typeof init?.body === "object" ? JSON.stringify(init.body) : init?.body,
  });

  const data = await response.json();
  if (!response.ok) {
    console.error(path, data);
    throw new Error(data?.response?.message ?? response.statusText);
  }
  return data.response;
}
