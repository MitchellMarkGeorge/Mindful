import * as toxicity from "@tensorflow-models/toxicity";

let model;

let blacklist = []; // technically dont need to empty array due to
let hostname;

// unInsatll event

// if script is not persitent, discummect current port
// chrome.runtime.onSuspend.addListener(listener)

// on load, get blacklist array and update on changed. In changeBadgeText function, just use blacklist
chrome.runtime.onInstalled.addListener(reason => {
    console.log('here')
    //showErrorNotification()
    loadModel();
    // let test = await toxicity.load(0.7);
    // let predict = await test.classify('bitch');
    // console.log(predict);
    //showErrorNotification();
    console.log(reason); // set blacklist as empy array on install
    if (reason.reason === "update") {
        console.log("update");
    }
    if (reason.reason === "install") {
        chrome.storage.sync.set({ blacklist: [] });


        //loadModel();
    }
});

chrome.runtime.onConnect.addListener(async function (port) {
    if (port.name !== "ToxicML") return;
    port.onMessage.addListener(async function (msg) {
        console.log(msg.text);
        if (!msg.text) return; // dont do this
        //  if (msg.text === '') return;
        if (!model) {
            loadModel(); // await loadModel() - should i do this
        }
        //return;
        try {
            const predict = await model.classify(msg.text);
            port.postMessage({ prediction: predict });
           
        } catch (err) {
            console.log(err);
            sendErrorMessage();

        }
    })
})



// on delete, warn user that user data (blacklist)

chrome.storage.sync.get(["blacklist"], function (result) {
    console.log('here', result.blacklist)
    //console.log(result.model);
    if (result.blacklist === undefined) {
        // if
        // || result.blacklist.length == 0

        return; // or should it be cheked by defult and then the script runs and confirms?
    }
    blacklist = result.blacklist;
    console.log(blacklist);
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //     console.log(tabs[0].url.split("/")[2]); // hostname

    //     hostname = tabs[0].url.split("/")[2];
    //     console.log('tab obj' + tabs[0])
    //     changeBadgeText(hostname, tabs[0].id);
    // })
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log('BLACKLIST UPDATED')
    if (blacklist === changes.blacklist.newValue) return; // do i need this
    console.log(changes);
    blacklist = changes.blacklist.newValue;
    console.log(blacklist);
});

chrome.tabs.onActivated.addListener(tabs => {
    console.log(tabs);
    console.log("changed");
    chrome.tabs.get(tabs.tabId, object => {
        console.log(object.url);
        hostname = object.url.split("/")[2]; // pass in directly
        changeBadgeText(hostname, tabs.tabId); // or use object.id??
    });
});

chrome.tabs.onUpdated.addListener((id, obj, tab) => {
    console.log("UPDATED");
    //console.log(tab.url);
    hostname = tab.url.split("/")[2]; // pass in directly?
    // chrome.storage.sync.get(['blacklist'], function (result) {
    //     // if it is undefied or the lenght is 0
    //     if (result.blacklist === undefined || result.blacklist.length == 0) { // if

    //         return; // or should it be cheked by defult and then the script runs and confirms?
    //     };
    //     blacklist = result.blacklist;
    //     // if the current website is blacklisted
    //     if (contains(blacklist, hostname)) {
    //         //blacklist.incudes(hostname);
    //         chrome.browserAction.setBadgeText({text: "OFF", tabId: tab.id});
    //     } else {
    //         chrome.browserAction.setBadgeText({text: "", tabId: tab.id});
    //     }
    // })

    changeBadgeText(hostname, id);
});

function changeBadgeText(pageHostname, id) {
    console.log(blacklist)
    // chrome.storage.sync.get(['blacklist'], function (result) {
    //     // if it is undefied or the lenght is 0
    //     if (result.blacklist === undefined || result.blacklist.length == 0) { // if

    //         return; // or should it be cheked by defult and then the script runs and confirms?
    //     };
    //     blacklist = result.blacklist;
    // if the current website is blacklisted

    if (blacklist === undefined) return;
    // if (blacklist === undefined || blacklist.length == 0) { // if

    //     return; // or should it be cheked by defult and then the script runs and confirms?
    // };
    if (contains(blacklist, pageHostname)) {
        //blacklist.incudes(hostname);
        chrome.browserAction.setBadgeText({ text: "OFF", tabId: id });
    } else {
        chrome.browserAction.setBadgeText({ text: "", tabId: id });
    }
    //})
}

function contains(array, element) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === element) {
            return true;
        }
    }
    return false;
}

// The minimum prediction confidence. https://github.com/tensorflow/tfjs-models/tree/master/toxicity
// const threshold = 0.7; // 0.9; repo uses 8.5
// rethink threshold
// MOVE THIS TO INSTALLED FUNCTION???

// toxicity
//     .load(threshold)
//     .then(modelObject => {
//         // HANDLE ERROR AND SHOW MESSAGE IN COMPONENT/ OR JUST STOP LOADING
//         model = modelObject;

//         console.log(model);
//         // listen for event
//         chrome.runtime.onConnect.addListener(function (port) {
//             if (port.name !== "ToxicML") return;
//             port.onMessage.addListener(function (msg) {
//                 console.log(msg.text);
//                 if (!msg.text) return; // dont do this
//                 //  if (msg.text === '') return;
//                 modelObject
//                     .classify(msg.text)
//                     .then(predict => {
//                         console.log(predict);
//                         // sendErrorMessage();
//                         //return;
//                         port.postMessage({ prediction: predict });
//                     })
//                     .catch(err => {
//                         console.error(err);
//                         //setTimeout(function () { throw err; });
//                         sendErrorMessage();
//                     });
//             });
//         });

//     })
//     .catch(err => {
//         console.error(err);
//         // WILL NOT WORK -- COULD FAIL BEFORE ACTUAL CONTENT SCRIPT IS INJECTED SO CAN CAUSE LOADING INDICATOR TO HANG

//         //setTimeout(function () { throw err; }); // to trigger error onerror handeler

//         showErrorNotification();
//         // if there is no response there is no contentscript
//         //sendErrorMessage();
//     });
function showErrorNotification() {

    let options = {
        type: "basic",
        iconUrl: "../public/mindful-logo2.png",
        title: "Unable to load advanced toxicity analysis tools.",
        message: "Please reload Mindful extension and all webpages with the extension.",
        buttons: [{ title: "Reload Extension" }]
    };

    chrome.notifications.create("", options, (notificationID) => {
        chrome.notifications.onButtonClicked.addListener(function (id, buttonIndex) {
            // is checking the id neccessary??
            if (id === notificationID && buttonIndex === 0) {
                chrome.runtime.reload();
            }
        });
    });
}

function sendErrorMessage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { error: "true" });
    });
}

async function loadModel() {
    try {
        const threshold = 0.7;
        model = await toxicity.load(threshold);
        console.log(model);
        //const saveResult = await model.model.save('localstorage://my-model-1');
        //console.log(saveResult);

    } catch (err) {
        console.error(err);
        showErrorNotification();
        return;
    }
}

// window.onerror = (message, source, lineno, colno, error) => {
//   // for all other errors
//   console.error(error);
//   sendErrorMessage();
// };
