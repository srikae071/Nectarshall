const nodemailer = require("nodemailer");

exports.sendNotificationEmail = async (req, res) => {
  try {
    const { to, toName, subject, body } = req.body;

    const emailUser = process.env.EMAIL_USER || "srikar071@gmail.com";
    const emailPass = process.env.EMAIL_PASS || "";

    if (!emailPass) {
      console.warn(
        "EMAIL_PASS is missing in backend .env. Email recorded in app mail store only.",
      );
      return res.status(200).json({
        message: "Email recorded in app portal. Add EMAIL_PASS in .env for real SMTP delivery.",
        sentReal: false,
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const info = await transporter.sendMail({
      from: `"srikar071@gmail.com" <${emailUser}>`,
      to: to,
      subject: subject,
      text: body,
      html: `<div style="font-family: Arial, sans-serif; padding: 15px; font-size: 14px; color: #333;">
        <p style="white-space: pre-wrap;">${body}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
        <p style="font-size: 12px; color: #888;">Sent automatically via Nectarshall HRMS System</p>
      </div>`,
    });

    console.log("Real Email Sent via SMTP:", info.messageId);
    return res.status(200).json({
      message: "Real email sent successfully via SMTP!",
      messageId: info.messageId,
      sentReal: true,
    });
  } catch (error) {
    console.error("Nodemailer SMTP Error:", error);
    return res.status(500).json({
      message: "Failed to send real email via SMTP",
      error: error.message,
      sentReal: false,
    });
  }
};
