import Sentiment from 'sentiment';
console.log('hello')
//console.log(document.activeElement)

//document.body.onclick = 

let activeElement;
let sentiment = new Sentiment();
let score = 0;
let wrapperDiv;

//TODO: see if ther is already a text area or input in focus
// reddit

document.body.addEventListener('click', () => {
    
    activeElement = document.activeElement;
    console.log(activeElement.tagName);
// forms??? // might reconsidder contentEditable

// might have to do something different for each type ofwhay of input
// consider grammarly
// reconsider way of showund sentiement (might just use dashboard or new tab. Consult Nick, Mr. Ajiri, and Uncle Seyi)
// should not interfere with previous extension
// instant feedback??
// tooltip??
// reomve on blur
//should not be in the way of the user
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.contentEditable == 'true') {

        // if (activeElement.hasChildNodes()) {
        //     analyze();
        // } else {
            // wrapperDiv = document.createElement('div');
            // wrapperDiv.style.position = 'relative';
            // wrapperDiv.style.top = '0';
            // wrapperDiv.style.left = '0'

            // top: 0px;
            // left: 0px;
            // activeElement.insertAdjacentElement('beforebegin', wrapperDiv);
            // activeElement.appendChild(wrapperDiv);
            // console.log(wrapperDiv);
            analyze();
        // }
    }
    // console.log(document.activeElement.tagName)
    // console.log(sentiment.analyze(document.activeElement.value));
    //might have to increase the scale to have more nuetral values (or devide by 5 like google nlp) 
})

function analyze() {

    activeElement.addEventListener('input', (e) => {


        //console.log(activeElement.value);
        // console.log(sentiment.analyze(e.target.value));

        if (!activeElement.value) return;
        let analysis = sentiment.analyze(activeElement.value)
        console.log(analysis);
        // console.log(e);
         activeElement.value += ` ${analysis.score}`;
        //wrapperDiv.innerHTML = `${analysis.score}`;
    })



}