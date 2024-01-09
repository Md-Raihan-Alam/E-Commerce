import { Link, useLocation } from "react-router-dom";
const Navbar = () => {
  const location = useLocation();
  return (
    <>
      <nav className="navbar sticky-top bg-body-tertiary border-black border-b">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            Book Shop
          </Link>
          <div className="d-flex">
            <Link
              to="/Login"
              className="no-underline text-lg mr-2 btn btn-primary"
            >
              Sign Up/In
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
