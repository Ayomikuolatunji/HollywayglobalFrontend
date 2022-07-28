import React, { useEffect } from 'react'
import { useRouter } from 'next/router'


import Cookies from "../../helpers/Cookies"


export default function AdminDashboard() {
  const router = useRouter()
  
  useEffect(() => {
    if (!Cookies.get("admin_token")) {
        router.push("/admin-login")
    }
  }, [router]);


  return (
    <div>index</div>
  )
}
