import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { ApiService } from "./components/models/ApiService";
import { ProductsModel } from "./components/models/ProductsModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { API_URL } from "./utils/constants";
import { IProductListResponse, TPayment } from "./types";

// Импорты представлений
import {
  Header,
  Gallery,
  Modal,
  Basket,
  CardCatalog,
  CardBasket,
  CardPreview,
  OrderForm,
  ContactsForm,
  Success,
} from "./components/views";

// Утилиты
import { cloneTemplate, ensureElement } from "./utils/utils";

document.addEventListener("DOMContentLoaded", () => {
  // ==================== ИНИЦИАЛИЗАЦИЯ ====================
  const events = new EventEmitter();

  // Модели
  const api = new Api(API_URL);
  const apiService = new ApiService(api, events);
  const productsModel = new ProductsModel(events);
  const cartModel = new CartModel(events);
  const buyerModel = new BuyerModel(events);

  // DOM элементы
  const pageWrapper = ensureElement<HTMLElement>(".page__wrapper");
  const modalContainer = ensureElement<HTMLElement>("#modal-container");

  // Основные компоненты
  const header = new Header(
    events,
    ensureElement<HTMLElement>(".header", pageWrapper)
  );
  const gallery = new Gallery(
    events,
    ensureElement<HTMLElement>(".gallery", pageWrapper)
  );
  const modal = new Modal(events, modalContainer);

  // Шаблоны
  const cardCatalogTemplate =
    ensureElement<HTMLTemplateElement>("#card-catalog");
  const cardPreviewTemplate =
    ensureElement<HTMLTemplateElement>("#card-preview");
  const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
  const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
  const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
  const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
  const successTemplate = ensureElement<HTMLTemplateElement>("#success");

  // Вспомогательные компоненты
  const basket = new Basket(events, cloneTemplate(basketTemplate));
  const orderForm = new OrderForm(events, cloneTemplate(orderTemplate));
  const contactsForm = new ContactsForm(
    events,
    cloneTemplate(contactsTemplate)
  );
  const success = new Success(events, cloneTemplate(successTemplate));

  // ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

  /** Создает карточку товара для каталога */
  const createCatalogCard = (product: any) => {
    const card = new CardCatalog(events, cloneTemplate(cardCatalogTemplate));
    card.id = product.id;
    card.title = product.title;
    card.price = product.price;
    card.image = product.image;
    card.category = product.category;
    return card.render();
  };

  /** Создает карточку товара для корзины */
  const createBasketCard = (item: any, index: number) => {
    const card = new CardBasket(events, cloneTemplate(cardBasketTemplate));
    card.id = item.id;
    card.title = item.title;
    card.price = item.price;
    card.index = index + 1;
    return card.render();
  };

  /** Отправляет заказ на сервер */
  const submitOrder = async () => {
    try {
      const customerData = buyerModel.getData();
      const cartItems = cartModel.getItems();

      const orderData = {
        payment: customerData.payment as TPayment,
        email: customerData.email as string,
        phone: customerData.phone as string,
        address: customerData.address as string,
        total: cartModel.getTotalPrice(),
        items: cartItems.map((item) => item.id),
      };

      console.log("Sending order:", orderData);
      await apiService.submitOrder(orderData);

      // Успешное оформление
      showOrderSuccess(orderData.total);
    } catch (error) {
      console.error("Ошибка оформления заказа:", error);
      contactsForm.errors = ["Ошибка оформления заказа. Попробуйте еще раз."];
    }
  };

  /** Показывает экран успешного заказа */
  const showOrderSuccess = (total: number) => {
    success.total = total;
    modal.content = success.render();

    // Очищаем данные
    cartModel.clear();
    buyerModel.clear();
    resetForms();
  };

  /** Сбрасывает формы к исходному состоянию */
  const resetForms = () => {
    orderForm.payment = "";
    orderForm.address = "";
    orderForm.errors = [];
    contactsForm.email = "";
    contactsForm.phone = "";
    contactsForm.errors = [];
  };

  /** Открывает форму заказа */
  const openOrderForm = () => {
    if (cartModel.getTotalCount() === 0) {
      console.warn("Корзина пустая");
      return;
    }

    modal.content = orderForm.render();
    modal.open();

    const customerData = buyerModel.getData();
    orderForm.payment = customerData.payment || "";
    orderForm.address = customerData.address || "";
  };

  // ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================

  // --- КАТАЛОГ И КАРТОЧКИ ---
  events.on("catalog:changed", () => {
    const products = productsModel.getItems();
    const cards = products.map(createCatalogCard);
    gallery.items = cards;
  });

  events.on("card:select", (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (product) productsModel.setSelectedItem(product);
  });

  events.on("product:selected", () => {
    const product = productsModel.getSelectedItem();
    if (product) {
      const preview = new CardPreview(
        events,
        cloneTemplate(cardPreviewTemplate)
      );
      preview.id = product.id;
      preview.title = product.title;
      preview.price = product.price;
      preview.image = product.image;
      preview.category = product.category;
      preview.description = product.description;

      const inCart = cartModel.contains(product.id);
      const isUnavailable = product.price === null;

      if (isUnavailable) {
        preview.buttonText = "Недоступно";
        preview.disabled = true;
      } else {
        preview.buttonText = inCart ? "Удалить из корзины" : "В корзину";
        preview.disabled = false;
      }

      modal.content = preview.render();
      modal.open();
    }
  });

  // --- КОРЗИНА ---
  events.on("cart:changed", () => {
    header.counter = cartModel.getTotalCount();
    basket.total = cartModel.getTotalPrice();
    const cartItems = cartModel.getItems().map(createBasketCard);
    basket.items = cartItems;
  });

  events.on("product:buy", (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (product && product.price !== null) {
      const inCart = cartModel.contains(data.id);

      if (inCart) {
        cartModel.removeItem(data.id);
      } else {
        cartModel.addItem(product);
      }
      modal.close();
    }
  });

  events.on("product:remove", (data: { id: string }) => {
    cartModel.removeItem(data.id);
  });

  events.on("basket:open", () => {
    modal.content = basket.render();
    modal.open();
  });

  events.on("order:start", openOrderForm);

  // --- ФОРМЫ И ЗАКАЗ ---
  events.on("payment:select", (data: { payment: string }) => {
    buyerModel.setData({ payment: data.payment as TPayment });
    orderForm.payment = data.payment;
  });

  events.on("form:input", (data: { field: string; value: string }) => {
    buyerModel.setData({ [data.field]: data.value });
  });

  events.on("form:submit", (data: { form: string }) => {
    if (data.form === "OrderForm") {
      // Проверяем только поля OrderForm
      const errors = buyerModel.validate();
      const orderErrors = [errors.payment, errors.address].filter(
        Boolean
      ) as string[];

      if (orderErrors.length > 0) {
        orderForm.errors = orderErrors;
        orderForm.valid = false;
      } else {
        // Переходим к ContactsForm
        const customerData = buyerModel.getData();
        contactsForm.email = customerData.email || "";
        contactsForm.phone = customerData.phone || "";
        modal.content = contactsForm.render();
        orderForm.valid = true;
      }
    } else if (data.form === "ContactsForm") {
      // Проверяем все поля
      const errors = buyerModel.validate();
      const allErrors = Object.values(errors).filter(Boolean) as string[];

      if (allErrors.length > 0) {
        contactsForm.errors = allErrors;
        contactsForm.valid = false;
      } else {
        contactsForm.valid = true;
        submitOrder();
      }
    }
  });

  events.on("success:close", () => {
    modal.close();
  });

  events.on("customer:changed", () => {
    const errors = buyerModel.validate();

    // OrderForm валидна если нет ошибок в payment и address
    orderForm.valid = !(errors.payment || errors.address);

    // ContactsForm валидна если нет ошибок вообще
    contactsForm.valid = Object.keys(errors).length === 0;
  });

  // ==================== ЗАГРУЗКА ДАННЫХ ====================
  apiService
    .getProductList()
    .then((response: IProductListResponse) => {
      productsModel.setItems(response.items);
    })
    .catch((error) => {
      console.error("Ошибка загрузки каталога:", error);
    });
});
