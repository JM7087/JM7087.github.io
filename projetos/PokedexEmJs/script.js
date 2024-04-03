// Função para buscar o Pokémon
function buscarPokemon() {
  let pokemonNameOuNumero = document
    .getElementById("characterName")
    .value.toLowerCase();

  const resultDiv = document.getElementById("result");

  if (pokemonNameOuNumero.trim() !== "") {

    resultDiv.innerHTML = `
        <div>
          <img src="img/carregando.gif" alt="Carregando...">
        </div>`;

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameOuNumero}`)
      .then((response) => response.json())
      .then((pokemonData) => {
        exibirPokemon(pokemonData);
      })
      .catch((error) => {
        resultDiv.innerHTML =
          "<p>Pokémon não encontrado. Verifique o nome e tente novamente.</p>";
        console.error("Erro:", error);
      });
  }

  // Função para exibir os detalhes do Pokémon
  function exibirPokemon(pokemonData) {
    const { name, height, weight, types, id, sprites, base_experience, abilities } = pokemonData;

    const abilitiesNames = abilities.map(ability => ability.ability.name).join(', ')

    let PokemonImagem

    const imagemGif =
      pokemonData.sprites.versions["generation-v"]["black-white"].animated.front_default;

    if (imagemGif == null) {
      PokemonImagem = sprites.front_default;

    }
    else {
      PokemonImagem = imagemGif
    }

    // para converter Decimetros é Hectogramas em Metros é Kg 
    // é só dividir o valor de height e weight por 10

    const altura = TrocarPontoPorVirgula(height / 10)

    const peso = TrocarPontoPorVirgula(weight / 10)


    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
          <h2>${name}</h2>
          <img src="${PokemonImagem}" alt="${name}">
          <p><strong>Altura:</strong> ${altura} Metros</p>
          <p><strong>Peso:</strong> ${peso} Kg</p>
          <p><strong>Nivel Base de Experiência:</strong> ${base_experience}</p>
          <p><strong>Habilidades:</strong> ${abilitiesNames}.</p>
          <p><strong>Tipo:</strong> ${types.map((type) => type.type.name).join(", ")}</p>
          <p><strong>Numero:</strong> ${id}</p>
          <!-- Adicione outras informações que desejar -->
        `;

    let dadosDoPokemon = `
          ${name}
          Altura ${altura} Metros
          Peso ${peso} Kg
          Nivel Base de Experiência ${base_experience}
          Habilidades ${abilitiesNames}
          Tipo ${types.map((type) => type.type.name).join(", ")}
          Numero na Pokedex ${id}
        `

    falarTexto(dadosDoPokemon);
  }
}

function TrocarPontoPorVirgula(valor) {
  return valor.toString().replace(".", ",")
}

function falarTexto(dadosDoPokemon) {

  // Verifica se o navegador suporta a Web Speech API
  if ('speechSynthesis' in window) {    
    // Cria um novo objeto SpeechSynthesisUtterance para definir o texto a ser falado
    let falar = new SpeechSynthesisUtterance(dadosDoPokemon);

    // Fala o texto
    window.speechSynthesis.speak(falar);
  } else {
    console.log('Seu navegador não suporta a Web Speech API. Tente um navegador mais recente.');
  }
}


// Ouvinte de evento para o botão "Buscar"
document
  .querySelector(".search-container button")
  .addEventListener("click", buscarPokemon);

// Ouvinte de evento para a tecla "Enter"
document
  .getElementById("characterName")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      buscarPokemon();
    }
  });
