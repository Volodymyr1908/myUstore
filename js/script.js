
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

const buildPokemonsDashboard = async () => {
    for (let i = 1; i <= pokemonsNumber; i++) {
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

function addToCart(pokemonId) {
    let cart = getOrCreateFromLocalStorage("cart");
    let pokemonsCount = cart.hasOwnProperty(pokemonId) ? cart[pokemonId] : 0;
    cart[pokemonId] = pokemonsCount + 1;
    putToLocalStorage("cart", cart);
    buildPokemonsCart().then(r => {});
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
    buildPokemonsCart().then(r => {});
}

function removeFromCartAll(pokemonId) {
    let cart = getOrCreateFromLocalStorage("cart");
    delete cart[pokemonId];
    putToLocalStorage("cart", cart);
    buildPokemonsCart().then(r => {});
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
    infoEl.appendChild(getPokemonsCountInCartView(cart[pokemonId]));
    pokeCart.appendChild(pokemonEl);
}

function getPokemonsCountInCartView(count) {
    let countEl = document.createElement("h5");
    countEl.classList.add("price");
    countEl.innerText = `Count: ${count}`
    return countEl;
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
    pokeContainer.appendChild(pokemonEl);
}

function getPokemonBaseView(pokemonId, name, price, type) {
     return `
        <div class="img-container">
            <img src="https://pokeres.bastionbot.org/images/pokemon/${
        pokemonId
    }.png" alt="${name}" />
        </div>
        <div class="info">
            <span class="number">#${pokemonId
        .toString()
        .padStart(3, '0')}</span>
            <h3 class="name">${name}</h3>
            <h5 class="price">Price: ${price}$</h5>
            <small class="type">Type: <span>${type}</span></small>
        </div>
        <div class="plus-minus">
            <img class="minus" src="https://www.flaticon.com/svg/vstatic/svg/1665/1665612.svg?token=exp=1614596390~hmac=b87374a96c122ee6608a434c5363273c" alt="pic">
            <img class="add" src="https://www.flaticon.com/svg/vstatic/svg/1665/1665578.svg?token=exp=1614598515~hmac=896fc0bcedc6894e9398c69ac305f1ba" alt="pic">
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
        filterBox.forEach( elem => {
            elem.classList.remove("hide");
            if (!elem.classList.contains(filterClass)) {
                elem.classList.add("hide");
            }
        });
    });


buildPokemonsDashboard();


const addItemToCard = document.querySelector(".add");
const removeItemToCard = document.querySelector(".minus");


// addItemToCard.addEventListener("click", addToCart());
// removeItemToCard.addEventListener("click", removeFromCartOne);

const closeCartButton = document.querySelector(".hide-cart").addEventListener("click", hideCart);