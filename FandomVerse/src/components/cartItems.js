
export function parsePrice(priceString) {
  const n = Number(String(priceString).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function toCartItem(merchandise) {
  return {
    id: merchandise.id,
    name: merchandise.title,
    price: parsePrice(merchandise.price),
    image: merchandise.imageUrl,
  };
}