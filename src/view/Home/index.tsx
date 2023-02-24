/* eslint-disable no-useless-concat */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./Home.css";
import "../../helpers/globalCss.css";

import {
  Button,
  Card,
  Carousel,
  Col,
  Image,
  notification,
  Row,
  Spin,
  Tag,
} from "antd";

import background from "../../assets/background/background01.jpeg";
import background1 from "../../assets/background/background02.jpeg";
import background2 from "../../assets/background/taphoalup.jpeg";
import emptyProduct from "../../assets/product/empty_product.png";

import { formatNumber } from "../../helpers/general";
import ButtonGroup from "antd/es/button/button-group";
import { MinusOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { addProductToCartAction } from "../../redux/actions/CartAction";
import ic_cart from "../../assets/icon/ic_cart_plus.svg";

import { db } from "../../helpers/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  startAt,
  endAt,
  onSnapshot,
} from "@firebase/firestore";
import { useSelector } from "react-redux";
import { PRODUCT_REDUCER } from "../../redux/reducers/ReducerTypes";

interface otherProduct {
  indexOther?: number;
  size?: string;
  price?: number;
}

interface productProps {
  index?: number;
  img?: any;
  name?: string;
  type?: string;
  other?: Array<otherProduct>;
  quantity?: number;
}

const carousel = [
  {
    img: background,
  },

  {
    img: background1,
  },
  {
    img: background2,
  },
];

const style: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  margin: 0,
  padding: 0,
};

