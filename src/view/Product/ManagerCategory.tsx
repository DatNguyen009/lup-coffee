/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Input,
  Modal,
  Space,
  Table,
  notification,
  Popconfirm,
} from "antd";
import { useEffect, useState } from "react";
import "./Product.css";
import { QuestionCircleOutlined } from "@ant-design/icons";

import { db } from "../../helpers/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function ManagerCategory() {
  const [category, setCategory] = useState<any>([]);
  const [api, contextHolder] = notification.useNotification();
  const categoryCollectionRef = collection(db, "category");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionSelected, setActionSelected] = useState("");
  const [categoryForm, setCategoryForm] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    const data = await getDocs(categoryCollectionRef);
    const mapData = data.docs.map((doc: any) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setCategory(mapData);
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => {
        return (
          <Space size="middle">
            <Button onClick={() => handleEditCategory(record.id, record.name)}>
              Chỉnh sửa
            </Button>
            <Popconfirm
              title="Xoá"
              description="Bạn có chắn chắn muốn xoá loại sản phẩm này hay không?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => handleDeleteCategory(record.id)}
            >
              <Button danger>Xoá</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const handleDeleteCategory = async (id: string) => {
    const categoryDoc = doc(db, "category", id);
    await deleteDoc(categoryDoc);
    setTimeout(() => {
      api.success({
        message: "Xoá loại sản phẩm thành công!",
      });
    }, 500);
    getCategory();
  };

  const showModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleCancel = async () => {
    showModal();
  };
  const handleOk = async () => {
    if (!categoryForm.name) {
      api.error({
        message: "Vui lòng nhập tên loại sản phẩm",
      });
      return;
    }
    if (actionSelected === "edit") {
      const categoryDoc = doc(db, "category", String(categoryForm?.id));
      await updateDoc(categoryDoc, { name: categoryForm.name });

      api.success({
        message: "Cập nhật loại sản phẩm thành công!",
      });
      getCategory();
      return;
    }
    await addDoc(categoryCollectionRef, { name: categoryForm.name });
    getCategory();
    setCategoryForm({ id: "", name: "" });
    api.success({
      message: "Thêm loại sản phẩm thành công!",
    });
    showModal();
  };

  const handleEditCategory = (id: string, name: string) => {
    setCategoryForm({
      id,
      name,
    });
    setActionSelected("edit");
    showModal();
  };

  return (
    <>
      <div className="header_product--add">
        <Button
          onClick={() => {
            showModal();
            setActionSelected("create");
          }}
        >
          Thêm loại sản phẩm
        </Button>
      </div>
      <Table columns={columns} dataSource={category} bordered size="middle" />
      <Modal
        title="Thêm loại sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <h4>Nhập tên loại sản phẩm</h4>
        <Input
          value={categoryForm.name}
          onChange={(value) =>
            setCategoryForm({
              ...categoryForm,
              name: value.target.value.toString(),
            })
          }
        />
        {contextHolder}
      </Modal>
    </>
  );
}

export default ManagerCategory;
