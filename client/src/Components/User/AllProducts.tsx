import DefaultProductPicture from "../../assets/default-book-cover.png";
import url from "../../utils/url";
import axios from "axios";
import { useState, useEffect } from "react";
import Loading from "../../utils/Loading";
import uselocalState from "../../utils/localState";
import editSVG from "../../assets/edit.svg";
import deleteSVG from "../../assets/delete.svg";
import { useGlobalContext, GlobalContextTypes } from "../../context";

const AllProducts = () => {
  const context = useGlobalContext() as GlobalContextTypes;
  const { getProduct } = context;
  const [nextPage, setNextPage] = useState(-1);
  const [prevPage, setPrevPage] = useState(-1);
  const { isLoading, setLoading } = uselocalState();
  const [allProducts, setAllProducts] = useState(null);
  const getAllProducts = async (page: String | null) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${url}/api/v1/product?page=${page === null ? "1" : page}&limit=5`
      );
      setAllProducts(data.result);
      setNextPage(data.next.page);
      setPrevPage(data.previous.page);
      setLoading(false);
    } catch (error: any) {
      console.log(error);

      setLoading(false);
    }
  };
  const setPage = async (page: Number) => {
    setLoading(true);
    let setPage = String(page);
    try {
      const { data } = await axios.get(
        `${url}/api/v1/product?page=${setPage}&limit=5`
      );
      setAllProducts(data.result);
      setNextPage(data.next.page);
      setPrevPage(data.previous.page);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const deleteProducts = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`${url}/api/v1/product/${id}`);

      getAllProducts(
        String(
          prevPage === -1 && nextPage === -1
            ? "1"
            : prevPage === -1 && nextPage !== -1
            ? nextPage - 1
            : prevPage + 1
        )
      );
    } catch (error: any) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllProducts("1");
  }, []);
  if (isLoading) {
    return (
      <div className="w-full h-[70vh] flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  if (allProducts === null) {
    return (
      <div className="w-full h-[70vh] flex justify-center items-center">
        <div className="alert alert-info">
          You have not entered any products
        </div>
      </div>
    );
  }
  return (
    <div className="w-full overflow-x-auto mt-2">
      <table className="table table-info table-striped">
        <thead>
          <tr>
            <th scope="col" className="whitespace-nowrap">
              Book Image
            </th>
            <th scope="col" className="whitespace-nowrap">
              Book Name
            </th>
            <th scope="col" className="whitespace-nowrap">
              Author
            </th>
            <th scope="col" className="whitespace-nowrap">
              Price
            </th>
            <th scope="col" className="whitespace-nowrap">
              Free Delivery
            </th>
            <th scope="col" className="whitespace-nowrap">
              Inventory
            </th>
            <th scope="col" className="whitespace-nowrap">
              Average Rating
            </th>
            <th scope="col" className="whitespace-nowrap">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {allProducts.map((e: any) => {
            return (
              <tr key={e.id}>
                <td className="whitespace-nowrap">
                  <img
                    src={
                      e.image === ""
                        ? DefaultProductPicture
                        : `${url}${e.image}`
                    }
                    alt="Book Cover"
                    className="w-[50px] h-[50px] object-cover rounded-full"
                  />
                </td>
                <td className="whitespace-nowrap">{e.name}</td>
                <td className="whitespace-nowrap">{e.author}</td>
                <td className="whitespace-nowrap">${e.price}</td>
                <td className="whitespace-nowrap">
                  {e.freeDelivery ? "Yes" : "No"}
                </td>
                <td className="whitespace-nowrap">{e.inventory}</td>
                <td className="whitespace-nowrap">{e.averageRating}</td>
                <td className="whitespace-nowrap">
                  <button
                    className="btn btn-primary m-2"
                    onClick={() => getProduct(e.id)}
                  >
                    <img src={editSVG} alt="edit" />
                  </button>
                  <button
                    className="btn btn-danger m-2"
                    onClick={() => deleteProducts(e.id)}
                  >
                    <img src={deleteSVG} alt="delete" />
                  </button>
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

export default AllProducts;
