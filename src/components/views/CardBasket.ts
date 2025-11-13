import { ensureElement } from "../../utils/utils";
import { Card } from "./Card"; 
import { IEvents } from "../base/Events";

interface ICardBasketData {
  title: string;
  price: number | null;
  index: number;
}

export class CardBasket extends Card<ICardBasketData> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);
    
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', () => {
      this.events.emit('product:remove', { id: this.container.dataset.id });
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }
}