import { GetServerSidePropsContext } from "next";
import { setCookie } from "nookies";

export function saveTokensOnCookies(
  token: string,
  refreshToken: string,
  ctx?: GetServerSidePropsContext
) {
  setCookie(ctx, "nextauth.token", token, {
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    path: "/",
  });

  setCookie(ctx, "nextauth.refreshToken", refreshToken, {
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    path: "/",
  });
}
