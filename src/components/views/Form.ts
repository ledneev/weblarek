import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/**
 * @abstract
 * @class Form
 * @extends Component<T>
 * @template T Тип данных, представляющий состояние или модель формы.
 * @classdesc Абстрактный базовый класс для всех форм в приложении.
 * Предоставляет общую логику для обработки отправки формы, валидации ввода
 * и отображения ошибок.
 */

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLElement;

  /**
   * @constructor
   * @param {IEvents} events - Обработчик событий приложения.
   * @param {HTMLElement} container - Корневой DOM-элемент формы.
   */

  constructor(
    protected events: IEvents,
    container: HTMLElement
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorsContainer = ensureElement<HTMLElement>('.form__errors', this.container);
    this.container.addEventListener('submit', (event: SubmitEvent) => {
      event.preventDefault();
      // Эмитим событие 'form:submit', передавая имя класса формы.
      this.events.emit('form:submit', {
        form: this.constructor.name
      });
    });

    this.container.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target && target.name) {
        // Эмитим событие 'form:input', передавая имя поля, его значение и имя класса формы.
        this.events.emit('form:input', {
          field: target.name,
          value: target.value,
          form: this.constructor.name
        });
      }
    });
  }

  /**
   * Управляет состоянием кнопки отправки (активна/неактивна).
   * @param {boolean} value - true, если форма валидна и кнопку можно нажать; false, если форма невалидна.
   */

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  /**
   * Устанавливает сообщения об ошибках валидации, отображая их в соответствующем контейнере.
   * @param {string[]} errors - Массив строк с сообщениями об ошибках.
   */
  
  set errors(errors: string[]) {
    this.errorsContainer.textContent = errors.join(', ');
  }
}