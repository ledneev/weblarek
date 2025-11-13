import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";

const categoryMap = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button', 
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};

interface ICardCatalogData {
  image: string;
  category: string;
  title: string;
  price?: number | null;
}

/**
 * Карточка товара для каталога
 * Отображает товар в виде кликабельной карточки
 */

export class CardCatalog extends Card<ICardCatalogData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);
    
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.button = ensureElement<HTMLButtonElement>('.gallery__item', this.container);

    this.button.addEventListener('click', () => {
      this.events.emit('card:select', { id: this.container.dataset.id });
    });
  }

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

  set image(value: string) {
    this.setImage(this.imageElement, value, this.title);
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }
}