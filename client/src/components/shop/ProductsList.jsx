
import ShopProductCard from "./ShopProductCard";

function ProductsList({ products }) {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <ShopProductCard product={product} />
      ))}
    </div>
  );
}

export default ProductsList;
