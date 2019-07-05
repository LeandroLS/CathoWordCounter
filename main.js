const axios = require('axios');
const cheerio = require('cheerio');
axios.get('https://www.catho.com.br/vagas/?q=Programador+JavaScript&estado_id%5B0%5D=25&perfil_id=1&where_search=1&how_search=2&faixa_sal_id_combinar=1&order=score&pais_id=31&page=1')
.then(response => {
    const $ = cheerio.load(response.data);
    var allDescriptionsWordsArr = $('.descricaoVaga').text().split(/[^a-zA-Z0-9s|]/);
    let wordCounterArr = [];
    allDescriptionsWordsArr.forEach(wordToFind => {
        if(wordToFind.length >= 4){
            let counter = 0;
            allDescriptionsWordsArr.forEach((word,index) => {
                if(wordToFind == word){
                    counter++;
                    delete allDescriptionsWordsArr[index]
                }
            });
            wordCounterArr.push({
                qtdOcurrency: counter,
                word: wordToFind
            });
            counter = 0;
        }
    });
    console.log(wordCounterArr);
});
