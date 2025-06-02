// components/TwoFactorSetup.jsx
import React, { useState, useEffect, useContext } from "react";
import { useTwoFactor } from "../Context/TwoFactorContext";
import { AuthContext } from "../auth/AuthProvider";

const TwoFactorSetup = ({ onCancel }) => {
  const { enable2FA, confirm2FA, getQRCode, loading, error, clearError } =
    useTwoFactor();
  const [step, setStep] = useState(1); // 1: QR Code, 2: Verify Code, 3: Recovery Codes
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [recoveryCodesGenerated, setRecoveryCodes] = useState([]);
  const [setupError, setSetupError] = useState("");
  const { setToken } = useContext(AuthContext);

  useEffect(() => {
    initializeSetup();
  }, []);

  useEffect(() => {
    if (error) {
      setSetupError(error);
      const timer = setTimeout(() => {
        clearError();
        setSetupError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const initializeSetup = async () => {
    try {
      const result = await enable2FA();
      const qrUrl = await getQRCode();
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error("Failed to initialize 2FA setup:", error);
      setSetupError("Failed to initialize 2FA setup. Please try again.");
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setSetupError("Please enter a verification code");
      return;
    }

    try {
      const result = await confirm2FA(verificationCode);
      console.log("Verification result:", result);
      if (result.success) {
        if (
          result.recoveryCodes.$values &&
          Array.isArray(result.recoveryCodes.$values)
        ) {
          setRecoveryCodes(result.recoveryCodes.$values);
        }
        setToken(result.token);
        setStep(3);
        setSetupError("");
      } else {
        setSetupError("Invalid verification code. Please try again.");
      }
    } catch (error) {
      console.error("Failed to verify code:", error);
      setSetupError("Failed to verify code. Please try again.");
    }
  };

  const handleComplete = () => {
    onCancel();
  };

  const copyRecoveryCodes = () => {
    const codesText = recoveryCodesGenerated.join("\n");
    navigator.clipboard
      .writeText(codesText)
      .then(() => {
        alert("Recovery codes copied to clipboard!");
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = codesText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Recovery codes copied to clipboard!");
      });
  };

  const downloadRecoveryCodes = () => {
    const codesText = recoveryCodesGenerated.join("\n");
    const blob = new Blob([codesText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "2fa-recovery-codes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="min-h-full h-fit w-full pt-16"
      style={{ backgroundImage: "linear-gradient(to right, #191910, #191912)" }}
    >
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={onCancel}
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
              Enable Two-Factor Authentication
            </h2>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center mb-6">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step >= 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${
                step >= 2 ? "bg-blue-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step >= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${
                step >= 3 ? "bg-blue-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step >= 3
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              3
            </div>
          </div>
        </div>

        {setupError && (
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
                <p className="text-sm text-red-800">{setupError}</p>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Step 1: Scan QR Code
            </h3>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-4">
                Scan this QR code with your authenticator app (like Google
                Authenticator, Authy, or Microsoft Authenticator):
              </p>
              {qrCodeUrl ? (
                <div className="flex flex-col items-center">
                  <div className="flex flex-row items-center justify-center mb-4 w-[50%] h-[50%]">
                    <img
                      src={qrCodeUrl}
                      alt="2FA QR Code"
                      className="border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center mb-4">
                  <div className="w-48 h-48 bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center">
                    {loading ? (
                      <svg
                        className="animate-spin h-8 w-8 text-gray-400"
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
                    ) : (
                      <span className="text-gray-400">Loading QR Code...</span>
                    )}
                  </div>
                </div>
              )}
              <p className="text-sm text-gray-500">
                Can't scan? You can manually enter the secret key in your
                authenticator app.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={loading || !qrCodeUrl}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Step 2: Verify Setup
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                Enter the 6-digit code from your authenticator app to verify the
                setup:
              </p>
              <form onSubmit={handleVerifyCode}>
                <div className="mb-4">
                  <label
                    htmlFor="verification-code"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Verification Code
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
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono"
                    placeholder="000000"
                    maxLength="6"
                    autoComplete="off"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || verificationCode.length !== 6}
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
                      "Verify & Enable"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Step 3: Save Recovery Codes
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    Two-factor authentication has been successfully enabled!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
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
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important!
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Save these recovery codes in a safe place. You can use
                      them to access your account if you lose your authenticator
                      device. Each code can only be used once.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">
                Recovery Codes
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {recoveryCodesGenerated.map((code, index) => (
                  <div
                    key={index}
                    className="bg-white p-2 rounded border text-center font-mono text-sm"
                  >
                    {code}
                  </div>
                ))}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={copyRecoveryCodes}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                  Copy Codes
                </button>
                <button
                  onClick={downloadRecoveryCodes}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  Download
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleComplete}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Complete Setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorSetup;
