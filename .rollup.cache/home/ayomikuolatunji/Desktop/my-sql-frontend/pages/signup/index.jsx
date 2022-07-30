import { __awaiter, __generator } from "tslib";
import Link from "next/link";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import * as UI from "../../components";
import Cookies from "../../helpers/Cookies";
import { useSignupMutation } from "../../redux/apis/authApi";
var schema = yup
    .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required(),
    confirmPassword: yup.string().required(),
})
    .required();
var Signup = function () {
    var _a, _b, _c, _d;
    var _e = useForm({
        resolver: yupResolver(schema),
    }), register = _e.register, handleSubmit = _e.handleSubmit, errors = _e.formState.errors;
    var router = useRouter();
    var signup = useSignupMutation()[0];
    useEffect(function () {
        if (Cookies.get("user_token")) {
            router.push("/");
        }
    }, [router]);
    var onSubmit = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var email, firstName, lastName, password, confirmPassword, error_1, err;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    email = data.email, firstName = data.firstName, lastName = data.lastName, password = data.password, confirmPassword = data.confirmPassword;
                    if (password !== confirmPassword) {
                        toast.error("password and confirm password not equal", {
                            toastId: "signup-password-not-equal-id",
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, signup({
                            username: "".concat(firstName, " ").concat(lastName),
                            first_name: firstName,
                            last_name: lastName,
                            email: email,
                            password: password,
                        }).unwrap()];
                case 1:
                    _b.sent();
                    window.location.href = "/login";
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    err = error_1;
                    if (error_1) {
                        toast.error((_a = err === null || err === void 0 ? void 0 : err.data) === null || _a === void 0 ? void 0 : _a.data.message, {
                            toastId: "main-response-error",
                        });
                    }
                    else {
                        toast.error("something went wrong", {
                            toastId: "main-response-error-id__2",
                        });
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<form className="bg-white mt-4 border-[1px] border-[#d7d7d7] h-auto relative">
      <div className="flex items-center w-[100%]">
        <div className="personal-information w-[50%] p-3">
          <div className="title">
            <h1 className="text-black text-2xl font-extrabold">
              Personal Information
            </h1>
          </div>
          <div className="form w-[100%]">
            <div className="first-name flex mt-5 items-center">
              <div>
                <label className="text-[#69686c] font-bold">First Name</label>
                <span className="text-red-500 text-xl ml-4 mb-5">*</span>
              </div>
              <div className="ml-12">
                <UI.InputField type="text" className="first-name  bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]" isHookForm={true} label="firstName" register={register} required={true}/>
                <span className="mt-1">This is a required field.</span>
              </div>
            </div>
            <div className="last-name flex mt-5 w-[100%] items-center">
              <div>
                <label className="text-[#69686c] font-bold">Last Name</label>
                <span className="text-red-500 text-xl ml-4 mb-1">*</span>
              </div>
              <div className="ml-12">
                <UI.InputField type="text" className="last-name  bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]" isHookForm={true} label="lastName" register={register} required={true}/>
                <span className="mt-1">This is a required field.</span>
              </div>
            </div>
            <div className="newletter flex mt-6 w-[100%] ml-36 items-center">
              <div>
                <input type="checkbox" className="last-name bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]"/>
              </div>
              <div>
                <label className="text-[#69686c] font-normal ml-3">
                  Sign Up for Newsletter
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="left-login-information w-[50%] h-auto block p-3">
          <div className="form w-[100%]">
            <div className="title">
              <h1 className="text-black text-2xl font-extrabold">
                Sign-in Information
              </h1>
            </div>
            <div className="email flex mt-5 w-full items-center">
              <div>
                <label className="text-[#69686c] font-bold">Email</label>
                <span className="text-red-500 text-xl ml-4 mb-5">*</span>
              </div>
              <div className="ml-12">
                <UI.InputField type="email" className="email  bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]" isHookForm={true} label="email" register={register} required={true}/>
              </div>
            </div>
            <div className="password flex mt-5 w-[100%]">
              <div>
                <label className="text-[#69686c] font-bold">Password</label>
                <span className="text-red-500 text-xl ml-4 mb-1">*</span>
              </div>
              <div className="w-[70%]">
                <UI.InputField type="text" className="password ml-12 bg-white border-[1px] border-[#dd] outline-none p-1 w-[70%]" isHookForm={true} label="password" register={register} required={true}/>
              </div>
            </div>
            <div className="comfirm-password flex mt-8 w-[100%]">
              <div>
                <label className="text-[#69686c] font-bold">
                  Confirm Password
                </label>
                <span className="text-red-500 text-xl ml-4 mb-1">*</span>
              </div>
              <div className="w-[50%]">
                <UI.InputField type="text" className="confirm-password ml-12 bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]" isHookForm={true} label="confirmPassword" register={register} required={true}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="create-account-btn mt-12 mb-9 text-center">
        <UI.Button className="text-white py-2 px-4 -ml-44 bg-red-color hover:bg-gray-500 transition-[background-color] duration-500 ease-in-out font-[600]" text="CREATE ACCOUNT" type="submit" onClick={handleSubmit(onSubmit)}/>
        <span className="ml-2 text-gray-900">
          <Link href={"/login"}>Or login</Link>
        </span>
      </div>
      <div className="error text-center">
        <span className="text-red-500 text-xl">
          {(((_a = errors.email) === null || _a === void 0 ? void 0 : _a.type) ||
            ((_b = errors.confirmPassword) === null || _b === void 0 ? void 0 : _b.type) ||
            ((_c = errors.firstName) === null || _c === void 0 ? void 0 : _c.type) ||
            ((_d = errors.lastName) === null || _d === void 0 ? void 0 : _d.message)) &&
            "All fields are required"}
        </span>
      </div>
      <span className="absolute bottom-10 right-10 sm:block hidden cursor-pointer">
        <Link href={"/"}>Home</Link>
      </span>
    </form>);
};
export default Signup;
//# sourceMappingURL=index.jsx.map