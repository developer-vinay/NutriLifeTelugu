# 📧 Newsletter System - Complete Guide

## 🆕 Recent Updates & Fixes

### ✅ Fixed: Count Issue in Send Digest (May 2026)
**Problem**: When viewing subscribers, the language breakdown showed incorrect counts.

**Solution**: Updated language count logic to only count ACTIVE subscribers:
```typescript
// Now counts only active subscribers by language
const langCounts = {
  en: subscribers.filter((s) => s.isActive && s.language === 'en').length,
  te: subscribers.filter((s) => s.isActive && s.language === 'te').length,
  hi: subscribers.filter((s) => s.isActive && s.language === 'hi').length,
}
```

### ✅ Fixed: Replaced Alert Boxes with Modals
**Problem**: Delete confirmations used browser `confirm()` dialogs.

**Solution**: Implemented professional modal dialogs for:
- Single subscriber deletion
- Bulk subscriber deletion

Features:
- Clean, modern design
- Dark mode support
- Clear confirmation messages
- Cancel and Confirm buttons

### ✅ Enhanced: Email Debugging
**Problem**: Welcome emails sometimes fail silently.

**Solution**: Added detailed logging to help diagnose issues:
- API key validation
- From email verification
- Detailed error messages with stack traces

**To Debug Email Issues:**
1. Subscribe with a test email
2. Check your terminal/console for logs:
   - `📧 Attempting to send welcome email...`
   - `✅ Welcome email sent successfully` (success)
   - `❌ Failed to send welcome email:` (error with details)
3. Verify Brevo API key in `.env.local`
4. Ensure `BREVO_FROM_EMAIL` is verified in Brevo dashboard

---

## Overview

Your website has a **complete newsletter system** that allows users to subscribe and receive weekly digests of your latest content (recipes, articles, health tips).

---

## 🎯 How It Works

### **1. User Subscribes (Language-Aware)**

**Location:** Homepage sidebar → "Get free weekly recipes" box

**What Happens:**
1. User enters their email address
2. **Language is automatically detected** from their current browsing language (English/Telugu/Hindi)
3. Clicks "Subscribe — it's free" (button text in their language)
4. **Instant feedback:**
   - ✅ Success message: "Successfully Subscribed! 🎉" (in their language)
   - ❌ Error message if email is invalid
   - ⏳ Loading spinner while processing
5. **Email + Language preference saved** to MongoDB `subscribers` collection
6. **Welcome email sent automatically** via Brevo

**Language Detection:**
- English users see English UI and get tagged as `language: 'en'`
- Telugu users see Telugu UI and get tagged as `language: 'te'`
- Hindi users see Hindi UI and get tagged as `language: 'hi'`

---

### **2. Welcome Email (Automatic)**

**Sent:** Immediately after subscription  
**Subject:** "Welcome to NutriLifeMitra! 🌿"

**Content Includes:**
- Welcome message
- Link to browse recipes
- Link to free diet plans
- Unsubscribe option

**Template Location:** `lib/brevo.ts` → `welcomeEmailHtml()`

---

### **3. Weekly Digest Email (Manual, Language-Specific)**

**Sent:** By admin from admin panel  
**Subject:** 
- English: "🌿 This Week on NutriLifeMitra"
- Telugu: "🌿 ఈ వారం NutriLifeMitra నుండి"
- Hindi: "🌿 इस सप्ताह NutriLifeMitra से"

**How It Works:**
1. Admin clicks "Send Weekly Digest"
2. System groups subscribers by language preference
3. **Each language group receives content in their language:**
   - English subscribers → English articles & recipes
   - Telugu subscribers → Telugu articles & recipes
   - Hindi subscribers → Hindi articles & recipes
4. If no content exists for a language, that group is skipped

**Content Includes:**
- Latest 5 published articles in subscriber's language (with excerpts)
- Latest 5 published recipes in subscriber's language
- Links to read more
- Unsubscribe option

**Template Location:** `lib/brevo.ts` → `weeklyDigestHtml()`

---

## 🔧 Admin Panel - How to Send Weekly Digest

### **Step 1: Go to Subscribers Page**
Navigate to: **Admin Panel → Subscribers**

### **Step 2: Review Subscriber Count**
- See total subscribers
- See active subscribers (only active ones receive emails)
- **See language breakdown:**
  - English: X subscribers
  - Telugu: Y subscribers
  - Hindi: Z subscribers

