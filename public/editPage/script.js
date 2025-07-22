let gifApiTopic = "goofy-cats";
let allGifsDatas = `https://api.giphy.com/v1/gifs/search?api_key=JTQ5tRcYUqk9fTAmpaiMe85s9UTGPlJy&q=${gifApiTopic}&limit=30`

const loadEvent = async function () {
    const root = document.getElementById("main-body");
    const searchButton = document.getElementById("search-button");
    await searchButton.addEventListener("click", async function () {
        const searchInput = document.getElementById("search-input");
        gifApiTopic = searchInput.value;
        const newApiUrl = `https://api.giphy.com/v1/gifs/search?api_key=JTQ5tRcYUqk9fTAmpaiMe85s9UTGPlJy&q=${gifApiTopic}&limit=30`;
        const newData = await getDataFromApi(newApiUrl);    
        console.log(`New data:`, newData);
        const gifList = document.getElementById("gif-list");
        gifList.innerHTML = ""; 
        listGifs(gifList, newData.data);
    });

    const datas = await getDataFromApi(allGifsDatas)
    console.log(`Result:`, datas)

    await sendDataToServer(datas.data)

    const editorHeader = document.createElement("header");
    editorHeader.classList.add("editor-nav");
    editorHeader.appendChild(createTagElement("h1", "editor-title", "Giphy Editor"));
    root.insertAdjacentElement("afterbegin", editorHeader);

    const currentData = await getDataFromApi("http://localhost:6969/api/gifs");
    console.log(`Current data:`, currentData);

    const gifList = document.getElementById("gif-list");
    gifList.innerHTML = "";
    listGifs(gifList, currentData);

};

async function getDataFromApi(api) {
    try {
        const promise = await fetch(api)
        if (!promise.ok) {
            throw Error(`Fetch error: ${promise.status}`);
        }
        const data = await promise.json();
        return data
    }
    catch (err) {
        console.error("Error in the fetching", err.message);
    }
}

function createTagElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) {
        element.classList.add(className);
    }
    if (textContent) {
        element.textContent = textContent;
    }
    return element;
}

async function sendDataToServer(data) {
    let newData = data.map(element => {
        return {
            "url": element.images.downsized_medium.url,
            "title": element.title.split(" "),
            "price": parseFloat((Math.random() * 9 + 1).toFixed(1))
        }
    });
    console.log(newData)

    const jsonData = JSON.stringify(newData)
    try {
        const response = await fetch('http://localhost:6969/api/gifs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        });

        if (!response.ok) {
            throw new Error("Error at the server site");
        }

        const serverResponse = await response.json();
        console.log("Server response:", serverResponse);

    } catch (error) {
        console.error("Error at file sending:", error);
    }

}

function listGifs(gifList, data) {
    data.forEach(products => {
        const productItem = document.createElement("li"); // <li> helyett <div>
        productItem.classList.add("product-item");

        const img = document.createElement("img");
        img.src = products.url;
        img.alt = products.title.join(" ");
        img.classList.add("product-image");

        const title = document.createElement("h2");
        title.classList.add("product-title");
        title.textContent = products.title.join(" ");

        const price = document.createElement("p");
        price.classList.add("product-price");
        price.textContent = `$${products.price.toFixed(2)}`;

        productItem.appendChild(img);
        productItem.appendChild(title);
        productItem.appendChild(price);

        gifList.appendChild(productItem);
    });
}

window.addEventListener("load", loadEvent);