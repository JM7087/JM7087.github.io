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
        // Encontrar uma entrada de texto de descrição em inglês
        const flavorTextEntry = speciesData.flavor_text_entries.find(
          entry => entry.language.name === 'en'
        )

        const englishDescription = flavorTextEntry
          ? flavorTextEntry.flavor_text.replace(/\n|\f/g, " ")
          : "Description not available.";

        // Extrair tipos e habilidades para tradução
        const tipos = pokemonDataGlobal.types.map(type => type.type.name);
        const habilidades = pokemonDataGlobal.abilities.map(ability => ability.ability.name);

        // Traduzir descrição, tipos e habilidades
        Promise.all([
          traduzirTexto(englishDescription),
          Promise.all(tipos.map(tipo => traduzirTexto(tipo))),
          Promise.all(habilidades.map(habilidade => traduzirTexto(habilidade)))
        ])
          .then(([descricaoTraduzida, tiposTraduzidos, habilidadesTraduzidas]) => {
            exibirPokemon(
              pokemonDataGlobal,
              descricaoTraduzida,
              tiposTraduzidos,
              habilidadesTraduzidas
            );
          })
          .catch(error => {
            console.error("Erro na tradução:", error);
            // Fallback para inglês se a tradução falhar
            exibirPokemon(
              pokemonDataGlobal,
              englishDescription,
              tipos,
              habilidades.map(h => h)
            );
          });
      })
      .catch((error) => {
        resultDiv.innerHTML =
          "<p>Pokémon não encontrado. Verifique o nome e tente novamente.</p>";
        console.error("Erro:", error);
      });
  }

  function traduzirTexto(texto) {
    return fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=en|pt-BR`)
      .then(response => response.json())
      .then(data => {
        return data.responseData?.translatedText || texto;
      })
      .catch(error => {
        console.error("Erro na tradução:", error);
        return texto; // Retorna o texto original em caso de erro
      });
  }

  function exibirPokemon(pokemonData, descricao, tiposTraduzidos, habilidadesTraduzidas) {
    const { name, height, weight, id, sprites, base_experience } = pokemonData;

    // colocar habilidades traduzidas em uma variável
    const habilitiesNomesTraduzidas = habilidadesTraduzidas.join(', ');
    // colocar tipos traduzidos em uma variável
    const tiposNomesTraduzidos = tiposTraduzidos.join(', ');

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
          <p><strong>Habilidades:</strong> ${habilitiesNomesTraduzidas}.</p>
          <p><strong>Tipo:</strong> ${tiposNomesTraduzidos}</p>
          <p><strong>Descrição:</strong> ${descricao}</p>
          <p><strong>Numero:</strong> ${id}</p>
        `;

    let dadosDoPokemon = `
          ${name}
          Altura ${altura} Metros
          Peso ${peso} Kg
          Nivel Base de Experiência ${base_experience}
          Habilidades ${habilitiesNomesTraduzidas}
          Tipo ${tiposNomesTraduzidos}
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