### **Step 3: Click "Send Weekly Digest"**
- Button is in the top-right corner
- **Modal shows confirmation with language breakdown:**
  - "Send weekly digest to X active subscribers?"
  - Shows count per language
  - Note: "Each subscriber will receive content in their preferred language"
- Click "Send Now" to proceed

### **Step 4: Wait for Completion**
- Modal closes, button shows "Sending..." with spinner
- Takes ~1-2 seconds per subscriber (rate limiting)
- **Shows result with breakdown:**
  - "Sent X, failed Y"
  - EN: X · TE: Y · HI: Z

---

## 📊 What Gets Sent in Weekly Digest

The system automatically fetches **language-specific content**:

### **For English Subscribers:**
- Last 5 published posts with `language: 'en'`
- Last 5 published recipes with `language: 'en'`
- Subject: "🌿 This Week on NutriLifeMitra"

### **For Telugu Subscribers:**
- Last 5 published posts with `language: 'te'`
- Last 5 published recipes with `language: 'te'`
- Subject: "🌿 ఈ వారం NutriLifeMitra నుండి"

### **For Hindi Subscribers:**
- Last 5 published posts with `language: 'hi'`
- Last 5 published recipes with `language: 'hi'`
- Subject: "🌿 इस सप्ताह NutriLifeMitra से"

### **Content Format:**
- **Articles:** Title, excerpt (first 100 chars), link to read
- **Recipes:** Title, link to view
- **Personalized Unsubscribe Link:** Each email has unique unsubscribe link

### **Important Notes:**
- If no content exists for a language, subscribers of that language won't receive an email
- Make sure to publish content in all languages regularly
- Content is sorted by creation date (newest first)

---

## 🎨 Email Templates

### **Welcome Email Features:**
- Professional design with brand colors
- Mobile-responsive
- Clear call-to-action buttons
- Unsubscribe link at bottom

### **Weekly Digest Features:**
- Clean, scannable layout
- Article excerpts (first 100 characters)
- Recipe icons
- Direct links to content
- Personalized unsubscribe

---

## 📁 File Structure

```
Newsletter System Files:
├── components/home/NewsletterBox.tsx          # Subscription form (NEW - improved)
├── app/api/subscribe/route.ts                 # Handles subscriptions
├── app/api/admin/send-digest/route.ts         # Sends weekly digest
├── app/api/unsubscribe/route.ts               # Handles unsubscribes
├── app/admin/subscribers/page.tsx             # Admin subscriber management
├── app/admin/subscribers/SendDigestButton.tsx # Send digest button
├── lib/brevo.ts                               # Email templates & sending
└── models/Subscriber.ts                       # Database model
```

---

## 🔐 Security & Privacy

### **Email Validation:**
- Checks for valid email format
- Normalizes emails (lowercase, trimmed)
- Prevents duplicate subscriptions

