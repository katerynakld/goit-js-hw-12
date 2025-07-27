import { getImageByQuery } from './pixabay-api';
import {
  createGallery,
  clearGallery,
  hideLoader,
  showLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import iconError from '../public/error-icon.svg';
import { refs } from './refs';

let page = 1;
let currentUserInput = '';
let totalPages;

export async function onFormSubmit(event) {
  event.preventDefault();

  showLoader();
  clearGallery();
  hideLoadMoreButton();
  page = 1;
  currentUserInput = '';

  const userInput = event.target.elements[0].value.trim();

  if (userInput === '') {
    displayError('Please, write something');
    return;
  }

  try {
    currentUserInput = userInput;
    const data = await getImageByQuery(userInput, page);

    if (data.hits.length === 0) {
      displayError(
        'Sorry, there are no images matching your search query. Please try again'
      );
      hideLoadMoreButton();
    }

    totalPages = Math.ceil(data.totalHits / 15); //Calculating total pages for this search
    createGallery(data.hits);
    hideLoader();

    //Checking if we still have search results to decide wheter to show the "load more" button
    if (page !== totalPages) {
      showLoadMoreButton();
    } else if (page === totalPages) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'bottomRight',
      });
      hideLoadMoreButton();
    }
  } catch (error) {
    hideLoader();
    displayError(error.message);
  }
}

export async function onLoadMoreBtnClick() {
  page += 1;
  let galleryItemSize =
    refs.galleryEl.firstElementChild.getBoundingClientRect();

  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImageByQuery(currentUserInput, page);
    refs.loadMoreBtnEl.insertAdjacentElement('afterend', refs.loaderEl);
    createGallery(data.hits);
    window.scrollBy({
      top: galleryItemSize.height * 2,
      behavior: 'smooth',
    });

    totalPages = Math.ceil(data.totalHits / 15);
    // To finish the fetching process if we maxed out the number of pages
    if (page !== totalPages) {
      showLoadMoreButton();
    } else if (page === totalPages) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'bottomRight',
      });
      hideLoadMoreButton();
    }

    hideLoader();
    showLoadMoreButton();
  } catch (error) {
    hideLoader();
    displayError(error.message);
  }
}

export function displayError(message) {
  iziToast.error({
    message: `There's been an error: ${message}`,
    position: 'topRight',
    backgroundColor: '#ef4040',
    messageColor: '#ffffff',
    iconUrl: iconError,
    iconColor: '#ffffff',
  });
}
