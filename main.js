const imageWrapper = document.querySelector(".images")
const loadMoreBtn = document.querySelector(".load-more")
const searchInput = document.querySelector(".search-box input")
const lightBox = document.querySelector(".lightbox")
const colseBtn = lightBox.querySelector('.fa-xmark')
const downloadImgBtn = lightBox.querySelector('.fa-download')



const apikey = "GvLyDQA8iZ4Iq9UsS16bc2mObWV94okElXhsmzCVd9rPnDuENKKl6wUn"
const perPage = 12;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
    fetch(imgURL).then(res => res.blob()).then(file => {
        const a = document.createElement("a")
        a.href = URL.createObjectURL(file)
        a.download = new Date().getTime()
        a.click()
    }).catch(() => alert("Fail to download images!"))
}

const showLightBox = (name, img) => {
    lightBox.querySelector('img').src = img;
    lightBox.querySelector('span').innerText = name;
    downloadImgBtn.setAttribute('data-img', img)
    lightBox.classList.add('show')
    document.body.style.overflow = 'hidden'
}

const hideLightBox = () => {
    lightBox.classList.remove('show')
    document.body.style.overflow = 'scroll'

}

const generateHTML = (images) => {
    imageWrapper.innerHTML += images.map(img =>
        `<li class="card" onclick="showLightBox('${img.photographer}','${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="img">
        <div class="details">
            <div class="photographer">
                <i class="fa-solid fa-camera"></i>
                <span>${img.photographer}</span>
            </div>
            <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
                <i class="fa-solid fa-download"></i>
            </button>
        </div>
    </li>`
    ).join('')
}

const getImages = (apiURL) => {

    loadMoreBtn.innerText = 'Loading...';
    loadMoreBtn.classList.add('disabled');
    fetch(apiURL, {
        headers: { Authorization: apikey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = 'Load More';
        loadMoreBtn.classList.remove('disabled');
    }).catch(() => alert("Fail to load images!"))
}

const loadMoreImages = () => {

    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL)
}

const loadSearchImages = (e) => {
    if (e.target.value === "") return searchTerm = null;
    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value
        imageWrapper.innerHTML = ""
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`)
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

loadMoreBtn.addEventListener('click', loadMoreImages)
searchInput.addEventListener('keyup', loadSearchImages)
colseBtn.addEventListener('click', hideLightBox)
downloadImgBtn.addEventListener('click', (e) => downloadImg(e.target.dataset.img))