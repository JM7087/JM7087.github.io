function buscarPokemon() {
  let pokemonNameOuNumero = document
    .getElementById("characterName")
    .value.toLowerCase();

  const resultDiv = document.getElementById("result");

  if (pokemonNameOuNumero.trim() !== "") {
    resultDiv.style.display = "block";

    resultDiv.innerHTML = `
        <div>
          <img src="img/carregando.gif" alt="Carregando...">
        </div>`;

    let pokemonDataGlobal = null;

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameOuNumero}`)
      .then((response) => response.json())
      .then((pokemonData) => {
        pokemonDataGlobal = pokemonData;
        // Buscar a descrição do Pokémon
        return fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonNameOuNumero}`);
      })
      .then((response) => response.json())
      .then((speciesData) => {
       
        
          // Find an English flavor text entry
          const flavorTextEntry = speciesData.flavor_text_entries.find(
            entry => entry.language.name === 'en'
          ) 
        
        const englishDescription = flavorTextEntry
          ? flavorTextEntry.flavor_text.replace(/\n|\f/g, " ")
          : "Description not available.";

        // Translate to Portuguese using MyMemory API
        fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(englishDescription)}&langpair=en|pt-BR`)
        .then(response => response.json())
        .then(data => {
          const descricao = data.responseData?.translatedText || englishDescription;
          exibirPokemon(pokemonDataGlobal, descricao);
        })
        .catch(error => {
          console.error("Erro na tradução:", error);
          // Fallback to English if translation fails
          exibirPokemon(pokemonDataGlobal, englishDescription);
        });
      })
      .catch((error) => {
        resultDiv.innerHTML =
          "<p>Pokémon não encontrado. Verifique o nome e tente novamente.</p>";
        console.error("Erro:", error);
      });
  }

  function exibirPokemon(pokemonData, descricao) {
    const { name, height, weight, types, id, sprites, base_experience, abilities } = pokemonData;

    const abilitiesNames = abilities.map(ability => ability.ability.name).join(', ');

    let PokemonImagem;

    const imagemGif =
      pokemonData.sprites.versions["generation-v"]["black-white"].animated.front_default;

    if (imagemGif == null) {
      PokemonImagem = sprites.front_default;
    } else {
      PokemonImagem = imagemGif;
    }

    const altura = TrocarPontoPorVirgula(height / 10);
    const peso = TrocarPontoPorVirgula(weight / 10);

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
          <h2>${name}</h2>
          <img src="${PokemonImagem}" alt="${name}">
          <p><strong>Altura:</strong> ${altura} Metros</p>
          <p><strong>Peso:</strong> ${peso} Kg</p>
          <p><strong>Nivel Base de Experiência:</strong> ${base_experience}</p>
          <p><strong>Habilidades:</strong> ${abilitiesNames}.</p>
          <p><strong>Tipo:</strong> ${types.map((type) => type.type.name).join(", ")}</p>
          <p><strong>Descrição:</strong> ${descricao}</p>
          <p><strong>Numero:</strong> ${id}</p>
        `;

    let dadosDoPokemon = `
          ${name}
          Altura ${altura} Metros
          Peso ${peso} Kg
          Nivel Base de Experiência ${base_experience}
          Habilidades ${abilitiesNames}
          Tipo ${types.map((type) => type.type.name).join(", ")}
          Descrição ${descricao}
          Numero na Pokedex ${id}
        `;

    falarTexto(dadosDoPokemon);
  }
}

function TrocarPontoPorVirgula(valor) {
  return valor.toString().replace(".", ",");
}

function exibirDescricao(descricao) {
  return descricao
}

function falarTexto(dadosDoPokemon) {
  if ('speechSynthesis' in window) {
    let falar = new SpeechSynthesisUtterance(dadosDoPokemon);
    window.speechSynthesis.speak(falar);
  } else {
    console.log('Seu navegador não suporta a Web Speech API. Tente um navegador mais recente.');
  }
}

document
  .querySelector(".search-container button")
  .addEventListener("click", buscarPokemon);

document
  .getElementById("characterName")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      buscarPokemon();
    }
  });
