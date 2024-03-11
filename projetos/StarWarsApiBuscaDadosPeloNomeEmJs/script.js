  // Função para buscar o personagem
  function buscarPersonagem() {
    let characterName = document.getElementById("characterName").value;
    characterName = characterName.replace(/ /g, "%20"); // Substituir espaços por '%20'

    const resultDiv = document.getElementById("result");

    if (characterName.trim() !== "") {

      // Exibe o ícone de carregamento
      resultDiv.innerHTML = `
      <div>
        <img src="img/carregando.gif" alt="Carregando...">
      </div>` 

      fetch(`https://swapi.py4e.com/api/people/?search=${characterName}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.results.length > 0) {
            const character = data.results[0];

            // Obtendo o nome do planeta natal
            fetch(character.homeworld)
              .then((response) => response.json())
              .then((planetData) => {

                resultDiv.innerHTML = `
                <h2>${character.name}</h2>
                <p><strong>Altura:</strong> ${character.height}cm</p>
                <p><strong>Peso:</strong> ${character.mass}kg</p>
                <p><strong>Cor do Cabelo:</strong> ${character.hair_color}</p>
                <p><strong>Cor da Pele:</strong> ${character.skin_color}</p>
                <p><strong>Cor dos Olhos:</strong> ${character.eye_color}</p>
                <p><strong>Ano de Nascimento:</strong> ${character.birth_year}</p>
                <p><strong>Gênero:</strong> ${character.gender}</p>
                <p><strong>Planeta Natal:</strong> ${planetData.name}</p>
                <!-- Adicione outras informações que desejar -->
              `;

            })
              .catch((error) => {
                resultDiv.innerHTML =
                  "<p>Ocorreu um erro ao buscar informações do planeta natal.</p>";
                console.error(
                  "Erro ao obter informações do planeta natal:",
                  error
                );
              });

            } else {
            resultDiv.innerHTML = "<p>Nenhum personagem encontrado.</p>";
          }
        })
        .catch((error) => {
          resultDiv.innerHTML =
            "<p>Ocorreu um erro ao buscar o personagem. Tente novamente.</p>";
          console.error("Erro:", error);
        });
    } else {
      resultDiv.innerHTML = "<p>Por favor, insira o nome do personagem.</p>";
    }
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
