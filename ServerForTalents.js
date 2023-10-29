const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv'); // Import dotenv

dotenv.config(); // Load environment variables from .env file

const app = express();
// const port = 3002;
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: 'https://logspot.net' // Update with your production domain
}));

// app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).single('cvFile');

app.post('/join-us', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).send('Error uploading files.');
    }

    const cvFile = req.file;

    console.log('CV File Info (from form):', cvFile);

    const formData = req.body;
    console.log('Form data received:', formData);

    sendEmail(formData, cvFile)
      .then(() => {
        res.status(200).send('Form submitted successfully! Email sent.');
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        res.status(500).send('Error submitting the form. Please try again later.');
      });
  });
});

function sendEmail(formData, cvFile) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Access password from environment variable
    },
  });

  // Ensure preferredPosition is an array
  let preferredPosition = formData.preferredPosition;
  if (typeof preferredPosition === 'string') {
    try {
      preferredPosition = JSON.parse(preferredPosition);
    } catch (error) {
      console.error('Error parsing preferredPosition:', error);
      preferredPosition = [];
    }
  }
  preferredPosition = Array.isArray(preferredPosition) ? preferredPosition : [preferredPosition];
  const preferredPositionString = preferredPosition.join(', ');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'info@logspot.net',
    subject: 'Candidate Form',
    html: `
      <p><strong>First Name:</strong> ${formData.firstName}</p>
      <p><strong>Last Name:</strong> ${formData.lastName}</p>
      <p><strong>Date of Birth:</strong> ${formData.dateOfBirth}</p>
      <p><strong>Mobile Phone:</strong> ${formData.mobilePhone}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>City:</strong> ${formData.city}</p>
      <p><strong>Languages:</strong> ${formData.Languages}</p>
      <p><strong>Programming Languages:</strong> ${formData.programmingLanguages}</p>
      <p><strong>Work Experience:</strong> ${formData.workExperience}</p>
      <p><strong>Education:</strong> ${formData.education}</p>
      <p><strong>Remote Work Preference:</strong> ${formData.remoteWork ? 'Yes' : 'No'}</p>
      <p><strong>Agreed to Terms:</strong> ${formData.agreeToTerms ? 'Yes' : 'No'}</p>
      <p><strong>CV File:</strong> ${cvFile ? cvFile.filename : 'Not provided'}</p>

      <p><strong>Preferred Positions:</strong> ${preferredPositionString}</p>
    `,
    attachments: [
      {
        filename: cvFile ? cvFile.filename : '',
        path: cvFile ? cvFile.path : '',
      },
    ],
  };

  console.log('Mail Options:', mailOptions);

  return transporter.sendMail(mailOptions)
    .then(info => {
      console.log('Email sent:', info.response);
    })
    .catch(error => {
      console.error('Error sending email:', error);
      throw error;
    });
}

app.get('/', (req, res) => {
  res.send('Hello, this is the server!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
