import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IGallery{
  items: HTMLElement[];
}

/**
 * Компонент галереи товаров
 * Отображает каталог товаров в виде сетки карточек
 * 
 * @property items - массив DOM-элементов карточек для отображения
 */

export class Gallery extends Component<IGallery>{
  protected catalogElement: HTMLElement;


  constructor(protected events: IEvents, container: HTMLElement){
    super(container);

    this.catalogElement = ensureElement<HTMLElement>('.gallery', this.container)

  }

  set items(elements: HTMLElement[]){
    this.catalogElement.innerHTML = '';
    elements.forEach(element => {
      this.catalogElement.appendChild(element);
    });
  }
}