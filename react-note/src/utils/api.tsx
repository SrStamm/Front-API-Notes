type FetchProps = {
  path: string;
  body?: object;
};

const Fetch = async ({ path, body }: FetchProps) => {
  const token = localStorage.getItem("auth_token");

  const Body = body !== undefined ? body : undefined;

  const response = await fetch("http://100.110.201.56:8000" + path, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: Body,
  });

  return response;
};

export default Fetch;
