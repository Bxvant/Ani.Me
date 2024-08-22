interface Anime {
  mal_id: number;
  title: string;
  synopsis: string;
  episodes: number;
  images: {
    jpg: {
      image_url: string;
    };
  };
  rating: string;
}

const animeContainer = document.querySelector(
  '.anime-container',
) as HTMLDivElement;

async function fetchAnime(): Promise<void> {
  try {
    const response = await fetch('https://api.jikan.moe/v4/top/anime');
    if (!response.ok) throw new Error('Fetch for top anime failed!');
    const data = await response.json();

    data.data.forEach((anime: Anime) => {
      animeContainer.appendChild(renderAnime(anime));
    });
  } catch (error) {
    console.error('Error fetching anime data:', error);
  }
}

// REnders the anime cards
function renderAnime(anime: Anime): HTMLDivElement {
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
function swapView(anime: Anime): void {
  const detailView = document.querySelector('.detail-view') as HTMLDivElement;
  const titleElement = detailView.querySelector(
    '.detail-title h1',
  ) as HTMLHeadingElement;
  const synopsisElement = detailView.querySelector(
    '.detail-summary p',
  ) as HTMLParagraphElement;
  const imageElement = detailView.querySelector(
    '.detail-image',
  ) as HTMLDivElement;
  const ratingElement = detailView.querySelector(
    '.detail-rating h2',
  ) as HTMLHeadingElement;

  titleElement.textContent = anime.title;
  synopsisElement.textContent = anime.synopsis;
  imageElement.innerHTML = `<img src="${anime.images.jpg.image_url}" alt="${anime.title}">`;
  ratingElement.textContent = `Rating: ${anime.rating ?? 'N/A'}`;

  // Hide the anime container and show the detail view
  document.querySelector('.anime-container')?.classList.add('hidden');
  detailView.classList.remove('hidden');
}

// Start the process of fetching and rendering anime data
fetchAnime();
