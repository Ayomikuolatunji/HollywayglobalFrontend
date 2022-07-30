import { __awaiter, __generator } from "tslib";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import * as yup from "yup";
import * as UI from "../../components";
import LoginStorage from "../../helpers/LoginStorage";
import { toast } from "react-toastify";
import Cookies from "../../helpers/Cookies";
import { useAdminLoginMutation } from "../../redux/apis/authApi";
var schema = yup
    .object({
    email: yup.string().required(),
    password: yup.string().required(),
})
    .required();
var AdminLogin = function () {
    var _a;
    var _b = useState(false), rememberMe = _b[0], setRememberMe = _b[1];
    var _c = useState(false), isLoggedIn = _c[0], setIsLoggedIn = _c[1];
    var router = useRouter();
    var _d = useAdminLoginMutation(), adminLogin = _d[0], data = _d[1].data;
    var _e = useForm({
        resolver: yupResolver(schema),
    }), register = _e.register, handleSubmit = _e.handleSubmit, errors = _e.formState.errors;
    useEffect(function () {
        if (Cookies.get("admin_token")) {
            router.push("/");
        }
    }, [router]);
    useEffect(function () {
        if (isLoggedIn) {
            setTimeout(function () {
                window.location.href = "/admin-dashboard";
            }, 2000);
        }
    }, [isLoggedIn]);
    useEffect(function () {
        if (data) {
            var getData = data;
            LoginStorage("admin_token", getData === null || getData === void 0 ? void 0 : getData.token, rememberMe);
            toast.success("Login successful", {
                toastId: "ogin-success-id",
            });
            setIsLoggedIn(true);
        }
    }, [data]);
    var onSubmit = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1, err;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, adminLogin({
                            email: data.email,
                            password: data.password,
                        }).unwrap()];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    err = error_1;
                    if (err) {
                        toast.error((_a = err === null || err === void 0 ? void 0 : err.data) === null || _a === void 0 ? void 0 : _a.message, {
                            toastId: "login-response-error",
                        });
                    }
                    else {
                        toast.error("something went wrong", {
                            toastId: "login-response-error-id__2",
                        });
                    }
                    console.log(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<form className="bg-white mt-4 border-[1px] border-[#d7d7d7] h-auto relative">
      <div className="flex w-[100%]">
        <div className="personal-information w-[50%] p-3">
          <div className="title">
            <h1 className="text-black text-lg font-extrabold">
              Admin Login
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
                <UI.InputField type="email" className="email bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]" isHookForm={true} label="email" required={true} register={register}/>
                <span className="mt-1">This is a required field.</span>
              </div>
            </div>
            <div className="password flex mt-5 w-[100%] items-center">
              <div>
                <label className="text-[#69686c] font-bold">Password</label>
                <span className="text-red-500 text-xl ml-4 mb-1">*</span>
              </div>
              <div className="ml-12">
                <UI.InputField type="text" className="last-name  bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]" isHookForm={true} label="password" register={register} required={true}/>
                <span className="mt-1">This is a required field.</span>
              </div>
            </div>
            <div className="newletter flex mt-6 w-[100%] ml-36 items-center">
              <div>
                <input type="checkbox" className="last-name bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]" onChange={function () { return setRememberMe(!rememberMe); }} checked={rememberMe}/>
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
            <h1 className="text-black text-lg font-extrabold">New Admin</h1>
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
        <UI.Button className="text-white py-2 px-4 -ml-44 bg-red-color hover:bg-gray-500 transition-[background-color] duration-500 ease-in-out font-[600]" text="SIGN IN" type="submit" onClick={handleSubmit(onSubmit)}/>
      </div>
      <div className="error text-center">
        <span className="text-red-500 text-xl">
          {((_a = errors.email) === null || _a === void 0 ? void 0 : _a.type) && "All fields are required"}
        </span>
      </div>
    </form>);
};
export default AdminLogin;
//# sourceMappingURL=index.jsx.map