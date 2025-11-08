// Definition for public and private routes

import App from "../App";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  { path: "/dashboard", element: <App /> },
  { path: "/login" },
  { path: "/register" },
]);
