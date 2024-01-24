"use client";
import { Amplify } from "aws-amplify";
import React from "react";
import { useAuthListener } from "./useAuthListener";
import { Authenticator } from "@aws-amplify/ui-react";

if (!process.env.NEXT_PUBLIC__COGNITO_USER_POOL_ID) {
  throw new Error("Missing NEXT_PUBLIC__COGNITO_USER_POOL_ID");
}
if (!process.env.NEXT_PUBLIC__COGNITO_USER_POOL_CLIENT_ID) {
  throw new Error("Missing NEXT_PUBLIC__COGNITO_USER_POOL_CLIENT_ID");
}
if (!process.env.NEXT_PUBLIC__COGNITO_DOMAIN) {
  throw new Error("Missing NEXT_PUBLIC__COGNITO_DOMAIN");
}

if (!process.env.NEXT_PUBLIC__COGNITO_LOGIN_URL) {
  throw new Error("Missing NEXT_PUBLIC__COGNITO_LOGIN_URL");
}

if (!process.env.NEXT_PUBLIC__COGNITO_LOGOUT_URL) {
  throw new Error("Missing NEXT_PUBLIC__COGNITO_LOGOUT_URL");
}

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC__COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC__COGNITO_USER_POOL_CLIENT_ID,
      loginWith: {
        email: true,
        oauth: {
          providers: ["Google"],
          responseType: "code",
          scopes: ["openid", "email", "profile"],
          redirectSignIn: [process.env.NEXT_PUBLIC__COGNITO_LOGIN_URL],
          redirectSignOut: [process.env.NEXT_PUBLIC__COGNITO_LOGOUT_URL],
          domain: process.env.NEXT_PUBLIC__COGNITO_DOMAIN,
        },
      },
    },
  },
});

export function AmplifyWrapper({ children }: { children: React.ReactNode }) {
  useAuthListener(async (hasAuth) => console.log(">>> hasAuth", hasAuth));
  return <Authenticator.Provider>{children}</Authenticator.Provider>;
}
