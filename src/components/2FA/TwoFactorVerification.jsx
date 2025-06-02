// components/TwoFactorVerification.jsx
import React, { useState, useEffect } from "react";
import { useTwoFactor } from "../Context/TwoFactorContext";

const TwoFactorVerification = ({
  isOpen,
  onClose,
  onSuccess,
  title = "Two-Factor Authentication Required",
}) => {
  const { verify2FA, verifyRecoveryCode, loading, error, clearError } =
    useTwoFactor();
  const [verificationCode, setVerificationCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  useEffect(() => {
    if (error) {
      setVerificationError(error);
      const timer = setTimeout(() => {
        clearError();
        setVerificationError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setVerificationCode("");
      setRecoveryCode("");
      setUseRecoveryCode(false);
      setVerificationError("");
      clearError();
    }
  }, [isOpen, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (useRecoveryCode) {
      if (!recoveryCode.trim()) {
        setVerificationError("Please enter a recovery code");
        return;
      }
    } else {
      if (!verificationCode.trim()) {
        setVerificationError("Please enter a verification code");
        return;
      }
    }

    try {
      let result;
      if (useRecoveryCode) {
        result = await verifyRecoveryCode(recoveryCode);
      } else {
        result = await verify2FA(verificationCode);
      }

      console.log("Verification result:", result);
      if (result.isValid) {
        onSuccess(result.token);
      } else {
        setVerificationError("Invalid code. Please try again.");
      }
    } catch (error) {
      setVerificationError("Failed to verify code. Please try again.");
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        ></div>

        {/* Modal positioning */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal content */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {title}
              </h3>

              {verificationError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">
                        {verificationError}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {useRecoveryCode ? "Recovery Code" : "Authenticator Code"}
                    </label>
                    <button
                      type="button"
                      onClick={() => setUseRecoveryCode(!useRecoveryCode)}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      {useRecoveryCode
                        ? "Use authenticator"
                        : "Use recovery code"}
                    </button>
                  </div>

                  {!useRecoveryCode ? (
                    <>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) =>
                          setVerificationCode(
                            e.target.value.replace(/\D/g, "").slice(0, 6)
                          )
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono"
                        placeholder="000000"
                        maxLength="6"
                        autoComplete="off"
                        autoFocus
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Enter the 6-digit code from your authenticator app
                      </p>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={recoveryCode}
                        onChange={(e) =>
                          setRecoveryCode(
                            e.target.value.replace(/[^A-Z0-9]/g, "").slice(0, 8)
                          )
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono uppercase"
                        placeholder="A1B2C3D4"
                        maxLength="8"
                        autoComplete="off"
                        autoFocus
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Enter one of your saved recovery codes
                      </p>
                    </>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      (!useRecoveryCode && verificationCode.length !== 6) ||
                      (useRecoveryCode && recoveryCode.length !== 8)
                    }
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      "Verify"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorVerification;
