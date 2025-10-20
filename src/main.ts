import './scss/styles.scss';
import { ProductsModel } from './components/models/ProductsModel';
import { apiProducts } from './utils/data';

const productsModel = new ProductsModel();

productsModel.setItems(apiProducts.items);

console.log('Массив товаров из каталога:', productsModel.getItems());
console.log('Количество товаров:', productsModel.getItems().length);

const testProduct = productsModel.getProductById(apiProducts.items[0].id);
console.log('Товар по ID:', testProduct);

productsModel.setSelectedItem(apiProducts.items[0]);
console.log('Выбранный товар:', productsModel.getSelectedItem());
