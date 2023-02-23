import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomeView from "./view/Home";
import NotFoundView from "./view/NotFound/NotFoundView";

import Cart from "./view/Cart";
import ManagerProductView from "./view/Product/ManagerProduct";

function App() {
  return (
    <Routes>
      <Route path={"/"} element={<HomeView />} />
      <Route path={"/cart"} element={<Cart />} />
      <Route path={"/manager"} element={<ManagerProductView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
}

export default App;
