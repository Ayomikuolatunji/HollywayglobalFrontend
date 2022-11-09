import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import * as yup from "yup";
import { toast } from "react-toastify";

import Cookies from "../../helpers/Cookies";
import { useLoginMutation } from "../../redux/apis/authApi";
import { Error, userLoginData } from "../../models/authTypings";
import {
  LocalSession,
  localStorageGetItem,
  localStorageSetItem,
} from "../../helpers/Storage";

const schema = yup
  .object({
    email: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

interface loginTypes {
  email: string;
  password: string;
}

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [login, { data }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginTypes>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (Cookies.get("user_token") || localStorageGetItem("user_id")) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (data) {
      const getData = data as unknown as userLoginData;
      LocalSession("user_token", getData?.token, rememberMe);
      localStorageSetItem("userId", getData.userId);
      toast.success("login successful", {
        toastId: "login-success-id",
      });
      setIsLoggedIn(true);
    }
  }, [data]);

  const onSubmit: SubmitHandler<loginTypes> = async (data) => {
    try {
      await login({
        email: data.email,
        password: data.password,
      }).unwrap();
    } catch (error: any) {
      const err = error as Error;
      if (err) {
        toast.error(err?.data?.message, {
          toastId: "login-response-error",
        });
      } else {
        toast.error("something went wrong", {
          toastId: "login-response-error-id__2",
        });
      }
    }
  };
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.info("All inputs fields are required", {
        toastId: "admin-signup-id",
      });
    }
  }, [errors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} action="#" method="POST" className="w-full">
      <section className="bg-gray-50 dark:bg-gray-900 w-[100%]">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="w-8 h-8 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            />
            Login
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    {...register("password", { required: true })}
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-red-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link href="/signup">
                    <span className="font-bold text-primary-600 hover:underline dark:text-primary-500 cursor-pointer">
                      Sign up
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
};

export default Login;
