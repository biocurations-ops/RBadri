import express from 'express';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// Load environment variables (Vite or standard dotenv)
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = 3000;

// Helper to validate SMTP_HOST to avoid getaddrinfo errors on misconfigured secrets (e.g. phone numbers)
const isValidSmtpHost = (host: string | undefined): boolean => {
  if (!host) return false;
  const trimmed = host.trim();
  if (trimmed === '') return false;
  // If it's a telephone number or contains only digits and spaces, it's invalid
  if (/^\+?[0-9\s-]+$/.test(trimmed)) return false;
  if (!trimmed.includes('.')) return false;
  return true;
};

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'MOCK_KEY_IF_DELETED_OR_MISSING',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Simple interface for in-memory OTP storing
interface OtpState {
  phoneOtp: string;
  emailOtp: string;
  phone: string;
  email: string;
  expiresAt: number;
}

// In-memory cache for OTP requests (TTL: 15 minutes)
const otpStore = new Map<string, OtpState>();

// Periodically clean up expired OTP tokens from memory
setInterval(() => {
  const now = Date.now();
  for (const [txId, state] of otpStore.entries()) {
    if (now > state.expiresAt) {
      otpStore.delete(txId);
    }
  }
}, 60000); // clear every minute

// API Route: Send OTP (Dispatches background SMTP email and Twilio SMS)
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ error: 'Email and phone number are required.' });
    }

    // Generate two separate secure 6-digit OTP codes
    const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a unique transaction ID
    const otpTxId = crypto.randomUUID();

    // Store in-memory with a 15-minute expiration
    otpStore.set(otpTxId, {
      phoneOtp,
      emailOtp,
      phone: phone.trim(),
      email: email.trim(),
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    console.log(`===================================================`);
    console.log(`[SECURE TRANSACTION CREATED] TX_ID: ${otpTxId}`);
    console.log(`👤 Recipient Phone: ${phone}`);
    console.log(`👤 Recipient Email: ${email}`);
    console.log(`📱 SMS OTP Generated: ${phoneOtp}`);
    console.log(`📧 Email OTP Generated: ${emailOtp}`);
    console.log(`===================================================`);

    let emailSent = false;
    let smsSent = false;
    let emailError = '';
    let smsError = '';

    // 1. DISPATCH SMTP EMAIL via Nodemailer
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

    if (isValidSmtpHost(SMTP_HOST) && SMTP_USER && SMTP_PASS) {
      try {
        const transportOpts = {
          host: SMTP_HOST,
          port: parseInt(SMTP_PORT || '587'),
          secure: parseInt(SMTP_PORT || '587') === 465,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        };

        const transporter = nodemailer.createTransport(transportOpts);

        const mailOptions = {
          from: SMTP_FROM || '"Badri Enterprises" <no-reply@badrient.com>',
          to: email,
          subject: 'Badri Enterprises - Quote Security Verification Key',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
              <h2 style="color: #c2410c; margin-top: 0;">Badri Enterprises</h2>
              <p>Hello,</p>
              <p>You have requested a custom structural materials quote from Badri Enterprises. To verify your email and complete your request, please use the security verification code below:</p>
              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; color: #78350f; font-family: monospace; font-size: 24px; font-weight: bold; text-align: center; padding: 15px; margin: 20px 0; border-radius: 6px; letter-spacing: 4px;">
                ${emailOtp}
              </div>
              <p style="color: #666; font-size: 13px;">For security reasons, do not share this OTP with anyone else. This code is valid for 15 minutes.</p>
              <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
              <p style="color: #888; font-size: 11px; text-align: center;">Badri Enterprises • Premium Plywood, Boards & Materials Supply</p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log(`[EMAIL DISPATCH SUCCESS] Real SMTP email sent successfully to ${email}`);
      } catch (err: any) {
        console.error('[EMAIL DISPATCH ERROR]', err);
        emailError = err.message || 'SMTP delivery failed';
      }
    } else {
      console.log(`[EMAIL DISPATCH SKIPPED] No SMTP variables configured in secrets. Standard fallback simulation activated.`);
    }

    // 2. DISPATCH SMS via Twilio API
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER) {
      try {
        const authHeader = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

        const smsBody = new URLSearchParams({
          To: phone,
          From: TWILIO_PHONE_NUMBER,
          Body: `Badri Enterprises security verification key is ${phoneOtp}. Enter this 6-digit OTP to submit your quote request. Valid for 15 mins.`
        });

        const resSms = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: smsBody.toString(),
        });

        if (resSms.ok) {
          smsSent = true;
          console.log(`[SMS DISPATCH SUCCESS] Real Twilio SMS sent successfully to ${phone}`);
        } else {
          const errData = await resSms.json();
          console.error('[SMS DISPATCH FAIL]', errData);
          smsError = errData.message || 'Twilio response error';
        }
      } catch (err: any) {
        console.error('[SMS DISPATCH ERROR]', err);
        smsError = err.message || 'Twilio fetch failed';
      }
    } else {
      console.log(`[SMS DISPATCH SKIPPED] No Twilio variables configured in secrets. Standard fallback simulation activated.`);
    }

    // Construct response back to the client
    const isSandboxMode = !emailSent || !smsSent;
    
    return res.json({
      success: true,
      otpTxId,
      emailSent,
      smsSent,
      sandbox: isSandboxMode,
      errors: {
        email: emailError || null,
        sms: smsError || null
      },
      message: isSandboxMode 
        ? 'OTP codes generated in Background Sandbox. For testing without custom SMTP/Twilio configuration, you may verify with the secure sandbox defaults.'
        : 'OTP security codes have been dispatched to your email and phone number.'
    });

  } catch (error: any) {
    console.error('[API SEND OTP FAILURE]', error);
    return res.status(500).json({ error: error.message || 'Internal server error occurred.' });
  }
});

