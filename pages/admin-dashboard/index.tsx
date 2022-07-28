import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import {BsThreeDots} from "react-icons/bs"
import { BsSearch } from 'react-icons/bs'
import {FiPlus} from "react-icons/fi"

import Cookies from "../../helpers/Cookies"
export const tableData=[
  {
      id:1,
      first_name:'Temitope',
      location:"Festac",
      last_name:"Adejumoke",
      phone_number:" +234800 000 0000",
      partner:"Xpress Rewards",
      status:"Active",
      action:"default"
  },
  {
      id:2,
      first_name:'Temitope',
      location:"Festac",
      last_name:"Adejumoke",
      phone_number:" +234800 000 0000",
      partner:"Xpress Rewards",
      status:"Awaiting approval",
      action:"default"
  },{
      id:4,
      first_name:'Temitope',
      location:"Festac",
      last_name:"Adejumoke",
      phone_number:" +234800 000 0000",
      partner:"Xpress Rewards",
      status:"Deactivated",
      action:"default"
  },{
      id:1,
      first_name:'Temitope',
      location:"Festac",
      last_name:"Adejumoke",
      phone_number:" +234800 000 0000",
      partner:"Xpress Rewards",
      status:"Active",
      action:"default"
  },{
      id:3,
      first_name:'Temitope',
      location:"Festac",
      last_name:"Adejumoke",
      phone_number:" +234800 000 0000",
      partner:"Xpress Rewards",
      status:"Active",
      action:"default"
  },{
      id:5,
      first_name:'Temitope',
      location:"Festac",
      last_name:"Adejumoke",
      phone_number:" +234800 000 0000",
      partner:"Xpress Rewards",
      status:"Active",
      action:"default"
  },{
      id:6,
      first_name:'Temitope',
      location:"Festac",
      last_name:"Adejumoke",
      phone_number:" +234800 000 0000",
      partner:"Xpress Rewards",
      status:"Awaiting approval",
      action:"default"
  },{
      id:3,
      first_name:'Temitope',
      location:"Festac",
      last_name:"Adejumoke",
      phone_number:" +234800 000 0000",
      partner:"Xpress Rewards",
      status:"Active",
      action:"default"
  },{
      id:4,
      first_name:'Temitope',
      location:"Festac",
      last_name:"Adejumoke",
      phone_number:" +234800 000 0000",
      partner:"Xpress Rewards",
      status:"Deactivated",
      action:"default"
  },{
      id:3,
      first_name:'Temitope',
      location:"Festac",
      last_name:"Adejumoke",
      phone_number:" +234800 000 0000",
      partner:"Xpress Rewards",
      status:"Active",
      action:"default"
  },{
      id:5,
      first_name:'Temitope',
      location:"Festac",
      last_name:"Adejumoke",
      phone_number:" +234800 000 0000",
      partner:"Xpress Rewards",
      status:"Active",
      action:"default"
  },{
      id:6,
      first_name:'Temitope',
      location:"Festac",
      last_name:"Adejumoke",
      phone_number:" +234800 000 0000",
      partner:"Xpress Rewards",
      status:"Awaiting approval",
      action:"default"
  }
]


const VerifierHeader = () => {



  
  return (
    <div className='flex justify-between'>
      {/* select dropwdown */}
      <div className="dropdown">
        <select name="account" className='px-3 border-2 border-gray-200 bg-white py-3 ml-'>
          <option value="">All</option>
          <option value="">Active Verifiers</option>
          <option value="">Pending Verifiers</option>
          <option value="">Deactivated Verifiers</option>
        </select>
        </div>
       <div className='flex items-center'>
            <div className="search relative">
                <BsSearch
                className="text-[#c9c9c9] text-xl absolute left-4 top-3.5"
                />
                <input type="text" placeholder="Name/Phone no / Location" 
                className="w-full py-3 px-5 indent-8 border-2" 
                />
            </div>
            <div className='ml-5'>
              <button 
                className='bg-blue-500 hover:bg-blue-700 text-white font-medium  font-serif px-3 py-3 flex items-center'
                >
                <FiPlus className='text-2xl inline mr-2'/>
                 <span>Create project</span>
            </button>
            </div>
       </div>
    </div>
  )
}

const VerifyTable = () => {


  return (
    <div className='mt-10'>
         <div className="relative overflow-x-auto shadow-xl">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-white dark:bg-gray-700 dark:text-gray-400 border-b-2 border-t-2 border-t-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-4">
                        First Name
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Last Name
                    </th>
                    <th scope="col" className="px-6 py-4">
                       Phone Number
                    </th>
                    <th scope="col" className="px-6 py-4">
                       Partner
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Location
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Status
                    </th>
                    <th  scope="col" className="px-6 py-4">
                       Actions
                    </th>
                </tr>  
        </thead>
        
            <tbody>
            {
                 tableData.map((item,index)=>{
                     return (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                   {item.first_name}
                                </th>
                                <td className="px-6 py-4">
                                  {item.last_name}
                                </td>
                                <td className="px-6 py-4">
                                  {item.phone_number}
                                </td>
                                <td className="px-6 py-4">
                                   {item.partner}
                                </td>
                                <td className="px-6 py-4 ">
                                    {item.location}
                                </td>
                                <td className="px-6 py-4 ">
                                    <span
                                        className={`text-left
                                        ${
                                            item.status === 'Active' ? 'text-[#27A713] active-status px-3 py-2' : item.status==="Awaiting approval" ? 'text-[#FF9900] pending px-3 py-2'
                                       :item.status==="Deactivated"? "deactivate-status px-3 py-2 text-[#FF0000]":""}`}
                                    >
                                    {item.status}
                                </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <BsThreeDots className='text-gray-600 dark:text-gray-400 text-2xl'/>
                                </td>
                            </tr>
                        )
                     })
                   }
               
            </tbody>
        </table>
    </div>
    </div>
  )
}


export default function AdminDashboard() {
  const router = useRouter()
  
  useEffect(() => {
    if (!Cookies.get("admin_token")) {
        router.push("/admin-login")
    }
  }, [router]);


  return (
    <div className='my-10 w-[95%] mx-auto'>
    {/* header */}
    <VerifierHeader/>
    {/* table */}
    <VerifyTable/>
  </div>
  )
}
