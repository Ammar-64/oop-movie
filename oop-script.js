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
`;
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

  static async fetchActors(movieData) {
    movieData.cast.forEach(async (cast, index) => {
      if (index > 5) return;

      const url = APIService._constructUrl(`/person/${cast.id}`);
      const response = await fetch(url);
      const data = await response.json();

      return data.results.map((actor) => new Actor(actor));
    });
  }

  static async fetchActor(actorId) {
    const url = APIService._constructUrl(`/person/${actorId}`);
    const response = await fetch(url);
    const data = await response.json();

    return new Actor(data);
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
    const scrollForMore = document.createElement("div");
    scrollForMore.classList.add("scroll-for-more");
    scrollForMore.innerHTML = `<p>Scroll to the right for more</p>`;
    this.container.appendChild(scrollForMore);
  }
}

class Movies {
  static async run(movie) {
    const movieData = await APIService.fetchMovie(movie.id);
    MoviePage.renderMovieSection(movieData);
    APIService.fetchActors(movieData.cast);
  }
}

class MoviePage {
  static container = document.getElementById("container");

  static renderMovieSection(movie) {
    MovieSection.renderMovie(movie);
  }
}

class Actors {
  static async run(actor) {
    const actorData = await APIService.fetchActor(actor.id);
    ActorPage.renderActorSection(actorData);
  }
}

class ActorPage {
  static container = document.getElementById("container");
  static renderActorSection(actor) {
    ActorSection.renderActor(actor);
  }
}
class ActorSection {
  static renderActor(actor) {
    ActorPage.container.innerHTML = `
    
  <h3>  ${actor.name} </h3>
    
    
    `;
  }
}
class SearchPage {}

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
    <div style="position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: blue; z-index: -1;">
    <img id="movieImage" src="${movie.backdropUrl}" width="" style="width: 100%; height: 100%;">
  </div>

  <header style="left: 10rem; top: 10rem; margin-top: 10rem; margin-left: 10rem;">
    <main style="max-width: 80%; background-color: rgba(0, 0, 0, 0.801); color: white; padding: 2rem; border-radius: 5px;">
        <h1 id="title">
            ${movie.title}
        </h1>

        <p id="description">
            description   ${movie.overview}
        </p>

        <footer style="display: flex;">
            <ul style="list-style: none; padding: 0px;">
                <li style="display: flex; justify-items: flex-start; align-items: flex-start;">
                    <aside id="runtime" style="margin-right: 10px;">
                        DURATION
                    </aside>
        
                  <div style="display: flex; " >
                    <p>
                        Rating:   ${movie.rating}
                    </p>

                    <p id="rating" style="background-color: indigo; padding: 5px; margin-left: 5px ; border-radius: 1000px;">
                        DIRECTOR   ${movie.director}
                    </p>
                  </div>
                </li>

            </ul>
        </footer>
    </main>

   
</header>

<div style="margin-top: 5rem; width: 100%; display: flex; min-width: 90rem">
    <aside id="cast" style="width: 40%;">
        <ul id="members" style="list-style: none; display: flex; flex-wrap: wrap;">
    
        </ul>
    </aside>

      <li id="member" style="font-size: 10px;display: none;width: 10rem; height: 10rem; margin: 5px;; border-radius: 5px;background-image: url(data:image/jpeg;base64,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); background-repeat: no-repeat; background-size: contain;">
                <div style="max-width: 80%; background-color: rgba(0, 0, 0, 0.801); color: white; padding: 2rem; border-radius: 5px;; ">
                    ACTOR NAME
                </div>
            </li>

    <main id="trailers" style="width: 30%;">
    </main>

    <aside id="similar-movies" style="width: 30%; display: flex; flex-wrap: wrap;">
        <div id="similar-movie" style="position: relative;;margin: 4px; border-radius: 10px;display: none;width: 40%; min-height: 10rem;background-repeat: no-repeat; background-size: cover; background-image: url(https://images.hindustantimes.com/img/2021/08/26/550x309/144b7a0179da2184143146224238adb0_1621492205535_1629966593507.jpg);">
            <div style="background-color: rgba(0, 0, 0, 0.527); width: fit-content; height: fit-content; border-radius: 10px; position: absolute; bottom: 4px;">
                <p style="color: white; font-size: 10px;">
            
                </p>
            </div>
        </div>
    </aside>
</div>

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
    this.rating = json.vote_average;
    this.overview = json.overview;
    this.backdropPath = json.backdrop_path;
    this.language = json.original_language;

    this.getCast();
    this.getTrailer();
  }

  async getCast() {
    const url = APIService._constructUrl(`/movie/${this.id}/credits`);
    const response = await fetch(url);
    const data = await response.json();

    this.director = await data.crew.filter(({ job }) => job === "Director")[0]
      .name;
    this.casts = data.cast;

    this.casts.forEach(async (cast, index) => {
      if (index > 5) return;

      const url = APIService._constructUrl(`/person/${cast.id}/images`);
      const response = await fetch(url);
      const data = await response.json();
      const image =
        data.profiles.length > 1 ? data.profiles[0].file_path : null;

      const member = document.getElementById("member").cloneNode(true);
      member.style.backgroundImage = `url("http://image.tmdb.org/t/p/w780/${image}")`;
      member.style.display = "flex";
      member.firstElementChild.innerHTML = cast.name;

      document.getElementById("members").appendChild(member);

      member.addEventListener("click", () => {
        Actors.run(cast);
      });
    });
  }

  async getTrailer() {
    const url = APIService._constructUrl(`/movie/${this.id}/videos`);
    const response = await fetch(url);
    const data = await response.json();

    const trailer = data["results"][0].key;

    const trailerSection = document.getElementById("trailers");
    const trailerDiv = document.createElement("div");
    trailerDiv.style =
      "width: 100%; min-height: 15rem;background-repeat: no-repeat; background-size: contain;";

    // //Creating iframe
    const link = `https://www.youtube.com/embed/${trailer}`;
    const iframe = document.createElement("iframe");
    iframe.frameBorder = 0;
    iframe.width = "420px";
    iframe.height = "315px";
    iframe.setAttribute("src", link);

    trailerDiv.appendChild(iframe);
    trailerSection.appendChild(trailerDiv);
  }

  get backdropUrl() {
    return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
  }
}

class Actor {
  constructor(json) {
    this.id = json.credit_id;
    this.name = json.name;

    if (json.gender == 1) {
      this.gender = "female";
    } else {
      this.gender = "male";
    }
    this.profilePicture = json.profile_path;
    this.popularity = json.popularity;
    this.birthday = data.birthday;
    this.deathday = data.deathday;
    this.biography = data.biography;

    // A list of movies the actor participated in
    this.getMovies();
  }

  async getMovies() {
    const url = APIService._constructUrl(`/person/${this.id}/movie_credits`);
    const response = await fetch(url);

    const data = response.json();

    this.movies = data.id;

    // const movieData = await APIService.fetchMovie(movie.id);
    // MoviePage.renderMovieSection(movieData);
  }
}
document.addEventListener("DOMContentLoaded", App.run);
