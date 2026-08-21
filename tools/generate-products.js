#!/usr/bin/env node
/**
 * Generates sample product data as CSV.
 *
 * Usage:
 *   node tools/generate-products.js [rowCount] [outputPath] [seed]
 *
 * Examples:
 *   node tools/generate-products.js                  # 200 rows -> sample-data/products.csv
 *   node tools/generate-products.js 50                # 50 rows -> sample-data/products.csv
 *   node tools/generate-products.js 500 sample-data/products.csv 7
 */
const fs = require('fs');
const path = require('path');

const rowCount = parseInt(process.argv[2], 10) || 200;
const outputPath = process.argv[3] || 'sample-data/products.csv';
const seed = parseInt(process.argv[4], 10) || 42;

const categories = {
  Outdoor: ['Backpack', 'Tent', 'Sleeping Bag', 'Trekking Poles', 'Duffel', 'Cooler', 'Hammock', 'Headlamp'],
  Electronics: ['Wireless Earbuds', 'Smartwatch Band', 'Bluetooth Speaker', 'Power Bank', 'USB-C Cable', 'Webcam', 'Keyboard', 'Mouse'],
  Home: ['Cutting Board', 'Mug Set', 'Desk Lamp', 'Throw Blanket', 'Candle', 'Storage Bin', 'Picture Frame', 'Rug'],
  Fitness: ['Yoga Mat', 'Resistance Bands', 'Foam Roller', 'Jump Rope', 'Dumbbell Set', 'Water Bottle', 'Gym Bag', 'Fitness Tracker'],
  Accessories: ['Sunglasses', 'Wallet', 'Belt', 'Scarf', 'Hat', 'Watch', 'Tote Bag', 'Phone Case'],
  Footwear: ['Running Shoes', 'Hiking Boots', 'Sandals', 'Sneakers', 'Slippers', 'Cleats', 'Loafers', 'Rain Boots'],
};
const adjectives = ['Aurora', 'Nimbus', 'Cedarwood', 'Flexfit', 'Solstice', 'Pulse', 'Terra', 'Voyager', 'Lumen', 'Cascade', 'Ember', 'Drift', 'Alpine', 'Coral', 'Vortex', 'Meridian', 'Halcyon', 'Zenith', 'Onyx', 'Marina', 'Boreal', 'Quartz', 'Fable', 'Granite', 'Willow'];
const colors = ['Charcoal', 'White', 'Natural', 'Teal', 'Black', 'Blue', 'Sand', 'Olive', 'Silver', 'Red', 'Green', 'Navy', 'Beige', 'Maroon', 'Gray'];
const currency = 'USD';

function seededRandom(initialSeed) {
  let s = initialSeed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seededRandom(seed);
function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }

const catKeys = Object.keys(categories);
const rows = [];
const skuCounters = {};

for (let i = 1; i <= rowCount; i += 1) {
  const category = pick(catKeys);
  const noun = pick(categories[category]);
  const adjective = pick(adjectives);
  const name = `${adjective} ${noun}`;
  const price = (5 + rand() * 195).toFixed(2);
  const stock = Math.floor(rand() * 400);
  const catAbbr = category.slice(0, 3).toUpperCase();
  skuCounters[category] = (skuCounters[category] || 0) + 1;
  const sku = `SKU-${catAbbr}-${String(skuCounters[category]).padStart(3, '0')}`;
  const color = pick(colors);
  const rating = (3.5 + rand() * 1.5).toFixed(1);
  const inStock = stock > 0 ? 'true' : 'false';
  const productId = `PRD-${String(i).padStart(4, '0')}`;
  const productPath = `/products/product-detail/${sku.toLowerCase()}`;
  const imageUrl = `https://picsum.photos/seed/${sku.toLowerCase()}/640/480`;
  rows.push([productId, name, category, price, currency, stock, sku, color, rating, inStock, productPath, imageUrl].join(','));
}

const header = 'product_id,name,category,price,currency,stock_quantity,sku,color,rating,in_stock,path,image_url';
const csv = `${header}\n${rows.join('\n')}\n`;

const resolvedOutputPath = path.resolve(process.cwd(), outputPath);
fs.mkdirSync(path.dirname(resolvedOutputPath), { recursive: true });
fs.writeFileSync(resolvedOutputPath, csv);
console.log(`Wrote ${rowCount} rows to ${resolvedOutputPath}`);
