// contexts/TwoFactorContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../auth/AuthProvider";
import TwoFactorService from "../Service/TwoFactorService";

const TwoFactorContext = createContext();

export const useTwoFactor = () => {
  const context = useContext(TwoFactorContext);
  if (!context) {
    throw new Error("useTwoFactor must be used within a TwoFactorProvider");
  }
  return context;
};

export const TwoFactorProvider = ({ children }) => {
  const { userToken } = useContext(AuthContext);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FAPending, setIs2FAPending] = useState(false);
  const [twoFactorService, setTwoFactorService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userToken) {
      try {
        const decoded = jwtDecode(userToken);
        setIs2FAEnabled(decoded.TwoFactorEnabled === "true");
        setIs2FAPending(decoded.TwoFactorPending === "true");

        const service = new TwoFactorService(() => userToken);
        setTwoFactorService(service);
      } catch (error) {
        console.error("Error decoding token for 2FA info:", error);
      }
    } else {
      setIs2FAEnabled(false);
      setIs2FAPending(false);
      setTwoFactorService(null);
    }
  }, [userToken]);

  const handleError = (error) => {
    console.error("2FA Error:", error);
    setError(error.message || "An unexpected error occurred");
    setLoading(false);
  };

  const clearError = () => {
    setError(null);
  };

  const enable2FA = async () => {
    if (!twoFactorService) return;

    setLoading(true);
    setError(null);

    try {
      const result = await twoFactorService.enable2FA();
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirm2FA = async (code) => {
    if (!twoFactorService) throw new Error("2FA service not initialized");

    setLoading(true);
    setError(null);

    try {
      const result = await twoFactorService.confirm2FA(code);
      if (result.Success) {
        setIs2FAEnabled(true);
      }
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const set2FADisabled = (state) => {
    setIs2FAEnabled(state);
  };

  const verify2FA = async (code) => {
    if (!twoFactorService) throw new Error("2FA service not initialized");

    setLoading(true);
    setError(null);

    try {
      const result = await twoFactorService.verify2FA(code);
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyRecoveryCode = async (recoveryCode) => {
    if (!twoFactorService) throw new Error("2FA service not initialized");

    setLoading(true);
    setError(null);

    try {
      const result = await twoFactorService.verifyRecoveryCode(recoveryCode);
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    if (!twoFactorService) throw new Error("2FA service not initialized");

    setLoading(true);
    setError(null);

    try {
      const result = await twoFactorService.disable2FA();
      if (result.Success) {
        setIs2FAEnabled(false);
      }
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getQRCode = async () => {
    if (!twoFactorService) throw new Error("2FA service not initialized");

    setLoading(true);
    setError(null);

    try {
      const qrCodeUrl = await twoFactorService.getQRCode();
      return qrCodeUrl;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    is2FAEnabled,
    is2FAPending,
    loading,
    error,
    clearError,
    enable2FA,
    confirm2FA,
    verify2FA,
    verifyRecoveryCode,
    disable2FA,
    getQRCode,
    set2FADisabled,
  };

  return (
    <TwoFactorContext.Provider value={value}>
      {children}
    </TwoFactorContext.Provider>
  );
};
