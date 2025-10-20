import './scss/styles.scss';
import { ProductsModel } from './components/models/ProductsModel';
import { CartModel } from './components/models/CartModel';
import {BuyerModel} from './components/models/BuyerModel'
import { apiProducts } from './utils/data';

const productsModel = new ProductsModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();

// Проверка каталога
productsModel.setItems(apiProducts.items);

console.log('Массив товаров из каталога:', productsModel.getItems());
console.log('Количество товаров:', productsModel.getItems().length);

const testProduct = productsModel.getProductById(apiProducts.items[0].id);
console.log('Товар по ID:', testProduct);

productsModel.setSelectedItem(apiProducts.items[0]);
console.log('Выбранный товар:', productsModel.getSelectedItem());

//Проверка корзины 
const products = productsModel.getItems();
if (products.length > 0) {
  cartModel.addItem(products[0]);
  cartModel.addItem(products[1]);
}

console.log('Товары в корзине:', cartModel.getItems());
console.log('Количество товаров в корзине:', cartModel.getTotalCount());
console.log('Общая стоимость корзины:', cartModel.getTotalPrice());
console.log('Товар 1 в корзине?', cartModel.contains(products[0].id));

cartModel.removeItem(products[0].id);
console.log('После удаления - товары:', cartModel.getItems());
console.log('После удаления - количество:', cartModel.getTotalCount());

//Проверка покупателя
buyerModel.setData({ email: 'test@mail.ru' });
console.log('После email:', buyerModel.getData());

buyerModel.setData({ payment: 'card' });
console.log('После оплаты:', buyerModel.getData());

// Тестируем валидацию
console.log('Ошибки (частично заполнено):', buyerModel.validate());

buyerModel.setData({ address: 'Нижний Новгород', phone: '+79991234567' });
console.log('Ошибки (все заполнено):', buyerModel.validate());

// Тестируем очистку
buyerModel.clear();
console.log('После очистки:', buyerModel.getData());
