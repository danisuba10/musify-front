import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (token) {
      setUserToken(token);
      setIsAuthenticated(true);
      decodeToken(token);
    }
  }, []);

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token!", error);
      return true;
    }
  };

  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded Token: ", decoded);
      const isAdminBool = decoded?.role === "Admin";
      setIsAdmin(isAdminBool);
      setUserInfo(decoded);
      sessionStorage.setItem("isAdmin", isAdmin);
      console.log(isAdmin);
    } catch (error) {
      console.log("Error decoding token ", error);
    }
  };

  const handleValidToken = (token) => {
    setUserToken(token);
    setIsAuthenticated(true);
    decodeToken(token);
  };

  //Interval possibly does not work
  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (token) {
      if (isTokenExpired(token)) {
        console.log("Login expired 1!");
        logout();
      } else {
        handleValidToken(token);
      }

      const interval = setInterval(() => {
        const token = sessionStorage.getItem("userToken");
        if (token && isTokenExpired(token)) {
          console.log("Login expired 2!");
          logout();
        }
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const formData = new FormData();
      formData.append("userName", email);
      formData.append("password", password);

      const response = await fetch("http://localhost:5231/user/login", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const token = await response.text();
        sessionStorage.setItem("userToken", token);
        handleValidToken(token);
      } else {
        console.error("Login failed!");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const register = async (email, password) => {
    try {
      const formData = new FormData();
      formData.append("userName", email);
      formData.append("password", password);

      const response = await fetch("http://localhost:5231/user/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const token = await response.text();
        sessionStorage.setItem("userToken", token);
        handleValidToken(token);
      } else {
        console.error("Register failed!");
      }
    } catch (error) {
      console.error("Error during register:", error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserToken(null);
    setUserInfo({});
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        userToken,
        userInfo,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
