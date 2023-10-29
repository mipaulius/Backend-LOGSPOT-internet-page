require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const PORT = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://logspot.net' // Update with your production domain
}));
// app.use(cors());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.get('/', (req, res) => {
  res.send('Hello, this is the server!');
});

app.post('/api/send-email', (req, res) => {
  const formData = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'info@logspot.net',  // Update recipient email
    subject: 'New Contact Form Submission',
    text: `
      Name: ${formData.name}
      Phone: ${formData.phone}
      Email: ${formData.email}
      Message: ${formData.message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Error sending email' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});

// const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
