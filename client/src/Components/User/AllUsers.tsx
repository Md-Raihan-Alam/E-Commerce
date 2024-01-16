import DefaultPicture from "../../assets/Default-Customer-Picture.jpg";
const AllUsers = () => {
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
          <tr>
            <td>
              <img
                src={DefaultPicture}
                alt="John Does's profile"
                className="w-[50px] h-[50px] object-cover whitespace-nowrap rounded-full"
              />
            </td>
            <td className="whitespace-nowrap">John Doe John Doe John Doe</td>
            <td className="whitespace-nowrap">
              123 Main St 123 Main St 123 Main St 123 Main St 123 Main St 123
              Main St 123 Main St 123 Main St 123 Main St
            </td>
            <td className="whitespace-nowrap">Customer</td>
            <td className="whitespace-nowrap">Yes</td>
            <td className="whitespace-nowrap">2022-01-01</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default AllUsers;
