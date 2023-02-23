/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  notification,
  Popconfirm,
  Tabs,
} from "antd";
import { useEffect, useState } from "react";
import { formatNumber } from "../../helpers/general";
import { storage } from "../../helpers/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import "./Product.css";
import ic_close from "../../assets/icon/ic_close.svg";
import { RcFile } from "antd/es/upload";
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
import ManagerOrder from "./ManagerOrder";
import ManagerCategory from "./ManagerCategory";

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
  id?: string;
}

const { Option } = Select;

function ManagerProductView() {
  const [product, setProduct] = useState<productProps[]>([]);
  const [category, setCategory] = useState<any>([]);
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Ảnh",
      key: "img",
      dataIndex: "img",
      render: (img: any) => {
        return (
          <img
            src={img}
            alt={img}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "10px",
            }}
          />
        );
      },
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại",
      key: "type",
      dataIndex: "type",
      render: (text: any) => {
        return <Tag color={"geekblue"}>{text.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Khác(size: giá)",
      key: "other",
      dataIndex: "other",
      render: (others: any) => {
        return (
          <>
            {others?.map((other: any, index: number) => {
              return (
                <Space>
                  {other?.size ? (
                    <Tag color={"green"} key={index}>
                      {other?.size + ":" || ""}
                      {formatNumber(other?.price || 0)} đ
                    </Tag>
                  ) : (
                    <Tag color={"green"} key={index}>
                      {formatNumber(other?.price || 0)} đ
                    </Tag>
                  )}
                </Space>
              );
            })}
          </>
        );
      },
    },

    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => {
        return (
          <Space size="middle">
            <Button
              onClick={() =>
                handleProductSelected(
                  record.index,
                  record.name,
                  record?.type,
                  record.img,
                  record?.other,
                  record.id
                )
              }
            >
              Chỉnh sửa
            </Button>
            <Popconfirm
              title="Xoá"
              description="Bạn có chắn chắn muốn xoá sản phẩm này hay không?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => handleDeleteProduct(record.id)}
            >
              <Button danger>Xoá</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionSelected, setActionSelected] = useState("");
  const [others, setOthers] = useState<
    Array<{ index: number; size: string; price: number }>
  >([]);
  const [imageUpload, setImageUpload] = useState<any>({});
  const [productForm, setProductForm] = useState<productProps>({
    name: "",
    type: "",
  });
  const [api, contextHolder] = notification.useNotification();
  const productCollectionRef = collection(db, "product");
  const categoryCollectionRef = collection(db, "category");

  useEffect(() => {
    getProducts();
    getCategorys();
  }, []);

  const getProducts = async () => {
    const data = await getDocs(productCollectionRef);
    const mapData = data.docs.map((doc: any) => ({
      ...doc.data(),
      id: doc.id,
      quantity: 1,
    }));
    setProduct(mapData);
  };

  const getCategorys = async () => {
    const data = await getDocs(categoryCollectionRef);
    const mapData = data.docs.map((doc: any) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setCategory(mapData);
  };

  const handleProductSelected = (
    index: number,
    name: string,
    type: string,
    img: string,
    other: any,
    id: string
  ) => {
    setProductForm({
      index,
      name,
      type,
      img,
      id,
    });
    setOthers(other);
    setActionSelected("edit");
    showModal();
  };

  const showModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleOk = async () => {
    if (!productForm.name || !productForm?.img || !productForm.type) {
      api.error({
        message: !productForm.name
          ? "Vui lòng nhập tên sản phẩm"
          : !productForm?.img
          ? "Vui lòng chọn hình ảnh"
          : "Vui lòng chọn loại sản phẩm",
      });
      return;
    }

    const otherMap = others.map((item) => {
      if (item?.size && item?.size.trim() === "") {
        return {
          index: item.index,
          price: item.price,
        };
      }
      return item;
    });

    const exitsPrice = otherMap.every((item: any) => item?.price);

    if (otherMap.length === 0 || !exitsPrice) {
      api.error({
        message: "Thất bại!",
        description: "Vui lòng nhập giá sản phẩm!!!",
      });
      return;
    }

    const imageRef = ref(storage, `images/${imageUpload?.name + uuidv4()}`);
    const uploadBytesData = await uploadBytes(imageRef, imageUpload);
    const url = await getDownloadURL(uploadBytesData.ref);

    if (actionSelected === "edit") {
      const userDoc = doc(db, "product", String(productForm?.id));
      await updateDoc(userDoc, {
        ...productForm,
        other: otherMap,
        ...(imageUpload?.name && { img: url }),
      });

      api.success({
        message: "Cập nhật sản phẩm thành công!",
      });
      getProducts();
      return;
    }

    const data = {
      index: product?.length + 1,
      ...productForm,
      other: otherMap,
      img: url,
    };

    await addDoc(productCollectionRef, data);
    getProducts();
    handleReset();
    api.success({
      message: "Thêm sản phẩm thành công!",
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    handleReset();
  };

  const handleChange = async (event: any) => {
    const url = await getBase64(event.target.files[0]);
    setImageUpload(event.target.files[0]);
    setProductForm({
      ...productForm,
      img: url,
    });
  };

  const handleChangeForm = (value: string, index: number, key: string) => {
    const updateSize = [...others];
    if (key === "size") {
      updateSize[index].size = value;
      setOthers(updateSize);
      return;
    }
    if (key === "price") {
      updateSize[index].price = Number(value);
      setOthers(updateSize);
      return;
    }

    if (key === "type") {
      setProductForm({
        ...productForm,
        type: value,
      });
      return;
    }
    setProductForm({
      ...productForm,
      name: value,
    });
  };

  const handleReset = () => {
    setProductForm({ name: "", type: "" });
    setOthers([]);
  };

  const handleAddSizeandPrice = () => {
    setOthers((prev) => [
      ...prev,
      {
        index: prev?.length + 1,
        size: "",
        price: 0,
      },
    ]);
  };

  const handleDeleteImg = () => {
    setProductForm({ ...productForm, img: "" });
  };

  const handleDeleteItemOther = (index: number) => {
    setOthers((prev) => prev.filter((other, id) => id !== index));
  };

  const handleDeleteProduct = async (id: string) => {
    const productDoc = doc(db, "product", id);
    await deleteDoc(productDoc);
    getProducts();
    setTimeout(() => {
      api.success({
        message: "Xoá sản phẩm thành công!",
      });
    }, 500);
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div
      className="containerManagerProduct"
      style={{ margin: "0rem  3rem", paddingTop: "10rem" }}
    >
      <Tabs
        type="card"
        items={["Đơn hàng", "Sản phẩm", "Loại sản phẩm"].map((tab, i) => {
          const id = String(i + 1);
          return {
            label: tab,
            key: id,
            children: (
              <>
                {id === "1" ? (
                  <ManagerOrder />
                ) : id === "2" ? (
                  <>
                    <div className="header_product--add">
                      <Button
                        onClick={() => {
                          showModal();
                          setActionSelected("create");
                        }}
                      >
                        Thêm sản phẩm
                      </Button>
                    </div>
                    <Table
                      columns={columns}
                      dataSource={product}
                      bordered
                      size="middle"
                    />
                  </>
                ) : (
                  <ManagerCategory />
                )}
              </>
            ),
          };
        })}
      />

      <Modal
        title="Thêm sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <h4>Nhập tên sản phẩm</h4>
        <Input
          value={productForm.name}
          onChange={(value) =>
            handleChangeForm(value.target.value.toString(), 0, "name")
          }
        />
        <h4>Chọn loại sản phẩm</h4>
        <Select
          value={productForm?.type}
          placeholder="Chọn loại"
          onChange={(value) => handleChangeForm(value, 0, "type")}
          style={{ width: "100%" }}
        >
          {category?.map((category: any) => (
            <Select.Option value={category.name}>{category.name}</Select.Option>
          ))}
        </Select>
        <br />
        <Space wrap>
          <h4>Chọn size và nhập giá</h4>
          <Button onClick={handleAddSizeandPrice}>Thêm size và giá </Button>
        </Space>

        {others?.map((item, index) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              gap: "10px",
            }}
          >
            <Input.Group compact>
              <Select
                placeholder="Chọn size"
                onChange={(value) => handleChangeForm(value, index, "size")}
                style={{ width: "50%" }}
                value={item?.size}
              >
                <Option value=""> </Option>
                <Option value="S">S</Option>
                <Option value="M">M</Option>
                <Option value="L">L</Option>
                <Option value="XL">XL</Option>
              </Select>
              <Input
                style={{ width: "50%" }}
                placeholder="Nhập giá theo size"
                type="number"
                value={item?.price}
                onChange={(value) =>
                  handleChangeForm(
                    value.target.value.toString(),
                    index,
                    "price"
                  )
                }
              />
            </Input.Group>

            <img
              src={ic_close}
              alt={ic_close}
              onClick={() => handleDeleteItemOther(index)}
              style={{ cursor: "pointer" }}
            />
          </div>
        ))}
        {productForm?.img ? (
          <div>
            <img
              src={productForm?.img}
              alt={productForm?.img}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "10px",
              }}
            />
            <img
              className="imgPreview"
              src={ic_close}
              alt={ic_close}
              onClick={handleDeleteImg}
            />
          </div>
        ) : (
          <Input type="file" onChange={handleChange} />
        )}

        {contextHolder}
      </Modal>
    </div>
  );
}

export default ManagerProductView;
