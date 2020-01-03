import Sentiment from "sentiment"; // will remove
import { SentimentIntensityAnalyzer } from "vader-sentiment";
import { MidfulExtensionClass } from './mindful-class'


// Might make utils folder
// isInputElement
// isTextArea
// isContentEditable

// make final dist folder

let activeElement;
let sentiment = new Sentiment();
let score = 0;
// let wrapperDiv;
// let scoreElement; // for emoji
// let progressBar; // positble progress bar (or text)
// let mindfulWrapper;

let currentMindfulInstance;


// make accounts and test on target websites/ platforms
// reddit 
  
document.body.addEventListener("click", () => {

  activeElement = document.activeElement;

  console.log(activeElement.tagName);

  console.log('Should insert: ' + shouldInsertWrapper());

  if (shouldInsertWrapper()) {
    //console.log(activeElement.isContentEditable);
    console.log(activeElement.type);
    console.log(activeElement.form);

    if (activeElement.nextSibling && activeElement.nextSibling.tagName === 'MINDFUL-EXTENSION' && currentMindfulInstance) {
      // need to check if there is a nextSibling because of content editable
      // if extension has already been added to text fiield
      // must have a sibling
      // set values
      // compare active elements??
      currentMindfulInstance.setValues(activeElement.nextSibling);
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
  return activeElement.tagName === "INPUT" ||
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
  let progressBar = document.createElement('span');
  mindfulWrapper.appendChild(wrapperDiv);
  wrapperDiv.appendChild(scoreElement);
  wrapperDiv.appendChild(progressBar);

  // insert created element into the page
  activeElement.parentNode.insertBefore(
    mindfulWrapper,
    activeElement.nextSibling
  );

  // class will be made here

  currentMindfulInstance = new MidfulExtensionClass(mindfulWrapper);

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

    if (!currentMindfulInstance.getWrapperDiv.id) {
      currentMindfulInstance.setWrapperDivID("mindful-wrapper");
    }

    console.log(activeElement.nextSibling.tagName);
    if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
      // console.log(e);
      let analysis = sentiment.analyze(activeElement.value);
      //let analysis_2 = SentimentIntensityAnalyzer.polarity_scores(e.target.value);
      let analysis_2 = SentimentIntensityAnalyzer.polarity_scores(activeElement.value);
      console.log(analysis);
      console.log(analysis_2);

      score = analysis_2.compound; // `${score}`
      currentMindfulInstance.setEmojiElementContent(getEmoji(score));
      //scoreElement.innerHTML = String.fromCodePoint(getEmoji(score));

    } else {
      // contentEditable
      let analysis = sentiment.analyze(activeElement.innerHTML);
      let analysis_2 = SentimentIntensityAnalyzer.polarity_scores(activeElement.innerHTML);
      console.log(analysis);
      console.log(analysis_2);

      score = analysis_2.compound; // `${score}`
      currentMindfulInstance.setEmojiElementContent(getEmoji(score));
    }



  });
}
