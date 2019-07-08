'use strict';
const axios = require('axios');
const cheerio = require('cheerio');
const inquirer = require('inquirer');
const fs = require("fs");
function readFileContent(){
    try {
        let fileContent = fs.readFileSync('estadosDataCatho.txt', "utf8");
        return JSON.parse(fileContent);
    } catch (error) {
        console.log("Algo deu errado, não foi possível ler o arquivo de estados");
    }
}
let estados = readFileContent();
console.log('Bem vindo ao CathoWordCounter');
inquirer.prompt([
    {
        type: 'input',
        name: 'keyWord',
        message: 'Qual o cargo ou palavra chave para fazer a busca ?'
    },
    {
        type:'list',
        name:'state',
        message: 'Qual cidade deve ser sonciderada ?',
        choices: estados
    }
]).then(answers => {
    var queryString = '';
    let estadoSelecionado = estados.filter(element => {
        if(element.value == answers.state){
            return element;
        }
    });
    var queryString = '';
    if(estadoSelecionado[0]['data-type'] == 'cidade'){
        queryString = 'cidade_id=' + estadoSelecionado[0].value;
    } else if(estadoSelecionado[0]['data-type'] == 'estado'){
        queryString = 'estado_id=' + estadoSelecionado[0].value;
    } else if(estadoSelecionado[0]['data-type'] == 'regiao'){
        queryString = 'regiao_id=' + estadoSelecionado[0].value;
    }
    axios.get(`https://www.catho.com.br/vagas/?q=${answers.keyWord}&${queryString}`)
    .then(response => {
        const $ = cheerio.load(response.data);
        if(!$('.descricaoVaga').text()){
            console.log('Não foi possível encontrar resultados.'); return;
        }
        var allDescriptionsWordsArr = $('.descricaoVaga').text().split(/\.?,?\s/).filter(element => element.length >= 4);
        let wordCounterArr = [];
        allDescriptionsWordsArr.forEach(wordToFind => {
            let counter = 0;
            allDescriptionsWordsArr.forEach((word,index) => {
                if(wordToFind == word){
                    counter++;
                    delete allDescriptionsWordsArr[index];
                }
            });
            wordCounterArr.push({
                qtdOcurrency: counter,
                word: wordToFind
            });
            counter = 0;
        });
        wordCounterArr.sort((elementA, elementB) => {
            if(elementA.qtdOcurrency > elementB.qtdOcurrency) {
                return -1;
            } else if(elementA.qtdOcurrency < elementB.qtdOcurrency) {
                return 1;
            } else {
                return 0;
            }
        });
        console.log('URL a ser buscada:', response.config.url);
        console.log('Palavras mais encontradas:');
        for (let index = 0; index <= 20; index++) {
            console.log(`Palavra: ${wordCounterArr[index].word}
Quantidade de ocorrência: ${wordCounterArr[index].qtdOcurrency}
            `);
        }
    });
});