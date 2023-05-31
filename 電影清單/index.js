const Base_Url = 'https://webdev.alphacamp.io/'
const Index_Url = Base_Url + 'api/movies/'
const Poster_Url = Base_Url + 'posters/'
const search_form = document.querySelector('#search-form')
const daytaPanel = document.querySelector('#data-panel')
const searchInput = document.querySelector('#search-input')
const movie_per_page = 12
const pageNav = document.querySelector('#paginators')
const ModeChangeSwitch = document.querySelector('#change-mode')
let filterMovie = []
let currentPage = 1
function renderMovieList(data){
  if(daytaPanel.dataset.mode==="card-mode"){
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
                          <button class="btn btn-info btn-add-favorate "data-id="${item.id}">+</button> 
                    </div>
                </div>
  
            </div>
  
        </div>
         `  
  });
    daytaPanel.innerHTML = rawHtml

  }else if(daytaPanel.dataset.mode==="list-mode"){

    let rawHTML = `<ul class="list-group col-sm-12 mb-2">`
    data.forEach((item) => {
      rawHTML += `
      <li class="list-group-item d-flex justify-content-between">
        <h5 class="card-title">${item.title}</h5>
        <div>
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal"
            data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </li>`
    })
    rawHTML += '</ul>'
    daytaPanel.innerHTML = rawHTML
  }
  }
  
  //切換不同顯示方式

  function changedisplaymode(displaymode){
     if(daytaPanel.dataset.mode==="displaymode") return 
     daytaPanel.dataset.mode = displaymode  
  }

//監聽事件
ModeChangeSwitch.addEventListener('click',function Modechanging(event){
if(event.target.matches('#list-mode-button')){
    changedisplaymode('list-mode')
    renderMovieList(getMovieByPage(currentPage))  
}else if(event.target.matches('#card-mode-button')){
    changedisplaymode('card-mode')
    renderMovieList(getMovieByPage(currentPage))
}
console.log(daytaPanel.dataset.mode)
})


// 電影分頁器
function getMovieByPage(page){

const data =  filterMovie.length ? filterMovie:movies
const pageIndex = (page-1)*movie_per_page
    return data.slice(pageIndex,pageIndex+movie_per_page)
}

function  renderPaginator(amount){
    const numberofpage = Math.ceil(amount/movie_per_page)
    let rawHTML = ''
    for(let page =1; page<=numberofpage; page++){
        rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`  
    }
    pageNav.innerHTML = rawHTML
}

pageNav.addEventListener('click',function pageworkfunction(event){
if(event.target.tagName!=='A') return
const page = Number(event.target.dataset.page)
renderMovieList(getMovieByPage(page))
})

// Modal
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
// 電影加入收藏
function addFavorate(id){
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = movies.find((movie) => movie.id === id)
    if (list.some((movie) => movie.id === id)) {
      return alert('此電影已經在收藏清單中！')
    }
    list.push(movie)
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
}


daytaPanel.addEventListener('click',function onPanelClick(event){
if(event.target.matches('.btn-show-movie')){
//console.log(event.target.dataset)
showMovieModal(Number(event.target.dataset.id))
}else if(event.target.matches('.btn-add-favorate')){
addFavorate(Number(event.target.dataset.id))
}

})
search_form.addEventListener('submit',function sumitformClick(event){
    event.preventDefault()
    const keyword = searchInput.value.trim().toLowerCase()
    filterMovie = movies.filter((movie)=>
movie.title.toLowerCase().includes(keyword)
    )
    if(filterMovie.length===0){
        return alert('cannot find movie in keywords')
        } 
    renderPaginator(filterMovie.length)
    renderMovieList(getMovieByPage(1))
})

const movies = []

axios.get(Index_Url).then(response => {  
movies.push(...response.data.results)
renderPaginator(movies.length)
renderMovieList(getMovieByPage(currentPage))

    })