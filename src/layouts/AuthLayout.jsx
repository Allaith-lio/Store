import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-page text-ink">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
