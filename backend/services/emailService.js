import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Load HTML template and replace variables
 */
const loadTemplate = (templateName, variables = {}) => {
  const filePath = path.join(process.cwd(), "templates", templateName);

  let html = fs.readFileSync(filePath, "utf8");

  Object.keys(variables).forEach((key) => {
    const value = variables[key];
    html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
  });

  return html;
};

/**
 * Send Forgotten Password Email
 */
export const sendForgottenPasswordEmail = async (userName, userEmail, otp) => {
  try {
    const html = loadTemplate("forgotten-password.html", {
      userName,
      userEmail,
      otp,
      resetLink: `${process.env.FRONTEND_URL}/reset-password`,
    });

    const info = await transporter.sendMail({
      from: `"SMOC" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: "Password Reset Code - SMOC",
      html,
      text: `
Hi ${userName},

Your password reset code is: ${otp}

Reset here:
${process.env.FRONTEND_URL}/reset-password

This code expires in 10 minutes.
`,
    });

    console.log("Password reset email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      message: "Password reset email sent successfully",
    };
  } catch (error) {
    console.error("Email error:", error);
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};

/**
 * Send Manager Credentials Email
 */
export const sendManagerCredentialsEmail = async (
  managerName,
  managerEmail,
  username,
  temporaryPassword,
) => {
  try {
    const html = loadTemplate("manager-credentials.html", {
      managerName,
      managerEmail,
      username,
      temporaryPassword,
      loginLink: `${process.env.FRONTEND_URL}/login`,
    });

    const info = await transporter.sendMail({
      from: `"SMOC" <${process.env.GMAIL_USER}>`,
      to: managerEmail,
      subject: "Your Manager Account Credentials - SMOC",
      html,
      text: `
Hi ${managerName},

Your manager account has been created.

Email: ${managerEmail}
Username: ${username}
Password: ${temporaryPassword}

Login:
${process.env.FRONTEND_URL}/login

Please change your password after first login.
`,
    });

    console.log("Manager credentials email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      message: "Manager credentials email sent successfully",
    };
  } catch (error) {
    console.error("Email error:", error);
    throw new Error(
      `Failed to send manager credentials email: ${error.message}`,
    );
  }
};

/**
 * Send Client Credentials Email
 */
export const sendClientCredentialsEmail = async (
  clientName,
  clientEmail,
  username,
  temporaryPassword,
) => {
  try {
    const html = loadTemplate("client-credentials.html", {
      clientName,
      clientEmail,
      username,
      temporaryPassword,
      loginLink: `${process.env.FRONTEND_URL}/login`,
    });

    const info = await transporter.sendMail({
      from: `"SMOC" <${process.env.GMAIL_USER}>`,
      to: clientEmail,
      subject: "Your Client Account Credentials - SMOC",
      html,
      text: `
Hi ${clientName},

Your client account has been created.

Email: ${clientEmail}
Username: ${username}
Password: ${temporaryPassword}

Login:
${process.env.FRONTEND_URL}/login

Please change your password after first login.
`,
    });

    console.log("Client credentials email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      message: "Client credentials email sent successfully",
    };
  } catch (error) {
    console.error("Email error:", error);
    throw new Error(
      `Failed to send client credentials email: ${error.message}`,
    );
  }
};

/**
 * Verify Email Connection
 */
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("✓ Email service ready");
    return { success: true, message: "Email service connected" };
  } catch (error) {
    console.error("✗ Email connection failed:", error);
    return { success: false, error: error.message };
  }
};

export default {
  sendForgottenPasswordEmail,
  sendManagerCredentialsEmail,
  sendClientCredentialsEmail,
  verifyEmailConnection,
};
