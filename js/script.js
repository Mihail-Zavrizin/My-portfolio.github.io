    function сinemaSearch() {
        const searchForm = document.querySelector('.search-form');
        const movie = document.querySelector('.movies');
        const posterMovies = 'https://image.tmdb.org/t/p/w500';
        
        function apiSearch(event) {
            event.preventDefault();
            const searchText = document.querySelector('.form-control').value;
            if (searchText.trim().length === 0) {
                movie.innerHTML = '<h2 class="col-12 text-center text-danger">Вы не заполнили поле Поиска</h2>';
                return;
            }
            const server = 'https://api.themoviedb.org/3/search/multi?api_key=e0647a3a06e2e83c720cc24311bce535&language=ru&query=' + searchText; 


            movie.innerHTML = '<div class="spiner"></div>';
            fetch(server)
                .then((value) => {
                    if (value.status !== 200) {
                        return Promise.reject((new Error(value.status)));
                    }
                    return value.json();
                })
                .then((output) => {
                    let ineer = '';
                    if (output.results.length === 0) {
                        ineer = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>';
                    }
                    output.results.forEach((item) => {
                        const nameItem = item.name || item.title;
                        const poster = item.poster_path ? posterMovies + item.poster_path : '/src/Img/download.jpg';
                        let dataInfo = '';
                        if (item.media_type !== 'person') {
                            dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
                        }
                        ineer += `<div class="col-12 col-md-6 col-lg-4 col-xl-3">
                        <img src="${poster}"class="img-poster" alt=${nameItem} ${dataInfo}></img> 
                        <h5 class search-title>${nameItem}</h5>
                        </div>`;
                    });
                    movie.innerHTML = ineer;
                    addEventMedia();

                })
                .catch((reason) => {
                    movie.innerHTML = `<h2 class="col-12 text-center text-danger">Ошибка Сервера ${reason}</h2>`;
                    console.error('error:' + reason);
                });
        }
        searchForm.addEventListener('submit', apiSearch);

        function addEventMedia() {
            const media = document.querySelectorAll('img[data-id]');
            media.forEach((elem) => {
                elem.style.cursor = 'pointer';
                elem.addEventListener('click', showFullInfo);
            });
        }



        function showFullInfo() { 
            const typeMedia = this.dataset.type;
            const mediaId = this.dataset.id;
            let url = '';
            if(typeMedia === 'movie') {
                url = `https://api.themoviedb.org/3/movie/${mediaId}?api_key=e0647a3a06e2e83c720cc24311bce535&language=ru`;
            }
            else if(typeMedia === 'tv') {
                url = `https://api.themoviedb.org/3/tv/${mediaId}?api_key=e0647a3a06e2e83c720cc24311bce535&language=ru`;
            }
            else movie.innerHTML = '<h2 class="col-12 text-center text-danger">Произошла ошибка повторите позже</h2>';
        
         fetch(url)
            .then((value) => {
                if (value.status !== 200) {
                    return Promise.reject((new Error(value.status)));
                }
                return value.json();
            })
            .then((output) => {
                let Transfers = '';
                let ganeres = '';
                const genres = output.genres;
               
                genres.forEach((item) => {
                    ganeres += ' ' + item.name;
                });
               
                if(output.status === 'Released') {
                    Transfers = 'Вышел';
                }
                else if(output.status === 'Returning Series') {
                    Transfers = 'Выходит';
                }
                else if(output.status === 'Ended') {
                    Transfers = 'Закончен'; 
                }

                const poster = output.poster_path ? posterMovies + output.poster_path : '/src/Img/download.jpg';
                    movie.innerHTML = `<h4 class="col-12 text-center text-info">
                    ${output.name || output.title}</h4> 
                     
                    <div class="col-12 col-lg-5">
                        <img src="${poster}" alt=
                        ${output.name || output.title}></img>
                         
                    ${(output.homepage) ? `<p class="text-center"><a class="linck" href="
                    ${output.homepage}" target="_blank">Официальная страничка Фильма</a></p>` 
                    : ''}    
                    ${(output.imdb_id) ? `<p class="text-center"><a class="linck" 
                    href="https://imdb.com/title/${output.imdb_id}" target="_blank">Страница на IMDB.com </a></p>`: ''}
                </div>
                 <div class=" col-12 col-lg-7">
                    <p> Рейтинг: ${output.vote_average}</p>
                    <p> Статус: ${Transfers}</p>
                    <p> Жанры${ganeres}</p>
                    <p> Премьера: ${output.release_date || output.first_air_date}</p>
                    ${(output.last_episode_to_air) ? `<p>${output.number_of_seasons}
                    сезонов вышло <p>`: ''}
                    <p>${output.overview}</p>
                    <div class="youtupe"</div>
                </div>`;
                getVideo(typeMedia, mediaId);
            })
            .catch((reason) => {
                movie.innerHTML = `<h2 class="col-12 text-center text-danger">Ошибка Сервера 
                ${reason}</h2>`;
                console.error('error:' + reason);
            });
            
        }

        document.addEventListener('DOMContentLoaded', () => {
            const trendsOfTheWeek =  'https://api.themoviedb.org/3/trending/all/week?api_key=e0647a3a06e2e83c720cc24311bce535&language=ru';
            fetch(trendsOfTheWeek)
                .then((value) => {
                    if (value.status !== 200) {
                        return Promise.reject((new Error(value.status)));
                    }
                    return value.json();
                })
                .then((output) => {
                    let ineer = '<h4 class="col-12 text-center text-info">Тренды недели</h4>';
                    if (output.results.length === 0) {
                        ineer = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>';
                    }
                    output.results.forEach((item) => {
                        const nameItem = item.name || item.title;
                        let mediaType = item.title ? 'movie': 'tv';
                        const poster = item.poster_path ? posterMovies + item.poster_path : '/src/Img/download.jpg';
                        const dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
                        ineer += `<div class="col-12 col-md-6 col-lg-4 col-xl-3">
                        <img src="${poster}"class="img-poster" alt=${nameItem} ${dataInfo}></img> 
                        <h5 class search-title>${nameItem}</h5>
                        </div>`;
                    });
                    movie.innerHTML = ineer;
                    addEventMedia();

                })
                .catch((reason) => {
                    movie.innerHTML = `<h2 class="col-12 text-center text-danger">Ошибка Сервера ${reason}</h2>`;
                    console.error('error:' + reason);
                });
        });
    

        
        function getVideo(type,id) {
            let youtupe = movie.querySelector('.youtupe');
            const movieApiKey = `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=e0647a3a06e2e83c720cc24311bce535&language=ru`;
            fetch(movieApiKey)
            .then((value) => {
                if (value.status !== 200) {
                    return Promise.reject((new Error(value.status)));
                }
                return value.json();
            })
            .then((output) => {
                    let wideoFreim = '<h5 class="text-info">Трейлеры</h5>';
                    
                    if(output.results.length === 0) {
                        wideoFreim = '<p> К сожалению Трейлер отсутствует</p>';
                    }

                    output.results.forEach((item) => {
                       
                    wideoFreim  += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                });
                
                youtupe.innerHTML =  wideoFreim;
            })    
             
            .catch((reason) => {
                youtupe.innerHTML = `<h2 class="col-12 text-center text-danger">Видео не найдено!
                ${reason}</h2>`;
                console.error('error:' + reason);
            });
            
        }
    
    }
        
    

    сinemaSearch();