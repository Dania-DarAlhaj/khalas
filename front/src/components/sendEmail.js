// sendEmail.js
import nodemailer from "nodemailer";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// إعداد SMTP - ممكن تستخدم Gmail أو أي SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourgmail@gmail.com", // ايميلك
    pass: "yourapppassword",      // كلمة مرور التطبيق (Gmail App Password)
  },
});

// مسار لإرسال الإيميل
app.post("/send-email", async (req, res) => {
  const { email, name, reservationDate } = req.body;

  try {
    await transporter.sendMail({
      from: '"Wedding Planning System" <yourgmail@gmail.com>',
      to: email,
      subject: "Hall Reservation Accepted ✅",
      text: `Hi ${name},\n\nYour reservation for the hall on ${reservationDate} has been accepted.\n\nThank you!`,
    });

    res.json({ success: true, message: "Email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

app.listen(5000, () => console.log("Email server running on port 5000")); 