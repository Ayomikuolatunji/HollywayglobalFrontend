import { FaUserAlt } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "../../helpers/Cookies";
import { localStorageRemoveItem } from "../../helpers/Storage";
import { useAuthUserQuery } from "../../redux/apis/usersApis";

interface ProfileDropDownProps {
  isLogged: boolean;
}

const ProfileDropDown = ({ isLogged }: ProfileDropDownProps) => {
  const router = useRouter();
  const { data } = useAuthUserQuery();

  const logout = () => {
    if (Cookies.get("user_token")) {
      Cookies.remove("user_token");
      localStorageRemoveItem("user_id");
      window.location.reload();
      router.push("/");
    }
  };
  return (
    <>
      {!isLogged ? (
        <Link href="/login">
          <li className="flex items-center pl-3 text-[#1c1c1c] cursor-pointer">
            <FaUserAlt className="mr-2" />
            Login
          </li>
        </Link>
      ) : (
        <div className="group inline-block relative z-50">
          <span className="bg-[#f5f5f5] font-semibold  rounded inline-flex items-center">
            <span className="mr-1 px-2"> {data?.data.first_name}</span>
          </span>
          <ul className="absolute hidden text-gray-700 pt-1 group-hover:block w-full">
            <li className="w-full">
              <Link href={"/profile"}>
                <a className="bg-[#f5f5f5] hover:bg-gray-200 py-2 px-4 block whitespace-no-wrap cursor-pointer">
                  Profile
                </a>
              </Link>
            </li>
            <li className="w-full">
              <a
                className="rounded-b bg-[#f5f5f5] hover:bg-gray-200 py-2 px-4 block whitespace-no-wrap cursor-pointer"
                onClick={logout}
              >
                Logout
              </a>
            </li>
            )
          </ul>
        </div>
      )}
    </>
  );
};

export default ProfileDropDown;
