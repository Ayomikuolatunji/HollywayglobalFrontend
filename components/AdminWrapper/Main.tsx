import React, { useEffect } from "react";
import { useRouter } from "next/router";

import AdminSidebar from "./AdminSidebar";
import Cookies from "../../helpers/Cookies";
import Header from "./Header";
import { getAppCredentials } from "../../helpers/Auth";
import { useAuthAdminQuery } from "../../redux/apis/adminApis";
import { localStorageGetItem } from "../../helpers/Storage";

interface Props {
  children: JSX.Element | JSX.Element[];
}

const AdminWrapper = ({ children }: Props) => {
  const router = useRouter();

  useEffect(() => {
    if (!Cookies.get("admin_token") || !localStorageGetItem("admin_id")) {
      router.push("/admin-login");
    }
  }, [router]);

  return (
    <div className="flex bg-white h-[100vh]">
      <div className="xl:w-[13%] md:w-[20%] bg-[white] h-[100vh]">
        <AdminSidebar />
      </div>
      <main className="xl:w-[87%] md:w-[80] bg-[white] h-[100vh] overflow-y-scroll pb-10">
        <Header />
        {children}
      </main>
    </div>
  );
};

export default AdminWrapper;
