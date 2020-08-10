import { SentimentAnalysisResult, ActiveElementType } from '../types';
import { SentimentIntensityAnalyzer } from "vader-sentiment";
import { MidfulExtensionClass } from "./mindful-class";
// import axios from 'axios';
// import common from '../common/common';
import { shouldInsertExtension, isAlreadyInserted } from "./functions";

// console.log(chrome.extension)

// SentimentAnalysisResult
//ALL CONSOLE.LOGS ARE REMOVED IN PRODUCTION
// let hostname = location.hostname;
// let blacklist: string[] = [];
// console.log(hostname);
// EMOJI SENTIMENT

// ;(async function main () {// just use then() and catch??
//   let blacklist = await common.getBlacklist(); // this is being called before it if finished readinf
//   console.log(blacklist)
//   let domain = common.getHostDomain(location.href);
//   if (!blacklist.includes(domain)) {
//     runExtension();
//   }
// })()
// runExtension()

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

//function runExtension() { // remove from fuction
// let activeElement: Element | HTMLElement | HTMLTextAreaElement; // figure out type
// let score: number = 0; // dosent need to be 
// // let port: chrome.runtime.Port;
// let text: string = "";
// let id: number = 0;
// let currentElementIndex: number = 0;
// // would have used keyCode but is deprecated
// //keys that should not trigger advance text analysis
// // const badKeys: string[] = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12', 'audiovolumemute', 'audiovolumedown', 'arrowright', 'arrowleft', 'arrowdown', 'arrowup', 'audiovolumeup', 'mediaplaypause', 'mediatracknext', 'mediatrackprevious', 'capslock', 'printscreen', 'home', 'end', 'pageup', 'pagedown', 'numlock', 'clear', 'escape']// 'alt', 'shift', 'control', 'meta', 'scrolllock', 'symbol', 'symbollock'
// // previousInstance 
// let noResultTimeOut: number; // TIMEOUT INCASE NO RESULS COME IN ABOUT 15 SECONDS
let typingTimer: number;
// console.log() 
let mindful = new MidfulExtensionClass();

// if (mindful.isEnabled) {
// think about thus

// console.log('here') //
document.addEventListener("focusin", documentListener);
// }



function documentListener() {
  console.log('focus')
  //LOOK INTO THIS
  let activeElement: ActiveElementType = document.activeElement;
  mindful.setActiveElement(activeElement);
  // let activeElement = mindful.getActiveElement();


  // SET EMOJI SIZE!!!
  //STILL SOMETIMES COMES AS UNAVILIBLE
  //EXTENSION REFRESH
  console.log(activeElement.tagName);
  // console.log(activeElement.clientHeight);
  // console.log(!mindful.isMounted);

  console.log(getComputedStyle(activeElement));
  if (shouldInsertExtension(activeElement) && !isAlreadyInserted(activeElement)) {


    // if (isAlreadyInserted(activeElement)) {
    //   // need to check if there is a nextSibling because of content editable
    //   // if extension has already been added to text fiield
    //   // must have a sibling

    //   mindful.setValues(activeElement.nextElementSibling, activeElement);// might just pass activeElement
    //   return;


    // }


    if (mindful.isMounted) { // just us isMounted
      // ALWAYS PUT THE VIEW FIRST!!!
      //mindfulWrapper

      // mindful.removePreviousMindfulWraper();

      mindful.unmountComponent();
      // let previousActiveElement = mindful.previousActiveElement; // WORK ON THIS
      // might not even need to remove listeners due to identical listeners not added
      // previousActiveElement.removeEventListener('input', analyzeInput);
      // previousActiveElement.removeEventListener("keyup", keyUpFunction);

    }

    // insertExtension();

    //     let mindfulWrapper = document.createElement("mindful-extension");
    // // THINK ABOIT THIS
    //     //  mindfulWrapper.style.margin = window.getComputedStyle(activeElement).padding;
    //     // should i append the element before moounting>>


    //     // insertafter - should they be elements
    //     activeElement.parentNode.insertBefore(
    //       mindfulWrapper,
    //       activeElement.nextSibling
    //     );

    // mindful.mountComponent(mindfulWrapper, { margin: window.getComputedStyle(activeElement).padding})

    // mindful.setValues(minfulDOMWrapper, activeElement)




    // NEED TO ADD EVENTLISTENERS

    // will only be called once as internally, duplicate listeners cannot be added

    // if (mindful.isEnabled) {
    // BASED ON ENABLED STATE, 
    // activeElement.addEventListener("input", analyzeInput);

    // activeElement.addEventListener("keyup", keyUpFunction);

    // analyzeInput();
    // doneTyping();

    setUpListeners();
    // should i remove 

    // } else {
    //   const computedStyle = window.getComputedStyle(activeElement)
    //   mindful.mountComponent({ emoji: mindful.getDisabledEmoji(), computedStyle, enableFunc: setUpListeners, isEnabled: mindful.isEnabled })
    // }


    // mindful.setActiveElement(document.activeElement)
    // when would be the best time to call this function?????


  }

}

