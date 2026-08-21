export default function decorate(block) {
  const [identityRow, specRow, skuRow] = [...block.children];

  const [, categoryCell] = identityRow ? identityRow.children : [];
  if (categoryCell) categoryCell.classList.add('product-details-category');

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
    priceCell.classList.add('product-details-price');
  }

  if (colorCell) colorCell.classList.add('product-details-color');

  if (ratingCell) {
    const rating = parseFloat(ratingCell.textContent);
    if (!Number.isNaN(rating)) {
      const fullStars = Math.round(rating);
      ratingCell.textContent = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
      ratingCell.title = `${rating} / 5`;
    }
    ratingCell.classList.add('product-details-rating');
  }

  if (stockCell) {
    const quantity = parseInt(stockCell.textContent, 10) || 0;
    stockCell.textContent = quantity > 0 ? `${quantity} in stock` : 'Out of stock';
    stockCell.classList.add('product-details-stock', quantity > 0 ? 'in-stock' : 'out-of-stock');
  }

  const [skuCell] = skuRow ? skuRow.children : [];
  if (skuCell) skuCell.classList.add('product-details-sku');
}
