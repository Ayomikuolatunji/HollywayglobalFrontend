import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import { useRouter } from "next/router";
import Cookies from "../../helpers/Cookies";
import { useAdminSignupMutation } from "../../redux/apis/authApi";
import { Error } from "../../models/AxioError";

const schema = yup
  .object({
    username: yup.string().required(),
    email: yup.string().email().required("Email is required"),
    password: yup.string().required(),
    comfirmPassword: yup.string().required(),
  })
  .required();

interface adminSignTypes {
  username: string;
  email: string;
  password: string;
  comfirmPassword: string;
}

const AdminSignup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<adminSignTypes>({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [adminSignup] = useAdminSignupMutation();
  const router = useRouter();

  useEffect(() => {
    if (Cookies.get("admin_token")) {
      router.push("/admin-dashboard");
    }
  }, [router]);

  const onSubmit: SubmitHandler<adminSignTypes> = async (data) => {
    try {
      setLoading(true);
      const { email, username, password, comfirmPassword } = data;
      if (password !== comfirmPassword) {
        toast.error("password and confirm password not equal", {
          toastId: "signup-password-not-equal-id",
        });
        return;
      }
      const res = await adminSignup({
        username: username,
        email: email,
        password: password,
      }).unwrap();
      toast.success("Admin created successfully", {
        toastId: "res-success",
      });
      window.location.href = "/admin-login";
    } catch (error: any) {
      const err = error as Error;
      if (error) {
        toast.error(err?.data.message, {
          toastId: "main-response-error",
        });
      } else {
        toast.error("something went wrong", {
          toastId: "main-response-error-id__2",
        });
      }
      console.log(error);
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
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/assets/logo.png"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Signup your admin dashboard
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
              <label htmlFor="username" className="sr-only">
                Admin username
              </label>
              <input
                id="username"
                type="username"
                autoComplete="username"
                {...register("username", { required: true })}
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                {...register("email", { required: true })}
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
                type="password"
                autoComplete="current-password"
                {...register("password", { required: true })}
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div className="mt-8">
              <label htmlFor="comfirmPassword" className="sr-only">
                Comfirm Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("comfirmPassword", { required: true })}
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-5">
            <div className="text-sm">
              <Link href={"/admin-login"} passHref>
                <a>Login admin</a>
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
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
