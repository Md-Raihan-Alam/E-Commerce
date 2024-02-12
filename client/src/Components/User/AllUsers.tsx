import DefaultPicture from "../../assets/Default-Customer-Picture.jpg";
import Loading from "../../utils/Loading";
import uselocalState from "../../utils/localState";
import url from "../../utils/url";
import axios from "axios";
import { useEffect, useState } from "react";
const AllUsers = () => {
  const { isLoading, setLoading } = uselocalState();
  const [allUsers, setUsers] = useState(null);
  const getAllUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${url}/api/v1/users`);
      setUsers(data.users);
    } catch (error: any) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-[70vh] flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  if (allUsers === null) {
    return (
      <div className="w-full h-[70vh] flex justify-center items-center">
        <div className="alert alert-info">You have no any users</div>
      </div>
    );
  }
  return (
    <div className="w-full overflow-x-auto mt-2">
      <table className="table table-info table-striped">
        <thead>
          <tr>
            <th scope="col" className="whitespace-nowrap">
              Image
            </th>
            <th scope="col" className="whitespace-nowrap">
              Name
            </th>
            <th scope="col" className="whitespace-nowrap">
              Address
            </th>
            <th scope="col" className="whitespace-nowrap">
              Role
            </th>
            <th scope="col" className="whitespace-nowrap">
              Is Verified
            </th>
            <th scope="col" className="whitespace-nowrap">
              Verified
            </th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((e: any) => {
            return (
              <tr key={e.id}>
                <td>
                  <img
                    src={e.image === "" ? DefaultPicture : `${url}${e.image}`}
                    alt="User profile"
                    className="w-[50px] h-[50px] object-cover whitespace-nowrap rounded-full"
                  />
                </td>
                <td className="whitespace-nowrap">{e.name}</td>
                <td className="whitespace-nowrap">
                  {e.address == "" ? "Not provided" : e.address}
                </td>
                <td className="whitespace-nowrap">Customer</td>
                <td className="whitespace-nowrap">
                  {e.isVerified ? "Yes" : "No"}
                </td>
                <td className="whitespace-nowrap">{e.verified.slice(0, 10)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default AllUsers;
