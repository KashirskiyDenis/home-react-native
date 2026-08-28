export const buildUrl = () => {
  return str;
};

export const checkResponse = (response) => {
  if (!response.ok) {
    const error = new Error();
    if (response.status === 401) error.name = "Unauthorized";
    else if (response.status === 404) error.name = "NotFound";
    else error.name = "NetworkError";

    throw error;
  }

  return response.json();
};
