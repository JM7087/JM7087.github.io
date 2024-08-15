document.getElementById('new-verse-btn').addEventListener('click', fetchVerse);

function fetchVerse() {
    const apiUrl = 'https://labs.bible.org/api/?passage=random&type=json';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const verse = data[0];
            const verseText = verse.text;
            const fullText = `${verse.bookname} ${verse.chapter}:${verse.verse} - ${verseText}`;

            const selectedLanguage = document.getElementById('language-select').value;


            if (selectedLanguage === 'en|en') {
                // Se o idioma selecionado for inglês, exibir o texto sem tradução
                document.getElementById('verse-text').innerText = verseText;
                document.getElementById('verse-reference').innerText = `${verse.bookname} ${verse.chapter}:${verse.verse}`;
                document.getElementById('new-verse-btn').disabled = false;
                document.getElementById('new-verse-btn').innerText = 'Novo Versículo';

                document.querySelector('.verse-box').classList.add('clicked');
            } else {
                // Caso contrário, passar pelo processo de tradução
                translateVerse(fullText, selectedLanguage);
                document.getElementById('new-verse-btn').disabled = true;
            }
        })
        .catch(error => {
            console.error('Erro ao buscar o versículo:', error);
            document.getElementById('verse-text').innerText = 'Erro ao obter o versículo. Tente novamente mais tarde.';
            document.getElementById('new-verse-btn').innerText = 'Tentar Novamente';
            document.getElementById('new-verse-btn').disabled = false;
        });
}

function translateVerse(fullText, languagePair) {
    const translateApiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(fullText)}&langpair=${languagePair}`;

    fetch(translateApiUrl)
        .then(response => response.json())
        .then(data => {
            const translatedText = data.responseData.translatedText;

            // Separar o texto traduzido em nome do livro e versículo
            const [bookAndVerse, ...verseTextParts] = translatedText.split(' - ');
            const verseText = verseTextParts.join(' - '); // Juntar o texto do versículo se houver mais de uma parte

            document.getElementById('verse-text').innerText = verseText;
            document.getElementById('verse-reference').innerText = bookAndVerse;

            document.getElementById('new-verse-btn').disabled = false;
            document.getElementById('new-verse-btn').innerText = 'Novo Versículo';

            // mudar css depois de clicar no botão
            document.querySelector('.verse-box').classList.add('clicked');
        })
        .catch(error => {
            console.error('Erro ao traduzir o versículo:', error);
            document.getElementById('verse-text').innerText = 'Erro ao traduzir o versículo. Tente novamente mais tarde.';
            document.getElementById('new-verse-btn').innerText = 'Tentar Novamente';
            document.getElementById('new-verse-btn').disabled = false;
        });
}
