// components/TwoFactorDisable.jsx
import React, { useState, useEffect, useContext } from "react";
import { useTwoFactor } from "../Context/TwoFactorContext";
import { AuthContext } from "../auth/AuthProvider";

const TwoFactorDisable = ({ onCancel }) => {
  const {
    disable2FA,
    verify2FA,
    verifyRecoveryCode,
    loading,
    error,
    clearError,
  } = useTwoFactor();
  const [verificationCode, setVerificationCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const [disableError, setDisableError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const { setToken } = useContext(AuthContext);

  useEffect(() => {
    if (error) {
      setDisableError(error);
      const timer = setTimeout(() => {
        clearError();
        setDisableError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleVerifyAndDisable = async (e) => {
    e.preventDefault();

    if (useRecoveryCode) {
      if (!recoveryCode.trim()) {
        setDisableError("Please enter a recovery code");
        return;
      }
    } else {
      if (!verificationCode.trim()) {
        setDisableError("Please enter a verification code");
        return;
      }
    }

    try {
      // First verify the code
      let verificationResult;
      if (useRecoveryCode) {
        verificationResult = await verifyRecoveryCode(recoveryCode);
      } else {
        verificationResult = await verify2FA(verificationCode);
      }

      if (verificationResult.isValid) {
        setIsConfirming(true);
      } else {
        setDisableError("Invalid code. Please try again.");
      }
    } catch (error) {
      setDisableError("Failed to verify code. Please try again.");
    }
  };

  const handleConfirmDisable = async () => {
    try {
      const result = await disable2FA();
      if (result.success) {
        console.log("Disabling, new token", result.token);
        onCancel(result.token);
      } else {
        setDisableError("Failed to disable 2FA. Please try again.");
      }
    } catch (error) {
      setDisableError("Failed to disable 2FA. Please try again.");
    }
  };

  const handleCancel = (token) => {
    console.log("Token", token);
    setIsConfirming(false);
    setToken(token);
    onCancel();
  };

  if (isConfirming) {
    return (
      <div
        className="w-full min-h-full h-fit p-16 flex flex-grow"
        style={{
          backgroundImage: "linear-gradient(to right, #191910, #191912)",
        }}
      >
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <button
                onClick={() => setIsConfirming(false)}
                className="mr-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                Confirm Disable 2FA
              </h2>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p className="text-justify">
                    You are about to disable two-factor authentication for your
                    account. This will reduce the security of your account. Are
                    you sure you want to continue?
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Security Implications
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Your account will only be protected by your password</li>
              <li>You will be more vulnerable to unauthorized access</li>
              <li>Your recovery codes will no longer be valid</li>
              <li>
                You can re-enable 2FA at any time from your security settings
              </li>
            </ul>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setIsConfirming(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDisable}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Disabling...
                </>
              ) : (
                "Yes, Disable 2FA"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-full h-fit p-16 flex flex-grow"
      style={{ backgroundImage: "linear-gradient(to right, #191910, #191912)" }}
    >
      <div className="flex flex-col height-fit flex-grow max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={handleCancel}
              className="mr-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>
            <h2 className="text-md md:text-xl lg:text-2xl font-bold text-gray-900">
              Disable Two-Factor Authentication
            </h2>
          </div>
          <p className="text-gray-600 text-justify">
            To disable two-factor authentication, please verify your identity
            with a code from your authenticator app or a recovery code.
          </p>
        </div>

        {disableError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
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
                <p className="text-sm text-red-800">{disableError}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleVerifyAndDisable}>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Verification Required
              </h3>
              <button
                type="button"
                onClick={() => setUseRecoveryCode(!useRecoveryCode)}
                className="text-sm text-green-600 hover:text-green-500"
              >
                {useRecoveryCode
                  ? "Use authenticator code"
                  : "Use recovery code"}
              </button>
            </div>

            {!useRecoveryCode ? (
              <div className="mb-4">
                <label
                  htmlFor="verification-code"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Authenticator Code
                </label>
                <input
                  type="text"
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-center text-lg font-mono"
                  placeholder="000000"
                  maxLength="6"
                  autoComplete="off"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
            ) : (
              <div className="mb-4">
                <label
                  htmlFor="recovery-code"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Recovery Code
                </label>
                <input
                  type="text"
                  id="recovery-code"
                  value={recoveryCode}
                  onChange={(e) =>
                    setRecoveryCode(
                      e.target.value.replace(/[^A-Z0-9]/g, "").slice(0, 8)
                    )
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-center text-lg font-mono uppercase"
                  placeholder="A1B2C3D4"
                  maxLength="8"
                  autoComplete="off"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Enter one of your saved recovery codes
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  "Verify & Continue"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorDisable;
