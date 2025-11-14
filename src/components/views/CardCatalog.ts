import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";

// Карта соответствия названий категорий CSS-классам для стилизации.
// Ключи: названия категорий, Значения: соответствующие CSS-классы.
const categoryMap: Record<string, string> = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};

/**
 * @interface ICardCatalogData
 * @interface
 * @description Интерфейс данных, используемых для отображения карточки товара в каталоге.
 */

interface ICardCatalogData {
  image: string;
  category: string;
  title: string;
  price: number | null; // Цена товара (может отсутствовать).
}

/**
 * @class CardCatalog
 * @extends Card<ICardCatalogData>
 * @classdesc Карточка товара, предназначенная для отображения в каталоге.
 * Отображает изображение, категорию, название и цену товара.
 * Имеет кликабельную область для выбора товара.
 */

export class CardCatalog extends Card<ICardCatalogData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected button: HTMLButtonElement;

  /**
   * @constructor
   * @param {IEvents} events - Обработчик событий.
   * @param {HTMLElement} container - Корневой элемент карточки каталога.
   */

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.button = ensureElement<HTMLButtonElement>('.gallery__item', this.container);
    this.button.addEventListener('click', () => {
      // Эмитим событие 'card:select', передавая ID товара из data-атрибута контейнера.
      this.events.emit('card:select', { id: this.container.dataset.id });
    });
  }

  /**
   * Устанавливает категорию товара и соответствующий CSS-класс для стилизации.
   * @param {string} value - Название категории товара.
   */
  set category(value: string) {
    this.categoryElement.textContent = value;

    // Переключаем CSS-классы на элементе категории.
    // Удаляем все классы из categoryMap и добавляем только тот, который соответствует текущей категории.
    for (const key in categoryMap) {
      const shouldHaveClass = key === value;
      this.categoryElement.classList.toggle(
        categoryMap[key as keyof typeof categoryMap],
        shouldHaveClass
      );
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.title);
  }

  /**
   * Устанавливает ID товара, сохраняя его в data-атрибуте контейнера.
   * @param {string} value - ID товара.
   */
  
  set id(value: string) {
    this.container.dataset.id = value;
  }
}