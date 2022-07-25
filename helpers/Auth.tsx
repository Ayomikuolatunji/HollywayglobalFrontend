import Cookies from "./Cookies"


export const isAuthenticated = () => {
   return Cookies.get("token") !== undefined;
}