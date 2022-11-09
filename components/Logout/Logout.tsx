import { useRouter } from "next/router";
import React from "react";
import Cookies from "../../helpers/Cookies";
import { localStorageRemoveItem } from "../../helpers/Storage";

const Logout = () => {
  const router = useRouter();
  const logout = () => {
    if (Cookies.get("admin_token")) {
      Cookies.remove("admin_token");
      localStorageRemoveItem("admin_id");
      router.push("admin-login");
    }
  };

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-medium  font-serif px-3 py-3 flex items-center"
        onClick={logout}
      >
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Logout;
