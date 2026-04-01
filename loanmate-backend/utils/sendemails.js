const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
};

module.exports = { sendEmail };
```

---

### Render environment variables to set
Go to your Render dashboard → your backend service → **Environment** and add:
```
PORT=5000
MONGO_URI=mongodb+srv://bajaj_db_user:BiBoBL7qPW8GvdaV@loanmate.1pc1qi7.mongodb.net/?appName=Loanmate
JWT_SECRET=loanmate_secret_key
EMAIL_USER=mevanshbajaj@gmail.com
EMAIL_PASS=qxaznornrxcwdzpd
```

### Vercel environment variable to set
Go to Vercel → your project → **Settings → Environment Variables**:
```
REACT_APP_API_URL=https://loanmate-4rp9.onrender.com/api