import React from "react";
import "./Header.css";
import "../../helpers/globalCss.css";
import logo from "../../assets/icon/lupcafe.jpeg";
import { Badge, Image, Popover, Space } from "antd";
import ic_cart from "../../assets/icon/ic_cart.svg";
import ic_search from "../../assets/icon/ic_search.svg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CART_REDUCER } from "../../redux/reducers/ReducerTypes";
import { Input } from "antd";
import { useDispatch } from "react-redux";
import { searchProductAction } from "../../redux/actions/ProductAction";

const { Search } = Input;

function Header() {
  const { data: cart } = useSelector((state: any) => state[CART_REDUCER]);
  const dispatch = useDispatch();
  const handleonSearch = (value: string) => {
    dispatch(searchProductAction(value));
  };

  const content = (
    <Search
      placeholder="Tìm kiếm"
      onChange={(value) => handleonSearch(value.target.value.toString())}
      style={{ scale: "none" }}
    />
  );

  return (
    <div className="containerHeader flexBetween">
      <Link to="/">
        <img src={logo} alt="logo" className="header-logo" />
      </Link>

      <Space>
        <Popover
          placement="bottom"
          content={content}
          trigger="click"
          style={{ width: "100%" }}
        >
          <Image src={ic_search} preview={false} className="header-search" />
        </Popover>
        <Link to="/cart">
          <Badge count={cart.length} className="cursorPointer ">
            <Image src={ic_cart} preview={false} className="cursorPointer " />
          </Badge>
        </Link>
      </Space>
    </div>
  );
}

export default Header;
