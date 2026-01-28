import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: config.node_mailer.google_account,
    pass: config.node_mailer.google_pass,
  },
});

export const sendEmail = async ({ user, url }: { user: any; url: string }) => {
  try {
    const brandName = "MediStore Pharmecy";
    await transporter.sendMail({
      from: `${brandName} <${config.node_mailer.google_account}>`,
      to: user.email,
      subject: `Verify your account - ${brandName}`,
      text: `Welcome to ${brandName}! Please verify your email by clicking: ${url}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #2c3e50;">Welcome to ${brandName}!</h2>
          <p>Hi ${user.name},</p>
          <p>Thank you for joining us. Please verify your email address to get started.</p>
          <a href="${url}" style="background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
            Verify Email Address
          </a>
          <p style="font-size: 12px; color: #7f8c8d;">If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    throw Error("MAIL_SERVICE_TEMPORARILY_UNAVAILABLE");
  }
};
