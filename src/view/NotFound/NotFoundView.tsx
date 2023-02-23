import { Button, Result } from "antd";
import { Link } from "react-router-dom";

function NotFoundView() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang này không tồn tại!!!!"
      extra={
        <Link to="/">
          {" "}
          <Button type="primary">Trở về trang chủ</Button>
        </Link>
      }
    />
  );
}

export default NotFoundView;
