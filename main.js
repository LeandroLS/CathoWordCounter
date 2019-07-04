let keyWords = ['php', 'nodejs'];
let text1 = 'olá,tudo bem php sakdaskdsaa nodejs nodejs';
let text2 = 'laravel php tudo bem';
let allTextArr = [];
allTextArr.push(text1,text2);
let allWordsArray = allTextArr.map(element => {
    return element.split(/[^a-zA-Z0-9s|]/);
}).join(',').split(',');
let wordCounterArr = [];
allWordsArray.forEach(wordToFind => {
    let counter = 0;
    allWordsArray.forEach((word,index) => {
        if(wordToFind == word){
            counter++;
            delete allWordsArray[index]
        }
    });
    wordCounterArr.push({
        qtdOcurrency: counter,
        word: wordToFind
    });
    counter = 0;
});
console.log(wordCounterArr);