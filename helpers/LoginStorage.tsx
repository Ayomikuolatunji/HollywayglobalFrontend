import CookiesSession from "./Cookies";

const LoginStorage = (key: string, token: string, checked: boolean) => {
  if (checked) {
    CookiesSession.set(key, token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
      secure: true,
    });
  } else {
    CookiesSession.set(key, token, {
      path: "/",
      secure: true,
      sameSite: "strict",
    });
  }
};

export default LoginStorage;
