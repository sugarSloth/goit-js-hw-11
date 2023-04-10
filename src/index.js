import Fetch from './js/fetchData.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio.js';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const fetchImages = new Fetch();
const gallery = new SimpleLightbox('.gallery a');

let query = '';

formEl.addEventListener('submit', formSubmitHandler);
loadMoreBtnEl.addEventListener('click', loadMoreHandler);

async function formSubmitHandler(event) {
  event.preventDefault();
  galleryEl.innerHTML = '';
  loadMoreBtnEl.classList.add('is-hidden');
  fetchImages.pageRestart();
  query = formEl.elements.searchQuery.value.trim();

  if (!query) {
    Notify.failure('Please, write your search query!');
    return;
  }

  try {
    const { hits, totalHits } = await fetchImages.getImages(query);

    if (!hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    makeImagesMarkup(hits);
    Notify.info(`Hooray! We found ${totalHits} images!`);

    if (totalHits > hits.length) {
      loadMoreBtnEl.classList.remove('is-hidden');
    }

    gallery.refresh();
    fetchImages.pageIncrement();
  } catch (error) {
    Notify.failure('Oops! Something went wrong. Try again later.');
    console.error(error);
  }
}

async function loadMoreHandler() {
  try {
    const { hits, totalHits } = await fetchImages.getImages(query);

    makeImagesMarkup(hits);
    gallery.refresh();
    fetchImages.pageIncrement();

    if (galleryEl.childElementCount >= totalHits) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    Notify.failure('Oops! Something went wrong. Try again later.');
    console.error(error);
  }
}

function makeImagesMarkup(data) {
  const innerMarkup = data
    .map(
      ({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => `
      <div class="photo-card">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes</b> ${likes}</p>
          <p class="info-item"><b>Views</b> ${views}</p>
          <p class="info-item"><b>Comments</b> ${comments}</p>
          <p class="info-item"><b>Downloads</b> ${downloads}</p>
        </div>
      </div>`
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', innerMarkup);
}
