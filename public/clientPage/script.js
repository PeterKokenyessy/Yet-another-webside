function main (){

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