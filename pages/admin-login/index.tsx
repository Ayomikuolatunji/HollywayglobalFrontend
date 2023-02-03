import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import * as yup from "yup";

import { toast } from "react-toastify";
import Cookies from "../../helpers/Cookies";
import { useAdminLoginMutation } from "../../redux/apis/authApi";
import { Error, loginData } from "../../models/authTypings";
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

const AdminLogin = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [adminLogin, { data }] = useAdminLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginTypes>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (Cookies.get("admin_token" || localStorageGetItem("admin_id"))) {
      router.push("/admin-dashboard");
    }
  }, [router]);

  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => {
        window.location.href = "/admin-dashboard";
      }, 2000);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (data) {
      const getData = data as unknown as loginData;
      LocalSession("admin_token", getData?.token, rememberMe);
      localStorageSetItem("admin_id", getData.adminId);
      toast.success("Login successful", {
        toastId: "login-success-id",
      });
      setIsLoggedIn(true);
    }
  }, [data]);

  const onSubmit: SubmitHandler<loginTypes> = async (data) => {
    try {
      setLoading(true);
      await adminLogin({
        email: data.email,
        password: data.password,
      })
        .unwrap()
        .then((data) => {
          toast.success("Login successfully", {
            toastId: "admin-login-success-id",
          });
        });
      setLoading(false);
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
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/assets/logo.png"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign into your admin dashboard
          </h2>
        </div>
        <form
          className="mt-8 space-y-6"
          action="#"
          method="POST"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm">
            <div className="my-8">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                {...register("email", { required: true })}
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="mt-8">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                {...register("password", { required: true })}
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <div className="flex items-center justify-between mt-5">
            <div className="text-sm">
              <Link href={"/admin-signup"} passHref>
                <a>Register your admin</a>
              </Link>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
