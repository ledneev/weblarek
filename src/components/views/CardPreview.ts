import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";

const categoryMap: Record<string, string> = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};

/**
 * @interface ICardPreviewData
 * @interface
 * @description Интерфейс данных, используемых для отображения предпросмотра товара.
 * Включает все детали, необходимые для полного представления товара.
 */
interface ICardPreviewData {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  price: number | null; // Цена товара (может отсутствовать).
}

/**
 * @class CardPreview
 * @extends Card<ICardPreviewData>
 * @classdesc Карточка товара, предназначенная для отображения полного предпросмотра.
 * Включает изображение, категорию, название, описание, цену и кнопку покупки.
 * Использует ту же логику стилизации категорий, что и CardCatalog.
 */

export class CardPreview extends Card<ICardPreviewData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected button: HTMLButtonElement;

  /**
   * @constructor
   * @param {IEvents} events - Обработчик событий.
   * @param {HTMLElement} container - Корневой элемент карточки предпросмотра.
   */

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container
    );
    this.button = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );

    this.button.addEventListener("click", () => {
      // Эмитим событие 'product:buy', передавая ID товара из data-атрибута контейнера.
      this.events.emit("product:buy", { id: this.container.dataset.id });
    });
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.title);
  }

  /**
   * Устанавливает категорию товара и соответствующий CSS-класс для стилизации.
   * Использует ту же логику, что и в CardCatalog.
   * @param {string} value - Название категории товара.
   */
  
  set category(value: string) {
    this.categoryElement.textContent = value;
    for (const key in categoryMap) {
      const shouldHaveClass = key === value;
      this.categoryElement.classList.toggle(
        categoryMap[key as keyof typeof categoryMap],
        shouldHaveClass
      );
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }
}