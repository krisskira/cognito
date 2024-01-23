"use client";
import RouteWithAuthentication from "@app/config/amplify";
import { useAuthListener } from "@app/config/useAuthListener";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { signOut } from "aws-amplify/auth";
export default function DashboardLayout(props: { children: ReactNode }) {
  const { replace } = useRouter();
  useAuthListener(async (isAuth) => {
    console.log(">>> isAuth: ", isAuth);
    if (!isAuth) {
      replace("/login");
    }
  });
  return (
    <RouteWithAuthentication>
      <main className="flex min-h-screen flex-col">
        <nav className="flex flex-row p-8 border">
          <h1 className="flex-grow">Dashboard</h1>
          <ul className="flex flex-row justify-center items-center gap-4">
            <li className="">
              <a href="/profile">Profile</a>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
            <li>
              <a
                onClick={() => {
                  signOut({
                    global: true,
                  })
                    .then(() => {
                      replace("/login");
                    })
                    .catch((error) => {
                      console.log(">>> Error al cerrar sesión", error);
                    });
                }}
                href="javascript:void(0)"
              >
                Logout
              </a>
            </li>
          </ul>
        </nav>
        {props.children}
      </main>
    </RouteWithAuthentication>
  );
}