function HomeView() {
  const { data: product } = useSelector((state: any) => state[PRODUCT_REDUCER]);
  const [products, setProducts] = useState<productProps[]>([]);
  const [productsTemp, setProductsTemp] = useState<productProps[]>([]);
  const [category, setCategory] = useState<any>([]);
  const [typeProductSelected, setTypeProductSelected] = useState("Tất cả");
  const [isLoading, setiIsLoading] = useState(false);

  const [sizeSelected, setSizeSelected] = useState("");
  const [priceSelected, setPriceSelected] = useState(0);
  const [indexSelected, setIndexSelected] = useState({
    indexProduct: null,
    indexOther: 1,
  });
  const [api, contextHolder] = notification.useNotification();

  const productCollectionRef = collection(db, "product");
  const categoryCollectionRef = collection(db, "category");

  const dispatch = useDispatch();

  useEffect(() => {
    const getProducts = async () => {
      const data = await getDocs(productCollectionRef);
      const mapData = data.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
        quantity: 1,
      }));
      setProducts(mapData);
      setProductsTemp(mapData);
      setiIsLoading(true);
    };
    getProducts();
    getCategorys();
  }, []);

  useEffect(() => {
    if (!product.search) {
      setProducts(productsTemp);
      return;
    }
    const q = query(
      productCollectionRef,
      orderBy("name"),
      startAt(product.search),
      endAt(product.search + "\uf8ff")
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      const items: any = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setProducts(items);
    });

    return () => {
      unsub();
    };
  }, [product.search]);

  const getCategorys = async () => {
    const data = await getDocs(categoryCollectionRef);
    const mapData = data.docs.map((doc: any) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setCategory(mapData);
  };

  const handleSizeSelect = (item: any, id: any) => {
    setSizeSelected(item?.size);
    setPriceSelected(item?.price);
    setIndexSelected({
      indexOther: item?.indexOther,
      indexProduct: id,
    });
  };

  const handleFilterProduct = (name: string) => {
    setTypeProductSelected(name);
    if (name === "Tất cả") {
      setProducts(productsTemp);
      return;
    }
    const filterProduct = productsTemp?.filter(
      (item: productProps) => item?.type === name
    ) as any;
    setProducts(filterProduct);
  };

  const increase = (id: number) => {
    setProducts((prev: any) =>
      prev.map((item: any, index: number) => {
        if (index === id) {
          return {
            ...item,
            quantity: item?.quantity + 1,
          };
        }
        return item;
      })
    );
  };

  const decline = (id: number, quantity: any) => {
    let newCount = Number(quantity) - 1;
    if (newCount < 1) {
      return;
    }
    setProducts((prev: any) =>
      prev.map((item: any, index: number) => {
        if (index === id) {
          return {
            ...item,
            quantity: newCount,
          };
        }
        return item;
      })
    );
  };

  const handleAddtoCart = (product: any) => {
    const exitsSize = product.other.every((item: any) => item?.size);
    if (exitsSize && sizeSelected === "") {
      api.error({
        message: "Thất bại!",
        description: "Vui lòng chọn size!!!",
      });
      return;
    }

    const data = {
      quantity: product.quantity,
      ...(sizeSelected !== "" && { size: sizeSelected }),
      totalPrice:
        product.quantity *
        (priceSelected === 0 ? product.other[0].price : priceSelected),
      price: priceSelected === 0 ? product.other[0].price : priceSelected,
      name: product?.name,
      img: product?.img,
      index: product?.index,
    };
    dispatch(addProductToCartAction(data));
    api.success({
      message: "Thành công!",
      description: "Thêm sản phẩm vào giỏ hàng thành công!!!",
    });
    setSizeSelected("");
    setPriceSelected(0);
  };

  return (
    <div className="containerHome">
      <Carousel autoplay>
        {carousel.map((item, index) => (
          <div key={index + "carousel"}>
            <img className="carousel" src={item.img} alt="logo" />
          </div>
        ))}
      </Carousel>
      <div className="productWrap">
        <div className="productWrap-category">
          {[{ name: "Tất cả" }, ...category].map((item: any, index: number) => (
            <h2
              key={index + "productWrap-category"}
              className={`cursorPointer ${
                typeProductSelected === item?.name
                  ? "colorfb693d"
                  : "categoryProductinActive"
              }`}
              onClick={() => handleFilterProduct(item?.name)}
            >
              {item.name}
            </h2>
          ))}
        </div>
        <Row gutter={[16, 24]} className="containerProduct">
          {!isLoading ? (
            <Spin style={{ margin: "1rem auto" }} />
          ) : (
            <>
              {products?.map((item: productProps, id: number) => (
                <Col
                  className="gutter-row"
                  span={6}
                  style={{ margin: "0 0rem" }}
                  key={id + "products"}
                >
                  <div style={style}>
                    <Card
                      style={{ width: "100%", margin: "1rem" }}
                      cover={<Image preview={false} src={item.img} />}
                    >
                      <h2 style={{ margin: 0 }}>{item.name}</h2>
                      <div className="productDetailWrap_info">
                        {item?.other?.map((option: any, index: number) => (
                          <>
                            {option?.size && (
                              <p
                                key={index + "size"}
                                className={`product-size cursorPointer ${
                                  sizeSelected === option?.size &&
                                  indexSelected.indexOther ===
                                    option?.indexOther &&
                                  indexSelected.indexProduct === item.index
                                    ? "boderAndColorOrange"
                                    : "boderAndColorGray"
                                }`}
                                onClick={() =>
                                  handleSizeSelect(option, item?.index)
                                }
                              >
                                {option?.size}
                              </p>
                            )}
                          </>
                        ))}
                      </div>
                      <ButtonGroup>
                        <Button
                          onClick={() => decline(id, item.quantity)}
                          icon={<MinusOutlined />}
                        />
                        <Button>{item.quantity}</Button>
                        <Button
                          onClick={() => increase(id)}
                          icon={<PlusOutlined />}
                        />
                      </ButtonGroup>
                      <div
                        className="productDetailWrap_info"
                        style={{ marginTop: "10px" }}
                      >
                        {item?.other?.map((option: any, index: number) => (
                          <Tag color="orange" key={index + "price"}>
                            {option?.size && `${option?.size}: `}
                            {formatNumber(option?.price)} đ
                          </Tag>
                        ))}
                      </div>
                      <div className="buttonWrap">
                        <Button
                          className="addCartText"
                          type="primary"
                          danger
                          onClick={() => handleAddtoCart(item)}
                        >
                          Thêm vào giỏ hàng
                        </Button>
                        <Button
                          size="large"
                          className="addCartIcon"
                          danger
                          onClick={() => handleAddtoCart(item)}
                        >
                          <img
                            src={ic_cart}
                            alt={ic_cart}
                            className="cursorPointer"
                          />
                        </Button>
                      </div>
                    </Card>
                  </div>
                </Col>
              ))}

              {!products?.length && (
                <div style={{ margin: "0 auto" }}>
                  <Image
                    src={emptyProduct}
                    alt="empty product"
                    preview={false}
                    width={200}
                  />
                  <p>Không có sản phẩm nào cả!!!</p>
                </div>
              )}
            </>
          )}
        </Row>
      </div>
      {contextHolder}
    </div>
  );
}

export default HomeView;
