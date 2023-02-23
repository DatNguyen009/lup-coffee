import { notification } from "antd";

export const formatNumber = (number: number) => {
  if (!number) return "";
  return number
    .toString()
    .replaceAll(".", "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const showErrorMessage = (message: string, description: string) => {
  const [api] = notification.useNotification();

  return api.error({
    message,
    description,
  });
};
