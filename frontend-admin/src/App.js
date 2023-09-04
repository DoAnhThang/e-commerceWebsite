import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { SERVER_URL } from "./data/api";

import Wrapper from "./components/Wrapper";
import PageNotFound from "./components/PageNotFound";

import Dashboard from "./pages/Dashboard";
import ProductsList from "./pages/ProductsList";
import AddProduct from "./pages/AddProduct";
import Chat from "./pages/Chat";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  const [isAuth, setIsAuth] = useState({ isAuth: false, user: {} });

  // get login status
  const getLoginStatus = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/auth/login-status`, {
        credentials: "include",
      });
      const data = await res.json();
      // console.log("getLoginStatus: ", data);
      if (data.errorMsg) return console.log(data.errorMsg);
      if (data.isAuth) {
        setIsAuth(data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getLoginStatus();
  }, []);

  return (
    <Wrapper isAuth={isAuth.isAuth} setIsAuth={(value) => setIsAuth(value)}>
      <Routes>
        {isAuth.isAuth ? (
          <>
            <Route path="/" element={<Dashboard role={isAuth.user.role} />} />
            <Route
              path="/products"
              element={<ProductsList role={isAuth.user.role} />}
            />
            <Route
              path="/add-product"
              element={<AddProduct edit={false} role={isAuth.user.role} />}
            />
            <Route
              path="/edit-product/:productId"
              element={<AddProduct edit={true} role={isAuth.user.role} />}
            />
            <Route path="/chat" element={<Chat role={isAuth.user.role} />} />
          </>
        ) : (
          <>
            <Route
              path="/"
              element={<Login setIsAuth={(value) => setIsAuth(value)} />}
            />
            <Route path="/signup" element={<Signup />} />
          </>
        )}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Wrapper>
  );
}

export default App;
