import { transporter } from "../configs/mailConfig.js";
import { GOOGLE_MAIL } from "../utils/variable.js";

const sendMail = async (data) => {
  try {
    const { to, subject, body } = data;

    const mailOptions = {
      from: `"Inventory Management System"<${GOOGLE_MAIL}>`,
      to: to,
      subject,
      body,
    };

    const info = await transporter.sendMail(mailOptions);

    if (!info) {
      throw new Error("Error to send mail.");
    }

    console.log("Email send.", info.messageId);
    return info;
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export default { sendMail };
