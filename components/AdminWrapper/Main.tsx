import React, { useEffect } from "react";
import { useRouter } from "next/router";

import AdminSidebar from "./AdminSidebar";
import Cookies from "../../helpers/Cookies";
import Header from "./Header";
import { getAppCredentials } from "../../helpers/Auth";
import { useAuthAdminQuery } from "../../redux/apis/secureAuth";
import { localStorageGetItem } from "../../helpers/Storage";

interface Props {
  children: JSX.Element | JSX.Element[];
}

const AdminWrapper = ({ children }: Props) => {
  const admin_id = getAppCredentials("admin_token", "admin")?.admin_id;
  const { error, isLoading } = useAuthAdminQuery(admin_id || "");

  const router = useRouter();

  useEffect(() => {
    if (!Cookies.get("admin_token") || !localStorageGetItem("admin_id")) {
      router.push("/admin-login");
    }
  }, [router, admin_id]);

  useEffect(() => {
    if (error) {
      Cookies.remove("admin_token");
      window.location.href = "/admin-login";
    }
  }, [error, router]);

  return (
    <div className="flex bg-white h-[100vh]">
      <div className="w-[15%] bg-[white] h-[100vh]">
        <AdminSidebar />
      </div>
      {isLoading ? (
        "Loading..."
      ) : (
        <main className="w-[85%] bg-[white] h-[100vh] overflow-y-scroll pb-10">
          <Header />
          {children}
        </main>
      )}
    </div>
  );
};

export default AdminWrapper;
