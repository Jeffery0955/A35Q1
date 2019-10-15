//==========A.HTML載入宣告區==========

const genres = {
  "1": "Action",
  "2": "Adventure",
  "3": "Animation",
  "4": "Comedy",
  "5": "Crime",
  "6": "Documentary",
  "7": "Drama",
  "8": "Family",
  "9": "Fantasy",
  "10": "History",
  "11": "Horror",
  "12": "Music",
  "13": "Mystery",
  "14": "Romance",
  "15": "Science Fiction",
  "16": "TV Movie",
  "17": "Thriller",
  "18": "War",
  "19": "Western"
};
const genresArray = Object.values(genres);
genresArray.unshift("");
const allMovieDatas = [];
const ITEM_PER_PAGE = 12;
const POSTER_URL = "https://movie-list.alphacamp.io/posters/";
const dataPanel = document.querySelector("#data-panel");
const pagination = document.querySelector("#pagination");
const movieGenres = document.querySelector(".movieGenres");
let bufferString = "";
let currentGenres = 1;  //記錄目前電影類型
let currentMovies = [];
//==========B.HTML產生區==========
(function () {  //產生影片分類區
  bufferString = `<div class="list-group" id="list-tab" role="tablist">`;
  bufferString += `<a class="list-group-item list-group-item-action active" data-toggle="list" href="#" role="tab" data-genre="${1}">${genresArray[1]}</a>`;
  for (let i = 2; i < genresArray.length; ++i) {
    bufferString += `<a class="list-group-item list-group-item-action " data-toggle="list" href="#" role="tab" data-genre="${i}">${genresArray[i]}</a>`;
  }
  bufferString += "</div>";
  movieGenres.innerHTML = bufferString;
})();
axios.get("https://movie-list.alphacamp.io/api/v1/movies").then(response => {
  allMovieDatas.push(...response.data.results);
  selectGenre();
})

//==========C.HTML產生後宣告區==========
//==========D.動態執行區==========
function selectGenre() {
  console.log(currentGenres);
  currentMovies = allMovieDatas.filter(movie => {
    return movie.genres.includes(currentGenres);
  });
  console.log(currentMovies);
  getPageData(1, currentMovies);
  getTotalPages(currentMovies.length);
}
function getPageData(pageNum, data) {
  let offset = (pageNum - 1) * ITEM_PER_PAGE;
  let pageData = data.slice(offset, offset + ITEM_PER_PAGE);
  displayDataList(pageData);
}
function displayDataList(data) {
  let bufferString = "";
  data.forEach(function (movie, index) {
    bufferString += `
        <div class="col-sm-3 card-deck">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${movie.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${movie.title}</h6>
            </div>
          <div class="card-footer  text-muted">`;

    movie.genres.forEach((item, index) => {
      if (index !== movie.genres.length - 1) {
        bufferString += `<span>${genresArray[item]}、</span>`;
      } else {
        bufferString += `<span>${genresArray[item]}</span>`;
      }

    })

    bufferString += `</div>
          </div>
        </div>
      `;
  });
  dataPanel.innerHTML = bufferString;
}
function getTotalPages(totalPages) {
  totalPages = Math.floor(totalPages / ITEM_PER_PAGE) + 1;
  let pageItemContent = "";
  for (let i = 0; i < totalPages; i++) {
    pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="#" data-page="${i + 1}">${i + 1}</a>
        </li>
      `;
  }
  pagination.innerHTML = pageItemContent;
}
pagination.addEventListener("click", event => {
  if (event.target.tagName === "A") {
    getPageData(event.target.dataset.page, currentMovies);
  }
});
movieGenres.addEventListener("click", event => {
  if (event.target.tagName === "A") {
    currentGenres = Number(event.target.dataset.genre);
    selectGenre();
  }
});