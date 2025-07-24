let tempcart = JSON.parse(localStorage.getItem("cart"));
let cart = [];
 if(tempcart){//hogy meg egyezik e a product json-nel.
    cart = tempcart;
 }

async function main() {
    displayHomePage();

    const homeBtn = document.getElementById('nav-home');
    homeBtn.addEventListener('click', displayHomePage);

    const cartBtn = document.getElementById('nav-cart');
    cartBtn.addEventListener("click", cartBtnEvent);

    const aboutBtn = document.getElementById('nav-ab');
    aboutBtn.addEventListener('click', aboutBtnEvent);
}

async function search(tag) {

    if(tag === ""){
        tag = "empty";
    }
    
    const gifs = await getSearchDatas(tag);
    displayNormalGifCard(gifs);

}

async function getSearchDatas (search) {
    try {
        let tmpsearch = encodeURIComponent(search.trim());
        const res = await fetch(`/api/search/${tmpsearch}`);
        const body = await res.json();
        return body
    } catch (err) {
        console.log(err);
        
    }
}

function cartBtnEvent() {
    const content = document.getElementById('content');
    content.innerHTML = `
    <div id="container">
    <div id="cartContainer"></div>
    <div id="cartSummary">
      <div id="totalText">Total: <span id="totalPrice">0 $</span></div>
      <button id="buyButton">Buy it</button>
    </div>
    </div>
    `;

    const buyBtn = document.getElementById("buyButton");
    buyBtn.addEventListener("click",() => alert("You realy want to buy free stuff HUH?"))

    const root = document.getElementById('cartContainer');
    
    cart.forEach((gif) => {
        const div = document.createElement('div');
        div.classList.add("gifContainer");
        div.id = gif.id;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "❌";
        deleteBtn.addEventListener('click',(e) =>{
            deleteFromCart(e);
        });

        const img = document.createElement('img');
        img.src = gif.url;
        img.alt = "gif";

        const span = document.createElement("span");
        const p = document.createElement("span");
        p.classList.add("price");
        p.textContent = gif.price+" $";

        const p1 = document.createElement("span");
        p1.textContent = gif.title.join(" ");
        p1.classList.add("title");

        span.appendChild(p1);
        span.appendChild(p);

        const plusBtn = document.createElement('button');
        plusBtn.textContent = "+";
        plusBtn.addEventListener("click",e => addBtnCount(e));

        const input = document.createElement('input');
        input.type = "number";
        input.value = gif.count;
        input.id = "count";
        input.addEventListener("keydown", e => {
            if(e.key === "Enter")
                inputKeydown(e);
        })

        const minusBtn = document.createElement('button');
        minusBtn.textContent = "-";
        minusBtn.addEventListener('click',e => minusBtnCount(e))

        div.appendChild(deleteBtn);
        div.appendChild(img);
        div.appendChild(span);
        div.appendChild(minusBtn);
        div.appendChild(input);
        div.appendChild(plusBtn);

        root.appendChild(div);
        szumPrice()
    })


}

function szumPrice (){
    const span = document.getElementById('totalPrice')
    let szum = cart.reduce((acc,curr) => acc + (curr.price * curr.count),0);
    szum = szum.toFixed(1);
    span.textContent = szum + " $"
}

function inputKeydown(e){
    const div = e.target.closest("div");
    const actualGif = cart.find(e => e.id === div.id);

    if(e.target.value > 0){   
    actualGif.count = e.target.value;

    localStorage.setItem('cart', JSON.stringify(cart));
    szumPrice()
    }else{
        e.target.value = actualGif.count;
        alert('Heeeey Brooooo!!!!');
    }
}

function deleteFromCart(e) {
    const div = e.target.closest("div");
    cart = cart.filter(e => e.id !== div.id);
    div.remove();

    localStorage.setItem('cart', JSON.stringify(cart));
    szumPrice();
}
function addBtnCount(e) {
    const div = e.target.closest("div");
    const input = div.querySelector('input[type="number"]');
    if (input) {
        const count = Number(input.value) + 1;
        if(! (count < 0)){
        input.value = count

        const actualGif = cart.find(gif => gif.id === div.id);
        if (actualGif) {
            actualGif.count = Number(input.value);
            localStorage.setItem('cart', JSON.stringify(cart));
            szumPrice();
        }
        } else{
            alert("Heeeeey Broooo!!!!")
        }
        
        
    }
}

function minusBtnCount(e) {
    const div = e.target.closest("div");
    const input = div.querySelector('input[type="number"]');
    if (input) {
        const count = Number(input.value) - 1;
        
        
        if (! (count < 0)){
        input.value = count
        
        const actualGif = cart.find(gif => gif.id === div.id);
        if (actualGif) {
            actualGif.count = Number(input.value);
            localStorage.setItem('cart', JSON.stringify(cart));
            szumPrice();
        }
        } else{
            alert("Heeeeey Broooo")
        }
    }
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
        cards.classList.add(`cards`,`card${i}`);
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
                    <div class="text">Add flair to your messages.<br>Start with a gif!
                        <div class="dots"></div>
                        <div class="dots1"></div>
                    </div>
                </div>
            </div>
            <div id="right"></div>
        </div>
        <div class="search-wrapper">
            <input type="text" placeholder="Search" id="search">
            <button id="searchBtn">Search</button>
        </div>
        <div id="moreGif">
        </div>
    `
    displayHomePageCards(datas);
    displayHomeMoreCard()
        const searchInput = document.getElementById('search');
    searchInput.addEventListener('keydown',(e) => {
        console.log("hello");
        
        if(e.key === "Enter"){
            search(e.target.value);
        }
    })

    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click',(e) => {
        console.log("hello");
        const searchInput = document.getElementById('search'); 
        const value = searchInput.value;
        search(value);
    })
}

async function displayHomeMoreCard(params) {
     const gifes = await getdataFromTo(20,60);
    displayNormalGifCard(gifes);
}

async function displayNormalGifCard(gif) { //refactoralni majd keresesre.
    const root = document.getElementById('moreGif');
    root.innerHTML = ""
    const gifes = gif
   

    for (const gif of gifes) {
        if (gif) {
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

            card.appendChild(cartBtn);
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
        currentGif.count = 1
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