const movieGrid = document.querySelector("#movie-grid");
let watchedList = JSON.parse(localStorage.getItem("watched")) || [];
let watchlistMovies = JSON.parse(localStorage.getItem("watchlistMovies")) || [];
const loading = document.querySelector("#loading");
const count = document.querySelector("#movie-count");
const watchlistCount = document.querySelector("#watchlist-count");
watchlistCount.textContent = watchlistMovies.length;
let currentModalMovie = null;
const modalWatchlist = document.querySelector("#modal-watchlist");
const searchInput = document.querySelector("#search");
const searchButton = document.querySelector("#search-btn");
let genreFilterValue = "all";
let ratingFilterValue = "0";
let watchedFilterValue = "all";
const resultsValue = movieGrid.children;
const modal = document.querySelector("#movie-modal");
const modalClose = document.querySelector("#modal-close");
const modalOverlay = document.querySelector(".modal-overlay");
const modalImage = document.querySelector("#modal-image");
const modalYear = document.querySelector("#modal-year");
const modalRuntime = document.querySelector("#modal-runtime");
const modalTitle = document.querySelector("#modal-title");
const modalRating = document.querySelector("#modal-rating");
const modalGenres = document.querySelector("#modal-genres");
const modalDescription = document.querySelector("#modal-description");

async function fetchResult(url, str) {
    try {
        const tmdbPath = new URL(url).pathname + new URL(url).search;
        const response = await fetch(
            `https://movie-api.anyuvrajsingh.workers.dev${tmdbPath}`
        );
        const body = await response.json();
        if (str === "results") {
            return body.results;
        } else if (str === "genres") {
            return body.genres;
        } else {
            return body.runtime;
        }
        document.querySelector("#error").classList.add("hidden");
    } catch (error) {
        loading.style.display = "none";
        document.querySelector("#error").classList.remove("hidden");
        count.textContent = 0;
    }
    
}

const genres = await fetchResult("https://api.themoviedb.org/3/genre/movie/list", "genres");
let results = await fetchResult("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc", "results");

async function addCard(result) {
    loading.style.display = "";
    const article = document.createElement("article");
    article.classList.add("movie-card");
    const div1 = document.createElement("div");
    div1.classList.add("poster");
    const div2 = document.createElement("div");
    div2.classList.add("movie-info");
    const img = document.createElement("img");
    const posterUrl = result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : "./public/no-image-poster.png";
    img.setAttribute("src", posterUrl);
    img.setAttribute("alt", "Movie Poster");
    const span1 = document.createElement("span");
    span1.classList.add("rating");
    span1.textContent = `★ ${Math.round(result.vote_average * 10) / 10}`;
    const button1 = document.createElement("button");
    button1.classList.add("watchlist-btn");
    button1.setAttribute("aria-label", "Add to watchlist");
    button1.textContent = "♡";
    if (watchlistMovies.includes(result.id)) {
        button1.classList.add("active");
        button1.textContent = "♥";
    }
    button1.addEventListener("click", () => {
        if (watchlistMovies.includes(result.id)) {
            watchlistMovies = watchlistMovies.filter(id => id !== result.id);
            button1.classList.remove("active");
            button1.textContent = "♡";
        } else {
            watchlistMovies.push(result.id);
            button1.classList.add("active");
            button1.textContent = "♥";
        }
        localStorage.setItem("watchlistMovies", JSON.stringify(watchlistMovies));
        watchlistCount.textContent = watchlistMovies.length;
    });
    const button3 = document.createElement("button");
    button3.classList.add("watched-btn");
    button3.setAttribute("aria-label", "Mark as watched");
    button3.textContent = "✓";
    const div3 = document.createElement("div");
    div3.classList.add("movie-meta");
    const span2 = document.createElement("span");
    span2.textContent = result.release_date.split("-")[0];
    const span3 = document.createElement("span");
    span3.textContent = "•";
    const span4 = document.createElement("span");
    const runtime = await fetchResult(`https://api.themoviedb.org/3/movie/${result.id}`, "runtime");
    span4.textContent = `${Math.floor(runtime / 60)}h ${runtime % 60}m`;
    const h3 = document.createElement("h3");
    h3.textContent = result.title;
    const div4 = document.createElement("div");
    div4.classList.add("genres");
    const button2 = document.createElement("button");
    button2.classList.add("details-btn");
    button2.textContent = "View details →";
    button2.addEventListener("click", async () => {
        currentModalMovie = result;
        if (watchlistMovies.includes(result.id)) {
            modalWatchlist.textContent = "✓ In watchlist";
        } else {
            modalWatchlist.textContent = "+ Add to watchlist";
        }
        modalImage.src = result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : "./public/no-image-poster.png";
        modalTitle.textContent = result.title;
        modalYear.textContent = result.release_date.split("-")[0];
        modalRating.textContent = Math.round(result.vote_average * 10) / 10;
        modalDescription.textContent = result.overview;
        modalGenres.textContent = "";
        const genreNames = result.genre_ids.map(id => {
            const genre = genres.find(genre => genre.id === id);
            return genre.name;
        });
        for (let name of genreNames) {
            const span = document.createElement("span");
            span.textContent = name;
            modalGenres.appendChild(span);
        }
        const runtime = await fetchResult(`https://api.themoviedb.org/3/movie/${result.id}`, "runtime");
        modalRuntime.textContent = `${Math.floor(runtime / 60)}h ${runtime % 60}m`;
        modal.classList.remove("hidden");
    });
    movieGrid.appendChild(article);
    article.appendChild(div1);
    article.appendChild(div2);
    div1.appendChild(img);
    div1.appendChild(span1);
    div1.appendChild(button1);
    div1.appendChild(button3);
    if (watchedList.includes(result.id)) {
        article.classList.add("watched");
    }
    button3.addEventListener("click", () => {
        if (watchedList.includes(result.id)) {
            watchedList = watchedList.filter(id => id !== result.id);
        } else {
            watchedList.push(result.id);
        }
        localStorage.setItem("watched", JSON.stringify(watchedList));
        article.classList.toggle("watched");
    });
    div2.appendChild(div3);
    div3.appendChild(span2);
    div3.appendChild(span3);
    div3.appendChild(span4);
    div2.appendChild(h3);
    div2.appendChild(div4);
    const genreNames = result.genre_ids.map(id => {
        const genre = genres.find(genre => genre.id === id);
        return genre.name;
    });
    for (let name of genreNames) {
        const spanGenre = document.createElement("span");
        spanGenre.textContent = name;
        div4.appendChild(spanGenre);
    }
    div2.appendChild(button2);
    loading.style.display = "none";
    count.textContent = resultsValue.length;
}

