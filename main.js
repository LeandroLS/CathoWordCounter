'use strict';
const axios = require('axios');
const cheerio = require('cheerio');
const inquirer = require('inquirer');
inquirer.prompt([
    {
        type:'list',
        name:'siteToSearch',
        message: 'Em qual site deseja fazer a buscar ?',
        choices: ['Catho']
    },
    {
        type: 'input',
        name: 'keyWord',
        message: 'Qual o cargo ou palavra chave ?'
    }
]).then(answers => {
    axios.get(`https://www.catho.com.br/vagas/?q=${answers.keyWord}`)
    .then(response => {
        const $ = cheerio.load(response.data);
        let paginacao = $('.page').length;
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
        console.log('Palavras mais encontradas:');
        for (let index = 0; index <= 20; index++) {
            console.log(`
                Palavra: ${wordCounterArr[index].word} 
                Quantidade de ocorrência: ${wordCounterArr[index].qtdOcurrency}
            `);
        }
    });
});