// function disableExtension() {
//   const activeElement = mindful.getActiveElement();
//   //see if tjis is slow
//   activeElement.removeEventListener('input', analyzeInput);
//   activeElement.removeEventListener("keyup", keyUpFunction);

//   mindful.updateProps({ emoji: mindful.getDisabledEmoji(), enableFunc: setUpListeners }) // pass isEnabled???


// }




// better to attach to document due to server side rendering changing the body and head



function keyUpFunction(event) {
  const key = event.key.toLowerCase();
  // does not call advanced analysis if "bad" key is pressed 
  if (mindful.getBadKeys().includes(key)) return;

  window.clearTimeout(typingTimer);
  // window.clearTimeout(noResultTimeOut); // clears timeout for no response
  // noResultTimeOut = null; //?????

  typingTimer = window.setTimeout(

    doneTyping, 2000) // could even reduce the timing 

  // might not even need 
}


function analyzeInput() {
  //activeElement.value || activeElement.textContent
  const activeElement = mindful.getActiveElement();
  // rework this
  // text = activeElement.value || activeElement.textContent
  //mindful.setText(text.trim())
  let text = activeElement.tagName === "TEXTAREA" ? (activeElement as HTMLTextAreaElement).value.trim() : activeElement.textContent.trim();
  mindful.setText(text);

  console.log('here 1');
  // if there is no text, there should technically be no toxicElements
  // should be here if all text is deleted

  
    // if (mindful?.props?.toxicityList?.length > 0) {
    //   mindful.updateProps({ toxicityList: [] });
    // }

    // DOES NOT WORK IF THERE IS TXICITY RESULT WHEN SWITCHING
  

  // if (mindful.tocicityElements.length > 0) {
  //   // if there is no text and there are
  //   mindful.removeToxicityElements();
  // }

  // if (!text) {
  //   // just set defult emoji
  //   // mindful.setEmojiElementContent("128528");
  //   mindful.setEmojiAsDefault();

  //   mindful.updateProps({})

  //   return;
  // }
  let emoji: string;

  // if (mindful.isEnabled)
  if (text) {
    let analysis: SentimentAnalysisResult = SentimentIntensityAnalyzer.polarity_scores(text);
    console.log(analysis);
    let score = analysis.compound;
    mindful.setScore(score);

    emoji = mindful.getEmojiFromScore(score)
    // update props in indide method
  } else {
    emoji = mindful.getDefaultEmoji()
    // mindful.updateProps({ emoji: mindful.getDefaultEmoji() })
  }

  if (mindful.isMounted) {
    mindful.updateProps({ emoji, toxicityList: [] });
  } else {
    // let margin = window.getComputedStyle(activeElement).padding
    // SHOULD PROBABLY USE A SEPERATE PARAMETER FOR STYLE
    // const computedStyle = window.getComputedStyle(activeElement)
    mindful.mountComponent( emoji ) //or use stright boolean values
  }





  // mindful.setEmoji(getEmojiCode(score));

  // when would be the best time to call this method


}

function setUpListeners() {

  let activeElement = mindful.getActiveElement();

  activeElement.addEventListener("input", analyzeInput);

  activeElement.addEventListener("keyup", keyUpFunction);

  analyzeInput();
  doneTyping();

}




function doneTyping() {

  // Look for bugs
  // global text variable
  if (!mindful.getText()) return;


  // if (mindful.tocicityElements.length > 0) {
  //   // remove toxicity elemnts if any
  //   mindful.removeToxicityElements();
  // }
  if (mindful.props.hasError) {
    // mindful.removeErrorElement();
    mindful.updateProps({ hasError: true })

  }


  //Adds loading spinner


  if (mindful.getScore() <= mindful.SCORE_THRESHOLD) {

    // mindful.addLoaderSpinner();
    mindful.updateProps({ isLoading: true })

    // no longer needs to be an array
    chrome.runtime.sendMessage({ text: mindful.getText() }, (response) => {
      console.log('request sent')
      // console.log(response); // remove spinner and 
      // work on this
      if (response.error) {
        // mindful.createErrorElement();
        console.log(response.body)
        // might not need to set toxicityList
        mindful.updateProps({ hasError: true, toxicityList: [] })
      } else {
        // mindful.removeLoadingSpinner(); // should it be in setToxicityEments method
        // should remove previos toxic elemnts
        // mindful.setToxicityElements(response.prediction)
        // console.log(response.predictions);
        const toxicityList = mindful.getToxicityList(response.predictions)


        // if there is no error an there is the toxicityList => display elements
        // might not need to update hasError 
        mindful.updateProps({ isLoading: false, hasError: false, toxicityList }) // add toxicity array
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
// }