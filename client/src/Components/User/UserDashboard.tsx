import UserInfo from "./UserInfo";
import AllUsers from "./AllUsers";
import AllOrders from "./AllOrders";
import ProductInfos from "./ProductInfo";
import AllProducts from "./AllProducts";
import { useEffect, useState } from "react";
import { useGlobalContext, GlobalContextTypes } from "../../context";
import uselocalState from "../../utils/localState";
import { useLocation } from "react-router-dom";
import Loading from "../../utils/Loading";
import axios from "axios";
import url from "../../utils/url";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const UserDashboard = () => {
  const context = useGlobalContext() as GlobalContextTypes;
  const { user } = context;
  const [activeTab, setActiveTab] = useState<string | null>("Dashboard");
  const [editProduct, setEditProduct] = useState();
  const query = useQuery();
  useEffect(() => {
    if (query.get("productId")) {
      const id = query.get("productId");
      setActiveTab("Create/Edit Product");

      const getProduct = async (id: string | null) => {
        try {
          const { data } = await axios.get(`${url}/api/v1/product/${id}`);
          setEditProduct(data.product);
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      };

      getProduct(id);
    }
  }, []);
  const { isLoading } = uselocalState();
  const updateTab = (e: string) => {
    setActiveTab(e);
  };
  let tabs = [
    "Dashboard",
    "Users",
    "Orders",
    "Create/Edit Product",
    "Products",
  ];
  if (user!.role === "user") {
    tabs = ["Dashboard", "My Orders"];
  }
  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  return (
    <>
      <ul className="nav nav-tabs">
        {tabs.map((e) => {
          return (
            <li className="nav-items" key={e}>
              <span
                onClick={() => updateTab(e)}
                className={`cursor-pointer nav-link ${
                  activeTab === e ? "active" : ""
                }`}
              >
                {e}
              </span>
            </li>
          );
        })}
      </ul>
      {activeTab === "Dashboard" && <UserInfo />}
      {activeTab === "Users" && <AllUsers />}
      {activeTab === "Orders" && <AllOrders />}
      {activeTab === "Create/Edit Product" && (
        <ProductInfos props={editProduct} />
      )}
      {activeTab === "Products" && <AllProducts />}
    </>
  );
};
export default UserDashboard;
