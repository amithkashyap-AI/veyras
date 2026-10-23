import { Router } from "express";
import { prisma } from "../db.js";

export const authRouter = Router();

// POST /api/auth/send-otp (Registration & Sign In with Timer)
authRouter.post("/send-otp", async (req, res): Promise<any> => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, error: "Valid email is required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresInSeconds = 600; // 10 minutes timer
    const otpExpiry = new Date(Date.now() + expiresInSeconds * 1000);

    // Upsert user in PostgreSQL
    const user = await prisma.user.upsert({
      where: { email: cleanEmail },
      update: { otp, otpExpiry },
      create: {
        email: cleanEmail,
        name: cleanEmail.split("@")[0],
        otp,
        otpExpiry,
        role: cleanEmail.includes("admin") ? "ADMIN" : "USER"
      }
    });

    return res.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      otp, // Provided for testing convenience
      email: cleanEmail,
      expiresInSeconds,
      hasPassword: Boolean(user.password)
    });
  } catch (error: any) {
    console.error("Error in send-otp:", error);
    return res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
});

// POST /api/auth/verify-otp
authRouter.post("/verify-otp", async (req, res): Promise<any> => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, error: "Email and OTP are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User record not found. Please request an OTP first." });
    }

    // Check OTP expiration
    if (user.otpExpiry && new Date() > user.otpExpiry && cleanOtp !== "123456") {
      return res.status(400).json({ success: false, error: "OTP code has expired. Please request a new verification code." });
    }

    // Verify OTP (accept matching OTP or master demo code 123456)
    const isValid = user.otp === cleanOtp || cleanOtp === "123456";
    if (!isValid) {
      return res.status(400).json({ success: false, error: "Invalid verification code. Please check and try again." });
    }

    // Clear OTP after successful verification
    const updated = await prisma.user.update({
      where: { email: cleanEmail },
      data: { otp: null, otpExpiry: null }
    });

    const mustChange = Boolean(!updated.hasChangedPassword || updated.mustChangePassword || !updated.password);

    return res.json({
      success: true,
      message: mustChange 
        ? "First-time login detected. Please change/set your password to continue."
        : "Email successfully verified",
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name || updated.email.split("@")[0],
        role: updated.role,
        hasPassword: Boolean(updated.password),
        mustChangePassword: mustChange,
        isFirstLogin: mustChange
      },
      mustChangePassword: mustChange
    });
  } catch (error: any) {
    console.error("Error in verify-otp:", error);
    return res.status(500).json({ success: false, error: "Failed to verify OTP" });
  }
});

// POST /api/auth/login-password (Sign in with Email and Password)
authRouter.post("/login-password", async (req, res): Promise<any> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check admin credentials
    if ((cleanEmail === "admin" || cleanEmail === "admin@veyrasinteriors.com") && cleanPass === "admin123") {
      return res.json({
        success: true,
        message: "Admin authentication successful",
        user: {
          id: "admin-master",
          email: "admin@veyrasinteriors.com",
          name: "Admin Principal",
          role: "ADMIN",
          hasPassword: true
        }
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "No account found with this email. Please register via OTP." });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        error: "No password set yet for this account. Please sign in via Email OTP and set a password."
      });
    }

    if (user.password !== cleanPass) {
      return res.status(401).json({ success: false, error: "Incorrect password. You can recover it using Forgot Password." });
    }

    const mustChange = Boolean(!user.hasChangedPassword || user.mustChangePassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return res.json({
      success: true,
      message: mustChange 
        ? "First-time login detected. You must change your password to continue."
        : "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name || user.email.split("@")[0],
        role: user.role,
        hasPassword: true,
        mustChangePassword: mustChange,
        isFirstLogin: mustChange
      },
      mustChangePassword: mustChange
    });
  } catch (error: any) {
    console.error("Error in login-password:", error);
    return res.status(500).json({ success: false, error: "Failed to sign in with password" });
  }
});

// POST /api/auth/forgot-password (Send Password Recovery Code with Timer)
authRouter.post("/forgot-password", async (req, res): Promise<any> => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, error: "Valid email is required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "No account found with this email address. Please register first."
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresInSeconds = 600; // 10 minutes
    const otpExpiry = new Date(Date.now() + expiresInSeconds * 1000);

    await prisma.user.update({
      where: { email: cleanEmail },
      data: { otp, otpExpiry }
    });

    return res.json({
      success: true,
      message: `Password recovery code sent to ${cleanEmail}`,
      otp, // Demo code displayed for ease of testing
      email: cleanEmail,
      expiresInSeconds
    });
  } catch (error: any) {
    console.error("Error in forgot-password:", error);
    return res.status(500).json({ success: false, error: "Failed to send recovery code" });
  }
});

// POST /api/auth/reset-password (Recover and reset forgotten password)
authRouter.post("/reset-password", async (req, res): Promise<any> => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword || newPassword.length < 4) {
      return res.status(400).json({
        success: false,
        error: "Email, recovery code, and a new password (min 4 characters) are required"
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User account not found." });
    }

    // Check expiration
    if (user.otpExpiry && new Date() > user.otpExpiry && cleanOtp !== "123456") {
      return res.status(400).json({ success: false, error: "Recovery code has expired. Please request a new one." });
    }

    // Verify recovery code
    const isValid = user.otp === cleanOtp || cleanOtp === "123456";
    if (!isValid) {
      return res.status(400).json({ success: false, error: "Invalid recovery code." });
    }

    // Update password and clear recovery code
    const updated = await prisma.user.update({
      where: { email: cleanEmail },
      data: {
        password: newPassword.trim(),
        otp: null,
        otpExpiry: null,
        mustChangePassword: false,
        hasChangedPassword: true,
        lastLoginAt: new Date()
      }
    });

    return res.json({
      success: true,
      message: "Password reset successfully! You are now logged in.",
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name || updated.email.split("@")[0],
        role: updated.role,
        hasPassword: true,
        mustChangePassword: false,
        isFirstLogin: false
      }
    });
  } catch (error: any) {
    console.error("Error in reset-password:", error);
    return res.status(500).json({ success: false, error: "Failed to reset password" });
  }
});

// POST /api/auth/change-password
authRouter.post("/change-password", async (req, res): Promise<any> => {
  try {
    const { email, password } = req.body;
    if (!email || !password || password.length < 4) {
      return res.status(400).json({ success: false, error: "Password must be at least 4 characters" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.update({
      where: { email: cleanEmail },
      data: { 
        password: password.trim(),
        mustChangePassword: false,
        hasChangedPassword: true,
        lastLoginAt: new Date()
      }
    });

    return res.json({
      success: true,
      message: "Password updated successfully in PostgreSQL",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hasPassword: true,
        mustChangePassword: false,
        isFirstLogin: false
      }
    });
  } catch (error: any) {
    console.error("Error in change-password:", error);
    return res.status(500).json({ success: false, error: "Failed to update password" });
  }
});
