import Sentiment from "sentiment"; // remove befor production
import { SentimentIntensityAnalyzer } from "vader-sentiment";
import { MidfulExtensionClass } from './mindful-class';

// import * as toxicity from '@tensorflow-models/toxicity';
// import work from 'webworkify-webpack';
//import Worker from 'worker-loader!./Worker';
// ONLY DO TEXTAREA (DOES GRAMMARLY ONLY DO THAT???)

// Might make utils folder
// isInputElement
// isTextArea
// isContentEditable

// remove console.logs and comments
// make final dist folder

// if using "progressbar.min.js, dont forget to put minfile in manifest.json"
let activeElement;
let sentiment = new Sentiment();
let score = 0;
let model;
let worker;
let port;
let text;
//let progressBar;
// can add progressBar dist code as contentscript js/css file

// let wrapperDiv;
// let scoreElement; // for emoji
// let progressBar; // positble progress bar (or text)
// let mindfulWrapper;

let currentMindfulInstance = new MidfulExtensionClass();
// The minimum prediction confidence. https://github.com/tensorflow/tfjs-models/tree/master/toxicity

// figure out why this slows down the entire thread
// also increases extension size

// in production remove consologs
// const threshold = 0.9
// toxicity.load(threshold)
//   .then(modelObject => { 
//     model = modelObject;
    
//   })
//   .catch(err => {
//     console.log(err)
//   }) 


// make accounts and test on target websites/ platforms
// reddit 

document.body.addEventListener("click", () => {

  activeElement = document.activeElement;

  console.log(activeElement.tagName);

  console.log('Should insert: ' + shouldInsertWrapper());

  if (shouldInsertWrapper()) {
    //console.log(activeElement.isContentEditable);
    console.log(activeElement.type);

    score = 0; //reset


    if (activeElement.nextSibling && activeElement.nextSibling.tagName === 'MINDFUL-EXTENSION' && currentMindfulInstance) {
      // need to check if there is a nextSibling because of content editable
      // if extension has already been added to text fiield
      // must have a sibling
      // set values
      // compare active elements??
      currentMindfulInstance.setValues(activeElement.nextSibling);
      //progressBar = undefined; // reset value
      analyzeInput();

    } else {

      inserExtension();
      analyzeInput();

    }
    // if it is an input element and it is in a form
    // might change this later
    // if (document.getElementById('mindful-wrapper')) {
    //   analyzeInput();
    // } else {
    // wrapperDiv = document.createElement("div");
    // wrapperDiv.id = "mindful-wrapper";

    // inserExtension();


    // // activeElement.parentNode.insertBefore(
    // //   mindfulWrapper,
    // //   activeElement.nextSibling
    // // );



    // analyzeInput();

  }
  // console.log(document.activeElement.tagName)
  // console.log(sentiment.analyzeInput(document.activeElement.value));
  //might have to increase the scale to have more nuetral values (or devide by 5 like google nlp)
});

function shouldInsertWrapper() {
  return (activeElement.tagName === "INPUT" && activeElement.type === 'text') ||
    activeElement.tagName === "TEXTAREA" ||
    activeElement.isContentEditable;
  // Figure out strategy so that all appropriate inputs can have extension working 

  // checks if the elemt is an input, textarea or contentEditable 
}

function inserExtension() {
  // create extension instance on element

  // could insert extension as child of parenElement instead of activeElement ???
  let mindfulWrapper = document.createElement('mindful-extension')
  let wrapperDiv = document.createElement('div');
  // should styles be loaded her on on type event
  let scoreElement = document.createElement('span');
  // let progressBar = document.createElement('span');
  let loading = document.createElement('div');
  loading.appendChild(document.createElement('div'))
  mindfulWrapper.appendChild(wrapperDiv);
  wrapperDiv.appendChild(scoreElement);
  wrapperDiv.appendChild(loading); 

  // insert created element into the page
  activeElement.parentNode.insertBefore(
    mindfulWrapper,
    activeElement.nextSibling
  );

  // class will be made here

  //currentMindfulInstance = new MidfulExtensionClass(mindfulWrapper);
  currentMindfulInstance.setValues(mindfulWrapper);
  currentMindfulInstance.setWrapperDivID("mindful-wrapper");
  
  currentMindfulInstance.setEmojiElementContent('128528');
  



} 

function getEmoji(score) {
  // workon 
  // confirm if my evaluattion is correct
  if (score > 0.8) return '128525';
  else if (score > 0.6) return '128512';
  else if (score > 0.4) return '128578';
  else if (score < -0.2 && score > -0.4) return '128528';
  else if (score < -0.4 && score > -0.6) return '128577';
  else if (score < -0.6 && score > -0.8) return '128551'; // could also use '128550'??? include this one
  else if (score < -0.8) return '128552'; // not working on values lower than -0.2
  else return '128528';

  // figure out ehy is is not working

}

