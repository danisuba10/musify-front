import { apiURL } from "../../assets/Constants";

class TwoFactorService {
  constructor(getToken) {
    console.log("TwoFactorService initialized token:", getToken());
    this.getToken = getToken;
  }

  async makeAuthenticatedRequest(url, options = {}) {
    const token = this.getToken();
    if (!token) {
      throw new Error("No authentication token available");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || `Request failed with status ${response.status}`
      );
    }

    return response;
  }

  async enable2FA() {
    const response = await this.makeAuthenticatedRequest(
      `${apiURL}/user/2fa/enable`,
      {
        method: "POST",
      }
    );
    return await response.json();
  }

  async confirm2FA(code) {
    const formData = new FormData();
    formData.append("code", code);

    const response = await this.makeAuthenticatedRequest(
      `${apiURL}/user/2fa/confirm`,
      {
        method: "POST",
        body: formData,
      }
    );
    return await response.json();
  }

  async verify2FA(code) {
    const formData = new FormData();
    formData.append("Code", code);

    const response = await this.makeAuthenticatedRequest(
      `${apiURL}/user/2fa/verify`,
      {
        method: "POST",
        body: formData,
      }
    );
    return await response.json();
  }

  async verifyRecoveryCode(recoveryCode) {
    const formData = new FormData();
    formData.append("RecoveryCode", recoveryCode);

    const response = await this.makeAuthenticatedRequest(
      `${apiURL}/user/2fa/recovery`,
      {
        method: "POST",
        body: formData,
      }
    );
    return await response.json();
  }

  async disable2FA() {
    const response = await this.makeAuthenticatedRequest(
      `${apiURL}/user/2fa/disable`,
      {
        method: "POST",
      }
    );
    return await response.json();
  }

  async getQRCode() {
    const response = await this.makeAuthenticatedRequest(
      `${apiURL}/user/2fa/qrcode`,
      {
        method: "GET",
      }
    );
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}

export default TwoFactorService;
