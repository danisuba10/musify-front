import React, { createContext, useState, useEffect } from "react";

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
      verifyRoles(token);
    }
  }, []);

  const verifyRoles = (token) => {
    const adminStatus = token === "adminToken";
    setIsAdmin(adminStatus);
    sessionStorage.setItem("isAdmin", adminStatus);
  };

  const login = (email, password) => {
    const token =
      email === "admin@gmail.com" && password === "admin"
        ? "adminToken"
        : "userToken";
    setUserToken(token);
    sessionStorage.setItem("userToken", token);
    setIsAuthenticated(true);
    setUserInfo({ email });
    verifyRoles(token);
  };

  const register = (email, password) => {
    const token = "userToken";
    setUserToken(token);
    sessionStorage.setItem("userToken", token);
    setIsAuthenticated(true);
    setUserInfo({ email });
    setIsAdmin(false);
    sessionStorage.setItem("isAdmin", false);
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
