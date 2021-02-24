
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


const poke_container = document.getElementById('poke_container');
const pokemons_number = 150;
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

const fetchPokemons = async () => {
    for (let i = 1; i <= pokemons_number; i++) {
        await getPokemon(i);
    }
};

const getPokemon = async id => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const pokemon = await res.json();
    createPokemonCard(pokemon);
};

function createPokemonCard(pokemon) {
    const poke_types = pokemon.types.map(type => type.type.name);
    const type = main_types.find(type => poke_types.indexOf(type) > -1);
    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const color = colors[type];
    const pokemonEl = document.createElement('div');

    pokemonEl.classList.add('pokemon');
    pokemonEl.classList.add(`${type}`);



    pokemonEl.style.backgroundColor = color;

    const pokeInnerHTML = `
        <div class="img-container">
            <img src="https://pokeres.bastionbot.org/images/pokemon/${
        pokemon.id
    }.png" alt="${name}" />
        </div>
        <div class="info">
            <span class="number">#${pokemon.id
        .toString()
        .padStart(3, '0')}</span>
            <h3 class="name">${name}</h3>
            <h5 class="price">Price: 100$</h5>
            <small class="type">Type: <span>${type}</span></small>
        </div>
    `;

    pokemonEl.innerHTML = pokeInnerHTML;

    poke_container.appendChild(pokemonEl);

}


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


fetchPokemons();





