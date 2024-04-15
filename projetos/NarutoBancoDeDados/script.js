// Função para buscar o personagem

function buscarPersonagem() {
  let characterName = document
    .getElementById("characterName")
    .value.toLowerCase()
    .trim();
  const resultDiv = document.getElementById("result");

  if (characterName !== "") {
    // selecionar imagem de carregando de forma aleatória
    let numeroDaImagem = Math.floor(Math.random() * 3) + 1;

    resultDiv.innerHTML = `
      <div>
        <img src="img/carregando-${numeroDaImagem}.gif" class="img_caregando" alt="Carregando...">
      </div>`;

    // Verifica se o characterName é um número
    if (!isNaN(characterName)) {
      // Se for um número, buscar por número
      fetch(`https://narutodb.xyz/api/character/${characterName}`)
        .then((response) => response.json())
        .then((characterData) => {
            exibirPersonagem(characterData);
        })
        .catch((error) => {
          resultDiv.innerHTML =
            "<p>Erro ao buscar o personagem. Por favor, tente novamente mais tarde.</p>";
          console.error("Erro:", error);
        });
    } else {
      // Caso contrário, buscar por nome
      const apiUrl = "https://narutodb.xyz/api/character";
      const pageSize = 20; // Tamanho da página
      const totalPages = Math.ceil(1431 / pageSize); // Total de páginas

      buscarPorPagina(apiUrl, characterName, 1, totalPages)
        .then((characterData) => {
          if (characterData) {
            exibirPersonagem(characterData);
          } else {
            resultDiv.innerHTML = `<p>Personagem não encontrado.</p>`;
          }
        })
        .catch((error) => {
          console.error("Erro:", error);
        });
    }
  }
}

// Função para buscar personagem por nome no json
async function buscarPorPagina(apiUrl, characterName, currentPage, totalPages) {
  for (let page = currentPage; page <= totalPages; page++) {
    const response = await fetch(`${apiUrl}?page=${page}`);
    const charactersData = await response.json();
    const characters = charactersData.characters;

    const character = characters.find((character) =>
      character.name.toLowerCase().includes(characterName)
    );
    if (character) {
      return character; // Retorna o personagem se encontrado
    }
  }

  return null; // Retorna nulo se o personagem não for encontrado em nenhuma página
}

// Função para exibir os detalhes do personagem
function exibirPersonagem(characterData) {
  const { name, id, images, debut, jutsu, natureType, personal, tools } = characterData;

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
    <h2>${name}</h2>
    <img src="${images[0]}" alt="${name}" class="img_personagem" ">
    <p><strong>ID:</strong> ${id}</p>
    <p><strong>Estreia no Anime:</strong> ${debut.anime}</p>
    <p><strong>Aparece em:</strong> ${debut.appearsIn}</p>
    <p><strong>Jutsu:</strong> ${jutsu}</p>
    <p><strong>Tipo de Natureza:</strong> ${natureType}</p>
    <p><strong>Gênero:</strong> ${personal.sex}</p>
    <p><strong>Classificação:</strong> ${personal.classification}</p>
    <p><strong>Ocupação:</strong> ${personal.occupation}</p>
    <p><strong>Afiliação:</strong> ${personal.affiliation}</p>
    <p><strong>Ferramentas:</strong> ${tools}</p>
    <!-- Adicione outras informações que desejar -->
  `;
}

// Ouvinte de evento para o botão "Buscar"
document
  .querySelector(".search-container button")
  .addEventListener("click", buscarPersonagem);

// Ouvinte de evento para a tecla "Enter"
document
  .getElementById("characterName")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      buscarPersonagem();
    }
  });
