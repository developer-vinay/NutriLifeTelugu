# Vercel Environment Variables Setup Guide

## 🚨 Issue: Emails Not Sending in Production

**Cause:** Environment variables are not configured in Vercel.

**Solution:** Follow these steps to add environment variables to Vercel.

---

## 📋 Step-by-Step Instructions

### Step 1: Add nutrilifemitra@gmail.com to Brevo (IMPORTANT!)

Before updating Vercel, you MUST verify the new sender email in Brevo:

1. Go to [Brevo Dashboard](https://app.brevo.com/)
2. Login with your account (vinaybuttala@gmail.com)
3. Navigate to **Senders** → **Domains & Addresses**
4. Click **Add a sender** button
5. Enter email: `nutrilifemitra@gmail.com`
6. Click **Add**
7. Brevo will send a verification email to `nutrilifemitra@gmail.com`
8. **Open Gmail** for nutrilifemitra@gmail.com
9. Find the Brevo verification email
10. Click the **Verify** link in the email
11. Wait for confirmation that email is verified

**⚠️ IMPORTANT:** You cannot send emails from an unverified address. Complete this step first!

---

### Step 2: Login to Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Login with your account
3. Find and click on your project: **nutrilifemitra** (or NutriLifeTelugu)

---

### Step 3: Add Environment Variables

1. In your project, click on **Settings** tab (top navigation)
2. In the left sidebar, click **Environment Variables**
3. You'll see a form to add new variables

#### Add Variable 1: BREVO_API_KEY

1. **Key:** `BREVO_API_KEY`
2. **Value:** Copy from your `.env.local` file (starts with `xkeysib-`)
   ```
   xkeysib-YOUR_ACTUAL_API_KEY_HERE
   ```
3. **Environments:** Select ALL three checkboxes:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. Click **Save**

#### Add Variable 2: BREVO_FROM_EMAIL

1. **Key:** `BREVO_FROM_EMAIL`
2. **Value:** `nutrilifemitra@gmail.com` (the email you just verified in Brevo)
3. **Environments:** Select ALL three checkboxes:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. Click **Save**

---

### Step 4: Verify Other Required Variables

Make sure these variables are also set in Vercel (they should already be there):

- ✅ `MONGODB_URI`
- ✅ `NEXTAUTH_SECRET`
- ✅ `NEXTAUTH_URL` (should be `https://nutrilifemitra.com`)
- ✅ `GOOGLE_CLIENT_ID`
- ✅ `GOOGLE_CLIENT_SECRET`
- ✅ `CLOUDINARY_CLOUD_NAME`
- ✅ `CLOUDINARY_API_KEY`
- ✅ `CLOUDINARY_API_SECRET`
- ✅ `RAZORPAY_KEY_ID`
- ✅ `RAZORPAY_KEY_SECRET`
- ✅ `GEMINI_API_KEY`
- ✅ `ADMIN_EMAIL`

If any are missing, add them from your `.env.local` file.

---

### Step 5: Redeploy Your Application

After adding environment variables, you MUST redeploy:

**Option A: Redeploy from Vercel Dashboard**
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **⋯** (three dots) menu
4. Click **Redeploy**
5. Confirm the redeployment

**Option B: Push a New Commit (Automatic Deploy)**
```bash
# Make a small change (already done in this commit)
git add .
git commit -m "Update: Change sender email to nutrilifemitra@gmail.com"
git push origin main
```

Vercel will automatically deploy when you push to GitHub.

---

### Step 6: Test Email Sending

1. Wait 2-3 minutes for deployment to complete
2. Go to https://nutrilifemitra.com/diet-plans
3. Scroll to a free plan
4. Enter your email address
5. Click "Get Free PDF"
6. Check your inbox (and spam folder)

---

## 🔍 How to Check Vercel Logs

If emails still don't work, check the logs:

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Click on the latest deployment
4. Click **Functions** tab
5. Look for `/api/free-plans/send` in the list
6. Click on it to see logs

You should see logs like:
```
📧 Diet plan email request: { email: 'test@example.com', planId: '...', language: 'en' }
✅ Plan found: 7-Day Weight Loss Plan
📤 Sending email to: test@example.com
✅ Email sent successfully to: test@example.com
```

If you see errors:
```
❌ BREVO_API_KEY not configured
```
→ Environment variable not set correctly in Vercel

```
❌ Brevo API error: { status: 401, ... }
```
→ API key is invalid or expired

```
❌ Brevo error details: { message: 'sender not verified' }
```
→ nutrilifemitra@gmail.com not verified in Brevo

---

## 📧 Email Deliverability Tips

### Check Spam Folder
- Gmail: Check **Spam** and **Promotions** tabs
- Outlook: Check **Junk** folder
- Yahoo: Check **Spam** folder

### Mark as Not Spam
If email lands in spam:
1. Open the email
2. Click "Not Spam" or "Move to Inbox"
3. This helps future emails land in inbox

### Email Reputation
- New sender emails often go to spam initially
- As more people receive and open emails, reputation improves
- Consider using a custom domain email (e.g., noreply@nutrilifemitra.com) for better deliverability

---

## 🎯 Quick Checklist

Before testing in production, verify:

- [ ] nutrilifemitra@gmail.com verified in Brevo dashboard
- [ ] BREVO_API_KEY added to Vercel (all environments)
- [ ] BREVO_FROM_EMAIL added to Vercel (all environments)
- [ ] Application redeployed after adding variables
- [ ] Waited 2-3 minutes for deployment to complete
- [ ] Tested on production URL (nutrilifemitra.com)
- [ ] Checked Vercel logs for errors
- [ ] Checked spam folder in email

---

## 🆘 Troubleshooting

### Problem: "Email service not configured"
**Solution:** BREVO_API_KEY not set in Vercel. Add it and redeploy.

### Problem: "Sender not verified"
**Solution:** Verify nutrilifemitra@gmail.com in Brevo dashboard.

### Problem: Emails not received
**Solution:** 
1. Check spam folder
2. Check Vercel logs for errors
3. Verify Brevo daily limit (300 emails/day on free tier)

### Problem: "Invalid API key"
**Solution:** 
1. Go to Brevo → Settings → SMTP & API
2. Copy the API key (starts with `xkeysib-`)
3. Update in Vercel environment variables
4. Redeploy

---

## 📞 Support Resources

- **Brevo Dashboard:** https://app.brevo.com/
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Brevo Documentation:** https://developers.brevo.com/
- **Vercel Documentation:** https://vercel.com/docs/environment-variables

---

## ✅ Expected Result

After completing all steps:

1. ✅ Emails sent from `nutrilifemitra@gmail.com`
2. ✅ Users receive diet plan PDFs via email
3. ✅ Emails land in inbox (not spam)
4. ✅ Vercel logs show successful email sending
5. ✅ No errors in production

---

**Last Updated:** May 11, 2026
