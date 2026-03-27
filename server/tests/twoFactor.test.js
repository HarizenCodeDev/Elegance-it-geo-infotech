import { verifyTOTP } from "../utils/twoFactor.js";

describe("Two Factor Authentication", () => {
  const testSecret = "JBSWY3DPEHPK3PXP";

  describe("verifyTOTP", () => {
    it("should validate correct TOTP token", () => {
      const speakeasy = await import("speakeasy");
      const token = speakeasy.totp({
        secret: testSecret,
        encoding: "base32",
      });

      const result = verifyTOTP(token, testSecret);
      expect(result).toBe(true);
    });

    it("should reject invalid TOTP token", () => {
      const result = verifyTOTP("000000", testSecret);
      expect(result).toBe(false);
    });
  });
});
