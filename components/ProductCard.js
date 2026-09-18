export default function ProductCard({ name, description, price }) {
  return (
    <div className="productCard">
      <div className="productCard-icon" aria-hidden="true">
        ▶
      </div>
      <div className="productCard-info">
        <div className="productCard-name">{name}</div>
        <div className="productCard-description">{description}</div>
      </div>
      <div className="productCard-price">{price}</div>
    </div>
  );
}
