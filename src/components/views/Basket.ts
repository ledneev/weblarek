import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/**
 * @interface IBasketData
 * @interface
 * @description Интерфейс данных, представляющий состояние компонента корзины.
 */
interface IBasketData {
  items: HTMLElement[];
  total: number;
}

/**
 * @class Basket
 * @extends Component<IBasketData>
 * @classdesc Компонент, представляющий корзину товаров.
 * Отображает список добавленных товаров, общую стоимость и кнопку для оформления заказа.
 *
 * @emits 'order:start' при клике на кнопку оформления заказа.
 */

export class Basket extends Component<IBasketData> {
  protected listElement: HTMLUListElement;
  protected totalElement: HTMLElement;
  protected button: HTMLButtonElement;

  /**
   * @constructor
   * @param {IEvents} events - Обработчик событий приложения.
   * @param {HTMLElement} container - Корневой DOM-элемент корзины.
   */

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.listElement = ensureElement<HTMLUListElement>(
      ".basket__list",
      this.container
    );
    this.totalElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container
    );
    this.button = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );
    this.button.addEventListener("click", () => {
      // Эмитим событие 'order:start', сигнализируя о начале процесса оформления заказа.
      this.events.emit("order:start");
    });

    this.items = [];
  }

  /**
   * Устанавливает или обновляет список товаров в корзине.
   * Заменяет существующее содержимое списка новыми элементами.
   * @param {HTMLElement[]} elements - Массив DOM-элементов, представляющих товары.
   */

  set items(elements: HTMLElement[]) {
    if (elements.length > 0) {
      // Если элементы есть, показываем стандартный список
      this.listElement.replaceChildren(...elements);
      this.button.disabled = false;
    } else {
      // Если корзина пуста, добавляем специальный элемент
      const emptyMessage = document.createElement("li");
      emptyMessage.classList.add("basket__empty-message");
      emptyMessage.textContent = "Корзина пуста";

      this.listElement.innerHTML = "";
      this.listElement.appendChild(emptyMessage);
      this.button.disabled = true;
    }
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }
}
