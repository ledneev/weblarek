import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/**
 * @class Card
 * @extends Component<T>
 * @template T Тип данных, представляющий товар.
 * @classdesc Базовый класс для представления карточки товара.
 */

export class Card<T> extends Component<T> {
  protected _title?: HTMLElement;
  protected _price?: HTMLElement;
  protected _button?: HTMLButtonElement;

  /**
   * @constructor
   * @param {IEvents} events - Обработчик событий.
   * @param {HTMLElement} container - Корневой элемент карточки.
   */

  constructor(
    protected events: IEvents,
    protected container: HTMLElement
  ) {
    super(container);

    this._title = this.container.querySelector('.card__title') || undefined;
    this._price = this.container.querySelector('.card__price') || undefined;
    this._button = this.container.querySelector('button') || undefined;
  }

  set title(value: string) {
    if (this._title) {
      this._title.textContent = value;
    }
  }

  set price(value: number | null) {
    if (this._price) {
      this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
    }
  }
}