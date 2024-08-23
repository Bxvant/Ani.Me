'use strict';
const animeContainer = document.querySelector('.anime-container');
async function fetchAnime() {
  try {
    const response = await fetch('https://api.jikan.moe/v4/top/anime');
    if (!response.ok) throw new Error('Fetch for top anime failed!');
    const data = await response.json();
    // Render and append each anime //
    data.data.forEach((anime) => {
      const animeDiv = renderAnime(anime);
      animeContainer.appendChild(animeDiv);
    });
  } catch (error) {
    console.error('Error fetching anime data:', error);
  }
}
// Renders the anime cards
function renderAnime(anime) {
  const animeDiv = document.createElement('div');
  animeDiv.classList.add('animes');
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
  // Add an event listener to the title to swap views
  title.addEventListener('click', () => {
    swapView(anime);
  });
  animeDiv.appendChild(imageDiv);
  animeDiv.appendChild(textDiv);
  return animeDiv;
}
// SWAPS THE VIEW
function swapView(anime) {
  const detailView = document.querySelector('.detail-view');
  const titleElement = detailView.querySelector('.detail-title h1');
  const synopsisElement = detailView.querySelector('.detail-summary p');
  const imageElement = detailView.querySelector('.detail-image');
  const ratingElement = detailView.querySelector('.detail-rating h2');
  titleElement.textContent = anime.title;
  synopsisElement.textContent = anime.synopsis;
  imageElement.innerHTML = `<img src="${anime.images.jpg.image_url}" alt="${anime.title}">`;
  ratingElement.textContent = `Rating: ${anime.rating ?? 'N/A'}`;
  // shows detail view, removes anime container view
  document.querySelector('.anime-container')?.classList.add('hidden');
  detailView.classList.remove('hidden');
}
// Start rendering anime data
fetchAnime();
