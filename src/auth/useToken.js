import { useState } from "react";

export const useToken = () => {
  const getToken = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    return token ? token.split("=")[1] : null;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (newToken) => {
    const saveToken = JSON.stringify(newToken);
    document.cookie = `token=${saveToken}; path=/`;
    setToken(saveToken);
  };

  const removeToken = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setToken(null);
  };

  return [token, saveToken, removeToken];
};
