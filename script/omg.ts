type OmgResponse<T> = T & {
  message: string;
};

export async function omg<T>(
  path: string,
  init?: Omit<RequestInit, "body"> & { body?: string | Record<string, unknown> }
): Promise<OmgResponse<T>> {
  const response = await fetch("https://api.omg.lol/" + path, {
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
