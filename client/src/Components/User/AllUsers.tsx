import DefaultPicture from "../../assets/Default-Customer-Picture.jpg";
import Loading from "../../utils/Loading";
import uselocalState from "../../utils/localState";
import url from "../../utils/url";
import axios from "axios";
import { useEffect, useState } from "react";
const AllUsers = () => {
  const { isLoading, setLoading } = uselocalState();
  const [allUsers, setUsers] = useState(null);
  const [nextPage, setNextPage] = useState(-1);
  const [prevPage, setPrevPage] = useState(-1);
  const getAllUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${url}/api/v1/users?page=1&limit=5`);
      setUsers(data.result);
      setNextPage(data.next.page);
      setPrevPage(data.previous.page);
    } catch (error: any) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  const setPage = async (page: Number) => {
    setLoading(true);
    let setPage = String(page);
    try {
      const { data } = await axios.get(
        `${url}/api/v1/users?page=${setPage}&limit=1`
      );
      setUsers(data.result);
      setNextPage(data.next.page);
      setPrevPage(data.previous.page);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
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
                <td className="whitespace-nowrap">{e.role}</td>
                <td className="whitespace-nowrap">
                  {e.isVerified ? "Yes" : "No"}
                </td>
                <td className="whitespace-nowrap">
                  {e.verified === undefined ? "N/A" : e.verified.slice(0, 10)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex my-2 justify-center w-full h-full items-center">
        {prevPage !== -1 && (
          <button
            type="button"
            onClick={() => setPage(prevPage)}
            className="cursor-pointer focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Previous
          </button>
        )}
        <button
          type="button"
          disabled={true}
          className="cursor-pointer py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          {prevPage === -1 && nextPage === -1
            ? 1
            : prevPage === -1 && nextPage !== -1
            ? nextPage - 1
            : prevPage + 1}
        </button>
        {nextPage !== -1 && (
          <button
            type="button"
            onClick={() => setPage(nextPage)}
            className="cursor-pointer focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
export default AllUsers;
