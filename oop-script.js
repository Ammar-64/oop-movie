//the API documentation site https://developers.themoviedb.org/3/
const container = document.getElementById("container");
const backgroundDiv = document.createElement("div");
backgroundDiv.classList.add("backgroundDiv");
container.appendChild(backgroundDiv);
class App {
  static async run() {
    const movies = await APIService.fetchMovies();
    HomePage.renderMovies(movies);
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
    return new Movie(data);
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
}

document.addEventListener("DOMContentLoaded", App.run);
