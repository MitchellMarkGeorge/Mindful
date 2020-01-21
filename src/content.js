import Sentiment from "sentiment"; // remove befor production
import { SentimentIntensityAnalyzer } from "vader-sentiment";
import { MidfulExtensionClass } from "./mindful-class";

//import * as browser from 'webextension-polyfill';

// ONLY DO TEXTAREA (DOES GRAMMARLY ONLY DO THAT???)


// comment all console.logs for production

chrome.storage.onChanged.addListener(function(changes, namespace) {
  console.log(changes);
})

let hostname = location.hostname;
let blacklist = [];
console.log(hostname);




chrome.storage.sync.get(['blacklist'], function (result) {
  console.log(result.blacklist)
  blacklist = result.blacklist;
  // WORK ON THIS SECTION (WORKS ON MY SYSTEM/ BUT IN CASE OF OTHERS)
  console.log(!Array.isArray(blacklist) || !blacklist.length);
  // not an array and is empty - still run
  if (!Array.isArray(blacklist) || !blacklist.length) {
    runExtension();
  } // handle if array is empty??
  // it is an array and it is not empty, there are blacklisted sites
  else if (!blacklist.includes(hostname)) { // should i still check length??
    runExtension();

  }
});

function runExtension() {
  let activeElement;
  let sentiment = new Sentiment();
  let score = 0;
  let model;
  let worker;
  let port;
  let text = "";
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

    console.log("Should insert: " + shouldInsertWrapper());

    if (shouldInsertWrapper()) {
      console.log(activeElement);
      console.log(!activeElement.getAttribute("autocorrect")); // whick ones should i be checking
      console.log(!activeElement.getAttribute("autocomplete")); // could be a code editor // mignt not even check any

      score = 0; //reset score -  is this needed

      if (
        activeElement.nextSibling &&
        activeElement.nextSibling.tagName === "MINDFUL-EXTENSION" &&
        currentMindfulInstance
      ) {
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
    // THE REASON GRMMARLY DOES NOT WORK ON CODEEDITORS IS BECAUSE IT TAKES INTO ACCOUNT THE HEIGHT OF THE TEXTAREA
    // CODE EDITOR TEXTAREAS USUALLY HAVE SMALL AND ODD DIMENSION FOR LINE HILIGHTING AND OTHER THINGS
    // USE HIGHT AND WIDTH FOR TEXTAREA (THIS WILL HELP WITH CODE EDITORS)
    return (
      (activeElement.tagName === "TEXTAREA" || activeElement.isContentEditable) &&
      !activeElement.getAttribute("autocorrect") && //dont check any (purpose of black luse)
      !activeElement.getAttribute("autocomplete") // dont check any of them
    );

    // adjust to not work on code editor textareas
    // Figure out strategy so that all appropriate inputs can have extension working
    //FIGURED IT OUT: ONLY USE TEXTARES
    // ALSO, CONSIDER SIZE LIKE GRAMARLY

    // checks if the elemt is textarea or contentEditable
  }

  function inserExtension() {
    // create extension instance on element

    // could insert extension as child of parenElement instead of activeElement ???
    let mindfulWrapper = document.createElement("mindful-extension");
    let wrapperDiv = document.createElement("div");
    // should styles be loaded her on on type event
    let scoreElement = document.createElement("span");
    // let progressBar = document.createElement('span');
    let loadingElement = document.createElement("div");
    loadingElement.appendChild(document.createElement("div"));
    mindfulWrapper.appendChild(wrapperDiv);
    wrapperDiv.appendChild(scoreElement);
    wrapperDiv.appendChild(loadingElement);

    // insert created element into the page
    activeElement.parentNode.insertBefore(
      mindfulWrapper,
      activeElement.nextSibling
    );

    // class will be made here

    //currentMindfulInstance = new MidfulExtensionClass(mindfulWrapper);
    currentMindfulInstance.setValues(mindfulWrapper);
    currentMindfulInstance.setWrapperDivID("mindful-wrapper");

    currentMindfulInstance.setEmojiElementContent("128528"); // defult emoji
  }

  function getEmoji(score) {
    // workon
    // confirm if my evaluattion is correct
    if (score > 0.8) return "128525";
    else if (score > 0.6) return "128512";
    else if (score > 0.4) return "128578";
    else if (score < -0.2 && score > -0.4) return "128528";
    else if (score < -0.4 && score > -0.6) return "128577";
    else if (score < -0.6 && score > -0.8) return "128551";
    // could also use '128550'??? include this one
    else if (score < -0.8) return "128552";
    // not working on values lower than -0.2
    else return "128528";
  }

  function analyzeInput() {
    activeElement.addEventListener("input", e => {
      // if (!wrapperDiv.id) {
      //   wrapperDiv.id = "mindful-wrapper"; // apply styling on input event
      // }

      // if (!currentMindfulInstance.getWrapperDiv.id) {
      //     currentMindfulInstance.setWrapperDivID("mindful-wrapper");
      //     currentMindfulInstance.setSpanElementClassName('mindful-span-elements');

      // }

      // should text be variable

      console.log(activeElement.nextSibling.tagName);
      if (activeElement.tagName === "TEXTAREA") {
        // console.log(activeElement.cols);
        // console.log(e);
        //text = activeElement.value.trim();

        if (currentMindfulInstance.tocicityElements.length > 0) {
          // if there is no text and there are
          currentMindfulInstance.removeToxicityElements(); // think about this
        }

        //event.target.value

        let analysis = sentiment.analyze(activeElement.value);
        //let analysis_2 = SentimentIntensityAnalyzer.polarity_scores(e.target.value);
        let analysis_2 = SentimentIntensityAnalyzer.polarity_scores(
          activeElement.value
        );

        console.log(analysis);
        console.log(analysis_2);

        score = analysis_2.compound;
        currentMindfulInstance.setEmojiElementContent(getEmoji(score));
      } else {
        // contentEditable
        //text = activeElement.innerHTML.trim();
        if (
          !activeElement.innerHTML &&
          currentMindfulInstance.tocicityElements.length > 0
        ) {
          currentMindfulInstance.removeToxicityElements();
        }
        let analysis = sentiment.analyze(activeElement.innerHTML);
        let analysis_2 = SentimentIntensityAnalyzer.polarity_scores(
          activeElement.innerHTML
        );
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
    activeElement.addEventListener("keyup", () => {
      clearTimeout(typingTimer);

      if (activeElement.value) {
        // pass in value as parameter or just use global variable
        typingTimer = setTimeout(function () {
          doneTyping(activeElement.value);
        }, 2000);
      } else if (activeElement.innerHTML) {
        typingTimer = setTimeout(function () {
          doneTyping(activeElement.innerHTML);
        }, 2000);
      }
    });
  }

  function doneTyping(userText) {
    if (userText === "") return; // do i need this???

    if (!port) {
      port = chrome.runtime.connect({ name: "ToxicML" });
    }

    port.postMessage({ text: userText });
    console.log("message sent");
    if (currentMindfulInstance.tocicityElements) {
      // remove toxicity elemnts if any
      currentMindfulInstance.removeToxicityElements();
    }

    currentMindfulInstance.setSpanElementClassName("mindful-span-elements");
    currentMindfulInstance
      .getLoadingElement()
      .classList.add("la-ball-clip-rotate"); // add animation
    // currentMindfulInstance.getLoadingElement().classList.toggle("la-ball-clip-rotate");

    port.onMessage.addListener(function (msg) {
      console.log(msg.prediction);
      if (
        currentMindfulInstance
          .getLoadingElement()
          .classList.contains("la-ball-clip-rotate") &&
        msg.prediction
      ) {
        currentMindfulInstance
          .getLoadingElement()
          .classList.remove("la-ball-clip-rotate");

        currentMindfulInstance.setToxicityElements(msg.prediction);
      }
    });
  }
}
