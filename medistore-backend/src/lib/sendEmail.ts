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

export const sendEmail = async ({
  user,
  url,
  subject,
  title,
  buttonText,
}: {
  user: any;
  url: string;
  subject: string;
  title: string;
  buttonText: string;
}) => {
  try {
    const brandName = "MediStore Pharmecy";
    await transporter.sendMail({
      from: `${brandName} <${config.node_mailer.google_account}>`,
      to: user.email,
      subject: `${subject} - ${brandName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #000; color: #fff; border-radius: 10px;">
          <h2 style="color: #fbbf24;">${title}</h2>
          <p>Hi ${user.name || "User"},</p>
          <p>Please click the button below to proceed.</p>
          <a href="${url}" style="background: #fbbf24; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin: 20px 0;">
            ${buttonText}
          </a>
          <p style="font-size: 11px; color: #666;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    throw Error("MAIL_SERVICE_TEMPORARILY_UNAVAILABLE");
  }
};
