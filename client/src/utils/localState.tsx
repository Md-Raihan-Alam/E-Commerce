import { useState } from "react";
const uselocalState = () => {
  const [isLoading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    text: "",
    type: "danger",
  });
  const [success, setSuccess] = useState(false);
  const showAlert = ({
    text,
    type = "danger",
  }: {
    text: string;
    type?: string;
  }) => {
    setAlert({ show: true, text, type });
  };
  const hideAlert = () => {
    setAlert({ show: false, text: "", type: "danger" });
  };
  return {
    alert,
    showAlert,
    hideAlert,
    isLoading,
    setLoading,
    success,
    setSuccess,
  };
};
export default uselocalState;
