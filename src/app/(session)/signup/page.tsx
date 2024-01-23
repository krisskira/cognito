"use client";
import React, { FormEvent, useState } from "react";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { replace } = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await signUp({
      username,
      password,
    })
      .then(async (user) => {
        if (user.nextStep.signUpStep === "CONFIRM_SIGN_UP") {
          const confirmationCode = prompt("Ingresa el código de confirmación");
          if (!confirmationCode) return;
          const result = await confirmSignUp({
            confirmationCode,
            username,
          });
          console.log(">>> Confirmation result", result);
        }
        console.log(">>> Redireccionar aqui", user);
        replace("/profile");
      })
      .catch((error) => {
        console.log(">>> Error al iniciar sesión", error);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto my-8 min-w-[400px]"
    >
      <div className="mb-6">
        <label
          htmlFor="username"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Correo Electrónico
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="usuario123"
          required
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Registrarse
      </button>
      {/* <input
        type="button"
        value={"Registrate con Google"}
        onClick={() => signInWithRedirect({ provider: "Google" })}
        className="w-full mt-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      /> */}
    </form>
  );
};

export default SignUpForm;
