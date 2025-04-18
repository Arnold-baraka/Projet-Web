export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    categoryId: number;
    status: 'AVAILABLE' | 'UNAVAILABLE';
}
  
export interface ProductDTO {
    id: number;
    name: string;
    price: number;
}
  
export interface FullProductDTO extends ProductDTO {
    description: string;
    categoryId: number;
    status: 'AVAILABLE' | 'UNAVAILABLE';

}