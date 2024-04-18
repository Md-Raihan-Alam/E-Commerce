import { useEffect, useState } from "react";
import url from "../../utils/url";
import { useGlobalContext, GlobalContextTypes } from "../../context";
import axios from "axios";
const MyOrder = () => {
  const context = useGlobalContext() as GlobalContextTypes;
  const { getCookie } = context;
  const [orders, setOrders] = useState(null);
  const [nextPage, setNextPage] = useState(-1);
  const [prevPage, setPrevPage] = useState(-1);
  const getMyOrder = async () => {
    try {
      const token = getCookie("token");
      const result = await axios.post(`${url}/api/v1/orders/myorder`, {
        token,
      });
      // console.log(result.data.result);
      setOrders(result.data.result);
      setNextPage(result.data.next.page);
      setPrevPage(result.data.previous.page);
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMyOrder();
  }, []);
  const setPage = async (page: Number) => {
    // setLoading(true);
    let setPage = String(page);
    try {
      const result = await axios.get(
        `${url}/api/v1/orders/myorder?page=${setPage}&limit=1`
      );
      setOrders(result.data.result);
      setNextPage(result.data.next.page);
      setPrevPage(result.data.previous.page);
    } catch (error) {
      console.log(error);
    }
  };
  if (orders === null) {
    return (
      <div className="w-full h-[70vh] flex justify-center items-center">
        <div className="alert alert-info">You have no orders</div>
      </div>
    );
  }
  return (
    <div className="w-full overflow-x-auto mt-2">
      <table className="table table-info table-striped">
        <thead>
          <tr>
            <th scope="col" className="whitespace-nowrap ">
              Product
            </th>
            <th scope="col" className="whitespace-nowrap ">
              Total
            </th>
            <th scope="col" className="whitespace-nowrap">
              Payment Status
            </th>
            <th scope="col" className="whitespace-nowrap">
              Order Date
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((e: any) => {
            return (
              <tr key={e.id}>
                <td className="whitespace-nowrap">
                  <select className="form-select">
                    <option>
                      Product Name - Product Price - Quantity - Amount
                    </option>
                    {e.orderItems.map((item: any, index: number) => (
                      <option disabled={true} key={index} value={item.name}>
                        {item.name} - ${item.price} - Qty: {item.amount} - $
                        {item.price * item.amount}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="whitespace-nowrap">${e.total}</td>
                <td className="whitespace-nowrap uppercase font-bold">
                  {e.status}
                </td>
                <td className="whitespace-nowrap">
                  {String(e.createdAt).substring(0, 10)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex my-2 justify-center w-full h-full items-center">
        {prevPage !== -1 && (
          <button
            type="button"
            onClick={() => setPage(prevPage)}
            className="cursor-pointer focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Previous
          </button>
        )}
        <button
          type="button"
          disabled={true}
          className="cursor-pointer py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          {prevPage === -1 && nextPage === -1
            ? 1
            : prevPage === -1 && nextPage !== -1
            ? nextPage - 1
            : prevPage + 1}
        </button>
        {nextPage !== -1 && (
          <button
            type="button"
            onClick={() => setPage(nextPage)}
            className="cursor-pointer focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
export default MyOrder;
