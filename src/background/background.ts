import { ToxicAPIResponse, RequestError } from "./../types";
// import toxicity from '@tensorflow-models/toxicity';
import axios from "axios";

// import common from '../common/common'

const API_URL =
  "https://us-central1-mindfulmodel.cloudfunctions.net/advanced_analysis";
// remove blacklist

chrome.runtime.onInstalled.addListener((data) => {
  // anytime this event is called, the model should be loaded just in case
  //  loadModel();  // dont think i need this

  console.log(data); // set blacklist as empy array on install
  if (data.reason === "install") {
    chrome.runtime.setUninstallURL(
      "http://mindful-extension-feedback.herokuapp.com"
    );
    // chrome.storage.sync.set({ blacklist: [] });
    // chrome.storage.sync

    // common.setInitalBlacklist();

    //loadModel();
  }
});

// common.addUpdateListener();

// look at documentation for async
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // use async await???

  // sender.
  // try {
  axios
    .post(API_URL, message)
    .then((response) => {
      const data: ToxicAPIResponse = response.data;
      console.log(response.data);
      sendResponse(data);
    })
    .catch((err) => {
      console.log(err);
      let request_error: RequestError = { error: true, body: err };
      sendResponse(request_error);
    });

  return true;

  // return true // should i
  // } catch (error) {
  //     console.log(error)
  //     let request_error: RequestError = {error: true, body: error}
  //     sendResponse(request_error)
  // }

  // const response = await axios.post(common.API_URL, message, { timeout: 25 * 1000 });
  // const data: ToxicAPIResponse = response.data
  // sendResponse(data)
});

// chrome.storage.sync.get(["blacklist"], function (result) {
//     console.log('here', result.blacklist);

//     if (result.blacklist === undefined ) {

//         return;
//     } // do i need this? is should never be undefined
//     blacklist = result.blacklist;
//     console.log(blacklist);
//     // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     //     console.log(tabs[0].url.split("/")[2]); // hostname

//     //     hostname = tabs[0].url.split("/")[2];
//     //     console.log('tab obj' + tabs[0])
//     //     changeBadgeText(hostname, tabs[0].id);
//     // })
// });

//Called when a port connection is made in Content Script
// chrome.runtime.onConnect.addListener(function (port) {
//     if (port.name !== "ToxicML") return;
//     port.onMessage.addListener(async function (msg) {
//         console.log(msg.userText);
//         if (!msg.userText) return;

//         // if (!model) {
//         //     await loadModel();
//         // }
//         // For testing purposes only
//         // sendErrorMessage()
//         //  return;
//         try {
//             if (!model) {
//                 await loadModel();
//             }

//             const predict = await model.classify(msg.userText);
//             port.postMessage({ prediction: predict, id: msg.id });

//         } catch (err) {
//             console.log(err);
//             sendErrorMessage();

//         }
//     })
// })

// chrome.storage.onChanged.addListener(function (changes, namespace) {
//     console.log(changes.blacklist.newValue);
//     blacklist = changes.blacklist.newValue;
//     console.log(blacklist);
// });

// chrome.tabs.onActivated.addListener( async () => {
//     console.log("changed tab");
//     // could just use active tab
//     // occasionally yields errors due to async nature - switch to acync await with browser api
//     // chrome.tabs.get(tabs.tabId, object => {
//     //     console.log(object.url);
//     //     hostname = object.url.split("/")[2]; // pass in directly
//     //     changeBadgeText(hostname, tabs.tabId); // or use object.id??
//     // });
//     // get active tab - this works
// try {
//     let [ tab ] = await common.getTabFromQuery({ active: true, currentWindow: true })
//     if (tab?.url) {
//         const domain = common.getHostDomain(tab?.url);

//         changeBadgeText(domain, tab.id)
//     }
// } catch (error) {
//     console.log(error)
// }

//     // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     //     hostname = tabs[0].url.split("/")[2];
//     //     if (hostname) {
//     //         changeBadgeText(hostname, tabs[0].id)
//     //     }

//     // });
// });

// chrome.tabs.onUpdated.addListener((id, changeInfo, tab) => {
//     // if (obj.url) {
//         // could just use id nd url
//         // look into documentation
//     console.log("UPDATED");
//     // hostname = tab.url.split("/")[2]; // pass in directly?
//     // still need tab??
//     const domain = common.getHostDomain(tab.url);
//     changeBadgeText(domain, id);
//     // } // is only run whn the url chnages

// });

//  function changeBadgeText(domain: string, tabId:number) {
//     // console.log(blacklist)
//     const blacklist = common.getBlacklist();

//     console.log(blacklist)

//    //contains(blacklist, pageHostname)

//     if (blacklist.includes(domain)) {
//         //blacklist.includes(pageHostname);
//         chrome.browserAction.setBadgeText({ text: "OFF", tabId: tabId });
//     } else {
//         chrome.browserAction.setBadgeText({ text: "", tabId: tabId });
//     }
//     //})
// }

// might use this to alert users of update
// chrome.runtime.onUpdateAvailable.addListener(function (version) {
//     let options = {
//         type: "basic",
//         iconUrl: "../public/mindful-logo2.png",
//         title: `Version ${version} of Mindful is avalible!`,
//         message: "Please reload Mindful extension and all webpages with the extension.",
//         buttons: [{ title: "Reload Extension" }]
//     };

//     chrome.notifications.create("", options, (notificationID) => {
//         chrome.notifications.onButtonClicked.addListener(function (id, buttonIndex) {
//             // is checking the id neccessary??
//             if (id === notificationID && buttonIndex === 0) {
//                 chrome.runtime.reload();
//             }
//         });
//     });
// })

// function contains(array, element) {
//     for (let i = 0; i < array.length; i++) {
//         if (array[i] === element) {
//             return true;
//         }
//     }
//     return false;
// }

// function showErrorNotification() {

//     let options = {
//         type: "basic",
//         iconUrl: "../public/mindful-logo2.png",
//         title: "Unable to load advanced toxicity analysis tools.",
//         message: "Please reload Mindful extension and all webpages with the extension.",
//         buttons: [{ title: "Reload Extension" }]
//     };

//     chrome.notifications.create("", options, (notificationID) => {
//         chrome.notifications.onButtonClicked.addListener(function (id, buttonIndex) {
//             // is checking the id neccessary??
//             if (id === notificationID && buttonIndex === 0) {
//                 chrome.runtime.reload();
//             }
//         });
//     });
// }

// function sendErrorMessage() {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, { error: "true" });
//     });
// }

// async function loadModel() {
//     try {
//         // The minimum prediction confidence. https://github.com/tensorflow/tfjs-models/tree/master/toxicity
// // const threshold = 0.7; // 0.9; repo uses 8.5
//         const threshold = 0.7;
//         // const toxicity = await import('@tensorflow-models/toxicity'); // THIS WORKS BUT ADDS NO BUNDLE DIFFERENCES!!!
//         model = await toxicity.load(threshold, [`toxicity`, `severe_toxicity` ,
//          `identity_attack` , `insult` , `threat` , `sexual_explicit` , `obscene`]);
//         // console.log(model);
//         //return model;
//     } catch (err) {
//         console.error(err);
//         showErrorNotification();
//         //return; //?
//     }
// }
