

const global = {
    location: window.location.pathname,
    api_key: '3bf00ace9a6286886a6fd8b94eb32f49',
    url: false
}

function commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getParam(param) {
    const url_string = window.location.href;
    const url = new URL(url_string);
    return url.searchParams.get(param);
}

function isSelected() {
    const location = window.location.pathname;
    console.log({location: location})
    if (location === '/index.html') {
        document.querySelector('#popular-movies').classList.add('highlighted');
    } else if (location === '/popular-tv-shows.html') {
        document.querySelector('#popular-tv-shows').classList.add('highlighted');
    }
}

async function fetchData(action) {
    
    switch(action) {
        case 'getPopularMovies':
            global.url = `https://api.themoviedb.org/3/movie/popular?api_key=${global.api_key}`;
            break;
        case 'getMovie':
            global.url = `https://api.themoviedb.org/3/movie/${getParam('id')}?api_key=${global.api_key}`;
            break;
        case 'getPopularTV':
            break;
    }

    if (global.url) {
        const response = await fetch(global.url);
        const data = await response.json();
        global.url = null;
        return data;
    } else {
        console.log('url is null');
    }


}

async function displayPopularMovies() {
    const {results} = await fetchData('getPopularMovies');
    console.log(results);
    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
            ${movie.poster_path ? `<img class="image" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="empty-image">` : `<img class="image" src="./img/no-image.jpg" alt="empty-image">`}   
        </a>
        <div class="info">
            <h3 class="name">${movie.title}</h3>
            <p class="realese-date">${movie.release_date}</p>
        </div>
        `
        document.querySelector('#popular-movies .container').append(div);        
    });
}

async function displayMovieDetails() {
    const movie = await fetchData('getMovie');
    console.log(movie);

    //top

    const div = document.createElement('div');
    div.classList.add('top');
    div.innerHTML = `${movie.poster_path ? `
                <img class="img" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="">` : `<img class"img" src="./img/no-image.jpg" alt="">`}
                <div class="description">
                    <h3 class="title">${movie.title}</h3>
                    <div class="text">
                        <p class="rating">Rating: ${Math.round(movie.vote_average)}/10</p>
                        <p class="release-date">Released: ${movie.release_date}</p>
                        <p class="plot">${movie.overview}</p>
                        <p id="genres"><strong>Genres</strong><ul class="list">
                            ${movie.genres.map(genre => `<li>${genre.name}</li>`).join('')}
                        </ul></p>
                        <a id="home-page" href="#" target="_blank">Visit Movie Homepage</a>
                    </div>
                </div>
    `;

    document.querySelector('#movie-details .container').append(div);

    //bottom

    const divBottom = document.createElement('div');
    divBottom.classList.add('bottom');
    divBottom.innerHTML = `
    <h3 class="heading">MOVIE INFO</h3>
    <div class="info">
        <ul class="numbers">
            <li><span class="yellow">Budget: </span>$${commas(movie.budget)}</li>
            <li><span class="yellow">Revenue: </span>$${commas(movie.revenue)}</li>
            <li><span class="yellow">Runtime: </span>${movie.runtime} minutes</li>
            <li><span class="yellow">Status: </span>${movie.status}</li>
        </ul>
        <h4>Production Companies</h4>
        <p>${movie.production_companies.map(company => company.name).join(', ')}</p>
    </div>
    `
    document.querySelector('#movie-details .container').append(divBottom);
}

function router(location) {
    switch(location) {
        case '/index.html':
            displayPopularMovies();
            isSelected();
            console.log('in home page');
            break;
        case '/popular-tv-shows.html':
            isSelected();
            console.log('in popular tv page');
            break;
        case '/movie-details.html':
            displayMovieDetails();
            console.log('in movie details page');
            break;
    }
}

router(global.location);