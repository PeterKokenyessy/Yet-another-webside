
const loadEvent = async function () {
    await renderCollection();
    const collectionList = document.getElementById("collection-list");
    const gifList = document.getElementById("gif-list");
    const addAllButton = document.getElementById("collect-all-button");



    const apiPathData = await getDataFromApi("http://localhost:6969/api/details");
    console.log(`API Path Data:`, apiPathData);

    const root = document.getElementById("main-body");
    const searchButton = document.getElementById("search-button");
    collectionList.addEventListener("click", async function (event) {
        if (event.target && event.target.classList && event.target.classList.contains("remove-button")) return;
        const li = event.target.closest("li");
        if (!li) return;
        let datas = await getDataFromApi("http://localhost:6969/api/gifs");
        const product = datas.find(item => item.url === li.querySelector("img").src);
        if (!product) return;

        const popupContainer = document.getElementById("popup-container");
        const details = document.getElementById("popup-content");
        let gifUrl = product.url;
        let gifTitle = product.title.join(" ");
        let gifPrice = `$${product.price}`

        const oldButton = document.getElementById("save-changes-button");
        const newButton = oldButton.cloneNode(true);
        oldButton.parentNode.replaceChild(newButton, oldButton);
        newButton.addEventListener("click", async function () {
            const newPriceInputValue = document.getElementById("new-price-input").value;
            const newTitleInputValue = document.getElementById("new-title-input").value;
            gifTitle = newTitleInputValue || gifTitle; // Use new title if provided, otherwise keep the old one
            gifPrice = newPriceInputValue ? `$${parseFloat(newPriceInputValue).toFixed(2)}` : gifPrice; // Use new price if provided, otherwise keep the old one

            datas = datas.map(element => {
                if (element.url === gifUrl) {
                    return {
                        ...element,
                        title: gifTitle.split(" "),
                        price: parseFloat(newPriceInputValue) || element.price // Use new price if provided, otherwise keep the old one
                    };
                }
                return element;
            })
            await sendDataToServer(datas);
            renderPopupDiv();

        })
        function renderPopupDiv() {
            details.innerHTML = "";

            const popupImage = document.createElement("img");
            popupImage.classList.add("popup-image");
            popupImage.id = "popup-image";
            popupImage.src = gifUrl;
            details.appendChild(popupImage);

            const popupTitle = document.createElement("h2");
            popupTitle.classList.add("popup-title");
            popupTitle.id = "popup-title";
            popupTitle.textContent = gifTitle;
            details.appendChild(popupTitle);

            const popupPrice = document.createElement("p");
            popupPrice.classList.add("popup-price");
            popupPrice.id = "popup-price";
            popupPrice.textContent = gifPrice;
            details.appendChild(popupPrice);

            popupContainer.classList.remove('hidden');

        }
        renderPopupDiv();


    });


    const closePopupButton = document.getElementById("close-popup-button");
    closePopupButton.addEventListener("click", async function () {
        let newTitleInputValue = document.getElementById("new-title-input");
        let newPriceInputValue = document.getElementById("new-price-input");
        newPriceInputValue.value = ""
        newTitleInputValue.value = "";

        const popupContainer = document.getElementById("popup-container");

        popupContainer.classList.add('hidden');
        await renderCollection();


    });

    let currentData = ""

    searchButton.addEventListener("click", async function () {
        console.log(`Search button clicked`);
        const searchInput = document.getElementById("search-input")
        const maxLimitInput = document.getElementById("search-input-max-length");

        await sendApiDataToServer(searchInput.value, "https://api.giphy.com/v1/gifs/search?api_key=JTQ5tRcYUqk9fTAmpaiMe85s9UTGPlJy&q=", parseInt(maxLimitInput.value) || 30);
        if (searchInput.value !== "") {
            addAllButton.classList.remove("hidden");
        }
        else if (searchInput.value === "") {
            addAllButton.classList.add("hidden");
        }
        console.log(`Search Limit Value:`, maxLimitInput.value);
        let maxLength = null
        if (maxLimitInput.value === "" || isNaN(maxLimitInput.value) || parseInt(maxLimitInput.value) <= 0) {
            maxLength = 30; // Default value if input is empty
        } else {
            maxLength = parseInt(maxLimitInput.value);
        }


        console.log(`API Path Data after input:`, apiPathData);
        const newApiUrl = `https://api.giphy.com/v1/gifs/search?api_key=JTQ5tRcYUqk9fTAmpaiMe85s9UTGPlJy&q=${searchInput.value}&limit=${maxLength}`;
        const newData = await getDataFromApi(newApiUrl);

        console.log(`New Data:`, newData);


        console.log(`Current data:`, currentData);
        console.log(`Current data length:`, currentData.length);

        gifList.innerHTML = "";
        currentData = renderCorrectStructureData(newData.data);
        listGifs(gifList, currentData);
        console.log(`Current data after rendering:`, currentData);



        await renderCollection();
    });

    console.log(`Result:`, currentData)


    const editorHeader = document.createElement("header");
    editorHeader.classList.add("editor-nav");
    editorHeader.appendChild(createTagElement("h1", "editor-title", "Gif Editor"));
    root.insertAdjacentElement("afterbegin", editorHeader);

    console.log(`Current data2:`, currentData);

    gifList.innerHTML = "Search for gifs to add them to your collection!";
    addAllButton.addEventListener("click", async function () {
        renderSingleOrMultipleGifs(gifList, currentData);
        await renderCollection();
    });
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
            "url": element.images && element.images.downsized_medium
                ? element.images.downsized_medium.url
                : element.url,
            "title": Array.isArray(element.title) ? element.title : element.title.split(" "),
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

async function renderSingleOrMultipleGifs(gifList, inputData) {
    const dataArray = Array.isArray(inputData) ? inputData : [inputData];

    for (const products of dataArray) {
        const productItem = document.createElement("li");
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

        const button = document.createElement("button");
        button.textContent = "Add";
        button.classList.add("add-button");

        const productsDatas = await getDataFromApi("http://localhost:6969/api/gifs");
        const isAlreadyInCollection = productsDatas.find(item => item.id === products.id);
        if (isAlreadyInCollection) {
            //alert("This gif is already in your collection!");
            console.warn("This gif is already in your collection!");
            continue;
        }

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
            console.log("Product added successfully:", result);

            await renderCollection();

        } catch (error) {
            console.error("Error adding product:", error);
        }

        productItem.appendChild(img);
        productItem.appendChild(title);
    }
}