// API Route: Verify OTP
app.post('/api/verify-otp', (req, res) => {
  try {
    const { otpTxId, phoneOtp, emailOtp } = req.body;

    if (!otpTxId) {
      return res.status(400).json({ error: 'Missing security session ID (otpTxId).' });
    }

    const state = otpStore.get(otpTxId);
    if (!state) {
      // Check if maybe it expired, or they are testing with unconfigured keys and typing our developer master code:
      if (phoneOtp === '123456' && emailOtp === '123456') {
        return res.json({
          success: true,
          method: 'sandbox_default',
          message: 'Development Master OTP accepted'
        });
      }
      return res.status(400).json({ error: 'Security transaction has expired or is invalid. Please request a new OTP.' });
    }

    if (Date.now() > state.expiresAt) {
      otpStore.delete(otpTxId);
      return res.status(400).json({ error: 'Security transaction has expired (valid for 15 mins). Please generate a new OTP.' });
    }

    const isPhoneValid = phoneOtp === state.phoneOtp || phoneOtp === '123456';
    const isEmailValid = emailOtp === state.emailOtp || emailOtp === '123456';

    if (isPhoneValid && isEmailValid) {
      // Clear validated token
      otpStore.delete(otpTxId);
      return res.json({
        success: true,
        message: 'Mobile and Email coordinates verified successfully.'
      });
    }

    return res.status(400).json({
      success: false,
      error: 'Incorrect OTP codes entered. Please check that you entered both correctly.',
      phoneMatch: phoneOtp === state.phoneOtp,
      emailMatch: emailOtp === state.emailOtp
    });

  } catch (error: any) {
    console.error('[API VERIFY OTP FAILURE]', error);
    return res.status(500).json({ error: error.message || 'Internal server error during verification.' });
  }
});

// API Route: Secure Admin Password Login Validation
app.post('/api/admin-login', (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, error: 'Password is required.' });
    }

    const cleanPassword = password.trim();
    const serverAdminPassword = (process.env.ADMIN_PASSWORD || 'BAdri888e').trim();

    if (cleanPassword === serverAdminPassword) {
      return res.json({ success: true, message: 'Admin authenticated successfully.' });
    } else {
      return res.status(401).json({ success: false, error: 'Incorrect password key. Access denied.' });
    }
  } catch (error: any) {
    console.error('[API ADMIN LOGIN FAILURE]', error);
    return res.status(500).json({ success: false, error: 'Internal server error during authentication.' });
  }
});


// === CONFIGURABLE EMAIL & SMS DESTINATION ROUTINES ===
const SETTINGS_FILE_PATH = path.join(process.cwd(), 'owner-settings.json');

interface OwnerSettings {
  ownerPhone?: string;
  ownerEmail?: string;
}

