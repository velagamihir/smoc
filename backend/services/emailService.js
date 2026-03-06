import nodemailer from "nodemailer";
import config from "../config/index.js";
// Initialize nodemailer transporter with Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Forgotten Password Email Template with OTP
 * @param {string} userName - User's name
 * @param {string} userEmail - User's email
 * @param {string} otp - One-time password for reset
 * @returns {object} - Email template with subject and HTML content
 */
const forgottenPasswordTemplate = (userName, userEmail, otp) => {
  return {
    subject: "Password Reset Code - Calendar App",
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
            background-color: white;
          }
          .footer {
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
          }
          .otp-code {
            display: block;
            background-color: #f0f0f0;
            border: 2px dashed #4CAF50;
            padding: 20px;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #4CAF50;
            margin: 20px 0;
            border-radius: 5px;
            font-family: monospace;
          }
          .reset-button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            font-weight: bold;
          }
          .reset-button:hover {
            background-color: #45a049;
          }
          .warning {
            color: #d32f2f;
            font-size: 14px;
            margin-top: 20px;
          }
          .timer {
            color: #ff9800;
            font-weight: bold;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Code</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            
            <p>We received a request to reset the password for your Calendar App account associated with <strong>${userEmail}</strong>.</p>
            
            <p>Your password reset code is:</p>
            
            <span class="otp-code">${otp}</span>
            
            <p>Click the button below to go to the reset page and enter your code:</p>
            
            <a href="${process.env.FRONTEND_URL}/reset-password" class="reset-button">Reset Password</a>
            
            <div class="timer">
              <p>⏱️ This code expires in 10 minutes</p>
            </div>
            
            <div class="warning">
              <p><strong>🔒 Security Notice:</strong> If you did not request this password reset, please ignore this email or contact our support team. Your account is still secure.</p>
            </div>
            
            <p>Best regards,<br/>
            The Calendar App Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2024 Calendar App. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `,
    text: `
    Password Reset Code
    
    Hi ${userName},
    
    We received a request to reset the password for your Calendar App account associated with ${userEmail}.
    
    Your password reset code is: ${otp}
    
    Visit this link to reset your password:
    ${process.env.FRONTEND_URL}/reset-password
    
    Enter the code above on the reset page.
    
    This code expires in 10 minutes.
    
    Security Notice: If you did not request this password reset, please ignore this email or contact our support team.
    
    Best regards,
    The Calendar App Team
    
    ---
    This is an automated email. Please do not reply to this message.
    `,
  };
};

/**
 * Send forgotten password email with OTP
 * @param {string} userName - User's name
 * @param {string} userEmail - User's email address
 * @param {string} otp - One-time password for reset
 * @returns {Promise<object>} - Email send result
 */
export const sendForgottenPasswordEmail = async (userName, userEmail, otp) => {
  try {
    // Get email template
    const emailTemplate = forgottenPasswordTemplate(userName, userEmail, otp);

    // Send email
    const info = await transporter.sendMail({
      from: `"Calendar App" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    console.log("Email sent successfully:", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      message: "Password reset email with OTP sent successfully",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};

/**
 * Verify nodemailer transporter connection
 * This is useful for testing the Gmail configuration
 */
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("✓ Email service is ready to send emails");
    return { success: true, message: "Email service is connected" };
  } catch (error) {
    console.error("✗ Email service connection failed:", error);
    return { success: false, error: error.message };
  }
};

export default {
  sendForgottenPasswordEmail,
  verifyEmailConnection,
};
