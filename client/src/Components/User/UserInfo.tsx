import { useState } from "react";
const UserInfo = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const handleUpdate = () => {
    console.log("Update button clicked");
  };
  const handleChangePassword = () => {
    console.log("Change password button clicked");
  };
  const handleLogout = () => {
    console.log("Logout button clicked");
  };
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setImage(file);
  };
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="form-group my-2">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="image">Profile picture</label>
            <input
              type="file"
              className="form-control"
              name="image"
              onChange={handleImageChange}
            />
          </div>
          <div className="w-full my-2">
            <button
              type="button"
              className="btn btn-primary w-full btn-block"
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
          <div className="w-full my-2">
            <button
              type="button"
              className="btn btn-info w-full btn-block"
              onClick={handleChangePassword}
            >
              Change Password
            </button>
          </div>
          <div className="w-full my-2">
            <button
              type="button"
              className="btn btn-danger w-full btn-block"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserInfo;
