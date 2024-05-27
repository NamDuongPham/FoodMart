import "aos/dist/aos.css";
import ProductItem from "./ProductItem";
interface DataType {
  key: React.Key;
  foodName: string;
  foodDescription: string;
  foodImage: string;
  foodIngredient: string;
  foodPrice: string;
  discount:number;
  categoryId: string;
  typeOfDishId: string;
  bestSeller: boolean;
  trending: boolean;
  inStock: boolean;
}
function ProductList({ product }: { product: DataType[] }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const productChunks = product.reduce<DataType[][]>(
    (resultArray, item, index) => {
      const chunkIndex = Math.floor(index / 4);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // Start a new chunk
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    },
    []
  );
  return (
    <>
      {productChunks.map((chunk, index) => (
        <div key={index} className="grid grid-cols-4 gap-10 mb-10">
          {chunk.map((item) => (
            <ProductItem key={item.key} product={item} />
          ))}
        </div>
      ))}
    </>
  );
}

export default ProductList;
