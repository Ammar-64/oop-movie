//the API documentation site https://developers.themoviedb.org/3/
const container = document.getElementById("container");
const backgroundDiv = document.createElement("div");
backgroundDiv.innerHTML = `
<div class='home-background'>
<div class='home-background--text'>
<h1>Welcome to your Movie Guide</h1>
<p>Start hovering over the popular movies for more details!</p>
</div>
</div>
`
backgroundDiv.classList.add("backgroundDiv");
container.appendChild(backgroundDiv);
class App {
  static async run() {
    const movies = await APIService.fetchMovies();
    const genres = await APIService.fetchGenres();
    HomePage.renderMovies(movies);
    MoviesByGenre.renderGenres(genres);
  }
}

class APIService {
  static TMDB_BASE_URL = "https://api.themoviedb.org/3";
  static async fetchMovies() {
    const url = APIService._constructUrl(`movie/now_playing`);
    const response = await fetch(url);
    const data = await response.json();
    return data.results.map((movie) => new Movie(movie));
  }
  static async fetchMovie(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}`);
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
    return new Movie(data);
  }
  //genre
  static async fetchGenres() {
    const url = APIService._constructUrl(`genre/movie/list`)
    const response = await fetch(url)
    const data = await response.json()
    return data.genres;
}
static async fetchDiscover(genreId) {
  const url = APIService._constructUrl(`discover/movie`) + `&with_genres=${genreId}`;
  const response = await fetch(url)
  const data = await response.json()
  return data.results.map(movie => new Movie(movie));
}
//search button
static async fetchSearch(queryString) {
  const url = APIService._constructUrl(`search/movie`) + `&query=${queryString}`
  const response = await fetch(url)
  const data = await response.json()
  return data.results.map(movie => new Movie(movie));
}
  static _constructUrl(path) {
    return `${
      this.TMDB_BASE_URL
    }/${path}?api_key=${"862271aa285e74d61113b31d525420b4"}`; //remember to encode and decode it using ../atob
  }
}

class HomePage {
  static container = document.getElementById("container");
  static moviesDiv = document.createElement("div");
  static renderBackgroundMovie(movie) {
    backgroundDiv.innerHTML = `
    <div class='backgroundTextDiv'>
    <h1>${movie.title}</h1>
    <p>${movie.overview}</p>
    </div>
    <img src=${movie.backdropUrl} alt='movie-image'>
    `;
  }
  static renderMovies(movies) {
    movies.forEach((movie) => {
      const movieDiv = document.createElement("div");
      const movieImage = document.createElement("img");
      movieImage.src = `${movie.backdropUrl}`;
      const movieTitle = document.createElement("p");
      movieTitle.textContent = `${movie.title}`;
      movieImage.addEventListener("click", function () {
        Movies.run(movie);
      });

      movieDiv.appendChild(movieTitle);
      movieImage.addEventListener("mouseover", (e) => {
        e.preventDefault();
        this.renderBackgroundMovie(movie);
      });
      movieDiv.classList.add("movieDiv");
      this.moviesDiv.classList.add("moviesDiv");
      movieDiv.appendChild(movieImage);
      this.container.appendChild(movieDiv);
      movieDiv.appendChild(movieTitle);
      this.moviesDiv.appendChild(movieDiv);
      this.container.appendChild(this.moviesDiv);
    });
    const scrollForMore = document.createElement('div')
    scrollForMore.classList.add('scroll-for-more')
    scrollForMore.innerHTML = `<p>Scroll to the right for more</p>`
    this.container.appendChild(scrollForMore)
  }
}

//class of movies by genre
class Genres {
  static async run(genre) {
      MoviesByGenrePage.renderDiscoveredByGenre(genre);
  }
}

class MoviesByGenrePage {
  static container = document.getElementById('container');
  static renderDiscoveredByGenre(genres) {
      genres.forEach(genre => {
          const genreDiv = document.createElement("div");
          genreDiv.classList.add("genre-div", "album", "py-5", "bg-light")
          const genreImage = document.createElement("img");
          genreImage.setAttribute('id', 'main-div-img');
          genreImage.classList.add("genre-image-div")
          genreImage.src = `${genre.backdropUrl}`;
          const genreName = document.createElement("h3");
          genreName.classList.add("text-dark")
          genreName.textContent = `${genre.title}`;
          genreImage.addEventListener("click", function () {
              Movies.run(genre.id);
          })
          genreDiv.appendChild(genreName);
          genreDiv.appendChild(genreImage);
          this.container.appendChild(genreDiv);
      })
  }
}


class MoviesByGenre {
  static renderGenres(genres) {
      const dropdown = document.getElementById("dropdown-genre-list");
      dropdown.innerHTML = genres.map(genre => {
          return `<a class="dropdown-item" id=${genre.id} href="#">${genre.name}</a>`
      }).join("")
      const dropdownItems = document.querySelectorAll(".dropdown-item");
      const dropdownItemsArr = [...dropdownItems];
      dropdownItemsArr.map(item => {
          item.addEventListener("click", async function () {
              const data = await APIService.fetchDiscover(item.id)
              HomePage.container.innerHTML = ""
              Genres.run(data);
          })
      })
  }
}


class Movies {
  static async run(movie) {
    const movieData = await APIService.fetchMovie(movie.id);
    MoviePage.renderMovieSection(movieData);
    APIService.fetchActors(movieData);
  }
}

class MoviePage {
  static container = document.getElementById("container");
  static renderMovieSection(movie) {
    console.log(movie);
    MovieSection.renderMovie(movie);
  }
}

class AboutSection {
  static container = document.getElementById("container");

  static renderAboutPage() {
    container.innerHTML = `
    <h3> HELLOOOOOO </h3>
    `;
  }
}

class MovieSection {
  static renderMovie(movie) {
    MoviePage.container.innerHTML = `
      <div class="row">
        <div class="col-md-4">
          <img id="movie-backdrop" src=${movie.backdropUrl}> 
        </div>
        <div class="col-md-8">
          <h2 id="movie-title">${movie.title}</h2>
          <p id="genres">${movie.genres}</p>
          <p id="movie-release-date">${movie.releaseDate}</p>
          <p id="movie-runtime">${movie.runtime}</p>
          <h3>Overview:</h3>
          <p id="movie-overview">${movie.overview}</p>
          <h4>Language:</h4>
          <p id="movie-overview">${movie.language}</p>
        </div>
      </div>
      <h3>Actors:</h3>
    `;
  }
}

class Movie {
  static BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
  constructor(json) {
    this.id = json.id;
    this.title = json.title;
    this.releaseDate = json.release_date;
    this.runtime = json.runtime + " minutes";
    this.overview = json.overview;
    this.backdropPath = json.backdrop_path;
    this.language = json.original_language;
  }

  get backdropUrl() {
    return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
  }
  get genres() {
    return this.genres.map(el => {
        return `<span> ${el.name}</span>`
    }).join("")
}

}

document.addEventListener("DOMContentLoaded", App.run);
