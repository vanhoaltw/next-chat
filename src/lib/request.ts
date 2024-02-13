export const request = async <T>(
  url: string,
  options?: Omit<RequestInit, 'body'> & { body?: object }
): Promise<T> => {
  const {
    method = 'GET',
    headers = {
      'Content-Type': 'application/json',
    },
    body = {},
  } = options || {};

  return new Promise((res, rej) =>
    fetch(url, {
      method,
      headers: { ...headers },
      ...(method !== 'GET' ? { body: JSON.stringify(body) } : {}),
    })
      .then((response) => response?.json?.())
      .then(res)
      .catch(rej)
  );
};