function filtered(gFilter, rFilter, wFilter, rValues) {
    for (let rValue of rValues) {
        const gValueFilter = rValue.children[1].querySelector(".genres").textContent.toLowerCase();
        const rValueFilter = rValue.children[0].querySelector(".rating").textContent.slice(2);
        const wValueFilter = rValue.classList.contains("watched");

        const genreValueFilter = gFilter === "all" || gValueFilter.includes(gFilter);
        const ratingValueFilter = rFilter === "0" || Number(rValueFilter) >= Number(rFilter);
        const watchedValueFilter = wFilter === "all" || (wFilter === "watched" && wValueFilter) || (wFilter === "unwatched" && !wValueFilter);

        rValue.style.display = genreValueFilter && ratingValueFilter && watchedValueFilter ? "" : "none";
    }
    count.textContent = Array.from(rValues).filter(rValue => {
        return window.getComputedStyle(rValue).display !== "none";
    }).length;
}

movieGrid.textContent = "";
document.querySelector("#empty").classList.add("hidden");
for (let result of results) {
    addCard(result);
}

let searchValue;

searchButton.addEventListener("click", async e => {
    searchValue = searchInput.value.toLowerCase();
    if (searchValue === "") {
        results = await fetchResult("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc", "results");
        document.querySelector("#empty").classList.add("hidden");
    } else {
        results = await fetchResult(`https://api.themoviedb.org/3/search/movie?query=${searchValue}&include_adult=false&language=en-US&page=1`, "results");
        document.querySelector("#empty").classList.add("hidden");
        if (results.length === 0) {
            document.querySelector("#empty").classList.remove("hidden");
            count.textContent = 0;
        }
    }
    movieGrid.textContent = "";
    for (let result of results) {
        addCard(result);
    }
});

document.querySelector("#genre").addEventListener("change", e => {
    genreFilterValue = e.target.value.toLowerCase();
    filtered(genreFilterValue, ratingFilterValue, watchedFilterValue, resultsValue);
});

document.querySelector("#rating").addEventListener("change", e => {
    ratingFilterValue = e.target.value.toLowerCase();
    filtered(genreFilterValue, ratingFilterValue, watchedFilterValue, resultsValue);
});

document.querySelector("#watched").addEventListener("change", e => {
    watchedFilterValue = e.target.value.toLowerCase();
    filtered(genreFilterValue, ratingFilterValue, watchedFilterValue, resultsValue);
});

