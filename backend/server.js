import express from 'express';
import bodyParser from 'body-parser';
import twilio from 'twilio';
import cors from 'cors';
import dotenv from 'dotenv';
import Joi from 'joi';

// Load environment variables from .env file
dotenv.config();

// Validate environment variables
const requiredEnvVars = ['TWILIO_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER', 'PORT'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: Missing environment variable ${envVar}`);
    process.exit(1);
  }
}

// Create an Express app
const app = express();
const port = process.env.PORT || 5176;

// Configure Twilio using environment variables
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

app.use(bodyParser.json());
app.use(cors());

// OTP storage (In-memory, replace with a database for production)
const otpStore = new Map(); // Key: phoneNumber, Value: { otp, expiresAt }

// Validate phone number input
const phoneNumberSchema = Joi.string()
  .pattern(/^\+\d{10,15}$/) // E.164 international format (e.g., +1234567890)
  .required();

app.post('/api/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;

  // Validate input
  const { error } = phoneNumberSchema.validate(phoneNumber);
  if (error) {
    return res.status(400).json({ success: false, message: 'Invalid phone number format.' });
  }

  try {
    // Generate OTP and calculate expiration time
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

    // Save OTP to store
    otpStore.set(phoneNumber, { otp, expiresAt });

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP code is ${otp}`,
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    res.status(200).json({ success: true, message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send OTP.' });
  }
});

app.post('/api/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;

  // Validate input
  const { error } = phoneNumberSchema.validate(phoneNumber);
  if (error || !otp) {
    return res.status(400).json({ success: false, message: 'Invalid input.' });
  }

  const storedOtpData = otpStore.get(phoneNumber);

  if (!storedOtpData) {
    return res.status(400).json({ success: false, message: 'No OTP sent to this phone number.' });
  }

  const { otp: storedOtp, expiresAt } = storedOtpData;

  if (Date.now() > expiresAt) {
    otpStore.delete(phoneNumber); // Clean up expired OTP
    return res.status(400).json({ success: false, message: 'OTP has expired.' });
  }

  if (otp !== storedOtp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP.' });
  }

  // OTP verified successfully
  otpStore.delete(phoneNumber); // Clean up after verification
  res.status(200).json({ success: true, message: 'OTP verified successfully.' });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
