import Cookies from "./Cookies"


const isAuthenticated = () => {
   return Cookies.get("token") !== undefined;
}

export default isAuthenticated