async function renderCollection(filter = "") {
    const collectionList = document.getElementById("collection-list");
    let data = await getDataFromApi("http://localhost:6969/api/gifs");
    collectionList.innerHTML = "";

    if (filter !== "") {
        data = data.filter(product =>
            product.title.some(title => title.toLowerCase().includes(filter.toLowerCase()))
        );
    }
    renderCollectionList(data, collectionList);
}

function renderCollectionTitle(title) {
    return Array.isArray(title) ? title.join(" ") : title;
}

async function renderCollectionList(data, collectionList) {
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
        removeButton.classList.add("remove-button");

        removeButton.addEventListener("click", async (event) => {
            event.stopPropagation();
            try {
                const response = await fetch("http://localhost:6969/api/gifs/remove", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ url: item.url })
                });
                if (!response.ok) throw new Error("Failed to remove item");
                await renderCollection();

            } catch (err) {
                console.error("Error removing gif:", err);

            }
        });

        li.appendChild(img);
        li.appendChild(title);
        li.appendChild(removeButton);

        collectionList.appendChild(li);
    });
}


window.addEventListener("load", async () => {
    await loadEvent();
    await renderCollection();

    const searchButton = document.getElementById("collection-search-button");
    const searchInput = document.getElementById("collection-name-input");
    searchButton.addEventListener("click", async () => {
        await renderCollection(searchInput.value);
    });
});