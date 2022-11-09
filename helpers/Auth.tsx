import Cookies from "./Cookies";
import { localStorageGetItem } from "./Storage";

type Type = "admin" | "user";

const isAuthenticated = (key: string) => {
  return Cookies.get(key);
};

export const getAppCredentials = (key: string, type: Type) => {
  if (isAuthenticated(key) && type === "admin") {
    return {
      admin_id: localStorageGetItem("admin_id"),
      admin_token: Cookies.get("admin_token"),
    };
  } else if (isAuthenticated(key) && type === "user") {
    return {
      user_id: localStorage.getItem("userId"),
      user_token: Cookies.get("user_token"),
    };
  }
};

export default isAuthenticated;
