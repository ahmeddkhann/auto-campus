import "server-only";

import nodemailer from "nodemailer";

import { escapeHtml } from "@/lib/utils/escape-html";

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

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
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

export async function sendAdminWelcomeEmail({
  to,
  fullName,
  password,
  schoolName,
}: {
  to: string;
  fullName: string;
  password: string;
  schoolName: string;
}) {
  const { from } = getSmtpConfig();
  const login = `${appUrl()}/login`;

  await getTransporter().sendMail({
    from,
    to,
    subject: `Your ${schoolName} admin account`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a56db;">Welcome to ${escapeHtml(schoolName)}</h2>
        <p>Hi ${escapeHtml(fullName)},</p>
        <p>An administrator account has been created for you.</p>
        <ul>
          <li><strong>Email:</strong> ${escapeHtml(to)}</li>
          <li><strong>Password:</strong> ${escapeHtml(password)}</li>
        </ul>
        <p>Sign in at <a href="${login}">${login}</a>. After entering your password you will receive a one-time verification code by email.</p>
        <p>Please change your password after your first login.</p>
      </div>
    `,
  });
}

export async function sendTeacherWelcomeEmail({
  to,
  fullName,
  password,
  schoolName,
}: {
  to: string;
  fullName: string;
  password: string;
  schoolName: string;
}) {
  const { from } = getSmtpConfig();
  const login = `${appUrl()}/login`;

  await getTransporter().sendMail({
    from,
    to,
    subject: `Your ${schoolName} teacher account`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a56db;">Welcome to ${escapeHtml(schoolName)}</h2>
        <p>Hi ${escapeHtml(fullName)},</p>
        <p>A teacher account has been created for you.</p>
        <ul>
          <li><strong>Email:</strong> ${escapeHtml(to)}</li>
          <li><strong>Password:</strong> ${escapeHtml(password)}</li>
        </ul>
        <p>Sign in at <a href="${login}">${login}</a> with the credentials above.</p>
        <p>Please change your password after your first login.</p>
      </div>
    `,
  });
}

export async function sendStudentEnrollmentEmail({
  to,
  fullName,
  schoolName,
}: {
  to: string;
  fullName: string;
  schoolName: string;
}) {
  const { from } = getSmtpConfig();

  await getTransporter().sendMail({
    from,
    to,
    subject: `Enrolled at ${schoolName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a56db;">${escapeHtml(schoolName)}</h2>
        <p>Hi ${escapeHtml(fullName)},</p>
        <p>You have been added as a student in the school <strong>${escapeHtml(schoolName)}</strong>.</p>
        <p>This message confirms your enrollment. No login credentials are included because student portal access is not enabled yet.</p>
      </div>
    `,
  });
}
