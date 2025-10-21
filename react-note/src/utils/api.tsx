type FetchProps = {
  path: string;
  method: string;
  body?: object;
};

const Fetch = async ({ path, method, body }: FetchProps) => {
  const token = localStorage.getItem("auth_token");

  const Body = body !== undefined ? JSON.stringify(body) : undefined;

  const fetchOptions: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    ...(Body && { body: Body }),
  };

  const response = await fetch(
    "http://100.110.201.56:8000/" + path,
    fetchOptions,
  );

  return response;
};

export default Fetch;
