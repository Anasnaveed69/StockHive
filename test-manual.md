# Manual API Testing Guide

## Prerequisites
Make sure the server is running: `node index.js`

## 1. Get All Products
```bash
curl http://localhost:3000/get-products
```

## 2. Get Product by ID
```bash
curl http://localhost:3000/get-product/1
```

## 3. Add a New Product
```bash
curl -X POST http://localhost:3000/add-product \
  -H "Content-Type: application/json" \
  -d '{
    "id": "5",
    "name": "Smart Watch",
    "description": "Fitness tracking smartwatch with heart rate monitor",
    "price": 199.99,
    "category": "Electronics",
    "brand": "TechFit",
    "image": "https://example.com/smartwatch.jpg"
  }'
```

## 4. Search Products
```bash
curl "http://localhost:3000/search-products?query=headphones"
```

## 5. Get Products by Category
```bash
curl http://localhost:3000/get-products-by-category/Electronics
```

## 6. Test Error Cases

### Product Not Found
```bash
curl http://localhost:3000/get-product/999
```

### Missing Query Parameter
```bash
curl http://localhost:3000/search-products
```

### Duplicate Product ID
```bash
curl -X POST http://localhost:3000/add-product \
  -H "Content-Type: application/json" \
  -d '{
    "id": "1",
    "name": "Duplicate Product",
    "price": 10.99
  }'
```

## Expected Responses

### Successful GET /get-products
```json
[
  {
    "id": "1",
    "name": "Wireless Bluetooth Headphones",
    "description": "Over-ear, noise-cancelling headphones with 30-hour battery life.",
    "price": 59.99,
    "category": "Electronics",
    "brand": "SoundMagic",
    "image": "https://example.com/images/headphones.jpg"
  }
]
```

### Successful POST /add-product
```json
{
  "id": "5",
  "name": "Smart Watch",
  "description": "Fitness tracking smartwatch with heart rate monitor",
  "price": 199.99,
  "category": "Electronics",
  "brand": "TechFit",
  "image": "https://example.com/smartwatch.jpg"
}
```

### Error Response (404)
```json
{
  "error": "Product not found"
}
``` 