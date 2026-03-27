import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const createTransporter = () => {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log("Email not configured. Would send to:", to, "Subject:", subject);
    return { success: false, message: "Email not configured" };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@elegance.com",
      to,
      subject,
      html,
      text,
    });
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false, error: error.message };
  }
};

const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  return sendEmail({
    to: email,
    subject: "Password Reset - Elegance EMS",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #06b6d4, #0891b2); padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">Elegance EMS</h1>
        </div>
        <div style="padding: 24px; background: #f8fafc;">
          <h2 style="color: #1e293b;">Password Reset Request</h2>
          <p>Hello ${userName},</p>
          <p>You requested a password reset for your Elegance EMS account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #06b6d4, #0891b2); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #64748b; font-size: 14px;">This link will expire in 1 hour.</p>
          <p style="color: #ef4444; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #64748b; font-size: 12px;">Elegance IT & Geo Synergy EMS</p>
        </div>
      </div>
    `,
    text: `Hello ${userName}, Reset your password here: ${resetUrl}`,
  });
};

const sendLeaveNotification = async (userEmail, userName, status, leaveType, days) => {
  const statusColors = {
    Approved: "#10b981",
    Rejected: "#ef4444",
    Pending: "#f59e0b",
  };

  return sendEmail({
    to: userEmail,
    subject: `Leave Request ${status} - Elegance EMS`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">Elegance EMS</h1>
        </div>
        <div style="padding: 24px; background: #f8fafc;">
          <h2 style="color: #1e293b;">Leave Request Update</h2>
          <p>Dear ${userName},</p>
          <p>Your leave request has been <strong style="color: ${statusColors[status]}">${status}</strong>.</p>
          <div style="background: white; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Leave Type:</strong> ${leaveType}</p>
            <p><strong>Duration:</strong> ${days} day(s)</p>
          </div>
          <p>Login to your dashboard for more details.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #64748b; font-size: 12px;">This is an automated message from Elegance IT & Geo Synergy EMS.</p>
        </div>
      </div>
    `,
    text: `Dear ${userName}, Your leave request for ${leaveType} (${days} days) has been ${status}.`,
  });
};

const sendWelcomeEmail = async (userEmail, userName, tempPassword) => {
  return sendEmail({
    to: userEmail,
    subject: "Welcome to Elegance EMS",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Elegance EMS</h1>
        </div>
        <div style="padding: 24px; background: #f8fafc;">
          <h2 style="color: #1e293b;">Hello ${userName},</h2>
          <p>Your account has been created in the Elegance Employee Management System.</p>
          <div style="background: white; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          </div>
          <p style="color: #ef4444;"><strong>Please change your password after first login.</strong></p>
          <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">Login Now</a>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #64748b; font-size: 12px;">Elegance IT & Geo Synergy</p>
        </div>
      </div>
    `,
    text: `Welcome ${userName}! Your account has been created. Email: ${userEmail}, Password: ${tempPassword}`,
  });
};

const sendAnnouncementNotification = async (users, announcement) => {
  for (const user of users) {
    await sendEmail({
      to: user.email,
      subject: `New Announcement: ${announcement.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Announcement</h1>
          </div>
          <div style="padding: 24px; background: #f8fafc;">
            <h2 style="color: #1e293b;">${announcement.title}</h2>
            <p>${announcement.message}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #64748b; font-size: 12px;">Elegance IT & Geo Synergy</p>
          </div>
        </div>
      `,
    });
  }
};

export { sendEmail, sendLeaveNotification, sendWelcomeEmail, sendAnnouncementNotification, sendPasswordResetEmail };
