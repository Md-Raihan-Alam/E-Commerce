const ChangePassword = () => {
  return (
    <div className="flex justify-center items-center h-[90vh]">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h1 className="text-xl sm:w-[600px] w-[300px] font-bold leading-tight tracking-tight">
            Change Password
          </h1>
          <div>
            <label className="mb-2 text-sm font-medium">Old password</label>
            <input
              type="password"
              className="bg-gray-50 border border-blue-300  sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-blue-500"
              placeholder="******"
              autoComplete="off"
              autoCorrect="off"
              name="password"
            />
          </div>
          <div>
            <label className="mb-2 text-sm font-medium">New password</label>
            <input
              type="password"
              className="bg-gray-50 border border-blue-300  sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-blue-500"
              placeholder="******"
              autoComplete="off"
              autoCorrect="off"
              name="password"
            />
          </div>

          <button className="btn btn-primary mt-3 btn-sm w-full block">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChangePassword;
