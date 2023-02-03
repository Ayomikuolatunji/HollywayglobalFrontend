import { useRouter } from "next/router";
import { GrLogout } from "react-icons/gr";
import React from "react";
import Cookies from "../../helpers/Cookies";
import { localStorageRemoveItem } from "../../helpers/Storage";

const Logout = () => {
  const router = useRouter();

  const logout = () => {
    Cookies.remove("admin_token");
    localStorageRemoveItem("admin_id");
    router.push("/admin-login");
  };

  return (
    <div>
      <button
        className="text-main-color font-extrabold  font-serif px-3 py-3 flex items-center"
        onClick={logout}
      >
        <span className="text-xl">Logout</span>
        <GrLogout className="ml-1"/>
      </button>
    </div>
  );
};

export default Logout;
