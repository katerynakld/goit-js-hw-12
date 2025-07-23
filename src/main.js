import { refs } from './js/refs';
import { onFormSubmit, onLoadMoreBtnClick } from './js/handlers';
import { hideLoader, hideLoadMoreButton } from './js/render-functions';

hideLoader();
hideLoadMoreButton();
refs.formEl.addEventListener('submit', onFormSubmit);
refs.loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
