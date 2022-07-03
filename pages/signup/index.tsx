import React from 'react'
import * as UI from "../../components"


const Signup = () => {
  return (
    <div className='bg-white mt-4 border-[1px] border-[#d7d7d7]'>
         <div className='flex justify-between items-center w-[100%]'>
              <div className="personal-information w-[50%] p-3">
                  <div className="title">
                      <h1 className='text-black text-2xl font-extrabold'>
                        Personal Information
                      </h1>
                  </div>
                  <div className="form w-[100%]">
                    <div className="first-name flex mt-5">
                        <label className='text-[#69686c] font-bold'>First Name</label>
                        <span className='text-red-500 text-xl ml-4 mb-5'>*</span>
                        <UI.InputField
                          type="text"
                          className="first-name ml-12 bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]"
                        />
                    </div>
                    <div className="last-name flex mt-5 w-[100%]">
                        <label className='text-[#69686c] font-bold'>Last Name</label>
                        <span className='text-red-500 text-xl ml-4 mb-1'>*</span>
                        <UI.InputField
                          type="text"
                          className="last-name ml-12 bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]"
                        />
                    </div>
                    <div className="newletter flex mt-6 w-[100%] ml-36">
                        <UI.InputField
                          type="checkbox"
                          className="last-name bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]"
                        />
                        <label className='text-[#69686c] font-normal ml-3'>
                          Sign Up for Newsletter
                        </label>
                    </div>
                    <div className="create-account-btn mt-24">
                       <UI.Button 
                        className="text-white font-bold py-2 px-4 ml-36 bg-red-color"
                        text="Create Account"
                       />
                    </div>
                  </div>
              </div>
              <div className="left-login-information w-[50%]">
                    <div className="form w-[100%]">
                      <div className="title">
                          <h1 className='text-black text-2xl font-extrabold'>
                             Sign-in Information
                          </h1>
                      </div>  
                      <div className="email flex mt-5 w-full">
                          <label className='text-[#69686c] font-bold'>Email</label>
                          <span className='text-red-500 text-xl ml-4 mb-5'>*</span>
                          <UI.InputField
                            type="text"
                            className="first-name ml-12 bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]"
                          />
                      </div>
                      <div className="password flex mt-5 w-[100%]">
                          <label className='text-[#69686c] font-bold'>Password</label>
                          <span className='text-red-500 text-xl ml-4 mb-1'>*</span>
                          <UI.InputField
                            type="text"
                            className="last-name ml-12 bg-white border-[1px] border-[#dd] outline-none p-1 w-[100%]"
                          />
                      </div>
                      <div className="comfirm-password flex mt-8 w-[100%]">
                          <label className='text-[#69686c] font-bold'>Confirm Password</label>
                          <span className='text-red-500 text-xl ml-4 mb-1'>*</span>
                          <UI.InputField
                            type="text"
                            className="last-name ml-12 bg-white border-[1px] border-[#dd] outline-none p-1 w-full"
                          />
                      </div>
                  </div>
              </div>
         </div>
    </div>
  )
}

export default Signup