import CookiesSession from "./Cookies";

const LocalSession = (key: string, token: string, checked: boolean) => {
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

const localStorageSetItem = (key: string, item: string) =>
  window && window.localStorage.setItem(key, item);

const localStorageGetItem = (key: string) =>
  window && window.localStorage.getItem(key);

const localStorageRemoveItem = (key: string) =>
  window && window.localStorage.removeItem(key);

export {
  localStorageGetItem,
  LocalSession,
  localStorageSetItem,
  localStorageRemoveItem,
};
