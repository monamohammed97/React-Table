import Login from "../pages/Login";
import TablePage from "../pages/TablePage";
import Weather from "../pages/Weather";
import Chart from "../pages/admin/Chart";
import Setting from "../pages/admin/Setting";
import ProfileDetails from "../pages/user/ProfileDetails";

export const publicRoutes = [
  {
    path: "/login",
    element: Login,
  },
];

export const authRoutes = [
  {
    path: "/",
    element: TablePage,
    allowedRoles: ["admin", "user"],
  },
  {
    path: "/weather",
    element: Weather,
    allowedRoles: ["admin", "user"],
  },
];

export const adminRoutes = [
  {
    path: "/admin/chart",
    element: Chart,
    allowedRoles: ["admin"],
  },
  {
    path: "/admin/setting",
    element: Setting,
    allowedRoles: ["admin"],
  },
];

export const userRoutes = [
  {
    path: "/user/profileDetails",
    element: ProfileDetails,
    allowedRoles: ["user"],
  },
];
