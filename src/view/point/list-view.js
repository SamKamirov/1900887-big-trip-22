import AbstractView from "../../framework/view/abstract-view";


const createListTemplate = () => {
  return '<ul class="trip-events__list"></ul>'
};

export class ListView extends AbstractView {
  get template() {
    return createListTemplate();
  }
}
