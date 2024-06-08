type JSON =
  "post_calls" |
  "cities" |
  "countries" |
  "regions" |
  "ua_browser" |
  "ua_device" |
  "ua_os" |
  "project";

export const tinybirdRequest = async(
  pipe: JSON,
  params: Record<string, string>,
  bearerToken: string
): Promise<unknown> => {

  const url = new URL(`https://api.tinybird.co/v0/pipes/${pipe}.json`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${bearerToken}`
    }
  });

  return res.json();
};