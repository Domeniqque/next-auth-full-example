import axios, { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";
import { saveTokensOnCookies } from "~/utils/saveTokensOnCookies";
import { signOut } from "~/utils/signOut";
import { AuthTokenError } from "./errors/AuthTokenError";

let isRefreshing = false;
let failedRequestsQueue: {
  onSuccess(token: string): void;
  onFailure(err: AxiosError): void;
}[] = [];

export function setupAPIClient(ctx?: GetServerSidePropsContext) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://localhost:3333",
    headers: {
      Authorization: `Bearer ${cookies["nextauth.token"]}`,
    },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError<{ code?: string }>) => {
      if (error.response?.status === 401) {
        if (error.response.data?.code === "token.expired") {
          cookies = parseCookies(ctx);
          const originalConfig = { ...error.config };

          if (!isRefreshing) {
            isRefreshing = true;

            const { "nextauth.refreshToken": refreshToken } = cookies;

            api
              .post("/refresh", { refreshToken })
              .then((response) => {
                const { token } = response.data;

                saveTokensOnCookies(token, response.data.refreshToken, ctx);

                // @ts-ignore
                api.defaults.headers["Authorization"] = `Bearer ${token}`;

                failedRequestsQueue.forEach((req) => req.onSuccess(token));
              })
              .catch((err) => {
                failedRequestsQueue.forEach((request) =>
                  request.onFailure(err)
                );

                if (process.browser) {
                  signOut(ctx);
                }
              })
              .finally(() => {
                failedRequestsQueue = [];
                isRefreshing = false;
              });
          }

          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token: string) => {
                // @ts-ignore
                originalConfig.headers["Authorization"] = `Bearer ${token}`;

                resolve(api(originalConfig));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        } else {
          if (process.browser) {
            signOut();
          } else {
            return Promise.reject(new AuthTokenError());
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
