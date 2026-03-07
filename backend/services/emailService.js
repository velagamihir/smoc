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
    subject: "Password Reset Code - SMOC",
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
            
            <p>We received a request to reset the password for your SMOC account associated with <strong>${userEmail}</strong>.</p>
            
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
            The SMOC Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2024 SMOC. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `,
    text: `
    Password Reset Code
    
    Hi ${userName},
    
    We received a request to reset the password for your SMOC account associated with ${userEmail}.
    
    Your password reset code is: ${otp}
    
    Visit this link to reset your password:
    ${process.env.FRONTEND_URL}/reset-password
    
    Enter the code above on the reset page.
    
    This code expires in 10 minutes.
    
    Security Notice: If you did not request this password reset, please ignore this email or contact our support team.
    
    Best regards,
    The SMOC Team
    
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
      from: `"SMOC" <${process.env.GMAIL_USER}>`,
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
 * Manager Credentials Email Template
 * @param {string} managerName - Manager's full name
 * @param {string} managerEmail - Manager's email address
 * @param {string} username - Manager's username
 * @param {string} temporaryPassword - Temporary password for first login
 * @returns {object} - Email template with subject and HTML content
 */
const managerCredentialsTemplate = (
  managerName,
  managerEmail,
  username,
  temporaryPassword,
) => {
  return {
    subject: "Your Manager Account Credentials - SMOC",
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
            background-color: #2196F3;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
            background-color: white;
          }
          .credentials-box {
            background-color: #f5f5f5;
            border: 2px solid #2196F3;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            font-family: monospace;
          }
          .credential-row {
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .credential-label {
            font-weight: bold;
            color: #2196F3;
            min-width: 120px;
          }
          .credential-value {
            background-color: white;
            padding: 8px 12px;
            border-radius: 3px;
            border: 1px solid #ddd;
            flex: 1;
            margin-left: 10px;
            word-break: break-all;
          }
          .login-button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #2196F3;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            font-weight: bold;
          }
          .login-button:hover {
            background-color: #1976D2;
          }
          .warning-box {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .warning-box h4 {
            color: #ff9800;
            margin-top: 0;
          }
          .footer {
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
          }
          .next-steps {
            background-color: #e8f5e9;
            border-left: 4px solid #4CAF50;
            padding: 15px;
            border-radius: 3px;
            margin: 20px 0;
          }
          .next-steps h4 {
            color: #4CAF50;
            margin-top: 0;
          }
          .next-steps ol {
            margin: 10px 0;
            padding-left: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to SMOC!</h1>
            <p>Manager Account Created</p>
          </div>
          <div class="content">
            <p>Hi ${managerName},</p>
            
            <p>Your manager account has been successfully created by the Super Admin. Below are your login credentials:</p>
            
            <div class="credentials-box">
              <div class="credential-row">
                <span class="credential-label">📧 Email:</span>
                <span class="credential-value">${managerEmail}</span>
              </div>
              <div class="credential-row">
                <span class="credential-label">👤 Username:</span>
                <span class="credential-value">${username}</span>
              </div>
              <div class="credential-row">
                <span class="credential-label">🔑 Password:</span>
                <span class="credential-value">${temporaryPassword}</span>
              </div>
            </div>
            
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/login" class="login-button">Login to Your Account</a>
            
            <div class="next-steps">
              <h4>⚙️ Next Steps:</h4>
              <ol>
                <li>Click the login button above or visit the login page</li>
                <li>Use your email/username and the provided password to log in</li>
                <li>Change your password to a secure one after your first login</li>
                <li>Start managing your  and clients</li>
              </ol>
            </div>
            
            <div class="warning-box">
              <h4>⚠️ Security Notice</h4>
              <p><strong>Please keep your credentials safe and confidential.</strong> This is a temporary password generated for your account. We strongly recommend that you change it immediately after your first login.</p>
              <p>Do not share this email with anyone. If you did not expect to receive this email, please contact support immediately.</p>
            </div>
            
            <p><strong>Need Help?</strong><br>
            If you have any questions or run into issues logging in, please contact the Super Admin or visit our support page.</p>
            
            <p>Best regards,<br/>
            The SMOC Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2024 SMOC. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `,
    text: `
    Welcome to SMOC - Manager Account Created
    
    Hi ${managerName},
    
    Your manager account has been successfully created by the Super Admin. Below are your login credentials:
    
    Email: ${managerEmail}
    Username: ${username}
    Password: ${temporaryPassword}
    
    Next Steps:
    1. Visit the login page at ${process.env.FRONTEND_URL || "http://localhost:3000"}/login
    2. Use your email/username and the provided password to log in
    3. Change your password to a secure one after your first login
    4. Start managing your  and clients
    
    SECURITY NOTICE:
    Please keep your credentials safe and confidential. This is a temporary password generated for your account. We strongly recommend that you change it immediately after your first login.
    
    Do not share this email with anyone. If you did not expect to receive this email, please contact support immediately.
    
    Need Help?
    If you have any questions or run into issues logging in, please contact the Super Admin or visit our support page.
    
    Best regards,
    The SMOC Team
    
    ---
    This is an automated email. Please do not reply to this message.
    `,
  };
};

/**
 * Send manager credentials email
 * @param {string} managerName - Manager's full name
 * @param {string} managerEmail - Manager's email address
 * @param {string} username - Manager's username
 * @param {string} temporaryPassword - Temporary password for first login
 * @returns {Promise<object>} - Email send result
 */
export const sendManagerCredentialsEmail = async (
  managerName,
  managerEmail,
  username,
  temporaryPassword,
) => {
  try {
    // Get email template
    const emailTemplate = managerCredentialsTemplate(
      managerName,
      managerEmail,
      username,
      temporaryPassword,
    );

    // Send email
    const info = await transporter.sendMail({
      from: `"SMOC" <${process.env.GMAIL_USER}>`,
      to: managerEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    console.log("Manager credentials email sent successfully:", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      message: "Manager credentials email sent successfully",
    };
  } catch (error) {
    console.error("Error sending manager credentials email:", error);
    throw new Error(
      `Failed to send manager credentials email: ${error.message}`,
    );
  }
};

/**
 * Client Credentials Email Template
 * @param {string} clientName - Client's full name
 * @param {string} clientEmail - Client's email address
 * @param {string} username - Client's username
 * @param {string} temporaryPassword - Temporary password for first login
 * @returns {object} - Email template with subject and HTML content
 */
const clientCredentialsTemplate = (
  clientName,
  clientEmail,
  username,
  temporaryPassword,
) => {
  return {
    subject: "Your Client Account Credentials - SMOC ",
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
            background-color: #0066cc;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
            background-color: white;
          }
          .credentials-box {
            background-color: #f5f5f5;
            border: 2px solid #0066cc;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            font-family: monospace;
          }
          .credential-row {
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .credential-label {
            font-weight: bold;
            color: #0066cc;
            min-width: 120px;
          }
          .credential-value {
            background-color: white;
            padding: 8px 12px;
            border-radius: 3px;
            border: 1px solid #ddd;
            flex: 1;
            margin-left: 10px;
            word-break: break-all;
          }
          .login-button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #0066cc;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            font-weight: bold;
          }
          .login-button:hover {
            background-color: #0052a3;
          }
          .warning-box {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .warning-box h4 {
            color: #ff9800;
            margin-top: 0;
          }
          .footer {
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
          }
          .next-steps {
            background-color: #e8f5e9;
            border-left: 4px solid #4CAF50;
            padding: 15px;
            border-radius: 3px;
            margin: 20px 0;
          }
          .next-steps h4 {
            color: #4CAF50;
            margin-top: 0;
          }
          .next-steps ol {
            margin: 10px 0;
            padding-left: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to SMOC !</h1>
            <p>Client Account Created</p>
          </div>
          <div class="content">
            <p>Hi ${clientName},</p>
            
            <p>Your client account has been successfully created by your manager. Below are your login credentials:</p>
            
            <div class="credentials-box">
              <div class="credential-row">
                <span class="credential-label">📧 Email:</span>
                <span class="credential-value">${clientEmail}</span>
              </div>
              <div class="credential-row">
                <span class="credential-label">👤 Username:</span>
                <span class="credential-value">${username}</span>
              </div>
              <div class="credential-row">
                <span class="credential-label">🔑 Password:</span>
                <span class="credential-value">${temporaryPassword}</span>
              </div>
            </div>
            
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/login" class="login-button">Login to Your Account</a>
            
            <div class="next-steps">
              <h4>⚙️ Next Steps:</h4>
              <ol>
                <li>Click the login button above or visit the login page</li>
                <li>Use your email/username and the provided password to log in</li>
                <li>Change your password to a secure one after your first login</li>
                <li>Start viewing and managing your  posts</li>
              </ol>
            </div>
            
            <div class="warning-box">
              <h4>⚠️ Security Notice</h4>
              <p><strong>Please keep your credentials safe and confidential.</strong> This is a temporary password generated for your account. We strongly recommend that you change it immediately after your first login.</p>
              <p>Do not share this email with anyone. If you did not expect to receive this email, please contact your manager immediately.</p>
            </div>
            
            <p><strong>Need Help?</strong><br>
            If you have any questions or run into issues logging in, please contact your manager or visit our support page.</p>
            
            <p>Best regards,<br/>
            The SMOC Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2024 SMOC. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `,
    text: `
    Welcome to SMOC  - Client Account Created
    
    Hi ${clientName},
    
    Your client account has been successfully created by your manager. Below are your login credentials:
    
    Email: ${clientEmail}
    Username: ${username}
    Password: ${temporaryPassword}
    
    Next Steps:
    1. Visit the login page at ${process.env.FRONTEND_URL || "http://localhost:3000"}/login
    2. Use your email/username and the provided password to log in
    3. Change your password to a secure one after your first login
    4. Start viewing and managing your  posts
    
    SECURITY NOTICE:
    Please keep your credentials safe and confidential. This is a temporary password generated for your account. We strongly recommend that you change it immediately after your first login.
    
    Do not share this email with anyone. If you did not expect to receive this email, please contact your manager immediately.
    
    Need Help?
    If you have any questions or run into issues logging in, please contact your manager or visit our support page.
    
    Best regards,
    The SMOC Team
    
    ---
    This is an automated email. Please do not reply to this message.
    `,
  };
};

/**
 * Send client credentials email
 * @param {string} clientName - Client's full name
 * @param {string} clientEmail - Client's email address
 * @param {string} username - Client's username
 * @param {string} temporaryPassword - Temporary password for first login
 * @returns {Promise<object>} - Email send result
 */
export const sendClientCredentialsEmail = async (
  clientName,
  clientEmail,
  username,
  temporaryPassword,
) => {
  try {
    // Get email template
    const emailTemplate = clientCredentialsTemplate(
      clientName,
      clientEmail,
      username,
      temporaryPassword,
    );

    // Send email
    const info = await transporter.sendMail({
      from: `"SMOC" <${process.env.GMAIL_USER}>`,
      to: clientEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    console.log("Client credentials email sent successfully:", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      message: "Client credentials email sent successfully",
    };
  } catch (error) {
    console.error("Error sending client credentials email:", error);
    throw new Error(
      `Failed to send client credentials email: ${error.message}`,
    );
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
  sendManagerCredentialsEmail,
  sendClientCredentialsEmail,
  verifyEmailConnection,
};
