import { createTransport } from "nodemailer";
import { HOST, PORT, GOOGLE_MAIL, APP_PASSWORD } from "../utils/variable.js";

const transporter = createTransport({
  host: HOST,
  port: PORT,
  secure: false,
  auth: {
    user: GOOGLE_MAIL,
    pass: APP_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Email Transport Error:", error);
  } else {
    console.log("Ready to mailing....");
  }
});

export { transporter };
