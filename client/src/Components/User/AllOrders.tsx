import DefaultProductPicture from "../../assets/default-book-cover.png";
const AllOrders = () => {
  return (
    <div className="w-full overflow-x-auto mt-2">
      <table className="table table-info table-striped">
        <thead>
          <tr>
            <th scope="col" className="whitespace-nowrap">
              Customer Name
            </th>
            <th scope="col" className="whitespace-nowrap">
              Book Name
            </th>
            <th scope="col" className="whitespace-nowrap">
              Book Image
            </th>
            <th scope="col" className="whitespace-nowrap">
              Total
            </th>
            <th scope="col" className="whitespace-nowrap">
              Delivery Status
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="whitespace-nowrap">John Doe</td>
            <td className="whitespace-nowrap">Product ABC</td>
            <td className="whitespace-nowrap">
              <img
                src={DefaultProductPicture}
                alt="John Does's profile"
                className="w-[50px] h-[50px] object-cover rounded-full"
              />
            </td>
            <td className="whitespace-nowrap">$100.00</td>
            <td className="whitespace-nowrap">
              <select className="form-select">
                <option selected value="pending">
                  Pending
                </option>
                <option value="failed">Failed</option>
                <option value="paid">Paid</option>
                <option value="delivered">Delivered</option>
                <option value="canceled">Canceled</option>
              </select>
            </td>
          </tr>
          {/* Add more rows with different data */}
        </tbody>
      </table>
    </div>
  );
};
export default AllOrders;
