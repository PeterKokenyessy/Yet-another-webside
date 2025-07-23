

let tempcart = JSON.parse(localStorage.getItem("cart"));
let cart = [];
 if(tempcart){
    cart = tempcart;
 }

async function main() {
    displayHomePage()

    const homeBtn = document.getElementById('nav-home');
    homeBtn.addEventListener('click', displayHomePage)

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
                        <div class="dots1"></div>
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
            const cardRoot = document.createElement('div');
            cardRoot.classList.add('normalCard');
            const card = document.createElement('div');
            card.classList.add('cardContainer')
            card.innerHTML = gifDisplayStrucure(gif);

            const cartBtn = document.createElement('button');
            cartBtn.textContent = "🍽️";
            cartBtn.id = gif.id;

            const btnAddedValidator = cart.some(e => e.id === gif.id);
            if(btnAddedValidator){
                cartBtn.classList.add('activeAdd');
            }
            
            cartBtn.classList.add("cartBtn")
            cartBtn.addEventListener('click',(e) => addToCartBtn(e))

            card.appendChild(cartBtn)
            cardRoot.appendChild(card);
            root.appendChild(cardRoot);
        }
    }
}

async function addToCartBtn (e){// le lehet ellenorizni az eloot is a dolgot mielott lehivod.
    const btn = e.target;
    btn.classList.toggle('activeAdd');
    const currentGif = await getGifById(btn.id);   
    const existValidator = cart.some(e => e.id === currentGif.id);

    if(!existValidator){
        cart.push(currentGif);
        localStorage.setItem('cart',JSON.stringify(cart));
    } else {
        cart = cart.filter(e => e.id !== currentGif.id);
        localStorage.setItem('cart',JSON.stringify(cart));
    }
    console.log(cart);
    
}

async function getGifById(id) {
    try {
        const res = await fetch(`/api/id/${id}`);
        const body = await res.json();
        return body;
    } catch (err) {
        console.log(err);        
    }
}

function gifDisplayStrucure(gif) {
    return `
            <div class="cardImg">
                <img src="${gif.url}" alt="gif">
            </div>
            <div class="tag">
                <span>${gif.price}</span>
                <span> $</span>
            </div>`;
}

window.addEventListener('load', main);