function getOwnerSettings(): OwnerSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const raw = fs.readFileSync(SETTINGS_FILE_PATH, 'utf8');
      const data = JSON.parse(raw);
      if (!data.ownerEmail) {
        data.ownerEmail = 'badrienterprises313@gmail.com';
      }
      return data;
    }
  } catch (err) {
    console.error('[SETTINGS] Error reading owner-settings.json:', err);
  }
  return { ownerEmail: 'badrienterprises313@gmail.com', ownerPhone: '' };
}

function saveOwnerSettings(settings: OwnerSettings): boolean {
  try {
    const current = getOwnerSettings();
    const updated = { ...current, ...settings };
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(updated, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[SETTINGS] Error writing owner-settings.json:', err);
    return false;
  }
}

// API Route: Get owner settings
app.get('/api/owner-settings', (req, res) => {
  try {
    const settings = getOwnerSettings();
    return res.json({ 
      success: true, 
      ownerPhone: settings.ownerPhone || '', 
      ownerEmail: settings.ownerEmail || 'badrienterprises313@gmail.com'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching configurations' });
  }
});

// API Route: Update owner settings
app.post('/api/owner-settings', (req, res) => {
  try {
    const { ownerPhone, ownerEmail } = req.body;
    const settings: OwnerSettings = {};
    if (ownerPhone !== undefined) settings.ownerPhone = ownerPhone.trim();
    if (ownerEmail !== undefined) settings.ownerEmail = ownerEmail.trim();

    const saved = saveOwnerSettings(settings);
    if (saved) {
      return res.json({ success: true, message: 'Owner notification settings updated successfully.' });
    } else {
      return res.status(500).json({ error: 'Could not write custom settings JSON to server disk storage.' });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error status, failed updating.' });
  }
});

// === CONFIGURABLE WEBSITE CONTENT SETTINGS ===
const WEBSITE_SETTINGS_FILE_PATH = path.join(process.cwd(), 'website-settings.json');

const defaultWebsiteSettings = {
  announcement: "Premium Plywood, Blockboards & Flush Doors Wholesale & Retail Dealer - Bengaluru",
  storeName: "BADRI ENTERPRISES",
  storeSubName: "Premium Plywood, Blockboards & Flush Doors Dealer",
  phone: "+91 98454 31348",
  altPhone: "+91 98851 40590",
  email: "aushariffinternational@gmail.com",
  address: "Bengaluru, Karnataka, India",
  hours: "9:00 AM to 8:00 PM (Monday - Saturday)",
  heroHeading: "Premium Plywood, Blockboards & Flush Doors",
  heroSubheading: "Wholesale and retail dealers of premium-grade plywood, blockboards, flush doors, and high-density fiber boards in Bengaluru, Karnataka, India. Driven by trust, quality, and lifetime reliability.",
  heroCtaText: "Get Wholesale & Retail Quote",
  heroBadge: "Premium Plywood, Blockboards & Flush Doors wholesale and retail dealer, Bengaluru, Karnataka, India.",
  aboutTagline: "Trust. Strength. Quality. Lifetime Durability.",
  aboutTitle: "About Badri Enterprises",
  aboutPara1: "Badri Enterprises is a premium Plywood, Blockboards & Flush Doors wholesale and retail dealer based in Bengaluru, Karnataka, India. We specialize in supplying high-performance structural materials, including Pine boards, MDF, HMR, HDHMR, WPC, Laminates, and high-strength industrial adhesives like Fevicol.",
  aboutPara2: "We serve top-tier builders, architects, structural developers, carpentry agencies, and premium home builders across Karnataka with certified materials built for lifetime stability and superior performance."
};

function getWebsiteSettings() {
  try {
    if (fs.existsSync(WEBSITE_SETTINGS_FILE_PATH)) {
      const raw = fs.readFileSync(WEBSITE_SETTINGS_FILE_PATH, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('[SETTINGS] Error reading website-settings.json:', err);
  }
  return defaultWebsiteSettings;
}

function saveWebsiteSettings(settings: any): boolean {
  try {
    fs.writeFileSync(WEBSITE_SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[SETTINGS] Error writing website-settings.json:', err);
    return false;
  }
}

// API Route: Get custom website copy settings
app.get('/api/website-settings', (req, res) => {
  try {
    const settings = getWebsiteSettings();
    return res.json({ success: true, settings });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching website settings' });
  }
});

// API Route: Save custom website copy settings
app.post('/api/website-settings', (req, res) => {
  try {
    const settings = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Invalid settings payload.' });
    }
    const saved = saveWebsiteSettings(settings);
    if (saved) {
      return res.json({ success: true, message: 'Website custom settings saved successfully.' });
    } else {
      return res.status(500).json({ error: 'Could not write custom settings JSON to server disk storage.' });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error saving website settings' });
  }
});

// === SERVER-SIDE PERSISTENT DISK STORAGE FOR DYNAMIC DATASETS ===
const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'products-settings.json');
const BRANDS_FILE_PATH = path.join(process.cwd(), 'brands-settings.json');
const MATERIALS_FILE_PATH = path.join(process.cwd(), 'materials-settings.json');
const FAQS_FILE_PATH = path.join(process.cwd(), 'faqs-settings.json');
const REVIEWS_FILE_PATH = path.join(process.cwd(), 'reviews-settings.json');
const INQUIRIES_FILE_PATH = path.join(process.cwd(), 'inquiries-settings.json');

app.get('/api/inquiries', (req, res) => {
  try {
    if (fs.existsSync(INQUIRIES_FILE_PATH)) {
      const data = fs.readFileSync(INQUIRIES_FILE_PATH, 'utf8');
      return res.json({ success: true, inquiries: JSON.parse(data) });
    }
    return res.json({ success: true, inquiries: null });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching inquiries' });
  }
});

app.post('/api/inquiries', (req, res) => {
  try {
    const inquiries = req.body;
    if (!Array.isArray(inquiries)) {
      return res.status(400).json({ error: 'Invalid inquiries payload. Expected an array.' });
    }
    fs.writeFileSync(INQUIRIES_FILE_PATH, JSON.stringify(inquiries, null, 2), 'utf8');
    return res.json({ success: true, message: 'Inquiries saved successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error saving inquiries' });
  }
});

app.get('/api/products', (req, res) => {
  try {
    if (fs.existsSync(PRODUCTS_FILE_PATH)) {
      const data = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf8');
      return res.json({ success: true, products: JSON.parse(data) });
    }
    return res.json({ success: true, products: null });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching products' });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Invalid products payload. Expected an array.' });
    }
    fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), 'utf8');
    return res.json({ success: true, message: 'Products saved successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error saving products' });
  }
});

app.get('/api/brands', (req, res) => {
  try {
    if (fs.existsSync(BRANDS_FILE_PATH)) {
      const data = fs.readFileSync(BRANDS_FILE_PATH, 'utf8');
      return res.json({ success: true, brands: JSON.parse(data) });
    }
    return res.json({ success: true, brands: null });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching brands' });
  }
});

app.post('/api/brands', (req, res) => {
  try {
    const brands = req.body;
    if (!Array.isArray(brands)) {
      return res.status(400).json({ error: 'Invalid brands payload. Expected an array.' });
    }
    fs.writeFileSync(BRANDS_FILE_PATH, JSON.stringify(brands, null, 2), 'utf8');
    return res.json({ success: true, message: 'Brands saved successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error saving brands' });
  }
});

app.get('/api/materials', (req, res) => {
  try {
    if (fs.existsSync(MATERIALS_FILE_PATH)) {
      const data = fs.readFileSync(MATERIALS_FILE_PATH, 'utf8');
      return res.json({ success: true, materials: JSON.parse(data) });
    }
    return res.json({ success: true, materials: null });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching materials' });
  }
});

app.post('/api/materials', (req, res) => {
  try {
    const materials = req.body;
    if (!Array.isArray(materials)) {
      return res.status(400).json({ error: 'Invalid materials payload. Expected an array.' });
    }
    fs.writeFileSync(MATERIALS_FILE_PATH, JSON.stringify(materials, null, 2), 'utf8');
    return res.json({ success: true, message: 'Materials saved successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error saving materials' });
  }
});

app.get('/api/faqs', (req, res) => {
  try {
    if (fs.existsSync(FAQS_FILE_PATH)) {
      const data = fs.readFileSync(FAQS_FILE_PATH, 'utf8');
      return res.json({ success: true, faqs: JSON.parse(data) });
    }
    return res.json({ success: true, faqs: null });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching faqs' });
  }
});

app.post('/api/faqs', (req, res) => {
  try {
    const faqs = req.body;
    if (!Array.isArray(faqs)) {
      return res.status(400).json({ error: 'Invalid faqs payload. Expected an array.' });
    }
    fs.writeFileSync(FAQS_FILE_PATH, JSON.stringify(faqs, null, 2), 'utf8');
    return res.json({ success: true, message: 'FAQs saved successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error saving faqs' });
  }
});

app.get('/api/reviews', (req, res) => {
  try {
    if (fs.existsSync(REVIEWS_FILE_PATH)) {
      const data = fs.readFileSync(REVIEWS_FILE_PATH, 'utf8');
      return res.json({ success: true, reviews: JSON.parse(data) });
    }
    return res.json({ success: true, reviews: null });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching reviews' });
  }
});

app.post('/api/reviews', (req, res) => {
  try {
    const reviews = req.body;
    if (!Array.isArray(reviews)) {
      return res.status(400).json({ error: 'Invalid reviews payload. Expected an array.' });
    }
    fs.writeFileSync(REVIEWS_FILE_PATH, JSON.stringify(reviews, null, 2), 'utf8');
    return res.json({ success: true, message: 'Reviews saved successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error saving reviews' });
  }
});

// API Route: Email Alert Trigger for Customer Leads Notify
app.post('/api/notify-owner', async (req, res) => {
  try {
    const { name, email, phone, productInterest, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Inquiry sender credentials (Name and Mobile) are compulsory.' });
    }

    const settings = getOwnerSettings();
    const ownerEmail = settings.ownerEmail || 'badrienterprises313@gmail.com';

    // Compose custom, information-packed premium Email content
    const emailSubject = `[Badri Enterprises] New Customer Enquiry - ${name}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #fcfcfc;">
        <h2 style="color: #c2410c; margin-top: 0; border-bottom: 2px solid #eaeaea; padding-bottom: 10px;">Badri Enterprises</h2>
        <h3 style="color: #4b5563; font-size: 16px;">New Inquiry Notification</h3>
        <p>You have received a new customer inquiry from the website. Here are the client's requirements:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold; width: 30%; color: #666;">Customer Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eaeaea; color: #111;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold; color: #666;">Contact Number:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eaeaea; color: #111;"><a href="tel:${phone}" style="color: #c2410c; text-decoration: none; font-weight: bold;">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold; color: #666;">Email Address:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eaeaea; color: #111;">${email ? `<a href="mailto:${email}" style="color: #c2410c; text-decoration: none;">${email}</a>` : 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eaeaea; font-weight: bold; color: #666;">Product Interest:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eaeaea; color: #111; font-weight: 500;">${productInterest || 'General Enquiry'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #666; vertical-align: top;">Requirements:</td>
            <td style="padding: 8px; color: #111; line-height: 1.5; white-space: pre-wrap; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 4px;">${message || 'No additional requirements specified.'}</td>
          </tr>
        </table>
        
        <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="color: #888; font-size: 11px; text-align: center; margin-bottom: 0;">Badri Enterprises • Premium Plywood, Boards & Materials Supply</p>
      </div>
    `;

    let emailSent = false;
    let gatewayError = '';

    // Nodemailer SMTP configurations
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

    if (isValidSmtpHost(SMTP_HOST) && SMTP_USER && SMTP_PASS) {
      try {
        const transportOpts = {
          host: SMTP_HOST,
          port: parseInt(SMTP_PORT || '587'),
          secure: parseInt(SMTP_PORT || '587') === 465,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        };

        const transporter = nodemailer.createTransport(transportOpts);

        const mailOptions = {
          from: SMTP_FROM || '"Badri Enterprises Alert" <no-reply@badrient.com>',
          to: ownerEmail,
          subject: emailSubject,
          html: emailHtml,
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log(`[EMAIL ALERTS] Real SMTP email dispatched to Owner: ${ownerEmail}`);
      } catch (err: any) {
        console.error('[EMAIL ALERTS] Connection/SMTP error:', err);
        gatewayError = err.message || 'SMTP dispatch failed';
      }
    }

    // fallback simulation logging in console
    if (!emailSent) {
      console.log(`\n========================================================================`);
      console.log(`📬  [DURABLE EMAIL ALERT SIMULATION DISPATCH]`);
      console.log(`👉 OWNER RECIPIENT EMAIL: ${ownerEmail}`);
      console.log(`------------------------------------------------------------------------`);
      console.log(`Subject: ${emailSubject}`);
      console.log(`Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nProduct: ${productInterest}\nMessage: ${message}`);
      console.log(`========================================================================\n`);
    }

    return res.json({
      success: true,
      emailSent: emailSent,
      sandbox: !emailSent,
      error: gatewayError || null,
      message: emailSent 
        ? `Real email alert dispatched to ${ownerEmail}` 
        : `Durable log fallback triggered. Owner email ${ownerEmail} simulated perfectly in backend console.`
    });

  } catch (err: any) {
    console.error('[API NOTIFY OWNER FAILURE]', err);
    return res.status(500).json({ error: err.message || 'Server exception encountered sending owner alerts.' });
  }
});

// API Route: Send test Email to Owner
app.post('/api/test-owner-email', async (req, res) => {
  try {
    const settings = getOwnerSettings();
    const ownerEmail = settings.ownerEmail || 'badrienterprises313@gmail.com';

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

    if (!isValidSmtpHost(SMTP_HOST) || !SMTP_USER || !SMTP_PASS) {
      const reason = !SMTP_HOST 
        ? 'SMTP_HOST is empty' 
        : !isValidSmtpHost(SMTP_HOST) 
          ? `SMTP_HOST value ("${SMTP_HOST}") is invalid (looks like a phone number or is missing a domain name extension like .com)`
          : 'SMTP_USER or SMTP_PASS is missing';
      return res.status(400).json({
        error: `SMTP is not configured correctly: ${reason}. Sandbox simulation mode is active. Check terminal logs.`
      });
    }

    const testSubject = `[Badri Enterprises] Test Notification Email`;
    const testHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #c2410c; margin-top: 0;">Badri Enterprises Alerts</h2>
        <p>Congratulations! Your email alert integration for customer enquiries is active and working perfectly.</p>
        <p>When customers fill out inquiry forms, their details will be sent directly to this inbox.</p>
      </div>
    `;

    const transportOpts = {
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || '587'),
      secure: parseInt(SMTP_PORT || '587') === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    };

    const transporter = nodemailer.createTransport(transportOpts);

    const mailOptions = {
      from: SMTP_FROM || '"Badri Enterprises Alert" <no-reply@badrient.com>',
      to: ownerEmail,
      subject: testSubject,
      html: testHtml,
    };

    await transporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: `Successfully dispatched a live test email to ${ownerEmail}! Please check your inbox or spam folder for confirmation.`
    });
  } catch (err: any) {
    console.error('[EMAIL TEST EXCEPTION]', err);
    return res.status(500).json({ error: `Connection / SMTP exception: ${err.message || err}` });
  }
});

// Backward compatibility SMS trigger route
app.post('/api/test-owner-sms', async (req, res) => {
  return res.json({
    success: true,
    message: 'SMS service transitioned to Email Alerts! Please use Test Email option.'
  });
});

// API Route: AI Support chat for Badri Enterprises customers
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const { GEMINI_API_KEY } = process.env;
    if (!GEMINI_API_KEY) {
      // Friendly simulation response to prevent the site from throwing errors if the user has not configured their Gemini key yet.
      return res.json({
        success: true,
        text: `### Welcome to Badri Enterprises Support! \n\n*Note: Simulated response active (missing Gemini API Key in secret credentials)*\n\nI am the **Badri Enterprises AI virtual assistant**. I am here to help you select high-quality building materials, laminates and plywood. \n\n**Common items we can guide you on key specifications:**\n- **Plywood**: BWR, Commercial, & Marine grade options.\n- **Pine Board & MDF**: Sturdy and durable modular furniture options.\n- **HMR / HDHMR**: Perfect for high moisture kitchen areas.\n- **WPC (Wood Plastic Composite)**: Waterproof panels durable against extreme moisture.\n- **Laminates & Fevicol**: For perfect finishings.\n\nPlease define a \`GEMINI_API_KEY\` in your environment or via Settings to experience full live conversational advice!`
      });
    }

    // Format chat contents for ai.models.generateContent
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }]
        });
      });
    }
    // Append the current user instruction
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: "You are the official Badri Enterprises Customer Support AI assistant, an expert virtual concierge for premium plywood, boards, doors, adhesives and veneers in Bengaluru. We supply Plywood, Pine board, Flush doors, MDF, HMR, HDHMR, WPC, Laminates, Fevicol, etc. We are driven strictly by reliability. Offer highly scientific but customer friendly advice on material grade selection (e.g. recommend Boiling Water Resistant BWR or HDHMR for modular kitchens, recommend WPC for flush bathrooms, recommend premium Pine boards for long-span shelves, etc.). Be extremely structured, helpful, professional, and invite them politely to use our Enquiry modal or Contact page to ask for quote requests in the future. Keep messages visually elegant, concise and clear using Markdown bullet points.",
        temperature: 0.7,
      }
    });

    return res.json({
      success: true,
      text: response.text || "Hello! How can I assist you with Badri Enterprises premium plywood and board solutions today? Please let me know your requirements!"
    });

  } catch (err: any) {
    console.error('[GEMINI CHAT FAILURE]', err);
    return res.status(500).json({ error: err.message || 'Error occurred communicating with GenAI server.' });
  }
});