### **Unsubscribe:**
- One-click unsubscribe link in every email
- Sets `isActive: false` (doesn't delete data)
- Can be reactivated if user subscribes again

### **Rate Limiting:**
- 100ms delay between each email
- Prevents Brevo rate limit issues
- Respects free tier limits (300 emails/day)

---

## 📈 Subscriber Management

### **Admin Can:**
- ✅ View all subscribers
- ✅ See active/inactive status
- ✅ See subscription date
- ✅ **See language preference** (English/తెలుగు/हिंदी badge)
- ✅ Remove individual subscribers (with modal confirmation)
- ✅ Bulk delete subscribers (with modal confirmation)
- ✅ Send weekly digest to all active subscribers
- ✅ **View language breakdown** (EN: X · TE: Y · HI: Z)

### **Subscriber States:**
- **Active:** Receives emails
- **Inactive:** Unsubscribed, doesn't receive emails

---

## 🚀 Best Practices

### **When to Send Weekly Digest:**

**Recommended Schedule:**
- **Every Friday** at 10 AM IST
- Or **Every Monday** at 9 AM IST
- Consistency is key!

### **Before Sending:**
1. ✅ **Publish content in all languages** (English, Telugu, Hindi)
2. ✅ Publish at least 2-3 new articles/recipes per language
3. ✅ Check subscriber count is > 0
4. ✅ Check language breakdown to see which languages need content
5. ✅ Verify Brevo API key is working
6. ✅ Test with your own email first

### **Content Tips:**
- Publish quality content regularly **in all three languages**
- Mix of recipes, health tips, and articles
- Use engaging titles and excerpts
- Add hero images to all content
- **Maintain content parity:** Try to have similar content across languages
- If you can't translate everything, focus on your primary audience language

---

## 🔧 Configuration

### **Environment Variables Required:**

```env
# Brevo Email Service
BREVO_API_KEY=xkeysib-YOUR_API_KEY_HERE
BREVO_FROM_EMAIL=noreply@nutrilifemitra.com

# Base URL (for email links)
NEXTAUTH_URL=https://nutrilifemitra.com  # Production
# or
NEXTAUTH_URL=http://localhost:3000       # Development
```

### **Brevo Free Tier Limits:**
- **300 emails per day** (forever free)
- Unlimited contacts
- Professional templates
- Delivery tracking

---

## 📊 Monitoring & Analytics

### **Check Email Delivery:**
1. Go to [Brevo Dashboard](https://app.brevo.com)
2. Navigate to **Campaigns** → **Transactional**
3. See delivery rates, opens, clicks

### **Subscriber Growth:**
- Track in Admin Panel → Subscribers
- Shows total and active count
- Monitor growth over time

---

## 🐛 Troubleshooting

### **Emails Not Sending?**

**Check:**
1. ✅ Brevo API key is correct (starts with `xkeysib-`)
2. ✅ `BREVO_FROM_EMAIL` matches verified domain
3. ✅ Subscriber has `isActive: true`
4. ✅ Check Brevo dashboard for errors

### **Welcome Email Not Received?**

**Common Issues:**
- Email in spam folder
- Brevo API key incorrect
- Email address typo
- Brevo account suspended (check dashboard)

### **Unsubscribe Not Working?**

**Check:**
- Link format: `/api/unsubscribe?email={email}`
- Email is URL-encoded
- Database connection working

---

## 🎯 Future Enhancements (Optional)

### **Automation Ideas:**
1. **Scheduled Digest:**
   - Use cron job or Vercel Cron
   - Auto-send every Friday at 10 AM
   - No manual clicking needed

2. **~~Segmentation:~~** ✅ **ALREADY IMPLEMENTED!**
   - ✅ Send different content based on language preference
   - ✅ Telugu subscribers get Telugu content
   - ✅ Hindi subscribers get Hindi content

3. **Analytics:**
   - Track open rates
   - Track click rates
   - A/B test subject lines

4. **Double Opt-In:**
   - Send confirmation email
   - User must click to confirm
   - Reduces spam complaints

---

## 📝 Email Content Strategy

### **What to Include in Weekly Digest:**

**Good Mix:**
- 2-3 health articles
- 2-3 recipes
- 1 health tip
- 1 call-to-action (diet plan, health tools)

**Avoid:**
- Too many items (overwhelming)
- Too few items (not valuable)
- Same content every week
- Broken links

---

## ✅ Quick Start Checklist

### **For Admin:**
- [ ] Verify Brevo API key is correct
- [ ] Test subscription with your email
- [ ] Check welcome email received
- [ ] Publish 3-5 new articles/recipes
- [ ] Go to Admin → Subscribers
- [ ] Click "Send Weekly Digest"
- [ ] Verify digest email received
- [ ] Check Brevo dashboard for delivery stats

### **For Users:**
- [ ] Find "Get free weekly recipes" box on homepage
- [ ] Enter email address
- [ ] Click subscribe
- [ ] Check email for welcome message
- [ ] Wait for weekly digest (sent by admin)

---

## 🎉 Summary

Your newsletter system is **fully functional** and includes:

✅ **Beautiful subscription form** with instant feedback (multilingual)  
✅ **Language detection** - captures user's browsing language  
✅ **Automatic welcome email** for new subscribers  
✅ **Language-specific weekly digest** - each subscriber gets content in their language  
✅ **Admin panel** to manage subscribers with language breakdown  
✅ **Professional modal dialogs** for delete confirmations  
✅ **One-click unsubscribe** in every email  
✅ **Professional email templates**  
✅ **Mobile-responsive design**  
✅ **Rate limiting** to respect API limits  
✅ **Error handling** for failed sends  
✅ **Detailed logging** for debugging email issues  

**Everything is ready to use!** Just send your first weekly digest from the admin panel.

---

**Questions?** Check the code comments or Brevo documentation at https://developers.brevo.com/
