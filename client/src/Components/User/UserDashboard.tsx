import UserInfo from "./UserInfo";
import AllUsers from "./AllUsers";
import AllOrders from "./AllOrders";
import ProductInfos from "./ProductInfo";
import AllProducts from "./AllProducts";
import { useGlobalContext, GlobalContextTypes } from "../../context";
import uselocalState from "../../utils/localState";
import Loading from "../../utils/Loading";
import MyOrder from "./UserOrder";
const UserDashboard = () => {
  const context = useGlobalContext() as GlobalContextTypes;
  const { user, activeTab, setActiveTab } = context;
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
      {activeTab === "My Orders" && <MyOrder />}
    </>
  );
};
export default UserDashboard;
