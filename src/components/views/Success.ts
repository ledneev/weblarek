import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/**
 * @interface ISuccessData
 * @interface
 * @description Интерфейс данных, используемых для отображения сообщения об успешной операции.
 */

interface ISuccessData {
  total: number;
}

/**
 * @class Success
 * @extends Component<ISuccessData>
 * @classdesc Компонент, отображающий сообщение об успешном выполнении операции (например, успешная покупка).
 * Показывает общую сумму и содержит кнопку для закрытия сообщения.
 *
 * @emits 'success:close' при клике на кнопку закрытия.
 */

export class Success extends Component<ISuccessData> {
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  /**
   * @constructor
   * @param {IEvents} events - Обработчик событий приложения.
   * @param {HTMLElement} container - Корневой DOM-элемент компонента сообщения об успехе.
   */

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.closeButton.addEventListener('click', () => {
      // Эмитим событие 'success: close', сигнализируя о том, что сообщение нужно закрыть.
      this.events.emit('success: close'); // Внимание: возможная опечатка в имени события ('success:close' было бы более типично)
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}