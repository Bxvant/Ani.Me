interface Anime {
  mal_id: number;
  title: string;
  episodes: number;
  images: {
    jpg: {
      image_url: string;
    };
  };
  [key: string]: any; // To account for any additional fields
}

const animeContainer = document.querySelector(
  '.anime-container',
) as HTMLDivElement;

async function fetchAnime(): Promise<Anime[]> {
  try {
    const response = await fetch('https://api.jikan.moe/v4/top/anime');
    const data = await response.json();
    return data.data as Anime[];
  } catch (error) {
    console.error('Error fetching anime data:', error);
    return [];
  }
}

function renderAnime(animeList: Anime[]): void {
  animeContainer.innerHTML = '';

  animeList.forEach((anime) => {
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

    animeDiv.appendChild(imageDiv);
    animeDiv.appendChild(textDiv);

    animeContainer.appendChild(animeDiv);
  });
}

async function init(): Promise<void> {
  const animeList = await fetchAnime();
  renderAnime(animeList);
}

init();
