import Cookies from "./Cookies"


const isAuthenticated = (key:string) => {
   return Cookies.get(key) !== undefined;
}

export default isAuthenticated