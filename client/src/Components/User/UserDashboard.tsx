import UserInfo from "./UserInfo";
import AllUsers from "./AllUsers";
import AllOrders from "./AllOrders";
import ProductInfos from "./ProductInfo";
import AllProducts from "./AllProducts";
import { useState } from "react";
import { useGlobalContext, GlobalContextTypes } from "../../context";
import uselocalState from "../../utils/localState";
import { useNavigate } from "react-router-dom";
import Loading from "../../utils/Loading";
const UserDashboard = () => {
  const navigate = useNavigate();
  const context = useGlobalContext() as GlobalContextTypes;
  const { user } = context;
  const [activeTab, setActiveTab] = useState<string | null>("Dashboard");
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
      {activeTab === "Create/Edit Product" && <ProductInfos />}
      {activeTab === "Products" && <AllProducts />}
    </>
  );
};
export default UserDashboard;
