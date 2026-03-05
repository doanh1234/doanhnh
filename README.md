# URL Stringify API

API Node.js để fetch và stringify nội dung từ URL, hỗ trợ cả CLI và REST API endpoints.

## Cài đặt

```bash
npm install
```

## Sử dụng

### CLI Mode

Chạy với URL mặc định:
```bash
npm start
```

Chạy với URL tùy chỉnh:
```bash
node index.js <URL>
```

### API Server Mode

Khởi động server:
```bash
npm run server
```

Server sẽ chạy tại `http://localhost:3000`

## API Endpoints

### GET /
Hiển thị thông tin API và danh sách endpoints

### GET /nguonc
Fetch nội dung từ URL mặc định hoặc custom URL
- Query params: `?url=<target_url>` (optional)

### GET /fetch
Fetch nội dung từ bất kỳ URL nào
- Query params: `?url=<target_url>` (required)

## Tính năng

- ✅ Fetch nội dung từ bất kỳ URL nào
- ✅ REST API endpoints
- ✅ CORS enabled
- ✅ Xử lý lỗi chi tiết
- ✅ JSON response format

## Yêu cầu

- Node.js >= 18.0.0
- npm hoặc yarn

## Dependencies

- express - Web framework
- axios - HTTP client
- cors - CORS middleware
