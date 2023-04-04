const watchlistedMovies = document.getElementById('watchlisted-movies')
const watchlistStart = document.getElementById('watchlist-start')

let watchlist = JSON.parse(localStorage.getItem("watchlist")) ?? []

document.addEventListener("click", (e) => {
  if (e.target.dataset.movieId) {
    removeFromWatchlist(e.target.dataset.movieId)
  }
})

function renderWatchList() {
  let watchlistDom = ''

  if (watchlist.length > 0) {
    watchlistStart.classList.add('hidden')

    console.log(watchlist)

    watchlist.forEach((movie) => {
      watchlistDom += `
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
                  <p class="movie-watchlist" data-movie-id="${movie.imdbID}">
                      <i class="fa-sharp fa-solid fa-circle-minus" data-movie-id="${movie.imdbID}"></i>
                      Remove
                  </p>
              </div>
              <div class="movie-info-bottom">
                  <p class="movie-description">${movie.Plot.startsWith('N/A') ? "We do not have a description for this movie" : movie.Plot}</p>
              </div>
          </div>
        </div>
      `
    })
  }
  else {
    watchlistStart.classList.remove('hidden')
  }

  watchlistedMovies.innerHTML = watchlistDom
}

function removeFromWatchlist(movieId) {
  const removeIndex = watchlist.map(movie => movie.imdbID).indexOf(movieId)

  watchlist.splice(removeIndex, 1)

  localStorage.setItem("watchlist", JSON.stringify(watchlist))

  renderWatchList()
}

renderWatchList()