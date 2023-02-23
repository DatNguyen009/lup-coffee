/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { formatNumber } from "../../helpers/general";
import "./Product.css";
import _ from "lodash";

import { db } from "../../helpers/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function ManagerOrder() {
  const columnOrderItem = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <p>{formatNumber(price)}</p>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice: number) => <p>{formatNumber(totalPrice)}</p>,
    },
  ];

  const columnsOrder = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Khách hàng",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Đơn hàng",
      key: "order",
      dataIndex: "order",
      render: (order: any) => (
        <Table
          columns={columnOrderItem}
          dataSource={order}
          bordered
          size="small"
          style={{ marginTop: "10px", marginRight: "10px" }}
        />
      ),
    },
    {
      title: "Tổng đơn",
      dataIndex: "order",
      key: "order",
      render: (order: any) => (
        <b>{formatNumber(_.sumBy(order, "totalPrice"))} đ</b>
      ),
    },
    {
      title: "Ngày đặt hàng",
      key: "date",
      dataIndex: "date",
    },
  ];
  const [order, setOrder] = useState<any>([]);
  const orderCollectionRef = collection(db, "order");

  useEffect(() => {
    getOrder();
  }, []);

  const getOrder = async () => {
    const data = await getDocs(orderCollectionRef);
    const mapData = data.docs.map((doc: any) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setOrder(mapData);
  };
  return (
    <Table columns={columnsOrder} dataSource={order} bordered size="middle" />
  );
}

export default ManagerOrder;
