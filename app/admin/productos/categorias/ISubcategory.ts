import ICategory from "./ICategory";

export default interface ISubcategory {
  _id: string;
  name: string;
  category: ICategory;
  type: string
}