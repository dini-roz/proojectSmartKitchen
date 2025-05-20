import Nav from "./comp/Nav";
import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  );
};

export default AppLayout;
