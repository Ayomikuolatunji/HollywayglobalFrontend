import CookiesSession from "./Cookies";
var LoginStorage = function (key, token, checked) {
    if (checked) {
        CookiesSession.set(key, token, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "strict",
            secure: true,
        });
    }
    else {
        CookiesSession.set(key, token, {
            path: "/",
            secure: true,
            sameSite: "strict",
        });
    }
};
export default LoginStorage;
//# sourceMappingURL=LoginStorage.jsx.map