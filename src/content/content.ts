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
  isTextArea,
} from "./functions";
import getCaretCoordinates from "textarea-caret";

let typingTimer: number;
const mindful = new MidfulExtensionClass();

// console.log()

// for debug in realtime???

// (window as any).mindful = mindful;



/* DOCUMENTATION */



// console.log(document.activeElement); // does not work onn
// better to atach to document due to serverside rendering
(async function main() {
  const status = await mindful.currentStatus;
  console.log(status);
  if (status.isEnabled) {
    document.addEventListener("focusin", documentListener);
    //handles elements with autoautofocus

    checkInitalFocusedElement();
  }
})();

// should this be in async IIFE

chrome.storage.onChanged.addListener((changes) => {
  const blacklist: string[] = changes.blacklist.newValue;
  console.log(blacklist);
  if (
    blacklist.length > 0 &&
    mindful.isMounted &&
    mindful.isDomainInBlacklist(blacklist)
  ) {
    mindful.unmountComponent();
    disableExtension();
  } else if (!mindful.isMounted && !mindful.isDomainInBlacklist(blacklist)) {
    document.addEventListener("focusin", documentListener);
    checkInitalFocusedElement();
  }
});

function checkInitalFocusedElement() {
  // autofocus element
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
  //
  console.log(activeElement.tagName);

  if (
    shouldInsertExtension(activeElement) &&
    !isAlreadyInserted(activeElement)
  ) {
    mindful.setActiveElement(activeElement);

    if (mindful.isMounted) {
      // ALWAYS PUT THE VIEW FIRST!!!

      mindful.unmountComponent();
    }

    setUpListeners();
  }
}

function disableExtension() {
  const activeElement = mindful.getActiveElement();
  //see if tjis is slow

  activeElement.removeEventListener("input", analyzeInput);
  activeElement.removeEventListener("keyup", keyUpFunction);
  document.removeEventListener("focusin", documentListener);
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

  isTextArea(activeElement)
      ? (activeElement as HTMLTextAreaElement).value.trim()
      : activeElement.textContent.trim();
  mindful.setText(text);

  console.log("here 1");

  let emoji: string;

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

  // works for both content editable and text area

  if (mindful.isMounted) {
    let isTrancelucent = false;
    if (
      mindful.ATTACHEMENT_STRATEGY === AttachmentStrategy.COMPLEX &&
      isTextArea(activeElement)
    ) {
      const caretPosition = getCaretCoordinates(
        activeElement as HTMLElement,
        (activeElement as HTMLTextAreaElement).selectionStart
        // mindful.getActiveElementPos()
      );
      const visibleTypingArea = getVisibleTypingArea(
        activeElement,
        mindful.mindfulWrapper
      );
      // console.log(mindful.getActiveElementPos)
      isTrancelucent = caretPosition.top >= visibleTypingArea - 5; // do i need to do this
    }
    mindful.updateProps({ emoji, toxicityList: [], isTrancelucent });
  } else {
    mindful.mountComponent(emoji);
  }
}

// if element has position absolute or fixed, things dont look great

function setUpListeners(element?: ActiveElementType) {
  const activeElement = element || mindful.getActiveElement();
  // should i do this??
  activeElement.addEventListener("input", analyzeInput);

  activeElement.addEventListener("keyup", keyUpFunction);

  analyzeInput();
  doneTyping();
}

function doneTyping() {
  const text = mindful.getText();
  if (!text) return;

  // if (mindful?.props?.hasError) {

  //   mindful.updateProps({ hasError: true });
  // }

  //Adds loading spinner

  if (mindful.getScore() <= mindful.SCORE_THRESHOLD) {
    // mindful.addLoaderSpinner();
    mindful.updateProps({ isLoading: true, hasError: false });

    // no longer needs to be an array
    chrome.runtime.sendMessage({ text }, (response) => {
      console.log("request sent");

      console.log(response);
      if (mindful.isMounted) {
        console.log(response.error);

        if (response?.predictions) {
          const toxicityList = mindful.getToxicityList(response.predictions);

          mindful.updateProps({
            isLoading: false,
            hasError: false,
            toxicityList,
          });
          
        } else {
          mindful.updateProps({
            hasError: true,
            toxicityList: [],
            isLoading: false,
          });
        }
      }
    });
  }
}
