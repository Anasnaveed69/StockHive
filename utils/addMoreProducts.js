const axios = require('axios');

const newProducts = [
  {
    "id": "macbook-air",
    "name": "MacBook Air M2",
    "description": "13.6-inch Liquid Retina display, M2 chip, 8GB unified memory, 256GB SSD, macOS Ventura",
    "price": 1199.99,
    "category": "Electronics",
    "brand": "Apple",
    "image": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-201810?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1664472289661"
  },
  {
    "id": "sony-wh1000xm4",
    "name": "Sony WH-1000XM4",
    "description": "Wireless noise-canceling headphones with 30-hour battery life, touch controls, Alexa built-in",
    "price": 349.99,
    "category": "Electronics",
    "brand": "Sony",
    "image": "https://electronics.sony.com/image/5d02da5df552836db89418d5c5c8b5c0?fmt=png-alpha&wid=720&hei=720"
  },
  {
    "id": "samsung-galaxy-s23",
    "name": "Samsung Galaxy S23",
    "description": "6.1-inch Dynamic AMOLED display, Snapdragon 8 Gen 2, 50MP camera, 128GB storage",
    "price": 799.99,
    "category": "Electronics",
    "brand": "Samsung",
    "image": "https://images.samsung.com/is/image/samsung/p6pim/latin/2308/gallery/latin-galaxy-s23-s918-sm-s918bzgcgto-534864730?$1300_1038_PNG$"
  },
  {
    "id": "converse-chuck-taylor",
    "name": "Converse Chuck Taylor All Star",
    "description": "Classic canvas sneakers, high-top design, rubber toe cap, iconic Chuck Taylor branding",
    "price": 59.99,
    "category": "Fashion",
    "brand": "Converse",
    "image": "https://www.converse.com/on/demandware.static/-/Sites-cnv-master-catalog/default/dw8a0c5e3a/images/a/08/162056C_A_08X1.jpg"
  },
  {
    "id": "levis-501-jeans",
    "name": "Levi's 501 Original Jeans",
    "description": "Classic straight fit jeans, 100% cotton denim, button fly, timeless style",
    "price": 89.99,
    "category": "Fashion",
    "brand": "Levi's",
    "image": "https://lsco.scene7.com/is/image/lsco/005010194-front-pdp?fmt=jpeg&qlt=80&fit=constrain&fmt.jpeg.interlaced=true&wid=1200&hei=1200"
  },
  {
    "id": "the-power-of-habit",
    "name": "The Power of Habit",
    "description": "Why We Do What We Do in Life and Business by Charles Duhigg",
    "price": 16.99,
    "category": "Books",
    "brand": "Random House",
    "image": "https://images-na.ssl-images-amazon.com/images/I/81nzxODnaJL._AC_UL600_SR600,400_.jpg"
  },
  {
    "id": "think-and-grow-rich",
    "name": "Think and Grow Rich",
    "description": "Napoleon Hill's classic on success principles and wealth building",
    "price": 12.99,
    "category": "Books",
    "brand": "Penguin",
    "image": "https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL._AC_UL600_SR600,400_.jpg"
  },
  {
    "id": "wilson-tennis-racket",
    "name": "Wilson Pro Staff Tennis Racket",
    "description": "Professional tennis racket, 97 sq inch head, 16x19 string pattern, lightweight design",
    "price": 249.99,
    "category": "Sports & Outdoors",
    "brand": "Wilson",
    "image": "https://www.wilson.com/en-us/media/catalog/product/cache/38c2577f6b8f7e2c6f2b5b3e8c8b3a2f/p/r/prostaff_97_autograph_tennis_racket_black_white_1.jpg"
  },
  {
    "id": "yeti-rambler-tumbler",
    "name": "Yeti Rambler Tumbler",
    "description": "20oz stainless steel tumbler, vacuum insulated, keeps drinks cold for hours",
    "price": 34.99,
    "category": "Home & Garden",
    "brand": "Yeti",
    "image": "https://www.yeti.com/dw/image/v2/BBRN_PRD/on/demandware.static/-/Sites-master-catalog/default/dw8a0c5e3a/images/20oz-rambler-tumbler/20oz-rambler-tumbler-charcoal-1.jpg"
  },
  {
    "id": "instant-pot-duo",
    "name": "Instant Pot Duo 7-in-1",
    "description": "Electric pressure cooker, 6-quart capacity, 7 cooking functions, digital display",
    "price": 89.99,
    "category": "Home & Garden",
    "brand": "Instant Pot",
    "image": "https://www.instantpot.com/wp-content/uploads/2018/01/DUO60_V2_01.png"
  }
];

async function addProducts() {
  console.log('Adding 10 new products...');
  
  for (const product of newProducts) {
    try {
      const response = await axios.post('http://localhost:3000/api/add-product', product);
      console.log(`✅ Added: ${product.name}`);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log(`⚠️  Skipped: ${product.name} (already exists)`);
      } else {
        console.error(`❌ Failed to add ${product.name}:`, error.response ? error.response.data : error.message);
      }
    }
  }
  
  console.log('\n🎉 Finished adding products!');
  
  // Show current product count
  try {
    const response = await axios.get('http://localhost:3000/api/get-products');
    console.log(`📊 Total products in database: ${response.data.length}`);
  } catch (error) {
    console.error('Failed to get product count:', error.message);
  }
}

// Check if server is running first
async function checkServer() {
  try {
    await axios.get('http://localhost:3000/api/get-products');
    console.log('✅ Server is running, proceeding to add products...\n');
    await addProducts();
  } catch (error) {
    console.error('❌ Server is not running. Please start the server with: node index.js');
  }
}

checkServer(); 