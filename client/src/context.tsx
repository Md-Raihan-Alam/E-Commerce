import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import url from "./utils/url";
export interface GlobalContextTypes {
  isLoading: boolean;
  user: object | null;
  activeTab: string | null;
  setActiveTab: (tab: string | null) => void;
  saveUser: (user: object | null) => void;
  logoutUser: () => void;
  setCookie: (token: string) => void;
  getCookie: (cname: string) => string;
  fetchUser: () => void;
  editProduct: object | null | undefined;
  getProduct: (id: string | null) => void;
}
interface AppContextProps {
  children: ReactNode;
}
const GlobalContext = createContext<GlobalContextTypes | undefined>(undefined);
const AppProvider: React.FC<AppContextProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<object | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>("Dashboard");
  const [editProduct, setEditProduct] = useState();
  const getProduct = async (id: string | null) => {
    setActiveTab("Create/Edit Product");
    try {
      const { data } = await axios.get(`${url}/api/v1/product/${id}`);
      setEditProduct(data.product);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const saveUser = (user: object | null) => {
    setUser(user);
  };
  const removeUser = () => {
    setUser(null);
  };
  function getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  const fetchUser = async () => {
    const currentTokenValue = getCookie("token");
    try {
      const { data } = await axios.post(`${url}/api/v1/users/showMe`, {
        token: currentTokenValue,
      });
      saveUser(data.name);
    } catch (error) {
      removeUser();
    }
    setIsLoading(false);
  };
  const logoutUser = async () => {
    document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
  };
  const setCookie = (token: string) => {
    const time = new Date();
    const oneDay = 1000 * 60 * 60 * 24;
    time.setTime(time.getTime() + oneDay);
    document.cookie = `token=${token};expires=${time};path=/`;
  };
  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        fetchUser,
        setCookie,
        getCookie,
        user,
        saveUser,
        logoutUser,
        activeTab,
        setActiveTab,
        editProduct,
        getProduct,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
export default AppProvider;
