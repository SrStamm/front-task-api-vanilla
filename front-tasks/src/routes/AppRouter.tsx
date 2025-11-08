// Definition for public and private routes

import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";

export const router = createBrowserRouter([
  { path: "/dashboard", element: <App /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register" },
]);
