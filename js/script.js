function getRandomInt(max) {

    return Math.floor(Math.random() * Math.floor(max));
}

const navSlide = () => {

    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links li")
    burger.addEventListener("click", () => {
        //Toggle nav
        nav.classList.toggle("nav-active");

        //Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = ""
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
            }
        });
        //Burger Animation
        burger.classList.toggle("toggle");
    });

}
navSlide();

function putToLocalStorage(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
}

function getOrCreateFromLocalStorage(key) {
    let item = window.localStorage.getItem(key);
    if (!item) {
        item = "{}";
        window.localStorage.setItem(key, item);
    }
    return JSON.parse(item);
}

const pokeContainer = document.getElementById('poke_container');
const pokeCart = document.getElementById('cart');

const pokemonsNumber = 150;
const pageSize = 12;

function initPrices() {
    pokemonPrices = {};
    for (let i = 1; i <= pokemonsNumber; i++) {
        pokemonPrices[`${i}`] = getRandomInt(20000);
    }
    putToLocalStorage("prices", pokemonPrices);
}

function getPrice(id) {
    return getOrCreateFromLocalStorage("prices")[`${id}`];
}

function getPrices() {
    return getOrCreateFromLocalStorage("prices");
}

// initPrices();
const colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
};

const main_types = Object.keys(colors);

const buildPokemonsDashboard = async (startIndex) => {
    pokeContainer.innerHTML = "";
    for (let i = startIndex + 1; i <= startIndex + pageSize; i++) {
        let pokemonJson = await getPokemon(i);
        buildDashboardItem(pokemonJson);
    }
};

const buildPokemonsCart = async () => {
    let cart = getOrCreateFromLocalStorage("cart");
    pokeCart.innerHTML = "";
    for (const [pokemonId, count] of Object.entries(cart)) {
        let pokemonJson = await getPokemon(pokemonId);
        buildCartItem(pokemonJson);
    }
}

function removeFromCartOneWrapper(e) {
    let pokemonId = getPokemonIdFromButton(e);
    removeFromCartOne(pokemonId);
}

function addToCartWrapper(e) {
    // console.log(e);
    let pokemonId = getPokemonIdFromButton(e)
    // console.log(pokemonId);
    addToCart(pokemonId);
}

function getPokemonIdFromButton(e) {
    return e.target
        .parentNode
        .parentNode
        .querySelector(".number")
        .getAttribute("pokemonId");
}

function addToCart(pokemonId) {
    let cart = getOrCreateFromLocalStorage("cart");
    let pokemonsCount = cart.hasOwnProperty(pokemonId) ? cart[pokemonId] : 0;
    cart[pokemonId] = pokemonsCount + 1;
    putToLocalStorage("cart", cart);
    buildPokemonsCart().then(r => {
    });
}

function removeFromCartOne(pokemonId) {
    let cart = getOrCreateFromLocalStorage("cart");
    if (cart.hasOwnProperty(pokemonId)) {
        let pokemonsCount = cart[pokemonId];
        let newPokemonsCount = pokemonsCount - 1;
        if (newPokemonsCount < 1) {
            delete cart[pokemonId];
        } else {
            cart[pokemonId] = newPokemonsCount;
        }
    }
    putToLocalStorage("cart", cart);
    buildPokemonsCart().then(r => {
    });
}

function removeFromCartAll(pokemonId) {
    let cart = getOrCreateFromLocalStorage("cart");
    delete cart[pokemonId];
    putToLocalStorage("cart", cart);
    buildPokemonsCart().then(r => {
    });
}

function showCart() {
    buildPokemonsCart().then(r => pokeCart.style.display = "flex");
}

function hideCart() {
    pokeCart.style.display = "none";
}

function buildCartItem(pokemonJson) {
    const poke_types = pokemonJson.types.map(type => type.type.name);
    const type = main_types.find(type => poke_types.indexOf(type) > -1);
    const name = pokemonJson.name[0].toUpperCase() + pokemonJson.name.slice(1);
    const color = colors[type];
    const pokemonEl = document.createElement('div');

    pokemonEl.classList.add('pokemon');
    pokemonEl.classList.add(`${type}`);

    pokemonEl.style.backgroundColor = color;

    let pokemonId = pokemonJson.id;
    pokemonEl.innerHTML = getPokemonBaseView(pokemonId, name, getPrice(pokemonId), type);
    let infoEl = pokemonEl.querySelector(".info");
    let cart = getOrCreateFromLocalStorage("cart");
    infoEl.appendChild(getPokemonsCountView(cart[pokemonId]));
    pokemonEl.appendChild(getPokemonsPlusMinusButtons());
    pokeCart.appendChild(pokemonEl);
}

