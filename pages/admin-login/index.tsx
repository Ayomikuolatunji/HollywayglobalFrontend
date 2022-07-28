import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from 'next/router'
import * as yup from "yup";


import * as UI from "../../components";
import { IFormValues } from "../../components/InputField/InputField";
import LoginStorage from "../../helpers/LoginStorage";
import { toast } from "react-toastify";
import Cookies from "../../helpers/Cookies";
import { useAdminLoginMutation } from "../../redux/apis/authApi";
import { Error, loginData } from "../../models/authTypings";


const schema = yup
  .object({
    email: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

const AdminLogin = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter()



  const [adminLogin, { data }] = useAdminLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (Cookies.get("admin_token")) {
        router.push("/")
    }
  }, [router]);

  useEffect(()=>{
    if(isLoggedIn){
       setTimeout(()=>{
        window.location.href = "/admin-dashboard";
       },2000)
    }
  },[isLoggedIn])

  useEffect(() => {
    if (data) {
      const getData = data as unknown as loginData;
      LoginStorage("admin_token",getData?.token, rememberMe);
      toast.success("login successful", {
        toastId: "login-success-id",
      });
      setIsLoggedIn(true)
    }
  }, [data]);

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    try {
      await adminLogin({
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
      console.log(error);
    }
  };

  return (
    <form className="bg-white mt-4 border-[1px] border-[#d7d7d7] h-auto relative">
      <div className="flex w-[100%]">
        <div className="personal-information w-[50%] p-3">
          <div className="title">
            <h1 className="text-black text-lg font-extrabold">
              Personal Information
            </h1>

            <h3 className="mt-10">
              If you have an account, sign in with your email address
            </h3>
          </div>
          <div className="form w-[100%]">
            <div className="first-name flex mt-5 items-center">
              <div>
                <label className="text-[#69686c] font-bold">Email</label>
                <span className="text-red-500 text-xl ml-4 mb-5">*</span>
              </div>
              <div className="ml-12">
                <UI.InputField
                  type="email"
                  className="email bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]"
                  isHookForm={true}
                  label="email"
                  required={true}
                  register={register}
                />
                <span className="mt-1">This is a required field.</span>
              </div>
            </div>
            <div className="password flex mt-5 w-[100%] items-center">
              <div>
                <label className="text-[#69686c] font-bold">Password</label>
                <span className="text-red-500 text-xl ml-4 mb-1">*</span>
              </div>
              <div className="ml-12">
                <UI.InputField
                  type="text"
                  className="last-name  bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]"
                  isHookForm={true}
                  label="password"
                  register={register}
                  required={true}
                />
                <span className="mt-1">This is a required field.</span>
              </div>
            </div>
            <div className="newletter flex mt-6 w-[100%] ml-36 items-center">
              <div>
                <input
                  type="checkbox"
                  className="last-name bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]"
                  onChange={() => setRememberMe(!rememberMe)}
                  checked={rememberMe}
                />
              </div>
              <div>
                <label className="text-[#69686c] font-normal ml-3">
                  Remember me on this device
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="left-login-information w-[50%] block p-3">
          <div className="title">
            <h1 className="text-black text-lg font-extrabold">New Customers</h1>
            <h3 className="mt-5">
              Creating an account has many benefits: check out faster, keep more
              than one address, track orders and more.
            </h3>
          </div>
          <div className="create-account-btn mt-12 mb-9 text-center">
            <Link href={"/admin-signup"} passHref>
              <a className="text-white py-2 px-4 -ml-44 bg-red-color hover:bg-gray-500 transition-[background-color] duration-500 ease-in-out font-[600]">
                CREATE AN ACCOUNT
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="create-account-btn mt-12 mb-9 text-center">
        <UI.Button
          className="text-white py-2 px-4 -ml-44 bg-red-color hover:bg-gray-500 transition-[background-color] duration-500 ease-in-out font-[600]"
          text="SIGN IN"
          type="submit"
          onClick={handleSubmit(onSubmit)}
        />
      </div>
      <div className="error text-center">
        <span className="text-red-500 text-xl">
          {errors.email?.type && "All fields are required"}
        </span>
      </div>
    </form>
  );
};

export default  AdminLogin;
