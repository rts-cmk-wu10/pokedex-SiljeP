const SPINNER = document.querySelector(".spinningIcon")
SPINNER.style.display = "block"

//VIS SPINNER

fetch(`https://pokeapi.co/api/v2/pokemon/${URL.get("pokeSearch")}`)
    .then(function (response) {
        if (response.status !== 200)
            throw new Error("error message")
        return response.json()
    })
    .then(function (data) {
        //SKJUL SPINNER
        SPINNER.style.display = "none"
        const POKEMON = document.querySelector(".pokemonDetail")

        POKEMON.innerHTML = `
        <h1 class="pokeList__title">${data.name}</h1>
        <span class="placeholderSVG">
        <svg width="450" height="350">
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

        const IMG = new Image()
        IMG.src = data.sprites.other["official-artwork"].front_default
        IMG.className = "pokeList__img"

        IMG.onload = function () {
            POKEMON.querySelector(".placeholderSVG svg").style.display = "none"
            //POKEMON.querySelector(".placeholderSVG").append(IMG)
        }

        console.log(data.types.map(el => {
            return el.type.name
        }))
            .catch(function (error) {
                console.log(error) //her gribes fejlen, og man kan bruge den til 
                // noget eks. skrive den i konsollen eller paa siden
                window.location.href = "/ups.html"
            })

    })
