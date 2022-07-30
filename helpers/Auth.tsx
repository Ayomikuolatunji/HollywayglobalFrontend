import Cookies from "./Cookies";

const isAuthenticated = (key: string) => {
  return Cookies.get(key) !== undefined;
};

export const getAppCredentials = (key:string) => {
  if (isAuthenticated(key)) {
    return {
      admin_id: localStorage.getItem("admin_id"),
      admin_token: Cookies.get("admin_token"),
    };
  } else if (isAuthenticated(key)) {
    return {
      user_id: localStorage.getItem("user_id"),
      user_token: Cookies.get("user_token"),
    };
  }
};

export default  isAuthenticated 
