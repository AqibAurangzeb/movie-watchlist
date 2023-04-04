const search = document.getElementById('search')
const movies = document.getElementById('movies')
const startExploring = document.getElementById('start-exploring')

const apiKey = '8da3f7ed'
let searchResults = []
let watchlist = JSON.parse(localStorage.getItem("watchlist")) ?? []

search.addEventListener('submit', (e) => {
  e.preventDefault()

  const searchQuery = document.getElementById('search-input').value
  
  searchResults = []

  startExploring.classList.add('hidden')
  renderMoviesLoading()

  fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchQuery}`)
    .then(response => response.json())
    .then(data => {
      const response = data.Response === 'True' ? true : false;
      if (response) {
        data.Search.forEach((movie) => {
          fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`)
            .then(response => response.json())
            .then(data => {
              searchResults.push(data)
            })
            .then(() => renderMovies()) // inefficent but having issues with rendering after
        })
      }
      else {
        searchResults = []
        renderMovies()
      }
    })
})

document.addEventListener("click", (e) => {
  if (e.target.dataset.movieAddId) {
    addToWatchlist(e.target.dataset.movieAddId)
  }
  else if (e.target.dataset.movieRemoveId) {
    removeFromWatchlist(e.target.dataset.movieRemoveId)
  }
})


function renderMoviesLoading() {
  movies.innerHTML = '<div class="loading"></div>';
}

function renderMovies() {
  let moviesDom = ''

  searchResults.forEach((movie) => {
    const isWatchlisted = watchlist.some(watchlistedMovie => watchlistedMovie?.imdbID === movie.imdbID)

    let movieWatchListParagraph = ''

    if (isWatchlisted) {
      movieWatchListParagraph = `
        <p class="movie-watchlist">
          <i class="fa-solid fa-check" style="color: #68ea39;"></i>
          Watchlist
        </p>
      `
    }
    else {
      movieWatchListParagraph = `
        <p class="movie-watchlist" data-movie-add-id="${movie.imdbID}">
          <i class="fa-sharp fa-solid fa-circle-plus" data-movie-add-id="${movie.imdbID}"></i>
          Watchlist
        </p>
      `
    }

    moviesDom += `
      <div class="movie">
        <img src="${movie.Poster.startsWith('http') ? movie.Poster : 'images/placeholder-image.jpg'}">
        <div class="movie-info">
            <div class="movie-info-top">
                <h3 class="movie-title">${movie.Title}</h3>
                <p class="movie-rating"><i class="fa-sharp fa-solid fa-star" style="color: #fec654;"></i>${movie.imdbRating}</p>
            </div>
            <div class="movie-info-middle">
                <p class="movie-runtime">${movie.Runtime}</p>
                <p class="movie-categories">${movie.Genre}</p>
                ${movieWatchListParagraph}
            </div>
            <div class="movie-info-bottom">
                <p class="movie-description">${movie.Plot.startsWith('N/A') ? "We do not have a description for this movie" : movie.Plot}</p>
            </div>
        </div>
      </div>
    `
  })

  if (moviesDom === '') {
    startExploring.fontWeight = '700'
    startExploring.textContent = "Unable to find what you're looking for. Please try another search."
    startExploring.style.color = '#787878'
    startExploring.classList.remove('hidden')
  }

  movies.innerHTML = moviesDom
}

function addToWatchlist(movieId) {
  const movieData = searchResults.find((movie) => movie.imdbID === movieId)
  
  watchlist.push(movieData)

  localStorage.setItem("watchlist", JSON.stringify(watchlist))

  renderMovies()
}

function removeFromWatchlist(movieId) {
  const removeIndex = watchlist.map(movie => movie.imdbID).indexOf(movieId)

  watchlist.splice(removeIndex, 1)

  localStorage.setItem("watchlist", JSON.stringify(watchlist))

  renderMovies()
}