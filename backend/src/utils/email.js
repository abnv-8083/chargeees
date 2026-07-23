const nodemailer = require('nodemailer');

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

/**
 * Send inquiry notification to company + acknowledgement to user
 */
const sendInquiryEmails = async (inquiry) => {
  const transporter = createTransporter();

  // Email to company
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: process.env.COMPANY_EMAIL,
    subject: `New Inquiry: ${inquiry.subject} — from ${inquiry.name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#111;border-bottom:2px solid #111;padding-bottom:10px;">New Inquiry Received</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:bold;width:140px;">Name</td><td style="padding:8px;">${inquiry.name}</td></tr>
          <tr style="background:#f5f5f5;"><td style="padding:8px;font-weight:bold;">Company</td><td style="padding:8px;">${inquiry.companyName || '—'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td></tr>
          <tr style="background:#f5f5f5;"><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">${inquiry.phone || '—'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Subject</td><td style="padding:8px;">${inquiry.subject}</td></tr>
          <tr style="background:#f5f5f5;"><td style="padding:8px;font-weight:bold;">Type</td><td style="padding:8px;">${inquiry.inquiryType}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Message</td><td style="padding:8px;">${inquiry.message.replace(/\n/g, '<br>')}</td></tr>
        </table>
        <p style="color:#666;font-size:12px;margin-top:20px;">Received: ${new Date().toLocaleString()}</p>
      </div>
    `,
  });

  // Acknowledgement to user
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: inquiry.email,
    subject: `We've received your inquiry — ChargEase`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#111;border-bottom:2px solid #111;padding-bottom:10px;">Thank you, ${inquiry.name}!</h2>
        <p style="color:#333;line-height:1.6;">We've received your inquiry regarding <strong>${inquiry.subject}</strong> and our team will get back to you shortly.</p>
        <div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:20px 0;">
          <p style="margin:0;color:#333;"><strong>Your Reference Number:</strong> ${inquiry._id}</p>
        </div>
        <p style="color:#333;line-height:1.6;">If you have any urgent queries, feel free to reach out to us directly at <a href="mailto:${process.env.COMPANY_EMAIL}" style="color:#111;font-weight:bold;">${process.env.COMPANY_EMAIL}</a>.</p>
        <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;">
        <p style="color:#999;font-size:12px;">ChargEase — Professional Excellence</p>
      </div>
    `,
  });
};

/**
 * Send reply email to inquiry submitter
 */
const sendReplyEmail = async ({ to, name, subject, replyMessage }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to,
    subject: `Re: ${subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#111;border-bottom:2px solid #111;padding-bottom:10px;">Response from ChargEase</h2>
        <p style="color:#333;">Dear ${name},</p>
        <div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:20px 0;border-left:4px solid #111;">
          <p style="margin:0;color:#333;line-height:1.6;">${replyMessage.replace(/\n/g, '<br>')}</p>
        </div>
        <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;">
        <p style="color:#999;font-size:12px;">ChargEase — Professional Excellence</p>
      </div>
    `,
  });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async ({ to, name, resetURL }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to,
    subject: 'Password Reset Request — ChargEase Admin',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#111;border-bottom:2px solid #111;padding-bottom:10px;">Password Reset</h2>
        <p style="color:#333;">Hello ${name},</p>
        <p style="color:#333;line-height:1.6;">You requested a password reset for your ChargEase admin account. Click the button below to reset your password. This link expires in <strong>10 minutes</strong>.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${resetURL}" style="background:#111;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Reset Password</a>
        </div>
        <p style="color:#666;font-size:13px;">If you didn't request this, please ignore this email. Your password won't change.</p>
        <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;">
        <p style="color:#999;font-size:12px;">ChargEase Admin Panel</p>
      </div>
    `,
  });
};

module.exports = { sendInquiryEmails, sendReplyEmail, sendPasswordResetEmail };
