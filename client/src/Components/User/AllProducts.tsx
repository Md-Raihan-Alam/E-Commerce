import DefaultProductPicture from "../../assets/default-book-cover.png";
import url from "../../utils/url";
import axios from "axios";
import { useState, useEffect } from "react";
import Loading from "../../utils/Loading";
import uselocalState from "../../utils/localState";
import editSVG from "../../assets/edit.svg";
import deleteSVG from "../../assets/delete.svg";
const AllProducts = () => {
  const { isLoading, setLoading } = uselocalState();
  const [allProducts, setAllProducts] = useState(null);
  const getAllProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${url}/api/v1/product/`);
      setAllProducts(data.product);
      getAllProducts();
    } catch (error: any) {
      console.log(error);
    }
    setLoading(false);
  };
  const deleteProducts = async (id: string) => {
    setLoading(true);
    try {
      console.log(id);
      await axios.delete(`${url}/api/v1/product/${id}`);
      getAllProducts();
    } catch (error: any) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getAllProducts();
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
                  <button className="btn btn-primary m-2">
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
    </div>
  );
};

export default AllProducts;
