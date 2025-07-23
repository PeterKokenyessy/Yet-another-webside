
const loadEvent = async function () {
    await renderCollection();
    const apiPathData = await getDataFromApi("http://localhost:6969/api/details");
    console.log(`API Path Data:`, apiPathData);
    const apiPath = `${apiPathData[0].apiAllGifsDatas}${apiPathData[0].gifApiTopic}${apiPathData[0].maxLimit}`;
    console.log(`API Path:`, apiPath);

    const root = document.getElementById("main-body");
    const searchButton = document.getElementById("search-button");


    let currentData = ""

    searchButton.addEventListener("click", async function () {
        console.log(`Search button clicked`);
        const searchInput = document.getElementById("search-input");
        const maxLimitInput = document.getElementById("search-input-max-length");
        console.log(`Search Limit Value:`, maxLimitInput.value);
        let maxLength = null
        //apiPathData[0].gifApiTopic = searchInput.value;
        if (maxLimitInput.value === "" || isNaN(maxLimitInput.value) || parseInt(maxLimitInput.value) <= 0) {
            maxLength = 30; // Default value if input is empty
        } else {
            maxLength = parseInt(maxLimitInput.value);
        }


        console.log(`API Path Data after input:`, apiPathData);
        const newApiUrl = `https://api.giphy.com/v1/gifs/search?api_key=JTQ5tRcYUqk9fTAmpaiMe85s9UTGPlJy&q=${searchInput.value}&limit=${maxLength}`;
        const newData = await getDataFromApi(newApiUrl);
        // max length input !!!

        console.log(`New Data:`, newData);
        //await sendApiDataToServer(apiPathData[0].gifApiTopic, apiPathData[0].apiAllGifsDatas,apiPathData[0].maxLimit);
        //await sendDataToServer(newData.data);


        //currentData = await getDataFromApi("http://localhost:6969/api/gifs");
        console.log(`Current data:`, currentData);
        console.log(`Current data length:`, currentData.length);

        const gifList = document.getElementById("gif-list");
        gifList.innerHTML = "";
        currentData = renderCorrectStructureData(newData.data);
        listGifs(gifList, currentData);

        await renderCollection();
    });

    //const datas = await getDataFromApi(apiPath)
    console.log(`Result:`, currentData)

    //await sendDataToServer(datas.data)

    const editorHeader = document.createElement("header");
    editorHeader.classList.add("editor-nav");
    editorHeader.appendChild(createTagElement("h1", "editor-title", "Giphy Editor"));
    root.insertAdjacentElement("afterbegin", editorHeader);

    //const currentData = await getDataFromApi("http://localhost:6969/api/gifs");
    console.log(`Current data2:`, currentData);

    const gifList = document.getElementById("gif-list");
    gifList.innerHTML = "Search for gifs to add them to your collection!";
    //listGifs(gifList, currentData);
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
async function sendApiDataToServer(gifApiTopic, apiAllGifsDatas, maxLimit) {
    let newData = {
        "gifApiTopic": gifApiTopic,
        "apiAllGifsDatas": "https://api.giphy.com/v1/gifs/search?api_key=JTQ5tRcYUqk9fTAmpaiMe85s9UTGPlJy&q=",
        "maxLimit": maxLimit
    }
    const jsonData = JSON.stringify(newData);
    try {
        const response = await fetch('http://localhost:6969/api/details', {
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

    }
    catch (error) {
        console.error("Error at file sending:", error);
    }

}
function renderCorrectStructureData(data) {
    return data.map(element => {
        return {
            "url": element.images.downsized_medium.url,
            "title": element.title.split(" "),
            "price": parseFloat((Math.random() * 9 + 1).toFixed(1)),
            "id": element.id
        }
    });
}

async function sendDataToServer(data) {
    let newData = data.map(element => {
        return {
            "url": element.images.downsized_medium.url,
            "title": element.title.split(" "),
            "price": element.price,
            "id": element.id
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
        const productItem = document.createElement("li");

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

        const button = document.createElement("button");
        button.textContent = "Add"
        button.classList.add("add-button")

        button.addEventListener("click", async () => {
            const productsDatas = await getDataFromApi("http://localhost:6969/api/gifs");
            console.log(`Products data:`, productsDatas);
            const isAlreadyInCollection = productsDatas.find(item => item.id === products.id);
            if (isAlreadyInCollection) {
                alert("This gif is already in your collection!");
                return;
            }
            console.log(products.title, "title");
            const singleProduct = {
                "url": products.url,
                "title": products.title,
                "price": products.price,
                "id": products.id
            };
            try {
                const response = await fetch("http://localhost:6969/api/gifs/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(singleProduct)
                });
                if (!response.ok) throw new Error("Failed to add product");
                const result = await response.json();
                console.log("product added successfully:", result);
                //alert("Gif added");

                await renderCollection();

            } catch (error) {
                console.error("Error adding product:", error);
            }
        })


        productItem.appendChild(img);
        productItem.appendChild(title);
        productItem.appendChild(price);
        productItem.appendChild(button);

        gifList.appendChild(productItem);
    });
}


async function renderCollection(){
    const collectionList = document.getElementById("collection-list");
    const data = await getDataFromApi("http://localhost:6969/api/gifs");

    collectionList.innerHTML = "";

    data.forEach(item => {
        const li = document.createElement("li");

        const img = document.createElement("img");
        img.src = item.url
        img.alt = Array.isArray(item.title) ? item.title.join(" ") : item.title;
        img.style.width = "100%";
        img.style.borderRadius = "8px"

        const title = document.createElement("P");
        title.textContent = renderCollectionTitle(item.title);
        title.style.fontSize = "0.9rem";

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.classList.add("remove-buton");

        removeButton.addEventListener("click", async () => {
            try{
                const response = await fetch("http://localhost:6969/api/gifs/remove", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ url: item.url})
                });
                if (!response.ok) throw new Error("Failed to remove item");
                await renderCollection();
                //alert("Removed from collection")

            } catch (err){
                console.error("Error removing gif:", err);

            }
        });

        li.appendChild(img);
        li.appendChild(title);
        li.appendChild(removeButton);

        collectionList.appendChild(li);
    });
}

function renderCollectionTitle(title) {
    return Array.isArray(title) ? title.join(" ") : title;
}


window.addEventListener("load", loadEvent);