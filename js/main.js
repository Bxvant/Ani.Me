'use strict';
const animeContainer = document.querySelector('.anime-container');
const detailView = document.querySelector('.detail-view');
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
  }
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
  const img = document.createElement('img');
  img.src = anime.images.jpg.image_url;
  img.alt = anime.title;
  // Clear existing children in imageElement and append new image
  while (imageElement.firstChild) {
    imageElement.removeChild(imageElement.firstChild);
  }
  imageElement.appendChild(img);
  // Update rating
  ratingElement.textContent = `Rating: ${anime.rating ?? 'N/A'}`;
  // Show detail view and hide anime container
  animeContainer.classList.add('hidden');
  detailView.classList.remove('hidden');
}
// starts the page
async function init() {
  const animeList = await fetchAnime();
  animeList.forEach((anime) => {
    animeContainer.appendChild(renderAnime(anime));
  });
  // Event delegation
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
}
init();
