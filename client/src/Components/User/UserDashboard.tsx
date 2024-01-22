import UserInfo from "./UserInfo";
import AllUsers from "./AllUsers";
import AllOrders from "./AllOrders";
import ProductInfos from "./ProductInfo";
import AllProducts from "./AllProducts";
import { useState } from "react";
const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState<string | null>("About Me");
  const updateTab = (e: string) => {
    setActiveTab(e);
  };
  const adminTabs = [
    "About Me",
    "AllUsers",
    "Orders",
    "Create/Edit Product",
    "All Product",
  ];
  return (
    <>
      <ul className="nav nav-tabs">
        {adminTabs.map((e) => {
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
      {activeTab === "About Me" && <UserInfo />}
      {activeTab === "AllUsers" && <AllUsers />}
      {activeTab === "Orders" && <AllOrders />}
      {activeTab === "Create/Edit Product" && <ProductInfos />}
      {activeTab === "All Product" && <AllProducts />}
    </>
  );
};
export default UserDashboard;
