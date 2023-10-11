function removeDiacritics(str) { // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript (primera respuesta).
    return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function toggleOffCanvas(title, overview, genres) {
    console.log(title, overview, genres);
}

document.addEventListener('DOMContentLoaded', () => {
    const inputBuscar = document.getElementById('inputBuscar');
    const btnBuscar = document.getElementById('btnBuscar');
    const lista = document.getElementById('lista');

    btnBuscar.addEventListener('click', () => {
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
                        console.log(film.genres.map(genre => genre.name));
                        li.setAttribute('onclick', `toggleOffCanvas('${film.title}', '${film.overview}', '${film.genres.map(genre => genre.name)}')`);
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