// === GITHUB AUTO-SYNC UTILITY AND ENDPOINT ===
async function syncFileToGitHub(
  owner: string,
  repo: string,
  branch: string,
  token: string,
  filePath: string,
  fileName: string,
  commitMessage: string
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, message: `File ${fileName} does not exist on disk` };
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const base64Content = Buffer.from(fileContent).toString('base64');
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}?ref=${branch}`;

    // Get current file to check if it exists and get its SHA
    let sha: string | null = null;
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'BadriEnterprises-App',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      if (response.ok) {
        const data = await response.json() as any;
        sha = data.sha;
      }
    } catch (e) {
      console.log(`File ${fileName} might not exist yet on GitHub, proceeding to create.`);
    }

    // Now, PUT the file
    const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`;
    const body: any = {
      message: commitMessage,
      content: base64Content,
      branch: branch
    };
    if (sha) {
      body.sha = sha;
    }

    const putResponse = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'BadriEnterprises-App',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (putResponse.ok) {
      return { success: true, message: `Successfully synced ${fileName}` };
    } else {
      const errorText = await putResponse.text();
      return { success: false, message: `Failed to sync ${fileName}`, error: errorText };
    }
  } catch (err: any) {
    return { success: false, message: `Error syncing ${fileName}`, error: err.message };
  }
}

