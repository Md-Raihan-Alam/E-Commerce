import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
const Sharedlayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
export default Sharedlayout;
