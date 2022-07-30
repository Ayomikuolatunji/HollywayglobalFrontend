import React from "react";
import Cookies from "../../helpers/Cookies";

const Logout = () => {
  const logout = () => {
    if (Cookies.get("admin_token")) {
      localStorage.removeItem("admin_id");
      Cookies.remove("admin_token");
      window.location.href = "/admin-login";
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
