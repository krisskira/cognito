### Configuracion de AWS Cognito en NEXT JS

- Instalar los siguites paquetes:

```
#bash
"@aws-amplify/ui-react": "^6.1.1",
"aws-amplify": "^6.0.12",
"jwt-decode": "^4.0.0",
```

- Definir la instancia de Amplify.config() en lo mas alto del proyecto, para consegir esto creamos un hook, en donde en el inicio del fichero inicializamos la instancia de amplify, y luego un warapper para observer los eventos de signin y singout

```Amplify.Configure.tsx
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
```

- Definimos el Listener de los eventos de amplify (Nuestro caso signin y signout)

```useAuthListener.tsx
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
```

- Usamos el Wrapper anterior para envolver la aplicacion completamente desde el layout principal.

```src/app/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AmplifyWrapper>{children}</AmplifyWrapper>
      </body>
    </html>
  );
```

- (Opción 1) Podemos envolver nuestras pages en un componente de DropIn UI que ofrece Amplify el cual se encagara de proteger las rutas y la gestion de la autenticacon, este nos da todas las facilidades para la personalizacion:

```src/config/amplify.tsx
import { Authenticator, WithAuthenticatorOptions } from "@aws-amplify/ui-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const AmplifyFormAuthOptions: WithAuthenticatorOptions["formFields"] = {
  signIn: {
    username: {
      type: "email",
      placeholder: "Email",
      labelHidden: true,
      autocomplete: "email",
    },
    password: {
      type: "password",
      placeholder: "Password",
      labelHidden: true,
    },
  },
};

export default function RouteWithAuthentication({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Authenticator
      components={{
        SignIn: {
          Header: () => {
            const { replace } = useRouter();
            return (
              <div className="flex flex-col w-full py-3">
                <button
                  className="flex h-5 bg-white py-4 right-0 justify-end"
                  onClick={() => {
                    replace("/login");
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="red"
                    height={24}
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    width={24}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div className="flex-col w-full">
                  <h1 className="text-2xl text-center font-semibold tracking-tight">
                    Sign In
                  </h1>
                </div>
              </div>
            );
          },
          Footer() {
            return (
              <div className="grid gap-6">
                <Authenticator.SignIn.Footer />
                <div className="w-full p-8 items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className=" flex justify-center text-xs uppercase bg-white">
                      <span
                        className="px-2 z-10 text-muted-foregroun bg-white"
                        style={{
                          backgroundColor: "#fff",
                          zIndex: 999,
                          color: "#ccc",
                        }}
                      >
                        {`You don't have an account?`}
                      </span>
                    </div>
                  </div>
                  <div className="py-4 w-full flex flex-1 h-[52px] flex-col">
                    <Link
                      className="w-full flex"
                      href="/signup"
                      legacyBehavior
                      passHref
                    >
                      <button className="my-4 w-full mb-8">
                        Create Account
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          },
        },
      }}
      formFields={{
        signIn: {
          username: {
            type: "email",
            placeholder: "Email",
            autocomplete: "email",
            labelHidden: true,
          },
          password: {
            type: "password",
            placeholder: "Password",
            labelHidden: true,
          },
        },
      }}
      hideSignUp={true}
      socialProviders={["google"]}

      variation="modal"
    >
      {children}
    </Authenticator>
  );
}
```

- (Opción 2) Se puede hacer una interfaz de usuario totalmente desde cero haciendo uso de las siguietes funciones:

```src/app/(session)/login/page.tsx
import { confirmSignUp, signIn, signInWithRedirect } from "aws-amplify/auth";
import "aws-amplify/auth/enable-oauth-listener";

    signInWithRedirect({
    provider: "Google",
    customState: "KHE",
    options: {
    // preferPrivateSession: true,
    },
    });
```

## Nota
En AWS se debe dejar configuraco los dominios desde donde la aplicación estara corriendo, e,g, mi. para el provider a utilizar. 