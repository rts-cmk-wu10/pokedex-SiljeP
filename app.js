const URL = new URLSearchParams(window.location.search)
const UL = document.querySelector(".pokeList")
const baseURL = "https://pokeapi.co/api/v2/"

const OFFSET = parseInt(URL.get("offset") || 0)

const NEXT_PAGE = document.querySelector(".nextPage")
const PREV_PAGE = document.querySelector(".prevPage")

//APP.JS HAR FREM OG TILBAGE KNAPPER SAMT SØGEFUNKTION

//BACK AND NEXT KNAPPER

fetch(`https://pokeapi.co/api/v2/pokemon?offset=${OFFSET}`)
    .then(function (response) {
        if (response.status !== 200)
            throw new Error("error message")
        return response.json()
    })
    .then(function (data) {
        const LAST_OFFSET = data.count - (data.count % 20)
        // ternery operator i næste linie betyder:
        // hvis offset er større end eller lig med det størst mulige offset vi må have,
        // så skal vi brugas LAST_OFFSET - ellers skal vi bruge OFFSET + 20
        NEXT_PAGE.href = `/?offset=${OFFSET >= LAST_OFFSET ? LAST_OFFSET : OFFSET + 20}`

        PREV_PAGE.href = `/?offset=${OFFSET - 20 < 0 ? 0 : OFFSET - 20}`

        data.results.forEach(function (result) {
            const LI = document.createElement("li")
            LI.innerHTML = `<a class="pokeListItem" href="/pokemon.html?pokeSearch=${result.name}">${result.name}</a>`
            UL.append(LI)
        })
    })
    .catch(function (error) {
        console.log(error) //her gribes fejlen, og man kan bruge den til 
        // noget eks. skrive den i konsollen eller paa siden
        window.location.href = "/ups.html"
    })

//søgefunktion herunder

function submitHandler() {
    fetch(`https://pokeapi.co/api/v2/pokemon/${URL.get("pokeSearch")}`)
        .then(function (response) {
            if (response.status === 200) {
                return response.json()
            } else {
                document.body.innerText += "Something went wrong try again"
            }
        })
        .then(function (data) {
            const POKEMON = document.querySelector(".pokemonDetail")

            POKEMON.innerHTML = `
        <h1 class="pokeList__title">${data.name}</h1>
        <span class="placeholderSVG">
        <svg  width="450" height="350">
            <rect x="40" y="20" width="290" height="200" style="fill:grey;stroke:rgb(79, 78, 78);stroke-width:6;fill-opacity:0.1;stroke-opacity:0.9;"/>
            <circle cx="130" cy="50" r="20" stroke="none" stroke-width="3" fill="rgb(38, 38, 38)" />
            <polygon x="10" y="10" points="120,80 80,200 170,200" style="fill:rgb(80, 79, 79);stroke:none;"/>
            <polygon points="175,50 100,200 240,200" style="fill:grey;stroke:none;"/>
            <polygon points="240,90 150,200 300,200" style="fill:rgb(169, 169, 169);stroke:none;"/>
            Sorry, your browser does not support inline SVG.  
          </svg></span>
        <p class="pokeListItem__subHeading"> Type:</p>
        <ul class="pokeListDetail">${data.types.map(
                elem => `<li class="pokeListDetail">${elem.type.name}</li>`
            ).join(" ")}</ul>
		<p class="pokeListItem__subHeading">Height:<span class= "pokeListDetail">${data.height}</span></p>
        <p class="pokeListItem__subHeading">Weight: <span class= "pokeListDetail">${data.weight}</span></p>
		<p class="pokeListItem__subHeading">Abilities:</p>
		<ul class="pokeListDetail">${data.abilities.map(
                elem => `<li class="pokeListDetail">${elem.ability.name}</li>`
            ).join(" ")}</ul>`

            if (data.id <= 30) {
                fetch(baseURL + 'characteristic/' + data.id).then(res => res.json()).then(characteristic => {
                    POKEMON.innerHTML += `
                    <h3 class="pokeListCharacteristics">${characteristic.descriptions[7].description}</h3>
                `
                })
            }

            const IMG = new Image()
            IMG.src = data.sprites.other["official-artwork"].front_default
            IMG.className = "pokeList__img"

            IMG.onload = function () {
                console.log('tun');
                POKEMON.querySelector(".placeholderSVG svg").style.display = "none"
                POKEMON.querySelector(".placeholderSVG").append(IMG)
            }

        })
}
if (URL.has("pokeSearch")) {
    submitHandler()
}

const DATALIST = document.querySelector("#pokemons")
const SEARCH_FIELD = document.querySelector(".searchForm__input")

SEARCH_FIELD.addEventListener("focus", getDatalist)
SEARCH_FIELD.addEventListener("focusout", function (event) {
    SEARCH_FIELD.removeEventListener("focus", getDatalist)
})

function getDatalist(event) {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
        .then(function (response) {
            if (response.status === 200) {
                return response.json()
            } else {
                document.body.innerText += "Something went wrong try again"
            }
        })
        .then(function (data) {
            data.results.forEach(function (pokemon) {
                DATALIST.innerHTML += `<option>${pokemon.name}</option>`
            })
        })
}

