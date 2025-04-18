"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = isNumber;
exports.isProduct = isProduct;
exports.isCategory = isCategory;
function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}
function isProduct(product) {
    return (product &&
        typeof product.id === 'number' &&
        typeof product.name === 'string' &&
        typeof product.description === 'string' &&
        typeof product.price === 'number' &&
        typeof product.categoryId === 'number' &&
        (product.status === 'AVAILABLE' || product.status === 'UNAVAILABLE'));
}
function isCategory(category) {
    return (category &&
        typeof category.id === 'number' &&
        typeof category.name === 'string' &&
        typeof category.description === 'string' &&
        (category.status === 'AVAILABLE' || category.status === 'UNAVAILABLE'));
}
