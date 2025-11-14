import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";

/**
 * @interface ICardBasketData
 * @interface
 * @description Интерфейс данных, используемых для отображения карточки товара в корзине.
 */

interface ICardBasketData {
  title: string;
  price: number | null;
  index: number;
}

/**
 * @class CardBasket
 * @extends Card<ICardBasketData>
 * @classdesc Карточка товара, предназначенная для отображения в корзине.
 * Расширяет базовый класс `Card`, добавляя отображение порядкового номера
 * и кнопку удаления товара.
 */

export class CardBasket extends Card<ICardBasketData> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  /**
   * @constructor
   * @param {IEvents} events - Обработчик событий.
   * @param {HTMLElement} container - Корневой элемент карточки корзины.
   */

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    this.deleteButton.addEventListener('click', () => {
      // Эмитим событие 'product:remove', передавая ID товара из data-атрибута контейнера.
      this.events.emit('product:remove', { id: this.container.dataset.id });
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  /**
   * Устанавливает ID товара, сохраняя его в data-атрибуте контейнера.
   * @param {string} value - ID товара.
   */
  
  set id(value: string) {
    this.container.dataset.id = value;
  }
}