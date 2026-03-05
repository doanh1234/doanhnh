# 🚀 Hướng dẫn Deploy API lên Server Miễn phí

## 📋 Tổng quan
API này có thể deploy lên các nền tảng hosting miễn phí sau:
- **Render** (Khuyên dùng - Đơn giản nhất)
- **Railway** (Tốt, có $5 credit miễn phí/tháng)
- **Vercel** (Tốt cho serverless)

---

## 🎯 Option 1: Deploy lên Render (KHUYÊN DÙNG)

### Bước 1: Chuẩn bị Git Repository
```bash
# Khởi tạo git (nếu chưa có)
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit - URL Stringify API"

# Tạo repository trên GitHub và push
git remote add origin https://github.com/YOUR_USERNAME/url-stringify-api.git
git branch -M main
git push -u origin main
```

### Bước 2: Deploy trên Render
1. Truy cập https://render.com và đăng ký/đăng nhập
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository của bạn
4. Cấu hình:
   - **Name**: `url-stringify-api` (hoặc tên bạn muốn)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
   - **Plan**: Chọn **Free**
5. Click **"Create Web Service"**

### Bước 3: Đợi Deploy
- Render sẽ tự động build và deploy
- Sau vài phút, bạn sẽ có URL dạng: `https://url-stringify-api.onrender.com`

### Bước 4: Test API
```bash
# Test endpoint
curl https://url-stringify-api.onrender.com/nguonc

# Test với custom URL
curl https://url-stringify-api.onrender.com/nguonc?url=https://tinnhac.com
```

---

## 🚂 Option 2: Deploy lên Railway

### Bước 1: Chuẩn bị Git (giống như trên)

### Bước 2: Deploy trên Railway
1. Truy cập https://railway.app và đăng nhập với GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Chọn repository của bạn
4. Railway sẽ tự động detect Node.js và deploy
5. Sau khi deploy xong, click **"Settings"** → **"Generate Domain"** để có public URL

### URL của bạn:
- Dạng: `https://your-project.up.railway.app`

---

## ⚡ Option 3: Deploy lên Vercel (Serverless)

**Lưu ý**: Vercel phù hợp cho serverless functions, cần chỉnh sửa code một chút.

### Bước 1: Tạo file `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Bước 2: Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Hoặc deploy production
vercel --prod
```

### URL của bạn:
- Dạng: `https://your-project.vercel.app`

---

## 🌐 Các Endpoints sau khi Deploy

Giả sử URL của bạn là: `https://url-stringify-api.onrender.com`

### 1. Trang chủ
```
GET https://url-stringify-api.onrender.com/
```

### 2. Endpoint nguonc
```
GET https://url-stringify-api.onrender.com/nguonc
GET https://url-stringify-api.onrender.com/nguonc?url=https://tinnhac.com
```

### 3. Endpoint fetch tùy chỉnh
```
GET https://url-stringify-api.onrender.com/fetch?url=https://example.com
```

---

## 📝 Lưu ý quan trọng

### Render Free Tier:
- ✅ Miễn phí hoàn toàn
- ⚠️ Server sẽ "ngủ" sau 15 phút không hoạt động
- ⚠️ Request đầu tiên sau khi "ngủ" sẽ mất ~30 giây để "đánh thức"
- 💡 Giải pháp: Dùng cron job để ping server mỗi 10 phút

### Railway Free Tier:
- ✅ $5 credit miễn phí mỗi tháng
- ✅ Không bị "ngủ"
- ⚠️ Hết credit thì dừng (thường đủ cho traffic nhỏ)

### Vercel Free Tier:
- ✅ Miễn phí
- ✅ Serverless - không bị "ngủ"
- ⚠️ Có giới hạn execution time (10s cho free tier)

---

## 🔧 Troubleshooting

### Lỗi: Port already in use
- Render/Railway/Vercel tự động set PORT environment variable
- Code đã handle: `const PORT = process.env.PORT || 3000;`

### Lỗi: Module not found
- Đảm bảo `package.json` có đầy đủ dependencies
- Render/Railway sẽ tự động chạy `npm install`

### API không trả về data
- Check logs trên dashboard của platform
- Verify URL target có accessible không

---

## 🎉 Hoàn tất!

Sau khi deploy, bạn có thể share URL với người khác:
```
https://your-api-url.com/nguonc
```

Họ sẽ thấy data JSON giống như khi bạn chạy local!
