import React from 'react'
import * as UI from "../../components"


const Signup = () => {
  return (
    <div className='bg-white mt-4 border-[1px] border-[#d7d7d7]'>
         <div className="personal-information w-[50%] p-3">
            <div className="title">
                <h1 className='text-black text-2xl font-extrabold'>
                  Personal Information
                </h1>
            </div>
            <div className="form">
               <div className="first-name flex mt-5">
                  <label className=''>First Name</label>
                  <span className='text-red-500 text-xl ml-4 mb-1'>*</span>
                  <UI.InputField
                    type="text"
                    className="first-name ml-8 bg-white border-[1px] border-[#dd] outline-none p-2"
                  />
               </div>
               <div className="last-name flex mt-5">
                  <label>Last Name</label>
                  <span className='text-red-500 text-xl ml-4 mb-1'>*</span>
                  <UI.InputField
                    type="text"
                    className="last-name border-2 ml-8 outline-none"
                  />
               </div>
            </div>
        </div>
        <div className="left-login-information w-[50%]">

        </div>
    </div>
  )
}

export default Signup