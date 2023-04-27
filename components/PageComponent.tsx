import { Formik } from "formik";
import HasuraLogo from "../public/powered-by-hasura-primary-dark.svg";
import Image from "next/image";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useState } from "react";

export default function PageComponent({ onClick }: any) {
  const [userInfo, setUserInfo] = useState("");
  const [loginError, setLoginError] = useState("");

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
  };
  const app = initializeApp(firebaseConfig);

  // Example POST method implementation:
  async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  const createUser = async (values: any) => {
    const { username, email, password } = values;
    var body = {
      username: username,
      email: email,
      password: password,
      role: "client",
    };

    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: { user: any }) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        onClick();
        postData("http://localhost:8080/api/rest/save-users", { ...body }).then(
          (data) => {
            console.log(data); // JSON data parsed by `data.json()` call
          }
        );
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);

        // ..
      });
    onAuthStateChanged(auth, (user) => {
      console.log(user);
    });
  };

  const handleLogin = async (event: any) => {
    event.preventDefault();
    var emailLogin = (document.getElementById("emailLogin") as HTMLInputElement)
      .value;
    var passwordLogin = (
      document.getElementById("passwordLogin") as HTMLInputElement
    ).value;

    const auth = getAuth();
    signInWithEmailAndPassword(auth, emailLogin, passwordLogin)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        setUserInfo(emailLogin);
        setLoginError("");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoginError(errorMessage);
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center pt-10 lg:pt-40">
        <h1 className="text-2xl font-semibold mb-12 text-gray-800 text-center">
          Hasura db homework and stuff
        </h1>
        <div className="pb-4 text-xl font-semibold"></div>
        <div className="lg:flex w-[80vw] justify-around">
          {/* LOGIN FORM */}
          <form
            onSubmit={(event) => handleLogin(event)}
            className="flex flex-col items-center p-2 justify-center"
          >
            <div className="flex flex-col">
              <div className="text-center mb-4">
                {userInfo ? <p>Hello! - {userInfo}</p> : ""}
                {loginError ? <p>Error! - {loginError}</p> : ""}
              </div>
              <label className="text-md font-semibold text-gray-600">
                E-Mail
              </label>
              <input
                id="emailLogin"
                type="email"
                name="email"
                className="indent-1 mb-2 appearance-none text-slate-900 w-60 min-[450px]:w-96 h-10 shadow-sm outline-none border-b border-gray-400 bg-white focus:border-purple-600 focus:border-b-[3px] transition focus:translate-x-1 focus:-translate-y-0.5"
              />
              <div className="text-red-600 text-sm"></div>
            </div>
            <div className="flex flex-col">
              <label className="text-md font-semibold text-gray-600">
                Password
              </label>
              <input
                id="passwordLogin"
                type="password"
                name="password"
                className="indent-1 mb-2 appearance-none text-slate-900 w-60 min-[450px]:w-96 h-10 shadow-sm outline-none border-b border-gray-400 bg-white focus:border-purple-600 focus:border-b-[3px] transition focus:translate-x-1 focus:-translate-y-0.5"
              />
              <div className="text-red-600 text-sm"></div>
            </div>
            <button
              type="submit"
              className="w-60 min-[450px]:w-96 h-12 mt-4 rounded-md bg-purple-600 text-white font-semibold text-lg transition hover:-translate-y-0.5 active:translate-y-1 hover:bg-purple-500 active:bg-purple-700"
            >
              Log in
            </button>
          </form>

          {/* REGISTER FORM */}
          <Formik
            initialValues={{
              email: "",
              password: "",
              repeatPassword: "",
              username: "",
            }}
            validate={(values) => {
              const errors: any = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              if (!values.password) {
                errors.password = "Required";
              } else if (values.password.length < 8) {
                errors.password = "Password must be at least 8 characters";
              }
              if (!values.repeatPassword) {
                errors.repeatPassword = "Required";
              } else if (values.repeatPassword != values.password) {
                errors.repeatPassword = "Password Mismatch";
              }
              if (!values.username) {
                errors.username = "Required";
              } else if (values.username.length < 6) {
                errors.username = "Username must be at least 6 characters";
              }
              return errors;
            }}
            onSubmit={createUser}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center p-2"
                noValidate
              >
                <div className="flex flex-col">
                  <label className="text-md font-semibold text-gray-600">
                    Username
                  </label>
                  <input
                    onChange={handleChange}
                    name="username"
                    type="username"
                    value={values.username}
                    className="indent-1 mb-2 appearance-none text-slate-900 w-60 min-[450px]:w-96 h-10 shadow-sm outline-none border-b border-gray-400 bg-white focus:border-purple-600 focus:border-b-[3px] transition focus:translate-x-1 focus:-translate-y-0.5"
                  />
                  <div className="text-red-600 text-sm">
                    {errors.username && touched.username && errors.username}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-md font-semibold text-gray-600">
                    E-Mail
                  </label>
                  <input
                    onChange={handleChange}
                    name="email"
                    type="email"
                    value={values.email}
                    className="indent-1 mb-2 appearance-none text-slate-900 w-60 min-[450px]:w-96 h-10 shadow-sm outline-none border-b border-gray-400 bg-white focus:border-purple-600 focus:border-b-[3px] transition focus:translate-x-1 focus:-translate-y-0.5"
                  />
                  <div className="text-red-600 text-sm">
                    {errors.email && touched.email && errors.email}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-md font-semibold text-gray-600">
                    Password
                  </label>
                  <input
                    onChange={handleChange}
                    name="password"
                    type="password"
                    value={values.password}
                    className="indent-1 mb-2 appearance-none text-slate-900 w-60 min-[450px]:w-96 h-10 shadow-sm outline-none border-b border-gray-400 bg-white focus:border-purple-600 focus:border-b-[3px] transition focus:translate-x-1 focus:-translate-y-0.5"
                  />
                  <div className="text-red-600 text-sm">
                    {errors.password && touched.password && errors.password}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-md font-semibold text-gray-600">
                    Repeat Password
                  </label>
                  <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="repeatPassword"
                    type="password"
                    value={values.repeatPassword}
                    className="indent-1 mb-2 appearance-none text-slate-900 w-60 min-[450px]:w-96 h-10 shadow-sm outline-none border-b border-gray-400 bg-white focus:border-purple-600 focus:border-b-[3px] transition focus:translate-x-1 focus:-translate-y-0.5"
                  />
                  <div className="text-red-600 text-sm">
                    {errors.repeatPassword &&
                      touched.repeatPassword &&
                      errors.repeatPassword}
                  </div>
                </div>
                <button
                  data-modal-target="defaultModal"
                  data-modal-toggle="defaultModal"
                  type="submit"
                  className="w-60 min-[450px]:w-96 h-12 mt-4 rounded-md bg-purple-600 text-white font-semibold text-lg transition hover:-translate-y-0.5 active:translate-y-1 hover:bg-purple-500 active:bg-purple-700"
                >
                  Register
                </button>
              </form>
            )}
          </Formik>
        </div>
        <div className="h-24 lg:h-64" />
        <Image src={HasuraLogo} alt="" className="w-28 lg:w-36 m-4" />
      </div>
    </div>
  );
}
