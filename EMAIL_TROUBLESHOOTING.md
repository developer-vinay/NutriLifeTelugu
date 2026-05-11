# Email Troubleshooting Guide

## Issue: Diet Plan Emails Not Being Received

### ✅ Local Testing - WORKING
The Brevo email service is configured correctly and working in local development:
- ✅ API key is valid
- ✅ Sender email is verified
- ✅ Test email sent successfully

### 🔍 Possible Issues in Production (Vercel)

#### 1. **Environment Variables Not Set in Vercel**
**Problem:** Vercel deployment doesn't have the Brevo API key configured.

**Solution:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `nutrilifemitra`
3. Go to **Settings** → **Environment Variables**
4. Add these variables (get values from your local `.env.local` file):
   ```
   BREVO_API_KEY=your_brevo_api_key_here
   BREVO_FROM_EMAIL=your_verified_email@gmail.com
   ```
5. **Important:** Select all environments (Production, Preview, Development)
6. Click **Save**
7. **Redeploy** your application

#### 2. **Emails Going to Spam Folder**
**Problem:** Emails are being sent but landing in spam/junk folder.

**Solution:**
- Check **Spam/Junk** folder in the recipient's email
- In Gmail: Check **Promotions** or **Updates** tab
- Mark emails from `vinaybuttala@gmail.com` as "Not Spam"

#### 3. **Sender Email Not Verified in Brevo**
**Problem:** Brevo requires sender email verification.

**Solution:**
1. Go to [Brevo Dashboard](https://app.brevo.com/)
2. Navigate to **Senders** → **Domains & Addresses**
3. Verify that `vinaybuttala@gmail.com` is verified
4. If not verified, click **Verify** and follow the instructions

#### 4. **Brevo Daily Limit Reached**
**Problem:** Free tier has 300 emails/day limit.

**Solution:**
1. Go to [Brevo Dashboard](https://app.brevo.com/)
2. Check **Statistics** → **Email** to see daily usage
3. If limit reached, wait 24 hours or upgrade plan

#### 5. **Rate Limiting**
**Problem:** Too many requests from same IP address.

**Solution:**
- Wait 1 hour before trying again (rate limit: 10 requests/hour per IP)
- Clear browser cache and cookies
- Try from a different device/network

### 🧪 How to Test

#### Test 1: Check Vercel Logs
1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on latest deployment
3. Go to **Functions** tab
4. Look for logs from `/api/free-plans/send`
5. Check for error messages

#### Test 2: Test Email Sending Locally
```bash
# Run the test script
node test-brevo.js
```

Expected output:
```
✅ SUCCESS! Email sent successfully.
Check your inbox: vinaybuttala@gmail.com
```

#### Test 3: Check Browser Console
1. Open diet plans page: https://nutrilifemitra.com/diet-plans
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Enter email and click "Get Free PDF"
5. Check for error messages in console

#### Test 4: Check Network Tab
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Enter email and click "Get Free PDF"
4. Look for `/api/free-plans/send` request
5. Check response status and body

### 📊 Enhanced Logging

The code now includes detailed logging:
- ✅ Request received with email and planId
- ✅ Brevo API key configuration check
- ✅ Plan found in database
- ✅ Email sending attempt
- ✅ Success/failure status

Check Vercel logs to see these messages.

### 🔧 Quick Fixes

#### Fix 1: Redeploy with Environment Variables
```bash
# Make sure .env.local has correct values
# Then push to GitHub
git add .
git commit -m "Fix: Add email logging"
git push origin main

# Vercel will auto-deploy
```

#### Fix 2: Verify Brevo Configuration
1. Login to [Brevo](https://app.brevo.com/)
2. Go to **Settings** → **SMTP & API**
3. Copy your API key (starts with `xkeysib-`)
4. Update in Vercel environment variables
5. Redeploy

#### Fix 3: Test with Different Email
- Try with Gmail, Yahoo, Outlook
- Some email providers have stricter spam filters

### 📝 Common Error Messages

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Email service not configured" | BREVO_API_KEY missing | Add to Vercel env vars |
| "Invalid email address" | Email format wrong | Check email format |
| "Plan not found" | Invalid planId | Check database |
| "Failed to send email" | Brevo API error | Check Brevo dashboard |
| "Too many requests" | Rate limit hit | Wait 1 hour |

### 🎯 Next Steps

1. **Check Vercel Environment Variables** (most likely issue)
2. **Check Spam Folder** (second most likely)
3. **Check Brevo Dashboard** for sender verification
4. **Check Vercel Logs** for detailed error messages
5. **Test locally** to confirm code is working

### 📞 Support

If issue persists after trying all solutions:
1. Check Vercel logs for specific error messages
2. Check Brevo dashboard for email delivery status
3. Verify all environment variables are set correctly
4. Contact Brevo support if API issues persist

---

## ✅ Status: Code Fixed

The following improvements have been made:
- ✅ Added detailed logging to track email sending
- ✅ Added Brevo API key validation
- ✅ Added better error messages
- ✅ Added response data logging
- ✅ Created test script for local testing

**Next:** Deploy to Vercel and check environment variables.
