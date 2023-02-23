/* eslint-disable react-hooks/rules-of-hooks */
import { useSelector } from "react-redux";

const getStoredData = (reducerName: any) => {
  const getPending = useSelector((state: any) => state[reducerName].pending);

  const getData = useSelector((state: any) => state[reducerName].data);

  const getError = useSelector((state: any) => state[reducerName].error);

  return { data: getData, pending: getPending, error: getError };
};

export default {
  getStoredData,
};
