import { Button, Image } from "antd";
import ButtonGroup from "antd/es/button/button-group";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { formatNumber } from "../../helpers/general";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { addProductToCartAction } from "../../redux/actions/CartAction";
import "./Product.css";
import ic_cart from "../../assets/icon/ic_cart_plus.svg";

function ProductDetail() {
  const location = useLocation();
  const dispatch = useDispatch();

  const product = location.state.product;
  const [sizeSelected, setSizeSelected] = useState(product?.other[0]?.size);
  const [priceSelected, setPriceSelected] = useState(product?.other[0]?.price);
  const [count, setCount] = useState(1);

  const handleSizeSelect = (item: any) => {
    setSizeSelected(item?.size);
    setPriceSelected(item?.price);
  };

  const increase = () => {
    setCount(count + 1);
  };

  const decline = () => {
    let newCount = count - 1;
    if (newCount < 1) {
      return;
    }
    setCount(newCount);
  };

  const handleAddtoCart = (product: any) => {
    const cart = {
      quantity: count,
      size: sizeSelected,
      totalPrice: count * priceSelected,
      price: priceSelected,
      name: product?.name,
      img: product?.img,
      index: product?.index,
    };
    dispatch(addProductToCartAction(cart));
  };

  return (
    <div className="productDetailWrap">
      <Image src={product?.img} className="imgDetail" />
      <div>
        <h1 className="productDetailWrap_name">{product.name}</h1>
        <div className="productDetailWrap_info">
          {product?.other.map((item: any, index: number) => (
            <p
              key={index + "size"}
              style={{
                padding: "10px 20px",
                border: `1px solid ${
                  sizeSelected === item?.size ? "#fb693d" : "gray"
                }`,
                borderRadius: "10px",
                color: `${sizeSelected === item?.size ? "#fb693d" : "gray"}`,
                cursor: "pointer",
              }}
              onClick={() => handleSizeSelect(item)}
            >
              {item?.size || "Không có size"}
            </p>
          ))}
        </div>
        <h2 style={{ color: "#fb693d" }}>
          {formatNumber(priceSelected || 0)} đ
        </h2>
        <ButtonGroup>
          <Button onClick={decline} icon={<MinusOutlined />} />
          <Button>{count}</Button>
          <Button onClick={increase} icon={<PlusOutlined />} />
        </ButtonGroup>
        <div className="buttonWrap">
          <Button size="large" danger type="primary">
            Mua ngay
          </Button>
          <Button
            size="large"
            className="addCartText"
            danger
            onClick={() => handleAddtoCart(product)}
          >
            Thêm vào giỏ hàng
          </Button>
          <Button
            size="large"
            className="addCartIcon"
            danger
            onClick={() => handleAddtoCart(product)}
          >
            <img src={ic_cart} alt={ic_cart} style={{ cursor: "pointer" }} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
