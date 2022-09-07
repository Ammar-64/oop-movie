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
      const data = await response.json()
      
      return new Movie(data);
    }
    static _constructUrl(path) {
      return `${this.TMDB_BASE_URL
        }/${path}?api_key=${"862271aa285e74d61113b31d525420b4"}`; //remember to encode and decode it using ../atob
    }
  }
  
  class HomePage {
    static container = document.getElementById("container");
    static moviesDiv = document.createElement("div");
  
    static renderBackgroundMovie(movie) {
      document.getElementById("movieImage").src = movie.backdropUrl
      document.getElementById("title").innerHTML = movie.title
      document.getElementById("description").innerHTML = movie.overview
  
      document.getElementById("runtime").innerHTML = "Year: " + movie.releaseDate
      document.getElementById("rating").innerHTML = movie.rating
  
  
      document.getElementById("members").innerHTML = ""
  
      movie.cast.forEach(async (cast, index) => {
        if(index > 5) return 
  
        const url = APIService._constructUrl(`/person/${cast.id}/images`);
        const response = await fetch(url);
        const data = await response.json();
        console.log(data)
        const image = data.profiles.length > 1 ? data.profiles[0].file_path : null
  
        const member = document.getElementById("member").cloneNode(true)
        member.style.backgroundImage = `url("http://image.tmdb.org/t/p/w780/${image}")`
        member.style.display = "flex"
        member.firstElementChild.innerHTML = cast.name
        document.getElementById("members").appendChild(member)
  
      })
   
  
    }
    static renderMovies(movies) {
      console.log(movies)
      movies.forEach((movie, index) => {
        if(index > 3) return 
  
        const similarMovie = document.getElementById("similar-movie").cloneNode(true)
  
        similarMovie.style.backgroundImage = `url(${movie.backdropUrl})`
        similarMovie.style.display = "flex"
  
        similarMovie.querySelector("p").innerHTML = movie.title
        similarMovie.addEventListener("click", function () {
          Movies.run(movie);
        });
  
        similarMovie.addEventListener("mouseover", (e) => {
          e.preventDefault();
          this.renderBackgroundMovie(movie);
        });
  
        similarMovie.classList.add("movieDiv");
  
        document.getElementById("similar-movies").appendChild(similarMovie)
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
      MovieSection.renderMovie(movie);
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
      this.releaseDate = json.release_date
      this.rating = json.vote_average
  
      this.getData()
      this.getMovieTrailers()
    }
    
    async getData() {
      const url = APIService._constructUrl(`/movie/${this.id}/credits`);
      const response = await fetch(url);
      const data = await response.json();
  
      this.cast = data.cast
      console.log(this.cast)
    }
  
    async getMovieTrailers() {
      const url = APIService._constructUrl(`/movie/${this.id}/credits`);
      const response = await fetch(url);
      const data = await response.json();
  
      this.trailers = data.cast
  
    }
  
    get backdropUrl() {
      return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
    }
  }
  
  document.addEventListener("DOMContentLoaded", App.run);
  
  
   
     
  