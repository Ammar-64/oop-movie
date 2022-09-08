//the API documentation site https://developers.themoviedb.org/3/

class App {
    static async run(input) {
        let movies
        if (typeof input === 'number') {
            movies = await APIService.fetchGenres(input)
        } else {
            movies = await APIService.fetchMovies(input)
        }
        HomePage.renderMovies(movies)
    }
}
class APIService {
    static TMDB_BASE_URL = 'https://api.themoviedb.org/3'
    static async fetchMovies(filter) {
        const url = APIService._constructUrl(`movie/${filter}`)
        const response = await fetch(url)
        const data = await response.json()
        return data.results.map((movie) => {
            return new Movie(movie)
        })
    }
    static async fetchMovie(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}`)
        const response = await fetch(url)
        const data = await response.json()

        return new Movie(data)
    }

    static async fetchGenres(genreId) {
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=bae5a03c227c33b8d9842f4e6c132889&include_adult=false&with_genres=${genreId}`
        )
        const data = await response.json()
        return data.results.map((movie) => new Movie(movie))
    }
    static async fetchPopularActors() {
        const url = APIService._constructUrl(`person/popular`)
        const response = await fetch(url)
        const data = await response.json()
            //console.log(data.results)
        return data.results.map((movie) => new SingleActor(movie))
    }

    //returns movie results for search

    static async fetchMovieSearchResultsforMovie(search) {
        const serachString = search.trim().toUpperCase()
        const url = APIService._constructUrlForSearch(
            `search/movie`,
            `${serachString}`
        )
        const response = await fetch(url)
        const data = await response.json()
        console.log(data)
        return data.results.map((movie) => new Movie(movie))
    }
    static async fetchMovieSearchResultsforActors(search) {
        const serachString = search.trim().toUpperCase()
        const url = APIService._constructUrlForSearch(
            `search/person`,
            `${serachString}`
        )
        const response = await fetch(url)
        const data = await response.json()
        console.log(data) //.results[0].known_for[0].overview
        return data.results.map((actor) => new SingleActor(actor))
    }
    static _constructUrl(path) {
            return `${this.TMDB_BASE_URL}/${path}?api_key=${atob(
      'NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI='
    )}`
        }
        // https://api.themoviedb.org/3/search/person?api_key=bae5a03c227c33b8d9842f4e6c132889&language=en-US&query=alpacino&page=1&include_adult=false
    static _constructUrlForSearch(path, search) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob(
      'NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI='
    )}&language=en-US&query=${search}&page=1&include_adult=false`
    }
}
APIService.fetchMovieSearchResultsforMovie('you')
APIService.fetchMovieSearchResultsforActors('tom')
    // class SearchResult {
    //     static container = document.getElementById('container')
    //     static async run(search) {
    //         const movies = await APIService.fetchMovieSearchResultsforActors(search)
    //             //const actor = await APIService.fetchMovieSearchResultsforActors(search)
    //         if (movies.length === 0) {
    //             // alert('Please Write a movie or actor')
    //         } else {
    //             movies.map(
    //                 (movie) => `
    //       <div class="searchResult-card col-md-2 col-sm-3 col-6">
    //         <img src='${movie.posterUrl}' class="img-fluid" alt="${movie.title}" >
    //         <h4>${movie.title}</h4>
    //       </div>`
    //             )
    //         }
    //         console.log('s')
    //     }
    // }
class SearchPage {
    static async run(input) {
        const movie = await APIService.fetchMovieSearchResultsforMovie(input)
        const actor = await APIService.fetchMovieSearchResultsforActors(input)
        let mov, person
        const container = document.getElementById('container')
        if (movie.length === 0) {
            mov = `<h3>Please Write a movie or actor</h3>`
        }
        if (document.getElementById('container').innerHTML !== '') {
            document.getElementById('container').innerHTML == ' '

            mov = movie
                .map(
                    (
                        movie
                    ) => `<div class="actorListPageActor col-lg-2 col-md-3 col-sm-4 col-6">
            <img class= "img-fluid actorListPageImg"  src="${movie.posterUrl}"/>
            ${movie.title} </div>`
                )
                .join('')
        }
        if (actor.length === 0) {
            person = '<h4>Unfortunately, no such people found.</h4>'
        }
        if (true) {
            person = actor
                .map(
                    (
                        actor
                    ) => `<div class="actorListPageActor text-center col-lg-2 col-md-3 col-sm-4 col-6">
            <img class= "img-fluid actorListPageImg"   src='${actor.actorsProfileUrl()}'/>
            ${actor.name}</div>`
                )
                .join('')
        }
        container.innerHTML = `
    <h2 class="text-center">Movie Results</h2>
    <div class="row  ">${mov}</div>
     <h2 class="text-center">People  Results</h2>
    <div class="row searchResults">${person}</div>`
    }
}

