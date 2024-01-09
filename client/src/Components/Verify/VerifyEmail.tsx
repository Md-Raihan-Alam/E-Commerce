import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import url from "../../utils/url";
import Loading from "../../utils/Loading";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const VerifyEmail = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const query = useQuery();
  const verifyToken = async () => {
    try {
      await axios.post(`${url}/api/v1/auth/verify-email`, {
        verificationToken: query.get("token"),
        email: query.get("email"),
      });
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (loading) {
      verifyToken();
    }
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center mx-auto h-[90vh]">
        <Loading />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center mx-auto h-[90vh]">
        <div className="alert alert-primary">
          <h4>
            There was an error, please double-check your verification link or
            try to login now by going to main page{" "}
          </h4>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center mx-auto h-[90vh]">
      <div className="alert alert-success w-[300px]">
        <h2>Your account has been confirmed!! Now you can login</h2>
        <Link to="/Login" className="mt-3 btn btn-sm btn-primary">
          Please login
        </Link>
      </div>
    </div>
  );
};
export default VerifyEmail;
