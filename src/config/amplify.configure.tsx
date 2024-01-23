"use client";
import { Amplify } from "aws-amplify";
import React from "react";
import { useAuthListener } from "./useAuthListener";

if (!process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID) {
  throw new Error("Missing NEXT_PUBLIC_COGNITO_USER_POOL_ID");
}
if (!process.env.NEXT_PUBLIC__COGNITO_USER_POOL_CLIENT_ID) {
  throw new Error("Missing NEXT_PUBLIC__COGNITO_USER_POOL_CLIENT_ID");
}
if (!process.env.NEXT_PUBLIC__COGNITO_DOMAIN) {
  throw new Error("Missing NEXT_PUBLIC__COGNITO_DOMAIN");
}

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC__COGNITO_USER_POOL_CLIENT_ID,
      loginWith: {
        email: true,
        oauth: {
          providers: ["Google"],
          responseType: "code",
          scopes: [],
          redirectSignIn: ["http://localhost:3000/"],
          redirectSignOut: ["http://localhost:3000/"],
          domain: process.env.NEXT_PUBLIC__COGNITO_DOMAIN,
        },
      },
    },
  },
});

export function AmplifyWrapper({ children }: { children: React.ReactNode }) {
  useAuthListener(async (hasAuth) => console.log(">>> hasAuth", hasAuth));
  return <>{children}</>;
}
