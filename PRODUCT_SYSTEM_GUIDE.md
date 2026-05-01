# Product System Guide

## Overview
Complete e-commerce product management system with discounts, multi-currency support, and file uploads.

---

## Features Implemented

### 1. **Discount System** ✅
- **Discount Types:**
  - `percentage`: e.g., 20% off
  - `fixed`: e.g., ₹50 off
  - `none`: No discount

- **How it works:**
  - Admin sets original price + discount type + discount value
  - System automatically calculates `finalPrice`
  - Shop displays strikethrough original price + highlighted final price
  - Calculation happens in MongoDB pre-save hook

- **Example:**
  ```
  Price: ₹299
  Discount: 20% off
  Final Price: ₹239.20 (auto-calculated)
  ```

### 2. **Multi-Currency Support** ✅
- **Supported Currencies:**
  - ₹ INR (Indian Rupee)
  - $ USD (US Dollar)
  - € EUR (Euro)
  - £ GBP (British Pound)
  - ¥ JPY (Japanese Yen)

- **Implementation:**
  - Dropdown selector in admin panel
  - Stored in database with product
  - Displayed correctly in shop

### 3. **File Upload System** ✅
- **Two Upload Methods:**
  1. **URL Input**: Paste existing URL (Cloudinary, AWS S3, etc.)
  2. **File Upload**: Upload directly from computer

- **File Types:**
  - **Images**: JPG, PNG, WebP (max 5MB)
  - **PDFs**: For ebooks/digital products (max 10MB)

- **Current Status:**
  - ✅ UI implemented
  - ✅ Validation added
  - ⚠️ **Upload endpoint is placeholder** - needs cloud storage integration

---

## How Major Websites Handle This

### **Amazon / Shopify / Gumroad Approach:**

#### 1. **Discounts:**
- Store original price + discount separately
- Calculate final price dynamically
- Show strikethrough original + highlighted sale price
- **✅ We implemented this exactly**

#### 2. **File Storage:**
- **Never store files in database**
- Upload to cloud storage (S3, Cloudinary, etc.)
- Store only the URL in database
- **✅ We implemented this pattern**

#### 3. **Currency:**
- Dropdown with common currencies
- Some sites auto-detect user location
- **✅ We have dropdown, can add auto-detect later**

---

## File Upload Integration (Production Setup)

### **Option 1: Cloudinary (Recommended)** ⭐

**Why Cloudinary:**
- Free tier: 25GB storage, 25GB bandwidth/month
- Automatic image optimization
- CDN included
- Easy integration

**Setup:**
```bash
npm install cloudinary
```

**Add to `.env.local`:**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Update `/api/upload/route.ts`:**
```typescript
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'products', resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    ).end(buffer)
  })

  return NextResponse.json({ url: result.secure_url })
}
```

### **Option 2: AWS S3**

**Setup:**
```bash
npm install @aws-sdk/client-s3
```

**Add to `.env.local`:**
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name
```

### **Option 3: Vercel Blob** (if on Vercel)

**Setup:**
```bash
npm install @vercel/blob
```

**Code:**
```typescript
import { put } from '@vercel/blob'

const blob = await put(file.name, file, {
  access: 'public',
})

