import React from "react";
import logo from "../../assets/icon/lupcafe.jpeg";
import ic_facebook from "../../assets/icon/ic_facebook.svg";
import ic_instagram from "../../assets/icon/ic_instagram.svg";
import "./Footer.css";
import "../../helpers/globalCss.css";

function Footer() {
  const handleNavigationSocial = () => {
    window.open("https://www.facebook.com/Lupcoffee.vn", "_blank");
  };
  return (
    <div className="containerFooter flexBetween">
      <div>
        <img src={logo} alt="logo" className="footer-logo" />
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={ic_facebook}
            alt="ic_facebook"
            width={20}
            onClick={() => handleNavigationSocial("facebook")}
          />

          <img
            src={ic_instagram}
            alt="ic_instagram"
            width={20}
            onClick={() => handleNavigationSocial("instagram")}
          />
        </div>
      </div>
      <div>
        <b>Địa chỉ quán:</b>
        <p>76B đường 3/2, thị trấn Trảng Bom, Tỉnh Đồng Nai</p>
      </div>
    </div>
  );
}

export default Footer;
