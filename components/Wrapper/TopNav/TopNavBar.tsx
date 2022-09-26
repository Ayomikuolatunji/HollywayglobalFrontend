import React from "react";
import {
  AiOutlineMail,
  AiFillFacebook,
  AiOutlineTwitter,
  AiFillLinkedin,
  AiOutlineWhatsApp,
} from "react-icons/ai";

export default function TopNavBar() {
  return (
    <div>
      <div className="left">
        <ul>
          <li>
            <AiOutlineMail />
            <span>hello@colorlib.com</span>
          </li>
          <li>
            <span>Free Shipping for all Order of $99</span>
          </li>
        </ul>
      </div>
      <div className="right">
        <div className="icons">
          <AiFillFacebook />
          <AiOutlineTwitter />
          <AiFillLinkedin />
          <AiOutlineWhatsApp />
        </div>
      </div>
    </div>
  );
}
