import { refs } from './refs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let gallery = '';
let galleryLightBox;

export function createGallery(images) {
  for (const image of images) {
    gallery += `<li class="gallery-item"><a href="${image.largeImageURL}" class="gallery-link">
            <img
              src="${image.webformatURL}"
              alt="${image.tags}"
              class="gallery-image"
              
            />
          </a>
          <ul class="image-stats-list">
            <li class="image-stats-item">
              <p class="image-stats-title">Likes</p>
              <p class="image-stats">${image.likes}</p>
            </li>
            <li class="image-stats-item">
              <p class="image-stats-title">Views</p>
              <p class="image-stats">${image.views}</p>
            </li>
            <li class="image-stats-item">
              <p class="image-stats-title">Comments</p>
              <p class="image-stats">${image.comments}</p>
            </li>
            <li class="image-stats-item">
              <p class="image-stats-title">Downloads</p>
              <p class="image-stats">${image.downloads}</p>
            </li>
          </ul>
          </li>`;
  }

  hideLoader();
  refs.galleryEl.insertAdjacentHTML('beforeend', gallery);

  if (!galleryLightBox) {
    galleryLightBox = new SimpleLightbox('.gallery a', {
      animationSpeed: 300,
      fadeSpeed: 250,
      captions: true,
      captionDelay: 250,
      captionType: 'attr',
      captionsData: 'alt',
      captionPosition: 'bottom',
      showCounter: true,
      scrollZoom: true,
    });
  } else {
    galleryLightBox.refresh();
  }
}

export function clearGallery() {
  gallery = [];
  refs.galleryEl.innerHTML = '';
}

export function showLoader() {
  if (refs.loaderEl.classList.contains('visually-hidden')) {
    refs.loaderEl.classList.remove('visually-hidden');
  }
}

export function hideLoader() {
  if (!refs.loaderEl.classList.contains('visually-hidden')) {
    refs.loaderEl.classList.add('visually-hidden');
  }
}
