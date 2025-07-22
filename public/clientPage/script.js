async function main (){
    let datas = await getdataFromTo(1,20);
    console.log(datas);
    displayHomePageCards(datas);
    
}

function displayHomePageCards (homePageGif){
    const container = document.getElementById('right');

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const cardWidth = 100;
    const cardHeight = 140;

    for(let i = 0 ; i < homePageGif.length;i++){
        const cards = document.createElement("img");
        cards.src = homePageGif[i].url
        cards.classList.add(`cards`,`card${i}`);
        container.appendChild(cards);
    }

}

async function getdataFromTo(from,to) {
    try {
        const res = await fetch(`/api/fromTo/${from}/${to}`);
        const body = await res.json();
        return body;
    } catch (error) {
        
    }
}
window.addEventListener('load',main);