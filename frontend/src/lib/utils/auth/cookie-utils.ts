import Cookies from "js-cookie";
import { AUTH_TOKEN_COOKIE_KEY } from "./middleware-cookie";

const getClientCookie = (key: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  return Cookies.get(key);
};

const setClientCookie = (key: string, value: string): void => {
  Cookies.set(key, value, {
    path: "/",
    sameSite: "lax",
  });
};

const removeClientCookie = (key: string): void => {
  Cookies.remove(key, {
    path: "/",
  });
};

export const getUserToken = (): string | undefined => getClientCookie(AUTH_TOKEN_COOKIE_KEY);

export const setUserToken = (token?: string): void => {
  if (token) {
    setClientCookie(AUTH_TOKEN_COOKIE_KEY, token);
  } else {
    removeClientCookie(AUTH_TOKEN_COOKIE_KEY);
  }
};
