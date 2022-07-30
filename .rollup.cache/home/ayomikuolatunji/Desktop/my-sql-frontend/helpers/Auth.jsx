import Cookies from "./Cookies";
var isAuthenticated = function (key) {
    return Cookies.get(key) !== undefined;
};
export default isAuthenticated;
//# sourceMappingURL=Auth.jsx.map