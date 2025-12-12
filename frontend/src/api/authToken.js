let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
  console.log(token);
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};