// Search button functionality
const submit = document.querySelector('#submit')
submit.addEventListener('click', (e) => {
    e.preventDefault()
    const search = document.querySelector('#search').value
    SearchPage.run(search)
})
class ListActorsPage {
    static async run() {
        //Empty the container div if it has something in it
        if (container.innerText !== '') {
            container.innerText = ''
        }

        //gets popular actors from API and returns an array of actor objects
        const actorData = await APIService.fetchPopularActors()
        ListActorsPage.renderActors(actorData)
    }
    static renderActors(actors) {
        const div = document.createElement('div')
        div.setAttribute('class', 'actorListPageActors row p-4')
        const actorsContainer = container.appendChild(div)

        actors.forEach((actor) => {
            //creates single movie divisions for the home page for each movie
            const actorDiv = document.createElement('div')
            actorDiv.setAttribute(
                'class',
                'actorListPageActor col-lg-2 col-md-3 col-sm-4 col-6'
            )
            const actorImage = document.createElement('img')
            actorImage.setAttribute('class', 'img-fluid actorListPageImg')
            actorImage.src = `
                ${actor.actorsProfileUrl()}
                `

            const actorTitle = document.createElement('h3')
            actorTitle.textContent = `
                $ { actor.name.toUpperCase() }
                `
            actorTitle.setAttribute('class', 'actor-name text-center')

            actorImage.addEventListener('click', function() {
                ActorPage.run(actor.id) //calls ActorPage.run with the id parameter from actor.forEach(actor)
            })

            actorDiv.appendChild(actorImage)
            actorDiv.appendChild(actorTitle)
            actorsContainer.appendChild(actorDiv)
        })
    }
}
class SingleActor {
    constructor(json) {
        this.name = json.name
        this.gender = json.gender // 1: Female, 2:Male
        this.profilePath = json.profile_path

        this.popularity = json.popularity
        this.biography = json.biography
        this.birthday = json.birthday
        this.deathday = json.deathday
        this.knownForDepartment = json.known_for_department
        this.id = json.id
    }

    //Profile url is the pictures of the cast & crew
    actorsProfileUrl() {
        return this.profilePath ? Movie.BACKDROP_BASE_URL + this.profilePath : ''
    }
}
class HomePage {
    static container = document.getElementById('container')
    static renderMovies(movies) {
        if (container.innerText !== '') {
            container.innerText = ''
        }
        movies.forEach((movie) => {
            const movieDiv = document.createElement('div')
            movieDiv.setAttribute('class', 'col-md-4 col-sm-6')
            const movieImage = document.createElement('img')
            movieImage.setAttribute('class', 'img-fluid')
            movieImage.src = `
                ${movie.backdropUrl}
                `
            const movieTitle = document.createElement('h3')
            movieTitle.setAttribute('class', 'text-center')
            movieTitle.textContent = `
                ${movie.title}
                `
            movieImage.addEventListener('click', function() {
                Movies.run(movie)
            })

            movieDiv.appendChild(movieTitle)
            movieDiv.appendChild(movieImage)
            this.container.appendChild(movieDiv)
        })
    }
}

class Movies {
    static async run(movie) {
        const movieData = await APIService.fetchMovie(movie.id)

        MoviePage.renderMovieSection(movieData)
            // APIService.fetchActors(movieData);
    }
}

class MoviePage {
    static container = document.getElementById('container')
    static renderMovieSection(movie) {
        MovieSection.renderMovie(movie)
    }
}

class MovieSection {
    static renderMovie(movie) {
        MoviePage.container.innerHTML = ` <
                div class = "row align-items-center" >
                    <
                    div class = "col-md-4 my-4" >
                    <
                    img id = "movie-backdrop"
                src = ${movie.posterUrl} >
                    <
                    /div> <
                div id = "movieSectionDiv"
                class = "col-md-8" >
                    <
                    h2 id = "movie-title" > ${movie.title} < /h2> <
                p class = "lead"
                id = "genres" > < strong > ${movie.genres
                  .map((genre) => genre.name)
                  .join('  ')} < /strong></p >
                    <
                    p class = "lead"
                id = "languages" > < strong > Language: ${movie.language.map(
                  (e) => {
                    return e.english_name
                  }
                )} < /strong></p >
                    <
                    p class = "lead"
                id = "movie-release-date" > < strong > ${
                  movie.releaseDate
                } < /strong></p >
                    <
                    p class = "lead"
                id = "movie-runtime" > < strong > ${
                  movie.runtime
                } < /strong></p >
                    <
                    h3 > Overview: < /h3> <
                p class = "lead"
                id = "movie-overview" > < strong > ${
                  movie.overview
                } < /strong></p >
                    <
                    /div> < /
                div > <
                    h3 class = "text-center my-3" > Actors: < /h3>
                `
    }
}

class Movie {
    static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780'
    constructor(json) {
        this.id = json.id
        this.title = json.title
        this.genres = json.genres
        this.releaseDate = json.release_date
        this.runtime = json.runtime + ' minutes'
        this.overview = json.overview
        this.posterPath = json.poster_path
        this.backdropPath = json.backdrop_path
        this.language = json.spoken_languages
    }

    get backdropUrl() {
        return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : ''
    }

    get posterUrl() {
        return this.posterPath ? Movie.BACKDROP_BASE_URL + this.posterPath : ''
    }
}

document.getElementById('homeBtn').addEventListener('click', (e) => {
    document.getElementById('container').innerHTML = ' '
    App.run('now_playing')
})

// Home.homeButton()
document.addEventListener('DOMContentLoaded', App.run('now_playing'))