function getPokemonsCountView(count) {
    let countEl = document.createElement("h5");
    countEl.classList.add("price");
    countEl.innerText = `Count: ${count}`
    return countEl;
}

function getPokemonsPlusMinusButtons() {
    let plusMinus = document.createElement('div');
    plusMinus.innerHTML = `
        <img class="minus" src="https://www.flaticon.com/svg/vstatic/svg/814/814039.svg?token=exp=1614624717~hmac=18d65c99f5dde3d37b68cad560670bb7" alt="pic">
        <img class="add" src="https://www.flaticon.com/svg/vstatic/svg/149/149145.svg?token=exp=1614624779~hmac=11e789819d64bca991d4be4d939c7d1f" alt="pic">
    `
    plusMinus.classList.add("plus-minus");
    plusMinus.querySelector(".minus").addEventListener("click", removeFromCartOneWrapper);
    plusMinus.querySelector(".add").addEventListener("click", addToCartWrapper);
    return plusMinus;
}

function buildDashboardItem(pokemonJson) {
    const poke_types = pokemonJson.types.map(type => type.type.name);
    const type = main_types.find(type => poke_types.indexOf(type) > -1);
    const name = pokemonJson.name[0].toUpperCase() + pokemonJson.name.slice(1);
    const color = colors[type];
    const pokemonEl = document.createElement('div');

    pokemonEl.classList.add('pokemon');
    pokemonEl.classList.add(`${type}`);

    pokemonEl.style.backgroundColor = color;

    let pokemonId = pokemonJson.id;
    pokemonEl.innerHTML = getPokemonBaseView(pokemonId, name, getPrice(pokemonId), type);
    pokemonEl.appendChild(getBuyButton());
    pokeContainer.appendChild(pokemonEl);
}

function getBuyButton() {
    let div = document.createElement("div");
    let button = document.createElement("button");
    div.classList.add("buy-now-container");
    button.classList.add("buy-now");
    button.innerText = "Buy";
    button.addEventListener("click", addToCartWrapper);
    div.appendChild(button);
    return div;
}

// Все що тут - відображається і в корзині, і на дашборді
function getPokemonBaseView(pokemonId, name, price, type) {
    return `
        <div class="img-container">
            <img src="https://pokeres.bastionbot.org/images/pokemon/${
        pokemonId
    }.png" alt="${name}" />
        </div>
        <div class="info">
            <span pokemonId="${pokemonId}" class="number">#${pokemonId
        .toString()
        .padStart(3, '0')}</span>
            <h3 class="name">${name}</h3>
            <h5 class="price">Price: ${price}$</h5>
            <small class="type">Type: <span>${type}</span></small>
        </div>
    `;
}


const getPokemon = async id => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    return await res.json();
};

document.querySelector(".filter-menu").addEventListener("click", event => {
    const filterBox = document.querySelectorAll(".pokemon");
    if (event.target.tagName !== "A") return false;

    let filterClass = event.target.dataset["f"];
    filterBox.forEach(elem => {
        elem.classList.remove("hide");
        if (!elem.classList.contains(filterClass)) {
            elem.classList.add("hide");
        }
    });
});


function initPagination() {
    let paginationEl = document.querySelector(".pagination");
    let pagesCount = pokemonsNumber / pageSize;
    for (let i = 0; i < pagesCount; i++) {
        let startPokemonIndex = i * pageSize;
        let buttonText = i + 1;
        let buttonEl = document.createElement("button");
        buttonEl.classList.add("first");
        buttonEl.addEventListener("click", () => {
            buildPokemonsDashboard(startPokemonIndex)
        });
        buttonEl.innerText = buttonText;
        paginationEl.appendChild(buttonEl);
    }
}

initPagination();

buildPokemonsDashboard(0);

function initListeners() {
    // const addButtons = document.querySelectorAll(".add");
    // const removeButtons = document.querySelectorAll(".minus");
    //
    // addButtons.forEach(addButton =>
    //     addButton.addEventListener("click", addToCartWrapper));
    // removeButtons.forEach(removeButton =>
    //     removeButton.addEventListener("click", removeFromCartOneWrapper));

}

document.querySelector(".show-cart").addEventListener("click", () => {
    let closeButtons = document.querySelector(".close");
    let container = document.querySelector(".container");
    let footer = document.querySelector("footer");

    container.style.opacity = "0.6";
    footer.style.opacity = "0.6";
    closeButtons.classList.add("hide-cart");
    document.querySelector(".hide-cart").addEventListener("click", () => {
        closeButtons.classList.remove("hide-cart");
        container.style.opacity = "1";
        footer.style.opacity = "1";
        hideCart();
    });
    showCart();
});


