import { SentimentIntensityAnalyzer } from "vader-sentiment";
import { MidfulExtensionClass } from "./mindful-class";

let hostname = location.hostname;
let blacklist = [];
console.log(hostname);

chrome.storage.sync.get(['blacklist'], function (result) {
  console.log(result.blacklist)
  blacklist = result.blacklist;
  console.log('here')
  // WORK ON THIS SECTION (WORKS ON MY SYSTEM/ BUT IN CASE OF OTHERS)
  console.log(`Should work ${(Array.isArray(blacklist)) && !blacklist.includes(hostname)}`)
  // dont need length
  // blacklist is an array and it is not included in the blacklist
  // do not technically have to check if it is an array
  if ((Array.isArray(blacklist)) && !blacklist.includes(hostname)) {
    runExtension();
  } // handle if array is empty??
  // it is an array and it is not empty, there are blacklisted sites
  // else if (!blacklist.includes(hostname)) { // should i still check length??
  //   runExtension();

  // }
});

function runExtension() {
  let activeElement;
  let score = 0;
  let port;
  let text = "";
  // NOT SURE ABOUT CAPSLOCK
  // would have used keyCode but is deprecated
  const badKeys = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12', 'audiovolumemute', 'audiovolumedown', 'arrowright', 'arrowleft', 'arrowdown', 'arrowup', 'audiovolumeup', 'mediaplaypause', 'mediatracknext', 'mediatrackprevious', 'capslock', 'printscreen', 'home', 'end', 'pageup', 'pagedown', 'numlock', 'clear', 'escape']// 'alt', 'shift', 'control', 'meta', 'scrolllock', 'symbol', 'symbollock'
  // previousInstance
  let noResultTimeOut; // TIMEOUT INCASE NO RESULS COME IN ABOUT 15 SECONDS

  let currentMindfulInstance = new MidfulExtensionClass();
  // better to attach to document due to server side rendering changing the body and head
  document.addEventListener("click", () => {
    console.log('click');
    activeElement = document.activeElement;

    console.log(activeElement.tagName);

    console.log("Should insert: " + shouldInsertWrapper());

    if (shouldInsertWrapper()) {
      console.log(activeElement);


      //score = 0; //reset score -  is this needed
      // checks if there is already an MindfulWatcher attached
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
        //analyzeInput();
      } else {
        insertExtension();
        // incase there is already text in the element
        // do i need to call these functions
        analyzeInput();
        // conditionaly if text
        doneTyping(text);
        activeElement.addEventListener("input", () => {
          console.log('input');
          analyzeInput();
        });



        let typingTimer;

        activeElement.addEventListener("keyup", (event) => {
          // console.log(event.key)
          const key = event.key.toLowerCase();
          //console.log(key);
          if (badKeys.includes(key)) return;

          clearTimeout(typingTimer);
          clearTimeout(noResultTimeOut); // clears timeout for no response
          noResultTimeOut = null;

          typingTimer = setTimeout(function () {
            doneTyping(text);
          }, 2000);

        });
        // message listener for errors from backgriund script
        chrome.runtime.onMessage.addListener((message) => {
          // do i need to check errorElemnt ???
          if (message.error === "true" && !currentMindfulInstance.errorElement) {
            console.log('recieved error message');
            currentMindfulInstance.createErrorElement();
          }
        })

      }

    }

  });



  function shouldInsertWrapper() {
    // checks if element is content editable or textarea and if it has the right dimensions
    console.log('width', activeElement.clientWidth);

    console.log('height', activeElement.clientHeight);
    console.log(activeElement.clientWidth > 190 && activeElement.clientHeight > 20);
    return ((activeElement.tagName === "TEXTAREA" && activeElement.clientWidth > 190 && activeElement.clientHeight > 20) || (activeElement.isContentEditable));


  }

  function insertExtension() {
    // create extension instance on element

    // could insert extension as child of parenElement instead of activeElement ???
    let mindfulWrapper = document.createElement("mindful-extension");
    let wrapperDiv = document.createElement("div");
    let scoreElement = document.createElement("span");

    let loadingElement = document.createElement("div");
    loadingElement.appendChild(document.createElement("div"));
    mindfulWrapper.appendChild(wrapperDiv);
    wrapperDiv.appendChild(scoreElement);
    wrapperDiv.appendChild(loadingElement);

    // insert created element into the page // technically inertAfter
    activeElement.parentNode.insertBefore(
      mindfulWrapper,
      activeElement.nextSibling
    );


    currentMindfulInstance.setValues(mindfulWrapper);
    currentMindfulInstance.setWrapperDivID("mindful-wrapper");
    // if i am using analyzeInput, it dosent make sence
    // currentMindfulInstance.setEmojiElementContent("128528"); // defult emoji
    currentMindfulInstance.setSpanElementClassName("mindful-span-elements");
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

    else return "128528"; // default score
  }

  function analyzeInput() {
    //activeElement.value || activeElement.textContent
    text = activeElement.tagName === "TEXTAREA" ? activeElement.value.trim() : activeElement.textContent.trim();

    // if there is no text, there should technically be no toxicElements
    // should be here if all text is deleted
    if (currentMindfulInstance.tocicityElements.length > 0) {
      // if there is no text and there are
      currentMindfulInstance.removeToxicityElements(); // think about this
    }

    if (!text) {
      // just set defult emoji
      currentMindfulInstance.setEmojiElementContent("128528");
      return;
    }
    // if (currentMindfulInstance.errorElement) {
    //   currentMindfulInstance.errorElement.remove();
    // }

    let analysis = SentimentIntensityAnalyzer.polarity_scores(text);

    console.log(analysis);
    score = analysis.compound;
    currentMindfulInstance.setEmojiElementContent(getEmoji(score));



  }

  // function reconnectToExtension() {
  //   console.log('Disconected'); // should insead just create an error element
  //   port = null;
  //   // should there be a set timeout
  //   setTimeout(connectToPort, 1000);
  //   // connectToPort();

  // }

  function connectToPort() {

    port = chrome.runtime.connect({ name: "ToxicML" });
    console.log('connected');



    port.onMessage.addListener(function (msg) {
      console.log(msg.prediction);

      if (noResultTimeOut) {
        clearTimeout(noResultTimeOut);
        noResultTimeOut = null; // do i technically need to do this

      } // remove spinner
      if (currentMindfulInstance.isLoaderSpinning() && msg.prediction) {

        currentMindfulInstance.removeLoadingSpinner();
        currentMindfulInstance.setToxicityElements(msg.prediction);

      }
    });

    port.onDisconnect.addListener(function () {
      currentMindfulInstance.createErrorElement('Reload Page');
      return;
    })
  }

  function doneTyping(userText) {
    console.log('here')
    if (!userText) return;
    console.log('here 2')
    if (!port) {
      connectToPort();
    }

    try {
      port.postMessage({ text: userText });

      console.log("message sent");
      // check lenght????
    } catch (err) {
      console.error(err); // if a message cannot be sent, create error element and stop execution
      currentMindfulInstance.createErrorElement('Reload Page');

      return;
    }
    //port.postMessage({ text: userText });
    // this is actually needed
    if (currentMindfulInstance.tocicityElements.length > 0) {
      // remove toxicity elemnts if any
      currentMindfulInstance.removeToxicityElements();
    }
    if (currentMindfulInstance.errorElement) {
      currentMindfulInstance.removeErrorElement(); // 
      // currentMindfulInstance.errorElement.remove();
      // currentMindfulInstance.errorElement = undefined;
    }

    // currentMindfulInstance.setSpanElementClassName("mindful-span-elements");
    //Adds loading spinner
    currentMindfulInstance.addLoaderSpinner();
    // currentMindfulInstance.getLoadingElement().classList.add("la-ball-clip-rotate"); // add animation

    // removes loading spinner after 15 seconds and add error element 
    // if no response is given
    noResultTimeOut = setTimeout(function () {
      //console.log('TIMEOUT') // is this how to do this???
      // show error // should we assume an error occured???
      currentMindfulInstance.createErrorElement('Error');
      // }
    }, 15 * 1000);
    // console.log(noResultTimeOut);
  }
}