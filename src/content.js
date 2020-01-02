import Sentiment from "sentiment";
import { SentimentIntensityAnalyzer } from "vader-sentiment";


// Might make utils folder
// isInputElement
// isTextArea
// isContentEditable

// make final dist folder

let activeElement;
let sentiment = new Sentiment();
let score = 0;
let wrapperDiv;
let scoreElement; // for emoji
let progressBar; // positble progress bar (or text)
let mindfulWrapper;


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
    // if it is an input element and it is in a form
    // might change this later
    // if (document.getElementById('mindful-wrapper')) {
    //   analyze();
    // } else {
    // wrapperDiv = document.createElement("div");
    // wrapperDiv.id = "mindful-wrapper";

    inserExtension();


    // activeElement.parentNode.insertBefore(
    //   mindfulWrapper,
    //   activeElement.nextSibling
    // );


  
    analyze();

  }
  // console.log(document.activeElement.tagName)
  // console.log(sentiment.analyze(document.activeElement.value));
  //might have to increase the scale to have more nuetral values (or devide by 5 like google nlp)
});

function shouldInsertWrapper() {
  return activeElement.tagName === "INPUT" ||
    activeElement.tagName === "TEXTAREA" ||
    activeElement.isContentEditable;
  // Figure out strategy so that all appropriate inputs can have extension working and on then blur and then focus occurs, no new wrapper is made and appropriate wrapper reads input (multiple input problem)

  // checks if the elemt is an input, textarea or contentEditable 
}

function inserExtension() {
  // create extension instance on element
  mindfulWrapper = document.createElement('mindful-extension')
  wrapperDiv = document.createElement('div');

  scoreElement = document.createElement('span');
  progressBar = document.createElement('span');
  mindfulWrapper.appendChild(wrapperDiv);
  wrapperDiv.appendChild(scoreElement);
  wrapperDiv.appendChild(progressBar);

  // insert created element into the page
  activeElement.parentNode.insertBefore(
    mindfulWrapper,
    activeElement.nextSibling
  );


}

function analyze() {
  activeElement.addEventListener("input", (e) => {

    if (!wrapperDiv.id) {
      wrapperDiv.id = "mindful-wrapper"; // apply styling on input event
    }


    if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
      // console.log(e);
      let analysis = sentiment.analyze(activeElement.value);
      //let analysis_2 = SentimentIntensityAnalyzer.polarity_scores(e.target.value);
      let analysis_2 = SentimentIntensityAnalyzer.polarity_scores(activeElement.value);
      console.log(analysis);
      console.log(analysis_2);

      score = analysis_2.compound;
      scoreElement.innerHTML = `${score}`;

    } else {
      // contentEditable
      let analysis = sentiment.analyze(activeElement.innerHTML);
      let analysis_2 = SentimentIntensityAnalyzer.polarity_scores(activeElement.innerHTML);
      console.log(analysis);
      console.log(analysis_2);

      score = analysis_2.compound;
      scoreElement.innerHTML = `${score}`;
    }



  });
}
