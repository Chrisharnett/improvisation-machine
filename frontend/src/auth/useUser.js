import { useState, useEffect } from "react";
import { useToken } from "./useToken";

const useUser = () => {
  const [token, , removeToken] = useToken();

  const getPayloadFromToken = (token) => {
    if (!token || typeof token !== "string") {
      console.error("Invalid token:", token);
      removeToken();
      return null;
    }
    const parts = token.split(".");

    if (parts.length !== 3) {
      console.error("Token does not have the expected format:", token);
      removeToken();
      return null;
    }

    try {
      const encodedPayload = parts[1];
      const decodedPayload = atob(encodedPayload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error("Error decoding token:", token, error);
      removeToken();
      return null;
    }
  };

  const [user, setUser] = useState(() => {
    if (!token) {
      return null;
    } else {
      return getPayloadFromToken(token.id_token);
    }
  });

  useEffect(() => {
    if (!token) {
      setUser(null);
    } else {
      setUser(getPayloadFromToken(token.id_token));
    }
  }, [token]);

  return user;
};

export default useUser;

// Add functions for access_token later if needed.