return NextResponse.json({ url: blob.url })
```

### **Option 4: UploadThing** (Easiest)

**Setup:**
```bash
npm install uploadthing
```

**Free tier:** 2GB storage
**Docs:** https://docs.uploadthing.com/getting-started/appdir

---

## Database Schema

### Product Model Fields:
```typescript
{
  name: string                    // English name
  nameHi?: string                 // Hindi name
  nameTe?: string                 // Telugu name
  description: string             // English description
  descriptionHi?: string          // Hindi description
  descriptionTe?: string          // Telugu description
  
  price: number                   // Original price
  currency: string                // ₹, $, €, £, ¥
  discountType?: string           // 'percentage' | 'fixed' | 'none'
  discountValue?: number          // Discount amount
  finalPrice?: number             // Auto-calculated
  
  category: string                // ebook, course, consultation, etc.
  duration?: string               // "30 days", "60 days"
  
  features: string[]              // English features
  featuresHi?: string[]           // Hindi features
  featuresTe?: string[]           // Telugu features
  
  imageUrl?: string               // Product image URL
  fileUrl?: string                // Downloadable PDF/ebook URL
  
  isActive: boolean               // Visible in shop?
  isFeatured: boolean             // Featured product?
  sortOrder: number               // Display order
}
```

---

## Admin Panel Usage

### Creating a Product:

1. **Go to:** `/admin/products`
2. **Click:** "Add Product"
3. **Fill in:**
   - Basic info (name, description) in all 3 languages
   - Price + currency
   - Discount (optional)
   - Category
   - Features (one per line)
   - Upload image or enter URL
   - Upload PDF (for digital products) or enter URL
4. **Click:** "Create Product"

### Editing a Product:

1. **Go to:** `/admin/products`
2. **Click:** Edit icon next to product
3. **Update:** Any fields
4. **Click:** "Save Changes"

### Discount Examples:

**20% off:**
- Price: ₹299
- Discount Type: Percentage
- Discount Value: 20
- Final Price: ₹239.20 (auto-calculated)

**Fixed ₹50 off:**
- Price: ₹299
- Discount Type: Fixed Amount
- Discount Value: 50
- Final Price: ₹249 (auto-calculated)

---

## Shop Display

### How Products Appear:

**Without Discount:**
```
Premium Ebook
₹299
```

**With Discount:**
```
Premium Ebook
₹299  ₹239.20
      (20% off)
```

---

## API Endpoints

### Admin (Auth Required):
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `GET /api/admin/products/[id]` - Get single product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product

### Public:
- `GET /api/products` - Get active products for shop

### Upload:
- `POST /api/upload` - Upload file (needs cloud storage setup)

---

## Next Steps

### To Make Upload Work:
1. Choose cloud storage provider (Cloudinary recommended)
2. Sign up and get API keys
3. Add keys to `.env.local`
4. Update `/api/upload/route.ts` with integration code
5. Test upload functionality

### Optional Enhancements:
- [ ] Add product categories filter in shop
- [ ] Add product search
- [ ] Add product reviews/ratings
- [ ] Add inventory management
- [ ] Add time-limited discounts (start/end dates)
- [ ] Add bulk discount codes
- [ ] Add product variants (sizes, colors, etc.)

---

## Comparison with Major Platforms

| Feature | Amazon | Shopify | Gumroad | Our System |
|---------|--------|---------|---------|------------|
| Discounts | ✅ | ✅ | ✅ | ✅ |
| Multi-currency | ✅ | ✅ | ✅ | ✅ |
| File uploads | ✅ | ✅ | ✅ | ✅ (needs setup) |
| Multilingual | ✅ | ✅ | ❌ | ✅ (EN/HI/TE) |
| Digital products | ✅ | ✅ | ✅ | ✅ |
| Discount types | ✅ | ✅ | ✅ | ✅ |

**Our system follows industry best practices!** ✅

---

## Troubleshooting

### Upload not working?
- Check if `/api/upload/route.ts` is configured
- Verify cloud storage credentials in `.env.local`
- Check file size limits (5MB images, 10MB PDFs)

### Discount not calculating?
- Ensure `discountType` is not 'none'
- Ensure `discountValue` is greater than 0
- Check MongoDB pre-save hook is running

### Products not showing in shop?
- Check `isActive` is true
- Check product was saved successfully
- Check `/api/products` endpoint returns data

---

## Security Notes

- ✅ Only admins can create/edit/delete products
- ✅ File upload requires admin authentication
- ✅ File size limits enforced
- ✅ File type validation (images/PDFs only)
- ✅ Input sanitization on all fields

---

## Support

For questions or issues:
1. Check this guide first
2. Review code comments in files
3. Check API endpoint responses
4. Verify database schema matches model

---

**Last Updated:** May 2026
**Version:** 1.0
