import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "mahmood3ssas@gmail.com", // your gmail
        pass: 'cseo twfj wlpe cyno'
        , // app password (NOT your real password)
    }, tls: {
        rejectUnauthorized: false, // 👈 هذا يحل self-signed error
    },
});

export const sendOtp = async (email,code) => {
    await transporter.sendMail({
        from: `"My App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Code",
        html: `
        <div style="font-family: Arial;">
          <h2>Your OTP Code</h2>
          <p style="font-size:20px;"><b>${code}</b></p>
          <p>Expires in 10 minutes</p>
        </div>
      `,
    });


}