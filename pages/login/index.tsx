import Link from 'next/link'
import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import * as UI from "../../components"
import { IFormValues } from '../../components/InputField/InputField';
import { login } from '../../hooks/apis';






interface Error {
   response :{
       data:{
         data:{
          message:string
         }
       }
   }
}

const schema = yup.object({
  email: yup.string().required(),
  password: yup.string().required(),
}).required();


const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormValues>({
    resolver: yupResolver(schema)
  });


  const onSubmit: SubmitHandler<IFormValues> =async (data) => {
       console.log(data)
       try {
           const response=await login({
              email:data.email,
              password:data.password
           },"/login")
           console.log(response)
       } catch (error) {
        console.log(error)
       }
  }



  return (
    <form className='bg-white mt-4 border-[1px] border-[#d7d7d7] h-auto relative'>
         <div className='flex w-[100%]'>
              <div className="personal-information w-[50%] p-3">
                  <div className="title">
                      <h1 className='text-black text-lg font-extrabold'>
                        Personal Information
                      </h1>

                      <h3 className='mt-10'>
                        If you have an account, sign in with your email address
                      </h3>
                  </div>
                  <div className="form w-[100%]">
                    <div className="first-name flex mt-5 items-center">
                        <div>
                          <label className='text-[#69686c] font-bold'>
                            Email
                          </label>
                          <span className='text-red-500 text-xl ml-4 mb-5'>*</span>
                        </div>
                        <div className='ml-12'>
                          <UI.InputField
                            type="email"
                            className="email bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]"
                            isHookForm={true}
                            label="email"
                            required={true}
                            register={register}
                          />
                          <span className='mt-1'>This is a required field.</span>
                        </div>
                    </div>
                    <div className="last-name flex mt-5 w-[100%] items-center">
                        <div>
                          <label className='text-[#69686c] font-bold'>
                             Password
                          </label>
                          <span className='text-red-500 text-xl ml-4 mb-1'>*</span>
                        </div>
                        <div className='ml-12'>
                          <UI.InputField
                            type="text"
                            className="last-name  bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]"
                            isHookForm={true}
                            label="password"
                            register={register}
                            required={true}
                          />
                          <span className='mt-1'>This is a required field.</span>
                        </div>
                    </div>
                  </div>
              </div>
              <div className="left-login-information w-[50%] block p-3">
                   <div className="title">
                      <h1 className='text-black text-lg font-extrabold'>
                         New Customers
                      </h1>
                      <h3 className='mt-5'>
                      Creating an account has many benefits: check out faster, keep more than one address, track orders and more.
                      </h3>
                  </div>
                  <div className="create-account-btn mt-12 mb-9 text-center">
                  <Link href={"/signup"} passHref>
                    <a  className="text-white py-2 px-4 -ml-44 bg-red-color hover:bg-gray-500 transition-[background-color] duration-500 ease-in-out font-[600]">
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
              <span className='text-red-500 text-xl'>{(errors.email?.type) && "All fields are required"}
              </span>
         </div>
    </form>
  )
}

export default Login