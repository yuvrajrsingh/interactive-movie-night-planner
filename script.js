const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NDkwZGVjYzQyMjRjYjdhYmZkYjFiZTk1YjA5NTI3NiIsIm5iZiI6MTc4NjcwNzUyMS4yMDg5OTk5LCJzdWIiOiI2YTdlZmU0MWIxMGQwYmQwOThiZjhlNzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.WYUsJ-DJ2sgsskW4FdFZ_gIvCpPYIzHzx9VG-VmuXMg'
    }
};

const movieGrid = document.querySelector("#movie-grid");
const loading = document.querySelector("#loading");

async function fetchResult(url, str) {
    const response = await fetch(url, options);
    const body = await response.json();
    if (str === "results") {
        const { results } = body;
        return results;
    } else if (str === "genres") {
        return body.genres;
    } else {
        return body.runtime;
    }
}

const genres = await fetchResult("https://api.themoviedb.org/3/genre/movie/list", "genres");

async function addCard(result) {
    loading.style.display = "";
    movieGrid.textContent = "";
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
    movieGrid.appendChild(article);
    article.appendChild(div1);
    article.appendChild(div2);
    div1.appendChild(img);
    div1.appendChild(span1);
    div1.appendChild(button1);
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
}

let results = await fetchResult("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc", "results");

for (let result of results) {
    addCard(result);
}

const searchInput = document.querySelector("#search");
const searchButton = document.querySelector("#search-btn");

searchButton.addEventListener("click", async e => {
    const value = searchInput.value.toLowerCase();
    if (value === "") {
        results = await fetchResult("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc", "results");
        for (let result of results) {
            addCard(result);
        }
    } else {
        results = await fetchResult(`https://api.themoviedb.org/3/search/movie?query=${value}&include_adult=false&language=en-US&page=1`, "results");
        for (let result of results) {
            addCard(result);
        }
    }
});

const genreFilter = document.querySelector("#genre");
const ratingFilter = document.querySelector("#rating");
let genreFilterValue = "all";
let ratingFilterValue = "0";
const resultsValue = movieGrid.children;

function filtered(gFilter, rFilter, rValues) {
    if (gFilter === "all" && rFilter === "0") {
        for (let rValue of rValues) {
            rValue.style.display = "";
        }
    } else {
        for (let rValue of rValues) {
            const gValueFilter = rValue.children[1].querySelector(".genres").textContent.toLowerCase();
            const rValueFilter = rValue.children[0].querySelector(".rating").textContent.slice(2);
            if (gValueFilter.indexOf(gFilter) > -1 && Number(rValueFilter) >= Number(rFilter)) {
                rValue.style.display = "";
            } else {
                rValue.style.display = "none";
            }
        }
    }
}

genreFilter.addEventListener("change", e => {
    genreFilterValue = e.target.value.toLowerCase();
    filtered(genreFilterValue, ratingFilterValue, resultsValue);
});

ratingFilter.addEventListener("change", e => {
    ratingFilterValue = e.target.value;
    filtered(genreFilterValue, ratingFilterValue, resultsValue);
});