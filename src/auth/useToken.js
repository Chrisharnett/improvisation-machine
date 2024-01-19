import { useState } from "react";

export const useToken = () => {
  const getToken = () => {
    const tokenString = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    if (tokenString) {
      const token = decodeURIComponent(tokenString.split("=")[1]);
      return token ? JSON.parse(token) : null;
    }
    return null;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (newToken) => {
    const saveToken = JSON.stringify({
      id_token: newToken.id_token,
      access_token: newToken.access_token,
      // add refresh_token here if needed later
    });
    const date = new Date();
    const expirationDays = 1;
    date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = `token=${encodeURIComponent(
      saveToken
    )}; path=/; ${expires}`;
    setToken(saveToken);
  };

  const removeToken = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setToken(null);
  };

  return [token, saveToken, removeToken];
};
