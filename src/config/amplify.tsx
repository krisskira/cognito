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
