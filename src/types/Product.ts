export interface Product {
  key: React.Key;
  foodName: string;
  foodDescription: string;
  foodImage: string;
  foodIngredient: string;
  foodPrice: string;
  discount: number;
  categoryId: string;
  typeOfDishId: string;
  bestSeller: boolean;
  trending: boolean;
  inStock: boolean;
  foodQuantity?:number,
  startAt?:number
  endAt?:number
  like?: boolean;
 
}
