require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());

const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));


app.get('/', (req, res) => {
  res.send('Welcome to the server for Employer!');
});


app.post('/it-hiring', (req, res) => {
  const formData = req.body;

console.log ("veikia PORT 3001")

 
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
    host: 'lynas.serveriai.lt',
    port: 465, 
    secure: true, 
    auth: {
      user: 'info@logspot.lt', 
      pass: 'h9bTAM9NQ8QH5K69', 
    },
  });

  const mailOptions = {
    from: 'info@logspot.lt',
    to: 'info@logspot.lt',
    subject: 'New Form Submission',
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
