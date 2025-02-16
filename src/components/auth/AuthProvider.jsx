import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setUserToken(token);
      setIsAuthenticated(true);
      decodeToken(token);
    }
  }, []);

  const isAdmin = () => {
    console.log("Is Admin check successfull!");
    if (!userToken) return false;
    try {
      const decoded = jwtDecode(userToken);
      return decoded?.role === "Admin";
    } catch (error) {
      console.error("Error decoding token!", error);
      return false;
    }
  };

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
      setUserInfo(decoded);
    } catch (error) {
      console.log("Error decoding token ", error);
    }
  };

  const handleValidToken = (token) => {
    setUserToken(token);
    setIsAuthenticated(true);
    decodeToken(token);
  };

  const startTokenExpirationCheck = () => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("userToken");
      if (token && isTokenExpired(token)) {
        console.log("Login expired!");
        clearInterval(interval);
        logout();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (userToken) {
      const clearExpirationCheck = startTokenExpirationCheck();
      return () => clearExpirationCheck();
    }
  }, [userToken]);

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
        localStorage.setItem("userToken", token);
        handleValidToken(token);
      } else {
        console.error("Login failed!");
        if (response.status === 404) {
          throw new Error("User does not exist!");
        }
        if (response.status === 401) {
          throw new Error("Invalid credentials!");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const register = async (email, password, displayName) => {
    try {
      const formData = new FormData();
      formData.append("Email", email);
      formData.append("Password", password);
      formData.append("DisplayName", displayName);

      const response = await fetch("http://localhost:5231/user/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("userToken", token);
        handleValidToken(token);
        console.log("Token after register:", token);
      } else {
        console.log("Register failed! Checking codes now!");
        if (response.status === 409) {
          throw new Error("User already exists with this email!");
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserToken(null);
    setUserInfo({});
    localStorage.removeItem("userToken");
    localStorage.removeItem("isAdmin");
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
