require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');
// const port = process.env.PORT || 3001;
const PORT = process.env.PORT || 8080;

// app.use(express.json());
app.use(cors({
  origin: 'https://logspot.net' // Update with your production domain
}));
// app.use(cors());

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://logspot.net',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Welcome to the server for Employers!');
});

app.post('/it-hiring', (req, res) => {
  const formData = req.body;

  console.log('Server is running on port 3001');

  sendEmail(formData)
    .then(() => {
      res.json({ message: 'Form submitted successfully' });
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Error sending email', details: error.message });
    });
});

async function sendEmail(formData) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use your real email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'info@logspot.net',
    subject: 'Business Application Form',
    html: `
      <p>Name: ${formData.firstName} ${formData.secondName}</p>
      <p>Company Name: ${formData.companyName}</p>
      <p>Phone Number: ${formData.phoneNumber}</p>
      <p>Email: ${formData.email}</p>
      <p>Message:</p>
      <p>${formData.message}</p>
    `,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
