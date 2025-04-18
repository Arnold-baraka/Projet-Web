export interface Category {
    id: number;
    name: string;
    description: string;
    status: 'AVAILABLE' | 'UNAVAILABLE';
}
  
export interface CategoryDTO {
    id: number;
    name: string;
}
  
export interface FullCategoryDTO extends CategoryDTO {
    description: string;
    status: 'AVAILABLE' | 'UNAVAILABLE';

}