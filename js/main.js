'use strict';
const animeContainer = document.querySelector('.anime-container');
const detailView = document.querySelector('.detail-view');
const favoritesContainer = document.querySelector('.favorites-container');
const favoritesLink = document.querySelector('.favorite-page-title');
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
// Fetch and render anime data
async function fetchAnime() {
  try {
    const response = await fetch('https://api.jikan.moe/v4/top/anime');
    if (!response.ok) throw new Error('Fetch for top anime failed!');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching anime data:', error);
    return [];
  } // will change to type void so it doesnt need a return.
}
// Renders the anime cards
function renderAnime(anime) {
  const animeDiv = document.createElement('div');
  animeDiv.classList.add('animes');
  animeDiv.dataset.id = anime.mal_id.toString(); // Add data attribute for identification
  const imageDiv = document.createElement('div');
  imageDiv.classList.add('image-container');
  const img = document.createElement('img');
  img.src = anime.images.jpg.image_url;
  img.alt = anime.title;
  imageDiv.appendChild(img);
  const textDiv = document.createElement('div');
  textDiv.classList.add('text-container');
  const title = document.createElement('h2');
  title.textContent = anime.title;
  const episodes = document.createElement('p');
  episodes.textContent = `Episodes: ${anime.episodes ?? 'N/A'}`;
  textDiv.appendChild(title);
  textDiv.appendChild(episodes);
  animeDiv.appendChild(imageDiv);
  animeDiv.appendChild(textDiv);
  return animeDiv;
}
// Creates a star button with SVG icon
function createStarButton(isFavorite) {
  const starButton = document.createElement('button');
  starButton.classList.add('favorite-button');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('stroke', 'black');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    'M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z',
  );
  path.setAttribute('fill', isFavorite ? 'yellow' : 'none');
  svg.appendChild(path);
  starButton.appendChild(svg);
  return starButton;
}
// Update the favorites list in localStorage
function updateFavorites(anime) {
  if (favorites.some((fav) => fav.mal_id === anime.mal_id)) {
    favorites = favorites.filter((fav) => fav.mal_id !== anime.mal_id);
  } else {
    favorites.push(anime);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
}
// Swap to the detail view
function swapView(anime) {
  const titleElement = detailView.querySelector('.detail-title h1');
  const synopsisElement = detailView.querySelector('.detail-summary p');
  const imageElement = detailView.querySelector('.detail-image');
  const ratingElement = detailView.querySelector('.detail-rating h2');
  // Update title
  titleElement.textContent = anime.title;
  // Update synopsis
  synopsisElement.textContent = anime.synopsis;
  // Update image
  imageElement.innerHTML = ''; // Clear existing image
  const img = document.createElement('img');
  img.src = anime.images.jpg.image_url;
  img.alt = anime.title;
  imageElement.appendChild(img);
  // Update rating
  ratingElement.textContent = `Rating: ${anime.rating ?? 'N/A'}`;
  // Add or Remove from Favorites button
  const isFavorite = favorites.some((fav) => fav.mal_id === anime.mal_id);
  const starButton = createStarButton(isFavorite);
  starButton.addEventListener('click', () => {
    updateFavorites(anime);
    const isFavoriteNow = favorites.some((fav) => fav.mal_id === anime.mal_id);
    starButton
      .querySelector('path')
      .setAttribute('fill', isFavoriteNow ? 'yellow' : 'none');
  });
  // Append the star button
  const detailRight = detailView.querySelector('.detail-right');
  detailRight.appendChild(starButton);
  // Show detail view and hide anime container
  animeContainer.classList.add('hidden');
  detailView.classList.remove('hidden');
}
// Render the anime list or favorites list
function renderList(animeList, container) {
  container.innerHTML = ''; // Clear existing content
  animeList.forEach((anime) => {
    container.appendChild(renderAnime(anime));
  });
}
// Render favorites list
function renderFavorites() {
  renderList(favorites, favoritesContainer);
}
// Initialize the app
async function init() {
  const animeList = await fetchAnime();
  renderList(animeList, animeContainer);
  // Event delegation for animeContainer
  animeContainer.addEventListener('click', (event) => {
    const target = event.target;
    const animeDiv = target.closest('.animes');
    if (animeDiv) {
      const animeId = animeDiv.dataset.id;
      const selectedAnime = animeList.find(
        (a) => a.mal_id.toString() === animeId,
      );
      if (selectedAnime) {
        swapView(selectedAnime);
      }
    }
  });
  // Event for favorites link
  favoritesLink.addEventListener('click', () => {
    animeContainer.classList.add('hidden');
    detailView.classList.add('hidden');
    favoritesContainer.classList.remove('hidden');
    renderFavorites();
  });
  // Event for back to main page
  document.querySelector('.home-page')?.addEventListener('click', () => {
    favoritesContainer.classList.add('hidden');
    detailView.classList.add('hidden');
    animeContainer.classList.remove('hidden');
  });
}
init();
