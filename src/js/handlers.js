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

  //Resetting
  clearGallery();
  hideLoadMoreButton();
  showLoader();
  page = 1;
  currentUserInput = '';

  //Getting the hold of user input
  const userInput = event.target.elements[0].value.trim();

  //Checking if user input is valid
  if (!userInput) {
    displayError('Please, write something');
    hideLoader();
    return;
  }

  //Fetching data from API
  try {
    currentUserInput = userInput;
    const data = await getImageByQuery(userInput, page);

    //This part is needed cause otherwise the empty search is not recognised as an error
    if (!data.hits || data.hits.length === 0) {
      throw new Error('No images found');
    }

    totalPages = Math.ceil(data.totalHits / 15); //Calculating total pages for this search
    showLoader();
    createGallery(data.hits);
    hideLoader();
    page += 1;

    //Checking if we still have search results to decide wheter to show the "load more" button
    if (page > 1 && page !== totalPages) {
      showLoadMoreButton();
    } else if (page === totalPages) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'bottomRight',
      });
    }
  } catch (error) {
    hideLoader();
    displayError(error.message);
  }
}

export async function onLoadMoreBtnClick() {
  showLoader();
  let galleryItemSize =
    refs.galleryEl.firstElementChild.getBoundingClientRect();

  try {
    const data = await getImageByQuery(currentUserInput, page);
    refs.loadMoreBtnEl.insertAdjacentElement('afterend', refs.loaderEl);
    createGallery(data.hits);

    window.scrollBy({
      top: galleryItemSize.height * 2,
      behavior: 'smooth',
    });

    hideLoader();
    page += 1;
    // To finish the fetching process if we maxed out the number of pages
    if (page >= totalPages) {
      hideLoader();
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'bottomRight',
      });
    }

    //This part is needed cause otherwise the empty search result is not recognised as an error
    if (!data.hits || data.hits.length === 0) {
      throw new Error('No images found');
    }
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
