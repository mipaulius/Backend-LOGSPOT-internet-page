const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const cors = require('cors');  // Import the cors package

const app = express();
app.use(bodyParser.json());
app.use(cors());  // Use cors middleware

const transporter = nodemailer.createTransport(
  smtpTransport({
    host: 'lynas.serveriai.lt',
    port: 465,
    auth: {
      user: 'info@logspot.lt',
      pass: 'h9bTAM9NQ8QH5K69',
    },
  })
);

app.get('/', (req, res) => {
  res.send('Hello, this is the server!');
});

app.post('/api/send-email', (req, res) => {
    const formData = req.body;
  
    const mailOptions = {
      from: 'info@logspot.lt',
      to: 'info@logspot.lt',  // Update recipient email
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
  

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
