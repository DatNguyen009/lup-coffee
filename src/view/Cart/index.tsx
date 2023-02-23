import { useSelector } from "react-redux";
import { CART_REDUCER } from "../../redux/reducers/ReducerTypes";
import { Button, Form, Input, notification } from "antd";
import { formatNumber } from "../../helpers/general";
import ButtonGroup from "antd/es/button/button-group";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { updateCartAction } from "../../redux/actions/CartAction";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "./Cart.css";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../helpers/firebaseConfig";

function Cart() {
  const { data: cart } = useSelector((state: any) => state[CART_REDUCER]);
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const orderCollectionRef = collection(db, "order");

  const onFinish = async (values: any) => {
    if (cart?.length === 0) {
      api.error({
        message: "Đặt hàng thất bại!",
        description: "Không có sản phẩm nào trong giỏ hàng!!!",
      });
      return;
    }

    const data = {
      ...values,
      order: cart,
      date: moment().format("HH:mm DD-MM-YYYY"),
    };
    await addDoc(orderCollectionRef, data);

    dispatch(updateCartAction([]));
    api.success({
      message: "Đặt hàng thành công!",
      description:
        "Cảm ơn quý khách đã đặt hàng của chúng tôi, lần sau hãy ghé lại nữa nhé!!!",
    });
    setTimeout(() => {
      navigate(`/`);
    }, 1500);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const increase = (quantity: number, index: number, price: number) => {
    const data = [...cart];
    data[index].quantity = quantity;
    data[index].totalPrice = quantity * price;
    dispatch(updateCartAction(data));
  };
  const decrease = (quantity: number, index: number, price: number) => {
    if (quantity === 0) {
      return;
    }
    const data = [...cart];
    data[index].quantity = quantity;
    data[index].totalPrice = quantity * price;
    dispatch(updateCartAction(data));
  };

  return (
    <div className="cartContainer">
      <div className="cartWrap">
        <Form
          name="basic"
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Tên khách hàng"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input />
          </Form.Item>

          {contextHolder}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Đặt hàng
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="cartWrap">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {cart?.map((item: any, index: number) => (
            <div
              key={index + "cart"}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <img
                  src={item?.img}
                  alt="logo"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "10px",
                  }}
                />
                <div>
                  <b>{item?.name}</b>
                  <p>{formatNumber(item?.price)} đ</p>
                  {item?.size && <p>size: {item?.size}</p>}
                </div>
              </div>
              <ButtonGroup>
                <Button
                  onClick={() =>
                    decrease(item?.quantity - 1, index, item?.price)
                  }
                  icon={<MinusOutlined />}
                />
                <Button>{item?.quantity}</Button>
                <Button
                  onClick={() =>
                    increase(item?.quantity + 1, index, item?.price)
                  }
                  icon={<PlusOutlined />}
                />
              </ButtonGroup>
            </div>
          ))}
        </div>
        {cart?.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "30px",
              justifyContent: "space-between",
            }}
          >
            <b>Tổng tiền: </b>
            <p>{formatNumber(_.sumBy(cart, "totalPrice"))} đ</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
