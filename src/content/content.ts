import {
  SentimentAnalysisResult,
  ActiveElementType,
  AttachmentStrategy,
} from "../types";
import { SentimentIntensityAnalyzer } from "vader-sentiment";
import { MidfulExtensionClass } from "./mindful-class";
import {
  shouldInsertExtension,
  isAlreadyInserted,
  isBody,
  getVisibleTypingArea,
} from "./functions";
import getCaretCoordinates from "textarea-caret";

// BLACKLIST

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
const mindful = new MidfulExtensionClass();

// if (mindful.isEnabled) {
// think about thus

console.log("here"); //
// console.log(document.activeElement); // does not work onn
// better to atach to document due to serverside rendering
(async function main() {
  // just use then() and catch??

  const status = await mindful.currentStatus;
  console.log(status)
  if (status.isEnabled) {
    
    
    document.addEventListener("focusin", documentListener);
    //autofocus
    // incase it is null
    checkInitalFocusedElement()
    // const initalFocusedElement = document.activeElement;
    // if (
    //   initalFocusedElement &&
    //   !isBody(initalFocusedElement) &&
    //   shouldInsertExtension(initalFocusedElement)
    // ) {
    //   mindful.setActiveElement(initalFocusedElement);
    //   setUpListeners();
    // }
  }
})();

chrome.storage.onChanged.addListener(changes => {
  const blacklist: string[] = changes.blacklist.newValue
  if (blacklist.length > 0 && mindful.isMounted && mindful.isDomainInBlacklist(blacklist)) {

    mindful.unmountComponent();
    disableExtension();
    //   const activeElement = mindful.getActiveElement();
//   //see if tjis is slow
//   activeElement.removeEventListener('input', analyzeInput);
//   activeElement.removeEventListener("keyup", keyUpFunction);
    
  } else if (!mindful.isMounted && !mindful.isDomainInBlacklist(blacklist)) {
    document.addEventListener("focusin", documentListener);
    // const initalFocusedElement = document.activeElement;
    // if (
    //   initalFocusedElement &&
    //   !isBody(initalFocusedElement) &&
    //   shouldInsertExtension(initalFocusedElement)
    // ) {
    //   mindful.setActiveElement(initalFocusedElement);
    //   setUpListeners();
    // }

    checkInitalFocusedElement();
  }
})

// document.addEventListener("focusin", documentListener);

// const initalFocusedElement = document.activeElement;
// // incase it is null
// if (
//   initalFocusedElement &&
//   !isBody(initalFocusedElement) &&
//   shouldInsertExtension(initalFocusedElement)
// ) {
//   mindful.setActiveElement(initalFocusedElement);
//   setUpListeners();
// }

function checkInitalFocusedElement() {
  const initalFocusedElement = document.activeElement;
  // incase document.activeElement is null
    if (
      initalFocusedElement &&
      !isBody(initalFocusedElement) &&
      shouldInsertExtension(initalFocusedElement)
    ) {
      mindful.setActiveElement(initalFocusedElement);
      setUpListeners();
    }
}

