import Link from 'next/link'
import React from 'react'
import * as UI from "../../components"
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";


interface Inputs  {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
};


const schema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().required(),
  password: yup.string().required(),
  confirmPassword: yup.string().required(),
}).required();


const Signup = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>({
    resolver: yupResolver(schema)
  });


  const onSubmit: SubmitHandler<Inputs> = data => {
      console.log(data);
  }

  console.log(errors.email);



  return (
    <form className='bg-white mt-4 border-[1px] border-[#d7d7d7] h-auto relative'>
         <div className='flex items-center w-[100%]'>
              <div className="personal-information w-[50%] p-3">
                  <div className="title">
                      <h1 className='text-black text-2xl font-extrabold'>
                        Personal Information
                      </h1>
                  </div>
                  <div className="form w-[100%]">
                    <div className="first-name flex mt-5 items-center">
                        <div>
                          <label className='text-[#69686c] font-bold'>First Name</label>
                          <span className='text-red-500 text-xl ml-4 mb-5'>*</span>
                        </div>
                        <div className='ml-12'>
                          <UI.InputField
                            type="text"
                            className="first-name  bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]"
                            isHookForm={true}
                            label="firstName"
                            register={register}
                            required={true}
                          />
                          <span className='mt-1'>This is a required field.</span>
                        </div>
                    </div>
                    <div className="last-name flex mt-5 w-[100%] items-center">
                        <div>
                          <label className='text-[#69686c] font-bold'>Last Name</label>
                          <span className='text-red-500 text-xl ml-4 mb-1'>*</span>
                        </div>
                        <div className='ml-12'>
                          <UI.InputField
                            type="text"
                            className="last-name  bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]"
                            isHookForm={true}
                            label="lastName"
                            register={register}
                            required={true}
                          />
                          <span className='mt-1'>This is a required field.</span>
                        </div>
                    </div>
                    <div className="newletter flex mt-6 w-[100%] ml-36 items-center">
                        <div>
                          <input
                            type="checkbox"
                            className="last-name bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]"
                          />
                        </div>  
                         <div>
                          <label className='text-[#69686c] font-normal ml-3'>
                            Sign Up for Newsletter
                          </label>
                         </div>
                    </div>
                  
                  </div>
              </div>
              <div className="left-login-information w-[50%] h-auto block p-3">
                    <div className="form w-[100%]">
                      <div className="title">
                          <h1 className='text-black text-2xl font-extrabold'>
                             Sign-in Information
                          </h1>
                      </div>  
                      <div className="email flex mt-5 w-full items-center">
                         <div>
                           <label className='text-[#69686c] font-bold'>Email</label>
                            <span className='text-red-500 text-xl ml-4 mb-5'>*</span>
                         </div>
                          <div className='ml-12'>
                            <UI.InputField
                              type="text"
                              className="email  bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]"
                              isHookForm={true}
                              label="email"
                              register={register}
                              required={true}
                            />
                          </div>
                      </div>
                      <div className="password flex mt-5 w-[100%]">
                          <label className='text-[#69686c] font-bold'>Password</label>
                          <span className='text-red-500 text-xl ml-4 mb-1'>*</span>
                          <UI.InputField
                            type="text"
                            className="password ml-12 bg-white border-[1px] border-[#dd] outline-none p-1 w-[70%]"
                            isHookForm={true}
                            label="password"
                            register={register}
                            required={true}
                          />
                      </div>
                      <div className="comfirm-password flex mt-8 w-[100%]">
                          <label className='text-[#69686c] font-bold'>Confirm Password</label>
                          <span className='text-red-500 text-xl ml-4 mb-1'>*</span>
                          <UI.InputField
                            type="text"
                            className="confirm-password ml-12 bg-white border-[1px] border-[#dd] outline-none p-1 w-[70%]"
                            isHookForm={true}
                            label="confirmPassword"
                            register={register}
                            required={true}
                          />
                      </div>
                  </div>
              </div>
         </div>
         <div className="create-account-btn mt-12 mb-9 text-center">
              <UI.Button 
              className="text-white py-2 px-4 -ml-44 bg-red-color hover:bg-gray-500 transition-[background-color] duration-500 ease-in-out font-[600]"
              text="Create Account"
              type="submit"
              onClick={handleSubmit(onSubmit)}
              />
              <span className='ml-2 text-gray-900'>
                 <Link href={"/login"}>
                    Or login
                 </Link>
              </span>
         </div>
         <div className="error text-center">
              <span className='text-red-500 text-xl'>{(errors.email?.type || errors.confirmPassword?.type || errors.firstName?.type || errors.lastName?.message) && "All fields are required"}</span>
         </div>
         <span className='absolute bottom-10 right-10 sm:block hidden cursor-pointer'>
             <Link href={"/"}>Home</Link>
         </span>
    </form>
  )
}

export default Signup