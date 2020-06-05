import { SentimentAnalysisResult, ActiveElementType } from '../types';
import { SentimentIntensityAnalyzer } from "vader-sentiment";
import { MidfulExtensionClass } from "./mindful-class";
// import axios from 'axios';
import common from '../common/common';
import { shouldInsertExtension, createExtension, isAlreadyInserted, getEmojiCode } from "./functions";
// SentimentAnalysisResult
//ALL CONSOLE.LOGS ARE REMOVED IN PRODUCTION
// let hostname = location.hostname;
// let blacklist: string[] = [];
// console.log(hostname);
// EMOJI SENTIMENT

;(async function main () {// just use then() and catch??
  let blacklist = await common.getBlacklist(); // this is being called before it if finished readinf
  console.log(blacklist)
  let domain = common.getHostDomain(location.href);
  if (!blacklist.includes(domain)) {
    runExtension();
  }
})()

// beter way to do this.
// chrome.storage.sync.get(['blacklist'], function (result) {
//   console.log(result.blacklist)
//   blacklist = <string[]>result.blacklist;
//   console.log(`Should work ${!blacklist.includes(hostname)}`)

//   // cheks if blacklist is an array and current hostname is not included in the blacklist
//   // do not technically have to check if it is an array
//   if (!blacklist.includes(hostname)) {
//     runExtension();
//   }
// });