function analyzeInput() {
  activeElement.addEventListener("input", (e) => {

    // if (!wrapperDiv.id) {
    //   wrapperDiv.id = "mindful-wrapper"; // apply styling on input event
    // }



    // if (!currentMindfulInstance.getWrapperDiv.id) {
    //     currentMindfulInstance.setWrapperDivID("mindful-wrapper");
    //     currentMindfulInstance.setSpanElementClassName('mindful-span-elements');

        

        
    // }

    
      // progressBar = new ProgressBar.Line(currentMindfulInstance.getProgressBarElement(), {
      //   strokeWidth: 4,
      //   easing: 'easeInOut',
      //   duration: 1400,
      //   color: '#FFEA82',
      //   trailColor: '#eee',
      //   trailWidth: 1,
      //   svgStyle: {width: '50px'}
      // })
    // SHOULD TEXT BE GLOBAL (DIDNT WANT TO DECLARE A NEW VARIABLE EVERYTIME)

    console.log(activeElement.nextSibling.tagName);
    if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
      // console.log(e);
      text = activeElement.value.trim();
      
      let analysis = sentiment.analyze(text);
      //let analysis_2 = SentimentIntensityAnalyzer.polarity_scores(e.target.value);
      let analysis_2 = SentimentIntensityAnalyzer.polarity_scores(text);

      console.log(analysis);
      console.log(analysis_2);

      
      

      score = analysis_2.compound; // `${score}`
      currentMindfulInstance.setEmojiElementContent(getEmoji(score));
      
      // model.classify(activeElement.value).then(prediction => {
      //   console.log(prediction);
      // }) // this slows down the entire site!!!
      // currentMindfulInstance.progressBar.animate(1);

      
      //scoreElement.innerHTML = String.fromCodePoint(getEmoji(score));

    } else {  
      // contentEditable  
      text = activeElement.innerHTML.trim();
      if (text.length === 0 && currentMindfulInstance.tocicityElements.length >= 0) {
        currentMindfulInstance.removeToxicityElements();
      }   
      let analysis = sentiment.analyze(text);
      let analysis_2 = SentimentIntensityAnalyzer.polarity_scores(text);
      console.log(analysis);
      console.log(analysis_2);
  
      

      score = analysis_2.compound; // `${score}`
      currentMindfulInstance.setEmojiElementContent(getEmoji(score));
      // currentMindfulInstance.setSpanElementClassName('mindful-span-elements');

      
      // currentMindfulInstance.setLoadingElementText('Loading...');
      
      // model.classify(activeElement.innerHTML).then(prediction => {
      //   console.log(prediction);
      // })
      // currentMindfulInstance.progressBar.animate(1);

      
    }



  });

  let typingTimer;
  activeElement.addEventListener('keyup', () => {
    clearTimeout(typingTimer);

    if (activeElement.value) { // pass in value as parameter or just use global variable
      typingTimer = setTimeout(function() {doneTyping(activeElement.value)}, 2000)
    } else if (activeElement.innerHTML) {
      typingTimer = setTimeout(function() {doneTyping(activeElement.innerHTML)}, 2000)
    }
  })
}

 function doneTyping(userText) {
   if (userText === '') return;
  // chrome.runtime.sendMessage({text: userText}, function(response) {
  //   // console.log(response.prediction);
  // });

  // chrome.runtime.onMessage.addListener(
  //   function(request) {
  //     console.log(request.prediction)
  //   }
  // )

  if (!port) {
   port = chrome.runtime.connect({name: "ToxicML"});
   
  }

  port.postMessage({text: userText}); //test reasons
  console.log('message sent');
  if (currentMindfulInstance.tocicityElements) {
    // remove them
    currentMindfulInstance.removeToxicityElements();
  }
  currentMindfulInstance.setSpanElementClassName('mindful-span-elements');
  currentMindfulInstance.getLoadingElement().classList.add("la-ball-clip-rotate");
  // currentMindfulInstance.getLoadingElement().classList.toggle("la-ball-clip-rotate");

  port.onMessage.addListener(function (msg) {
    console.log(msg.prediction);
    if (currentMindfulInstance.getLoadingElement().classList.contains("la-ball-clip-rotate") && msg.prediction){
      currentMindfulInstance.getLoadingElement().classList.remove("la-ball-clip-rotate");

      currentMindfulInstance.setToxicityElements(msg.prediction);
    }
    

  })
   

//   if (!worker && window.Worker) {
//   //  worker = new Worker();

//   worker = work(require.resolve('./Worker.js'));
//   }

//   worker.postMessage(text);
//   console.log('sent message to worker');
//   // model.classify(text).then(prediction => {
//   //       console.log(prediction); // blocks entire thread???
//   //     })
 }
