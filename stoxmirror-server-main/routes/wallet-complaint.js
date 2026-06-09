const express = require("express");
const router = express.Router();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Admin email that receives the complaint
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ultradeplus.com";

// ================================================================
// POST /wallet/complaint
// Body: { walletName, message, userId?, userEmail?, userName? }
// ================================================================
router.post("/complaint", async (req, res) => {
  const { walletName, message, userId, userEmail, userName } = req.body;

  if (!walletName || !message || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "walletName and message are required.",
    });
  }

  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const userLine = userName
    ? `<b>User:</b> ${userName}${userEmail ? ` &lt;${userEmail}&gt;` : ""}${userId ? ` (ID: ${userId})` : ""}`
    : userEmail
    ? `<b>User:</b> ${userEmail}${userId ? ` (ID: ${userId})` : ""}`
    : userId
    ? `<b>User ID:</b> ${userId}`
    : `<b>User:</b> Anonymous`;

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #0a0a0a; border-radius: 12px; overflow: hidden; border: 1px solid #1e2d3d;">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0fef9e22, #0a0a0a); border-bottom: 1px solid #0fef9e44; padding: 24px 28px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.5rem;">🔗</span>
          <div>
            <div style="color: #0fef9e; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">Ultradeplus</div>
            <div style="color: #ffffff; font-size: 1.05rem; font-weight: 700;">Wallet Connection Complaint</div>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div style="padding: 24px 28px;">

        <!-- Wallet badge -->
        <div style="background: #111; border: 1px solid #0fef9e55; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; display: flex; align-items: center; gap: 12px;">
          <div style="background: #1a1a1a; border-radius: 8px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">💼</div>
          <div>
            <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 0.08em;">Failed Wallet</div>
            <div style="font-size: 1rem; font-weight: 700; color: #0fef9e;">${walletName}</div>
          </div>
        </div>

        <!-- User info -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; font-size: 0.82rem; color: #888; width: 120px; vertical-align: top;">User</td>
            <td style="padding: 8px 0; font-size: 0.85rem; color: #e0e0e0;">${
              userName || userEmail || userId || "Anonymous"
            }${userEmail ? `<br><span style="color:#888; font-size:0.78rem;">${userEmail}</span>` : ""}${
    userId ? `<br><span style="color:#555; font-size:0.75rem;">ID: ${userId}</span>` : ""
  }</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 0.82rem; color: #888; vertical-align: top;">Submitted</td>
            <td style="padding: 8px 0; font-size: 0.85rem; color: #e0e0e0;">${submittedAt}</td>
          </tr>
        </table>

        <!-- Message box -->
        <div style="background: #111; border: 1px solid #1e2d3d; border-radius: 8px; padding: 16px 18px;">
          <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">User Message</div>
          <div style="font-size: 0.9rem; color: #d0d0d0; line-height: 1.6; white-space: pre-wrap;">${message.trim()}</div>
        </div>

      </div>

      <!-- Footer -->
      <div style="padding: 16px 28px; border-top: 1px solid #1e1e1e; background: #080808;">
        <p style="margin: 0; font-size: 0.72rem; color: #444; text-align: center;">
          This message was sent from the Ultradeplus wallet connection flow.
        </p>
      </div>

    </div>
  `;

  try {
    await resend.emails.send({
      from: "Ultradeplus Alerts <alerts@ultradeplus.com>",
      to: ADMIN_EMAIL,
      subject: `⚠️ Wallet Complaint: ${walletName} failed for ${userName || userEmail || "a user"}`,
      html: htmlBody,
    });

    // Always respond with success to the client (they'll see "Failed" anyway — by design)
    return res.status(200).json({
      success: true,
      message: "Complaint received.",
    });
  } catch (error) {
    console.error("Wallet complaint email error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

module.exports = router;