function runExtension() {
  let activeElement: Element | HTMLElement | HTMLTextAreaElement; // figure out type
  let score: number = 0; // dosent need to be 
  // let port: chrome.runtime.Port;
  let text: string = "";
  let id: number = 0;
  let currentElementIndex: number = 0;
  // would have used keyCode but is deprecated
  //keys that should not trigger advance text analysis
  // const badKeys: string[] = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12', 'audiovolumemute', 'audiovolumedown', 'arrowright', 'arrowleft', 'arrowdown', 'arrowup', 'audiovolumeup', 'mediaplaypause', 'mediatracknext', 'mediatrackprevious', 'capslock', 'printscreen', 'home', 'end', 'pageup', 'pagedown', 'numlock', 'clear', 'escape']// 'alt', 'shift', 'control', 'meta', 'scrolllock', 'symbol', 'symbollock'
  // previousInstance 
  let noResultTimeOut: number; // TIMEOUT INCASE NO RESULS COME IN ABOUT 15 SECONDS
  let typingTimer: number;
  // console.log() 
  let mindful = new MidfulExtensionClass();



  // chrome.runtime.onMessage.addListener((message) => {
  //   // do i need to check errorElemnt ???
  //   if (message.error === "true" && !mindful.errorElement) {
  //     console.log('recieved error message');
  //     mindful.createErrorElement();
  //   }
  // })
  // better to attach to document due to server side rendering changing the body and head
  document.addEventListener("click", async () => {
    //LOOK INTO THIS
    mindful.setActiveElement(document.activeElement);
    // let activeElement = mindful.getActiveElement();

    let activeElement: ActiveElementType = document.activeElement;
    // SET EMOJI SIZE!!!
    //STILL SOMETIMES COMES AS UNAVILIBLE
    //EXTENSION REFRESH
    console.log(activeElement.tagName);
    // const response = await axios.post('https://us-central1-mindful-279120.cloudfunctions.net/advanced-analysis', {text: ['Fuck you']});
    // console.log(JSON.parse(JSON.stringify(response.data)));

    // local variabvle for activeElement
    // console.log("Should insert: " + shouldInsertWrapper());

    if (shouldInsertExtension(activeElement)) {
      // console.log(activeElement);

      if (isAlreadyInserted(activeElement)) {
        // need to check if there is a nextSibling because of content editable
        // if extension has already been added to text fiield
        // must have a sibling

        mindful.setValues(activeElement.nextElementSibling, activeElement);// might just pass activeElement
        return;


      }


      if (mindful.previousMindfulWraper) {
        // ALWAYS PUT THE VIEW FIRST!!!

        mindful.removePreviousMindfulWraper();
        // let previousActiveElement = mindful.previousActiveElement; // WORK ON THIS
        // might not even need to remove listeners due to identical listeners not added
        // previousActiveElement.removeEventListener('input', analyzeInput);
        // previousActiveElement.removeEventListener("keyup", keyUpFunction);

      }

      // insertExtension();

      let minfulDOMWrapper = createExtension(activeElement)

      // insertafter - should they be elements
      activeElement.parentNode.insertBefore(
        minfulDOMWrapper, // or just pass in the function
        activeElement.nextSibling
      );

      mindful.setValues(minfulDOMWrapper, activeElement)



      analyzeInput();
      doneTyping();
      // NEED TO ADD EVENTLISTENERS
      activeElement.addEventListener("input", analyzeInput);

      activeElement.addEventListener("keyup", keyUpFunction)

      mindful.setActiveElement(document.activeElement)
      // when would be the best time to call this function?????


    }

  });


  function keyUpFunction(event) {
    const key = event.key.toLowerCase();
    // does not call advanced analysis if "bad" key is pressed 
    if (mindful.getBadKeys().includes(key)) return;

    window.clearTimeout(typingTimer);
    window.clearTimeout(noResultTimeOut); // clears timeout for no response
    noResultTimeOut = null; //?????

    typingTimer = window.setTimeout(

      doneTyping, 2000) // could even reduce the timing 

    // might not even need 
  }


  function analyzeInput() {
    //activeElement.value || activeElement.textContent
    const activeElement = mindful.getActiveElement()
    // rework this
    // text = activeElement.value || activeElement.textContent
    //mindful.setText(text.trim())
    let text = activeElement.tagName === "TEXTAREA" ? (activeElement as HTMLTextAreaElement).value.trim() : activeElement.textContent.trim();
    mindful.setText(text)
    // if there is no text, there should technically be no toxicElements
    // should be here if all text is deleted
    if (mindful.tocicityElements.length > 0) {
      // if there is no text and there are
      mindful.removeToxicityElements();
    }

    if (!text) {
      // just set defult emoji
      // mindful.setEmojiElementContent("128528");
      mindful.setEmojiAsDefault();

      return;
    }

    let analysis: SentimentAnalysisResult = SentimentIntensityAnalyzer.polarity_scores(text);

    console.log(analysis);
    let score = analysis.compound;

    mindful.setEmoji(getEmojiCode(score));
    mindful.setScore(score);
    // when would be the best time to call this method


  }


  async function doneTyping() {

     // Look for bugs

    if (!mindful.getText()) return;


    // if (mindful.tocicityElements.length > 0) {
    //   // remove toxicity elemnts if any
    //   mindful.removeToxicityElements();
    // }
    if (mindful.errorElement) {
      mindful.removeErrorElement();

    }


    //Adds loading spinner
    
    
    if (mindful.getScore() <= mindful.SCORE_THRESHOLD) {
      
      mindful.addLoaderSpinner();
      chrome.runtime.sendMessage({ text: [mindful.getText()] }, (response) => {
        
        console.log(response); // remove spinner and 
        // work on this
        if (response.error) {
          mindful.createErrorElement();
        }  else {
          mindful.removeLoadingSpinner(); // should it be in setToxicityEments method
          // should remove previos toxic elemnts
          mindful.setToxicityElements(response.prediction)
        }
      })
      // try {
      //   // const response = await axios.post(mindful.API_URL, { text: [mindful.getText()] }, { timeout: 17 * 1000 });
      //   // const data: ToxicAPIResponse = response.data
      //   // if (data) {
      //   //   mindful.removeLoadingSpinner(); // should it be in setToxicityEments method
      //   //   mindful.setToxicityElements(data.prediction)
      //   // }
      //   // is this needed
      // } catch (e) {
      //   mindful.createErrorElement();
      //   console.log(e)
      // }


    }
    // mindful.getLoadingElement().classList.add("la-ball-clip-rotate"); // add animation

    // removes loading spinner after 17 (15 was too short) seconds and add error element if no response is given
    

  }
}