document.querySelector("#sort").addEventListener("change", e => {
    const sortValue = e.target.value.toLowerCase();
    if (sortValue === "rating") {
        const items = Array.from(resultsValue);
        items.sort((a, b) => {
            const textA = a.children[0].children[1].textContent.slice(2);
            const textB = b.children[0].children[1].textContent.slice(2);
            return Number(textB) - Number(textA);
        });
        items.forEach(item => movieGrid.appendChild(item));
    } else if (sortValue === "year") {
        const items = Array.from(resultsValue);
        const yearRegex = /\b(19|20)\d{2}\b/;
        items.sort((a, b) => {
            const textA = a.children[1].children[0].textContent.slice(0, 4);
            const textB = b.children[1].children[0].textContent.slice(0, 4);

            const isYearA = yearRegex.test(textA);
            const isYearB = yearRegex.test(textB);

            if (!isYearA && !isYearB) return 0;
            if (!isYearA) return 1;
            if (!isYearB) return -1;

            return Number(textB) - Number(textA);
        });
        items.forEach(item => movieGrid.appendChild(item));
    } else {
        const items = Array.from(resultsValue);
        items.sort((a, b) => {
            const textA = a.children[1].children[1].textContent.toLowerCase();
            const textB = b.children[1].children[1].textContent.toLowerCase();
            return textA.localeCompare(textB);
        });
        items.forEach(item => movieGrid.appendChild(item));
    }
});

document.querySelector("#clear-filters").addEventListener("click", () => {
    genreFilterValue = "all";
    ratingFilterValue = "0";
    watchedFilterValue = "all";
    filtered(genreFilterValue, ratingFilterValue, watchedFilterValue, resultsValue);
    document.querySelector("#genre").selectedIndex = 0;
    document.querySelector("#rating").selectedIndex = 0;
    document.querySelector("#watched").selectedIndex = 0;
});

document.querySelector("#random-movie").addEventListener("click", async () => {
    const visibleMovies = Array.from(resultsValue).filter(movie => window.getComputedStyle(movie).display !== "none");
    if (visibleMovies.length === 0) return;
    const randomCard = visibleMovies[Math.floor(Math.random() * visibleMovies.length)];
    const title = randomCard.querySelector("h3").textContent;
    const result = results.find(movie => movie.title === title);
    if (!result) return;
    currentModalMovie = result;
    modalImage.src = result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : "./public/no-image-poster.png";
    modalTitle.textContent = result.title;
    modalYear.textContent = result.release_date.split("-")[0];
    modalRating.textContent = Math.round(result.vote_average * 10) / 10;
    modalDescription.textContent = result.overview;
    modalGenres.textContent = "";
    const genreNames = result.genre_ids.map(id => {
        const genre = genres.find(genre => genre.id === id);
        return genre.name;
    });
    for (let name of genreNames) {
        const span = document.createElement("span");
        span.textContent = name;
        modalGenres.appendChild(span);
    }
    const runtime = await fetchResult(`https://api.themoviedb.org/3/movie/${result.id}`, "runtime");
    modalRuntime.textContent = `${Math.floor(runtime / 60)}h ${runtime % 60}m`;
    modal.classList.remove("hidden");
});

modalClose.addEventListener("click", () => {
    modal.classList.add("hidden");
});

modalOverlay.addEventListener("click", () => {
    modal.classList.add("hidden");
});

modalWatchlist.addEventListener("click", () => {
    if (!currentModalMovie) return;
    const movieId = currentModalMovie.id;
    if (watchlistMovies.includes(currentModalMovie.id)) {
        watchlistMovies = watchlistMovies.filter(id => id !== movieId);
        modalWatchlist.textContent = "+ Add to watchlist";
    } else {
        watchlistMovies.push(movieId);
        modalWatchlist.textContent = "✓ In watchlist";
    }
    localStorage.setItem("watchlistMovies", JSON.stringify(watchlistMovies));
    watchlistCount.textContent = watchlistMovies.length;
    const movieCard = Array.from(movieGrid.children).find(card => {
        return card.querySelector("h3").textContent === currentModalMovie.title;
    });
    if (movieCard) {
        const watchlistButton = movieCard.querySelector(".watchlist-btn");
        if (watchlistMovies.includes(movieId)) {
            watchlistButton.classList.add("active");
            watchlistButton.textContent = "♥";
        } else {
            watchlistButton.classList.remove("active");
            watchlistButton.textContent = "♡";
        }
    }
});

document.querySelector("#retry").addEventListener("click", async () => {
    loading.style.display = "";
    searchValue = searchInput.value.toLowerCase();
    if (searchValueValue === "") {
        results = await fetchResult("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc", "results");
        document.querySelector("#empty").classList.add("hidden");
    } else {
        results = await fetchResult(`https://api.themoviedb.org/3/search/movie?query=${searchValue}&include_adult=false&language=en-US&page=1`, "results");
        document.querySelector("#empty").classList.add("hidden");
        if (results.length === 0) {
            document.querySelector("#empty").classList.remove("hidden");
        }
    }
    movieGrid.textContent = "";
    for (let result of results) {
        addCard(result);
    }
    loading.style.display = "none";
});