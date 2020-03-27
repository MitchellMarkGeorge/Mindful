import { SentimentIntensityAnalyzer } from "vader-sentiment";
import { MidfulExtensionClass } from "./mindful-class";
//ALL CONSOLE.LOGS ARE REMOVED IN PRODUCTION
let hostname = location.hostname;
let blacklist = [];
// console.log(hostname);
// EMOJI SENTIMENT
chrome.storage.sync.get(['blacklist'], function (result) {
  console.log(result.blacklist)
  blacklist = result.blacklist;
  console.log(`Should work ${(Array.isArray(blacklist)) && !blacklist.includes(hostname)}`)

  // cheks if blacklist is an array and current hostname is not included in the blacklist
  // do not technically have to check if it is an array
  if ((Array.isArray(blacklist)) && !blacklist.includes(hostname)) {
    runExtension();
  }
});

function runExtension() {
  let activeElement;
  let score = 0; // dosent need to be 
  let port;
  let text = "";
  let id = 0;
  let currentElementIndex = 0;
  // would have used keyCode but is deprecated
  //keys that should not trigger advance text analysis
  const badKeys = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12', 'audiovolumemute', 'audiovolumedown', 'arrowright', 'arrowleft', 'arrowdown', 'arrowup', 'audiovolumeup', 'mediaplaypause', 'mediatracknext', 'mediatrackprevious', 'capslock', 'printscreen', 'home', 'end', 'pageup', 'pagedown', 'numlock', 'clear', 'escape']// 'alt', 'shift', 'control', 'meta', 'scrolllock', 'symbol', 'symbollock'
  // previousInstance
  let noResultTimeOut; // TIMEOUT INCASE NO RESULS COME IN ABOUT 15 SECONDS
  let typingTimer;
  let currentMindfulInstance = new MidfulExtensionClass();

  chrome.runtime.onMessage.addListener((message) => {
    // do i need to check errorElemnt ???
    if (message.error === "true" && !currentMindfulInstance.errorElement) {
      console.log('recieved error message');
      currentMindfulInstance.createErrorElement();
    }
  })
  // better to attach to document due to server side rendering changing the body and head
  document.addEventListener("click", () => {
    //console.log('click'); 
    activeElement = document.activeElement;
    // SET EMOJI SIZE!!!
    //STILL SOMETIMES COMES AS UNAVILIBLE
    //EXTENSION REFRESH
    console.log(activeElement.tagName);

    console.log("Should insert: " + shouldInsertWrapper());

    if (shouldInsertWrapper()) {
      console.log(activeElement);

      if (
        activeElement.nextSibling &&
        activeElement.nextSibling.tagName === "MINDFUL-EXTENSION" &&
        currentMindfulInstance
      ) {
        // need to check if there is a nextSibling because of content editable
        // if extension has already been added to text fiield
        // must have a sibling

        currentMindfulInstance.setValues(activeElement.nextSibling, activeElement);// might just pass activeElement
        return;


      }


      if (currentMindfulInstance.previous) {
        // ALWAYS PUT THE VIEW FIRST!!!

        currentMindfulInstance.removePrevious();
        let previousActiveElement = currentMindfulInstance.previousActiveElement; // WORK ON THIS
        // might not even need to remove listeners due to identical listeners not added
        // previousActiveElement.removeEventListener('input', analyzeInput);
        // previousActiveElement.removeEventListener("keyup", keyUpFunction);

      }

      insertExtension();

      analyzeInput();
      doneTyping();
      // NEED TO ADD EVENTLISTENERS
      activeElement.addEventListener("input",
        // console.log('input');
        analyzeInput
      );

      activeElement.addEventListener("keyup", keyUpFunction)



      //score = 0; //reset score -  is this needed

      // if (
      //   activeElement.nextSibling &&
      //   activeElement.nextSibling.tagName === "MINDFUL-EXTENSION" &&
      //   currentMindfulInstance
      // ) {
      //   // need to check if there is a nextSibling because of content editable
      //   // if extension has already been added to text fiield
      //   // must have a sibling

      //   currentMindfulInstance.setValues(activeElement.nextSibling);


      // } else {


      //   insertExtension();
      //   // incase there is already text in the element

      //   analyzeInput();
      //   doneTyping(text);

      //   activeElement.addEventListener("input",
      //     // console.log('input');
      //     analyzeInput
      //   );

      //   activeElement.addEventListener("keyup", keyUpFunction)





      //   // activeElement.addEventListener("keyup", (event) => {
      //   //   // console.log(event.key)
      //   //   const key = event.key.toLowerCase();
      //   //   // does not call advanced analysis if "bad" key is pressed 
      //   //   if (badKeys.includes(key)) return;

      //   //   clearTimeout(typingTimer);
      //   //   clearTimeout(noResultTimeOut); // clears timeout for no response
      //   //   noResultTimeOut = null;

      //   //   typingTimer = setTimeout(

      //   //     doneTyping, 2000) // could even reduce the timing

      //   // });
      //   // message listener for errors from backgriund script
      //   // should be outside of document click


      // }

    }

  });



  function shouldInsertWrapper() {
    // checks if element is content editable or textarea and if it has the right dimensions

    return ((activeElement.tagName === "TEXTAREA" && activeElement.clientWidth > 190 && activeElement.clientHeight > 20) || (activeElement.isContentEditable));


  }

  function keyUpFunction(event) {
    const key = event.key.toLowerCase();
    // does not call advanced analysis if "bad" key is pressed 
    if (badKeys.includes(key)) return;

    clearTimeout(typingTimer);
    clearTimeout(noResultTimeOut); // clears timeout for no response
    noResultTimeOut = null;

    typingTimer = setTimeout(

      doneTyping, 2000) // could even reduce the timing
  }

  function insertExtension() {
    // create extension instance on element

    // could insert extension as child of parenElement instead of activeElement ???
    let mindfulWrapper = document.createElement("mindful-extension");
    let wrapperDiv = document.createElement("div");
    let scoreElement = document.createElement("span");

    let loadingElement = document.createElement("div");
    // need this for loading element to show
    loadingElement.appendChild(document.createElement("div"));
    mindfulWrapper.appendChild(wrapperDiv);
    wrapperDiv.appendChild(scoreElement);
    wrapperDiv.appendChild(loadingElement);

    // insert created element into the page // technically inertAfter
    activeElement.parentNode.insertBefore(
      mindfulWrapper,
      activeElement.nextSibling
    );

    id += 1;
    console.log(id);
      // every element that the mindful-wraper is attached to is has an id attached to it
      // to so when messages are sent to the background script, it knows witch element to 
      // set the results to (id is with text)
    if (!activeElement.hasAttribute('data-mindful-id')) {
      activeElement.setAttribute('data-mindful-id', id.toString())
    //   currentElementIndex = id.toString(); // CAN JUST DECLARE VARABLE ABOVE SETATTRIBUTE
    // } else {
    //  currentElementIndex = activeElement.getAttribute('data-mindful-id');
    }


    currentMindfulInstance.setValues(mindfulWrapper, activeElement);
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
      currentMindfulInstance.removeToxicityElements();
    }

    if (!text) {
      // just set defult emoji
      currentMindfulInstance.setEmojiElementContent("128528");
      return;
    }


    let analysis = SentimentIntensityAnalyzer.polarity_scores(text);

    console.log(analysis);
    score = analysis.compound;
    currentMindfulInstance.setEmojiElementContent(getEmoji(score));


  }


  function connectToPort() {

    try {
      port = chrome.runtime.connect({ name: "ToxicML" });
    } catch (err) {
      console.error(err);
      currentMindfulInstance.createErrorElement('Reload Page');
      return;
    }
    console.log('connected');

    port.onMessage.addListener(function (msg) {
      console.log(msg.prediction);

      if (noResultTimeOut) {
        clearTimeout(noResultTimeOut);
        noResultTimeOut = null; // do i technically need to do this

      }
      // this could be problematic - if loader is dismissed in timeout but a result comes in, it might not show
      // if (currentMindfulInstance.isLoaderSpinning() && msg.prediction) {

      //   currentMindfulInstance.removeLoadingSpinner();
      //   currentMindfulInstance.setToxicityElements(msg.prediction);

      // }

      if (currentMindfulInstance.isLoaderSpinning()) {
        currentMindfulInstance.removeLoadingSpinner();
      }

      if (msg.prediction) {
      // once results from bg script is received, if the current active elment's id 
      // is not the same as the one sent to the background script, it will ignore the result 
      
        let currentID = activeElement.getAttribute('data-mindful-id');
        console.log(currentID, msg.id)
        console.log(currentID === msg.id)
        if (currentID === msg.id) {
          
          currentMindfulInstance.setToxicityElements(msg.prediction);  

        }
        
      }
    });

    port.onDisconnect.addListener(function () {
      currentMindfulInstance.createErrorElement('Reload Page'); // should probbably use variable for text
      return;
    })
  }

  function doneTyping() {

    if (!text) return;

    if (!port) {
      connectToPort();
    }

    try {
      // should i use score thershold
      port.postMessage({ userText: text, id: activeElement.getAttribute('data-mindful-id') }); // see if this is working // activeElement.getAttribute('data-mindful-id')
        // currentElementId
      console.log("message sent");

    } catch (err) {
      console.error(err); // if a message cannot be sent, create error element and stop execution
      currentMindfulInstance.createErrorElement('Reload Page');

      return;
    }


    if (currentMindfulInstance.tocicityElements.length > 0) {
      // remove toxicity elemnts if any
      currentMindfulInstance.removeToxicityElements();
    }
    if (currentMindfulInstance.errorElement) {
      currentMindfulInstance.removeErrorElement();

    }


    //Adds loading spinner
    currentMindfulInstance.addLoaderSpinner();
    // currentMindfulInstance.getLoadingElement().classList.add("la-ball-clip-rotate"); // add animation

    // removes loading spinner after 17 (15 was too short) seconds and add error element if no response is given
    noResultTimeOut = setTimeout(function () {

      // should we assume an error occured???
      if (currentMindfulInstance.isLoaderSpinning()) {
        currentMindfulInstance.removeLoadingSpinner()
      }
      // currentMindfulInstance.createErrorElement('Error');
      // }
    }, 17 * 1000);

  }
}