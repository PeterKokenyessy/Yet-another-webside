async function main() {
    displayHomePage()

    const homeBtn = document.getElementById('nav-home');
    homeBtn.addEventListener('click', displayHomePage)

    const categoryBtn = document.getElementById('nav-cat');
    categoryBtn.addEventListener('click', categoryBtnEvent)

    const aboutBtn = document.getElementById('nav-ab');
    aboutBtn.addEventListener('click', aboutBtnEvent)
}

function categoryBtnEvent() {
    const content = document.getElementById('content');
    content.innerHTML = '';
}

function aboutBtnEvent() {
    const content = document.getElementById('content');
    content.innerHTML = '';
}
function displayHomePageCards(homePageGif) {
    const container = document.getElementById('right');

    for (let i = 0; i < homePageGif.length; i++) {
        if(homePageGif[i].url){
        const cards = document.createElement("img");
        cards.src = homePageGif[i].url
        cards.classList.add(`cards`, `card${i}`);
        container.appendChild(cards);
        }
    }
}

async function getdataFromTo(from, to) {
    try {
        const res = await fetch(`/api/fromTo/${from}/${to}`);
        const body = await res.json();
        return body;
    } catch (error) {
        console.log(error);
    }
}

async function displayHomePage() {
    const datas = await getdataFromTo(0, 20);
    const homePageHtmlStruc = document.getElementById('content');
    homePageHtmlStruc.innerHTML = `
            <div id="container">

            <div id="left">
                <div class="center">
                    <div class="text">Adj hangulatot az üzeneteidnek.<br>Kezdj egy gif-fel!
                        <div class="dots"></div>
                        <div calss="dots1"></div>
                    </div>
                </div>
            </div>
            <div id="right"></div>
        </div>
        <div class="search-wrapper">
            <input type="text" placeholder="Search" id="search">
            <button>Search</button>
        </div>
        <div id="moreGif">
        </div>
    `
    displayHomePageCards(datas);
    displayHomeMoreCard()
}

async function displayHomeMoreCard() { //refactoralni majd keresesre.
    const root = document.getElementById('moreGif');
    const gifes = await getdataFromTo(20, 40);

    for (const gif of gifes) {
        if (gif.url) {
            const card = document.createElement('div');
            card.classList.add('normalCard');
            card.innerHTML = gifDisplayStrucure(gif);

            const cartBtn = document.getElementById('button');

            root.appendChild(card);
        }
    }
}

function gifDisplayStrucure(gif) {
    return `
        <div class="cardContainer">
            <div class="cardImg">
                <img src="${gif.url}" alt="gif">
            </div>
            <div class="tag">
                <span>${gif.price}</span>
                <span> $</span>
            </div>
            <div>
            <button id="${gif.id}"></button>
            </div>
        </div>`;
}

window.addEventListener('load', main);