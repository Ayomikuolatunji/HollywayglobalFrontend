import CookiesSession from "./Cookies";

const LoginStorage = (auth_id:string,key: string, token: string, checked: boolean) => {
  if (checked) {
    CookiesSession.set(key, token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
      secure: true,
    });
    localStorage.setItem(auth_id, token);
  } else {
    CookiesSession.set(key, token, {
      path: "/",
      secure: true,
      sameSite: "strict",
    });
    localStorage.setItem(auth_id, token);
  }
};

export default LoginStorage;
