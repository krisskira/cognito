import { useEffect } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

export const useAuthListener = (
  callback?: (hasAuth: boolean) => Promise<void>
) => {
  useEffect(() => {
    fetchAuthSession()
      .then((session) => {
        console.log(">>> Cognito Session (useAuthListener)", session);
      })
      .catch((error) => {
        console.log(">>> error getting current user: ", error);
      });

    const observer = Hub.listen(
      "auth",
      async ({ payload: { event, message } }) => {
        switch (event) {
          case "signedOut":
            console.log(">>> signedOut");
            callback?.(false);
            break;
          case "signedIn":
            console.log(">>> signedIn");
            callback?.(true);
            break;
          default:
            console.log(">>> Unknown event", event);
            break;
        }
      }
    );
    return () => observer();
  }, [callback]);

  return null;
};
