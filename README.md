# URL Stringify Project

Dự án Node.js đơn giản để lấy nội dung từ một URL và chuyển đổi thành chuỗi JSON.

## Cài đặt

```bash
cd /Users/doanhnh/CascadeProjects/url-stringify-project
npm install
```

## Sử dụng

### Với URL mặc định (https://media.hth4nh.eu.org/nguonc):
```bash
npm start
```

### Với URL tùy chỉnh:
```bash
node index.js <URL_của_bạn>
```

Ví dụ:
```bash
node index.js https://api.example.com/data
```

## Tính năng

- Fetch nội dung từ bất kỳ URL nào
- Tự động stringify kết quả thành JSON format
- Hiển thị kết quả với pretty print (indent 2 spaces)
- Xử lý lỗi chi tiết

## Yêu cầu

- Node.js 14.x trở lên
- npm hoặc yarn
