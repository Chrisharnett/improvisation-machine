import { useState, useEffect } from "react";
import { useToken } from "./useToken";

const useUser = () => {
  const [token] = useToken();

  const getPayloadFromToken = (token) => {
    const encodedPayload = token.split(".")[1];
    return JSON.parse(atob(encodedPayload));
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
