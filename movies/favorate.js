const Base_Url = 'https://webdev.alphacamp.io/'
const Index_Url = Base_Url + 'api/movies/'
const Poster_Url = Base_Url + 'posters/'
const search_form = document.querySelector('#search-form')
const daytaPanel = document.querySelector('#data-panel')
const searchInput = document.querySelector('#search-input')
let movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
function renderMovieList(data){
  let rawHtml = '' 
  data.forEach((item) => {
    rawHtml+=`
    
     <div class="col-sm-3">
          <div class="mb-2">
              <div class="card">
                  <img src="${Poster_Url + item.image}" class="card-img-top" alt="Movie Poster">
                 <div class="card-body">
                     <h5 class="card-title">${item.title}</h5>
                  </div>
                  <div class="card-footer">
                        <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
                        <button class="btn btn-danger btn-remove-favorate "data-id="${item.id}">X</button> 
                  </div>
              </div>

          </div>

      </div>
     
    `  
});
  daytaPanel.innerHTML = rawHtml
} 

function showMovieModal(id){
const ModalTitle = document.querySelector('#movie-modal-title')
const ModalImg = document.querySelector('#movie-modal-img')
const ModalDate = document.querySelector('#movie-modal-date')
const ModalDescription = document.querySelector('#movie-modal-des')

axios.get(Index_Url + id).then(respounse =>{
    const data =respounse.data.results
    ModalTitle.innerText = data.title
    ModalDate.innerText = 'Release date: ' + data.release_date
    ModalDescription.innerText = data.description
    ModalImg.innerHTML = `<img src="${Poster_Url + data.image}" alt="movie-poster" class="img-fluid">`
})
}
function cancelFavorate(id){
    const movieindex = movies.findIndex((movie) => movie.id === id)
    movies.splice(movieindex,1)
    localStorage.setItem('favoriteMovies', JSON.stringify(movies))
    renderMovieList(movies)
}

daytaPanel.addEventListener('click',function onPanelClick(event){
if(event.target.matches('.btn-show-movie')){
//console.log(event.target.dataset)
showMovieModal(Number(event.target.dastaset.id))
}else if(event.target.matches('.btn-remove-favorate')){
cancelFavorate(Number(event.target.dataset.id))
}
})



renderMovieList(movies)