import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import axios from "axios";
export interface GlobalContextTypes {
  isLoading: boolean;
  user: string | null;
  saveUser: (user: string | null) => void;
  logoutUser: Dispatch<SetStateAction<null>>;
}
interface AppContextProps {
  children: ReactNode;
}
const GlobalContext = createContext<GlobalContextTypes | undefined>(undefined);
const AppProvider: React.FC<AppContextProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);
  const saveUser = (user: string | null) => {
    setUser(user);
  };
  const removeUser = () => {
    setUser(null);
  };
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`/api/v1/users/showMe`);
      saveUser(data.user);
    } catch (error) {
      removeUser();
    }
    setIsLoading(false);
  };
  const logoutUser = async () => {
    try {
      await axios.delete(`/api/v1/auth/logout`);
      removeUser();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <GlobalContext.Provider value={{ isLoading, user, saveUser, logoutUser }}>
      {children}
    </GlobalContext.Provider>
  );
};
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
export default AppProvider;