function documentListener() {
  console.log("focus");
  //LOOK INTO THIS
  const activeElement: ActiveElementType = document.activeElement;
  // mindful.setActiveElement(activeElement);
  // should probably onnly set activeelement is it works
  // let activeElement = mindful.getActiveElement();

  // SET EMOJI SIZE!!!
  //STILL SOMETIMES COMES AS UNAVILIBLE
  //EXTENSION REFRESH
  console.log(activeElement.tagName);
  // console.log(activeElement.clientHeight);
  // console.log(!mindful.isMounted);

  // console.log(shouldInsertExtension(activeElement) && !isAlreadyInserted(activeElement));
  if (
    shouldInsertExtension(activeElement) &&
    !isAlreadyInserted(activeElement)
  ) {
    mindful.setActiveElement(activeElement);
    // if (isAlreadyInserted(activeElement)) {
    //   // need to check if there is a nextSibling because of content editable
    //   // if extension has already been added to text fiield
    //   // must have a sibling

    //   mindful.setValues(activeElement.nextElementSibling, activeElement);// might just pass activeElement
    //   return;

    // }

    if (mindful.isMounted) {
      // just us isMounted
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

function disableExtension() {
  const activeElement = mindful.getActiveElement();
  //see if tjis is slow

  activeElement.removeEventListener('input', analyzeInput);
  activeElement.removeEventListener("keyup", keyUpFunction);
  document.removeEventListener('focusin', documentListener);

  

}

// better to attach to document due to server side rendering changing the body and head

function keyUpFunction(event) {
  const key = event.key.toLowerCase();
  // does not call advanced analysis if "bad" key is pressed
  if (mindful.getBadKeys().includes(key)) return;

  window.clearTimeout(typingTimer);
  // window.clearTimeout(noResultTimeOut); // clears timeout for no response
  // noResultTimeOut = null; //?????

  typingTimer = window.setTimeout(doneTyping, 2000); // could even reduce the timing

  // might not even need
}

function analyzeInput() {
  //activeElement.value || activeElement.textContent
  const activeElement = mindful.getActiveElement();
  // rework this
  // text = activeElement.value || activeElement.textContent
  //mindful.setText(text.trim())
  const text =
    activeElement.tagName === "TEXTAREA"
      ? (activeElement as HTMLTextAreaElement).value.trim()
      : activeElement.textContent.trim();
  mindful.setText(text);

  console.log("here 1");
  // if there is no text, there should technically be no toxicElements
  // should be here if all text is deleted

  // if (mindful?.props?.toxicityList?.length > 0) {
  //   mindful.updateProps({ toxicityList: [] });
  // }

  // DOES NOT WORK IF THERE IS TXICITY RESULT WHEN SWITCHING

  // if (mindful.tocicityElements.length > 0) {
  //   // if there is no text and there are
  //   mindful.removeToxicityElements();
  // if (
  //   mindful.isMounted &&
  //   mindful.ATTACHEMENT_STRATEGY === AttachmentStrategy.COMPLEX
  // ) {
  //   // console.log(getLineNumber(activeElement));
  //   const caretPosition = getCaretCoordinates(
  //     activeElement as HTMLElement,
  //     (activeElement as HTMLTextAreaElement).selectionStart
  //   );
  //   console.log(
  //     getVisibleTypingArea(activeElement, mindful.mindfulWrapper),
  //     caretPosition
  //   );
  //   // console.log(parseFloat(getComputedStyle(mindful.mindfulWrapper).fontSize));
  //   // console.log((activeElement as HTMLTextAreaElement).cols)
  // }
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
    const analysis: SentimentAnalysisResult = SentimentIntensityAnalyzer.polarity_scores(
      text
    );
    console.log(analysis);
    const score = analysis.compound;
    mindful.setScore(score);

    emoji = mindful.getEmojiFromScore(score);
    // update props in indide method
  } else {
    emoji = mindful.getDefaultEmoji();
    // mindful.updateProps({ emoji: mindful.getDefaultEmoji() })
  }

  if (mindful.isMounted) {
    let isTrancelucent = false;
    if (mindful.ATTACHEMENT_STRATEGY === AttachmentStrategy.COMPLEX) {
      const caretPosition = getCaretCoordinates(
        activeElement as HTMLElement,
        (activeElement as HTMLTextAreaElement).selectionStart
      );
      const visibleTypingArea = getVisibleTypingArea(
        activeElement,
        mindful.mindfulWrapper
      );
      isTrancelucent = caretPosition.top >= visibleTypingArea - 5; // do i need to do this
    }
    mindful.updateProps({ emoji, toxicityList: [], isTrancelucent });
  } else {
    mindful.mountComponent(emoji);
  }

  // mindful.setEmoji(getEmojiCode(score));

  // when would be the best time to call this method
}

function setUpListeners() {
  const activeElement = mindful.getActiveElement();

  activeElement.addEventListener("input", analyzeInput);

  activeElement.addEventListener("keyup", keyUpFunction);

  analyzeInput();
  doneTyping();
}

function doneTyping() {
  // Look for bugs
  // global text variable
  const text = mindful.getText();
  if (!mindful.getText()) return;

  // if (mindful.tocicityElements.length > 0) {
  //   // remove toxicity elemnts if any
  //   mindful.removeToxicityElements();
  // }
  if (mindful.props.hasError) {
    // mindful.removeErrorElement();
    mindful.updateProps({ hasError: true });
  }

  //Adds loading spinner

  if (mindful.getScore() <= mindful.SCORE_THRESHOLD) {
    // mindful.addLoaderSpinner();
    mindful.updateProps({ isLoading: true });

    // no longer needs to be an array
    chrome.runtime.sendMessage({ text }, (response) => {
      console.log("request sent");
      // console.log(response); // remove spinner and
      // work on this
      if (response.error) {
        // mindful.createErrorElement();
        console.log(response.body);
        // might not need to set toxicityList
        mindful.updateProps({ hasError: true, toxicityList: [] });
      } else {
        // mindful.removeLoadingSpinner(); // should it be in setToxicityEments method
        // should remove previos toxic elemnts
        // mindful.setToxicityElements(response.prediction)
        // console.log(response.predictions);
        const toxicityList = mindful.getToxicityList(response.predictions);

        // if there is no error an there is the toxicityList => display elements
        // might not need to update hasError
        mindful.updateProps({
          isLoading: false,
          hasError: false,
          toxicityList,
        }); // add toxicity array
      }
    });
  }
}