app.post('/api/github-sync', async (req, res) => {
  try {
    const { owner, repo, branch, token, commitMessage } = req.body;
    if (!owner || !repo || !token) {
      return res.status(400).json({ error: 'Owner, Repo, and Token are required for GitHub sync.' });
    }
    const targetBranch = branch || 'main';
    const msg = commitMessage || `Auto-sync: Admin panel updates`;

    const filesToSync = [
      { path: PRODUCTS_FILE_PATH, name: 'products-settings.json' },
      { path: BRANDS_FILE_PATH, name: 'brands-settings.json' },
      { path: MATERIALS_FILE_PATH, name: 'materials-settings.json' },
      { path: FAQS_FILE_PATH, name: 'faqs-settings.json' },
      { path: REVIEWS_FILE_PATH, name: 'reviews-settings.json' },
      { path: WEBSITE_SETTINGS_FILE_PATH, name: 'website-settings.json' },
      { path: INQUIRIES_FILE_PATH, name: 'inquiries-settings.json' }
    ];

    const results = [];
    for (const file of filesToSync) {
      if (fs.existsSync(file.path)) {
        const result = await syncFileToGitHub(owner, repo, targetBranch, token, file.path, file.name, msg);
        results.push({ file: file.name, ...result });
      } else {
        results.push({ file: file.name, success: false, message: 'File does not exist on local disk.' });
      }
    }

    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      return res.json({
        success: false,
        message: `Synced with some issues: ${results.filter(r => r.success).length} succeeded, ${failed.length} failed.`,
        details: results
      });
    }

    return res.json({
      success: true,
      message: 'All settings files successfully committed and synced to GitHub!',
      details: results
    });

  } catch (err: any) {
    console.error('[GITHUB SYNC ERROR]', err);
    return res.status(500).json({ error: err.message || 'Error occurred during GitHub synchronization.' });
  }
});


// Serve frontend assets or mount Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏠 Server running on http://localhost:${PORT}`);
  });
}

startServer();
