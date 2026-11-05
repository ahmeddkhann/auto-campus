import "server-only";

import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT?.trim() ?? 465);
  const secureValue = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure = secureValue
    ? secureValue === "true" || secureValue === "1"
    : port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? user;

  if (!host || !from) {
    throw new Error(
      "Email is not configured. Set SMTP_HOST and SMTP_FROM in .env.local."
    );
  }

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a valid port number.");
  }

  return { host, port, secure, user, pass, from };
}

function getTransporter() {
  if (!transporter) {
    const { host, port, secure, user, pass } = getSmtpConfig();

    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  return transporter;
}

export const otpEmailTemplate = (
  otpCode: string,
  appName: string = "Auto Campus"
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a56db;">${appName} - OTP Verification</h2>
      <p>Your one-time password (OTP) for ${appName} is:</p>
      <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
        <span style="font-size: 24px; font-weight: bold; color: #1a56db;">${otpCode}</span>
      </div>
      <p>This OTP will expire in 5 minutes.</p>
      <p>If you did not request this OTP, please ignore this email.</p>
      <hr />
      <p style="font-size: 12px; color: #666;">${appName} School Management System</p>
    </div>
  `;
};

/**
 * Sends an OTP email to the specified address.
 */
export async function sendOTPEmail(
  email: string,
  otpCode: string
): Promise<void> {
  const { from } = getSmtpConfig();

  await getTransporter().sendMail({
    from,
    to: email,
    subject: "Your Auto Campus OTP Code",
    html: otpEmailTemplate(otpCode),
  });
}

/**
 * Sends an internal notification to ADMIN_NOTIFY_EMAIL.
 * Does nothing when the variable is not configured.
 */
export async function sendAdminNotification({
  subject,
  html,
}: {
  subject: string;
  html: string;
}): Promise<void> {
  const notifyEmail = process.env.ADMIN_NOTIFY_EMAIL;

  if (!notifyEmail) {
    return;
  }

  const { from } = getSmtpConfig();

  await getTransporter().sendMail({
    from,
    to: notifyEmail,
    subject,
    html,
  });
}
