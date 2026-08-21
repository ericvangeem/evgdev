export default function decorate(block) {
  const [imageRow, identityRow, specRow, skuRow] = [...block.children];

  block.classList.add('product-details-card');

  const [imageCell] = imageRow ? imageRow.children : [];
  if (imageCell) imageCell.classList.add('product-details-image');

  const [titleCell, categoryCell] = identityRow ? identityRow.children : [];
  if (titleCell) titleCell.classList.add('product-details-title');
  if (categoryCell) {
    categoryCell.textContent = categoryCell.textContent.trim();
    categoryCell.classList.add('product-details-category');
  }

  const [priceCell, colorCell, ratingCell, stockCell] = specRow ? specRow.children : [];

  if (priceCell) {
    const [amount, currency] = priceCell.textContent.trim().split(/\s+/);
    const price = parseFloat(amount);
    if (!Number.isNaN(price)) {
      priceCell.textContent = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
      }).format(price);
    }
    priceCell.classList.add('product-details-stat', 'product-details-price');
  }

  if (colorCell) {
    const color = colorCell.textContent.trim();
    colorCell.innerHTML = `<span class="product-details-label">Color</span><span class="product-details-value">${color}</span>`;
    colorCell.classList.add('product-details-stat', 'product-details-color');
  }

  if (ratingCell) {
    const rating = parseFloat(ratingCell.textContent);
    if (!Number.isNaN(rating)) {
      const fullStars = Math.round(rating);
      const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
      ratingCell.innerHTML = `<span class="product-details-stars">${stars}</span><span class="product-details-value">${rating}</span>`;
    }
    ratingCell.classList.add('product-details-stat', 'product-details-rating');
  }

  if (stockCell) {
    const quantity = parseInt(stockCell.textContent, 10) || 0;
    const inStock = quantity > 0;
    stockCell.innerHTML = `<span class="product-details-stock-dot"></span>${inStock ? `${quantity} in stock` : 'Out of stock'}`;
    stockCell.classList.add('product-details-stat', 'product-details-stock', inStock ? 'in-stock' : 'out-of-stock');
  }

  const [skuCell] = skuRow ? skuRow.children : [];
  if (skuCell) {
    const sku = skuCell.textContent.trim();
    skuCell.innerHTML = `<span class="product-details-label">SKU</span><span class="product-details-value">${sku}</span>`;
    skuCell.classList.add('product-details-sku');
  }
}
