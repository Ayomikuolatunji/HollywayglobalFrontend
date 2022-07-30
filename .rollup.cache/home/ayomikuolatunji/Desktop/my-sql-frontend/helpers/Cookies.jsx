import Cookies from 'universal-cookie';
var cookies = new Cookies();
var CookiesSession = /** @class */ (function () {
    function CookiesSession() {
    }
    CookiesSession.prototype.get = function (key) {
        return cookies.get(key);
    };
    CookiesSession.prototype.set = function (name, value, path) {
        cookies.set(name, value, path);
    };
    CookiesSession.prototype.remove = function (name) {
        cookies.remove(name);
    };
    return CookiesSession;
}());
export default new CookiesSession();
//# sourceMappingURL=Cookies.jsx.map