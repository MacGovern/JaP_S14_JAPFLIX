document.addEventListener('DOMContentLoaded', () => {
    function toggleOffcanvas(title, overview, genresArray, year, runtime, budget, revenue) {
        document.getElementById('offcanvasTopLabel').textContent = title;
        document.getElementById('offcanvasBody').innerHTML = `
            <p>${overview}</p>
            <hr>
            <div class="row">
                <div class="col">
                    <p class="genres">${genresArray.join(' - ')}</p>
                </div>
                <div class="col-auto btn-group">
                    <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        More
                    </button>
                    <ul class="dropdown-menu dropdown-menu-start">
                        <li class="dropdown-item">
                            <div class="row d-flex justify-content-between">
                                <span class="col-auto pe-0">Year: </span>
                                <span class="col-auto text-end ps-0">${year}</span>
                            <div>
                        </li>
                        <li class="dropdown-item">
                            <div class="row d-flex justify-content-between">
                                <span class="col-auto pe-0">Runtime: </span>
                                <span class="col-auto text-end ps-0">${runtime} mins</span>
                            <div>
                        </li>
                        <li class="dropdown-item">
                            <div class="row d-flex justify-content-between">
                                <span class="col-auto pe-0">Budget: </span>
                                <span class="col-auto text-end ps-0">$${budget}</span>
                            <div>
                        </li>
                        <li class="dropdown-item">
                            <div class="row d-flex justify-content-between">
                                <span class="col-auto pe-0">Revenue: </span>
                                <span class="col-auto text-end ps-0">$${revenue}</span>
                            <div>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    }

    document.getElementById('btnBuscar').addEventListener('click', () => {
        function removeDiacritics(str) { // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript (primera respuesta).
            return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
        }

        const lista = document.getElementById('lista');
        const inputBuscar = document.getElementById('inputBuscar');
        const keyWord = removeDiacritics(inputBuscar.value).toLowerCase();

        function inGenres(film) {
            let index = 0;
            let flag = false;
            while (index < film.genres.length && !flag) {
                flag = removeDiacritics(film.genres[index].name).toLowerCase().includes(keyWord);
                index++;
            }
            return flag;
        }

        async function bringMedia(keyWord) {
            try {
                const response = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
                const mediaArray = await response.json();
                mediaArray.forEach(film => {
                    if (removeDiacritics(film.title).toLowerCase().includes(keyWord) || removeDiacritics(film.overview).toLowerCase().includes(keyWord) || removeDiacritics(film.tagline).toLowerCase().includes(keyWord) || inGenres(film)) {
                        const li = document.createElement('li');
                        li.classList.add('list-group-item');
                        li.setAttribute('type', "button");
                        li.setAttribute('data-bs-toggle', "offcanvas");
                        li.setAttribute('data-bs-target', "#offcanvasTop");
                        li.setAttribute('aria-controls', "offcanvasTop");
                        let stars = "";
                        for (let i = 1; i <= Math.round(film.vote_average / 2); i++)
                            stars += `<i class="checked fa fa-star"></i>`; // Estrella checked.
                        for (let i = 1; i <= 5 - Math.round(film.vote_average / 2); i++)
                            stars += `<i class="fa fa-star"></i>`; // Estrella unchecked.
                        li.innerHTML = `
                            <div class="row">
                                <div class="col">
                                <h5>${film.title}</h5>
                                </div>
                                <div class="col text-end">
                                    ${stars}
                                </div>
                            </div>                            
                            <p class="fst-italic">${film.tagline}</p>                            
                        `;
                        li.addEventListener('click', () => {
                            toggleOffcanvas(film.title, film.overview, film.genres.map(genre => genre.name), film.release_date.substring(0, 4), film.runtime, film.budget, film.revenue);
                        });
                        lista.appendChild(li);
                    }
                });
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }

        if (inputBuscar.value !== '') {
            lista.innerHTML = '';
            bringMedia(keyWord);
        }
    });
})