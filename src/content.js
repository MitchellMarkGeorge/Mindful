import Sentiment from 'sentiment';
console.log('hello')
//console.log(document.activeElement)

//document.body.onclick = 

let activeElement;
let sentiment = new Sentiment();
let score = 0;
let wrapperDiv;


document.body.addEventListener('click', () => {
    
    activeElement = document.activeElement;
    console.log(activeElement.contentEditable);
// forms???
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.contentEditable === 'true') {
        wrapperDiv = document.createElement('div');
        activeElement.appendChild(wrapperDiv);
        analyze();
    }
    // console.log(document.activeElement.tagName)
    // console.log(sentiment.analyze(document.activeElement.value));
    //might have to increase the scale to have more nuetral values (or devide by 10 like google nlp) 
})

function analyze() {

    activeElement.addEventListener('input', () => {
        //console.log(activeElement.value);
        console.log(sentiment.analyze(activeElement.value));
    })



}