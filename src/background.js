import * as toxicity from '@tensorflow-models/toxicity';

let model;

let blacklist = []; // technically dont need to empty array due to 
let hostname;
// unInsatll event

// on load, get blacklist array and update on changed. In changeBadgeText function, just use blacklist
chrome.runtime.onInstalled.addListener(reason => {
    showErrorNotification();
    console.log(reason); // set blacklist as empy array on install
    if (reason.reason === 'update') console.log('update');
    if (reason.reason === "install") {
        chrome.storage.sync.set({ blacklist: [] }, function () {
            console.log('Set inital blacklist');
        });

    }
})

// on delete, warn user that user data (blacklist)

chrome.storage.sync.get(['blacklist'], function (result) {
    if (result.blacklist === undefined) { // if 
        // || result.blacklist.length == 0

        return; // or should it be cheked by defult and then the script runs and confirms?
    };
    blacklist = result.blacklist;

    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //     console.log(tabs[0].url.split("/")[2]); // hostname

    //     hostname = tabs[0].url.split("/")[2];
    //     console.log('tab obj' + tabs[0])
    //     changeBadgeText(hostname, tabs[0].id);
    // })
})

chrome.storage.onChanged.addListener(function (changes, namespace) {

    if (blacklist === changes.blacklist.newValue) return; // do i need this
    console.log(changes);
    blacklist = changes.blacklist.newValue;



});

chrome.tabs.onActivated.addListener((tabs) => {
    console.log(tabs)
    console.log('changed')
    chrome.tabs.get(tabs.tabId, (object) => {
        console.log(object.url);
        hostname = object.url.split("/")[2]; // pass in directly
        changeBadgeText(hostname, tabs.tabId) // or use object.id??

    })

})



chrome.tabs.onUpdated.addListener((id, obj, tab) => {

    console.log('UPDATED');
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

})

function changeBadgeText(pageHostname, id) {
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
const threshold = 0.7// 0.9; repo uses 8.5
// rethink threshold 
// MOVE THIS TO INSTALLED FUNCTION???

toxicity.load(threshold)
    .then(modelObject => { // HANDLE ERROR AND SHOW MESSAGE IN COMPONENT/ OR JUST STOP LOADING
        model = modelObject;

        console.log(model);
        // listen for event
        chrome.runtime.onConnect.addListener(
            function (port) {
                if (port.name !== "ToxicML") return;
                port.onMessage.addListener(function (msg) {
                    console.log(msg.text);
                    if (msg.text === '') return;
                    modelObject.classify(msg.text).then(predict => {
                        console.log(predict);
                        port.postMessage({ prediction: predict });
                    })
                        .catch(err => {
                            console.error(err);
                            //setTimeout(function () { throw err; }); 
                            sendErrorMessage();
                        })
                })
            }
        )
        // chrome.runtime.onMessage.addListener(
        //     function(request, sender, sendResponse) {
        //         if (request.text) {
        //             modelObject.classify(request.text).then(predict => {
        //                 chrome.runtime.sendMessage({prediction: predict}, function(response) {
        //                     console.log('response sent');
        //                   });
        //             })
        //         }
        //     })

        //model.classify('hello').then(predict => {console.log(predict)});
    })
    .catch(err => {
        console.error(err);
        // WILL NOT WORK -- COULD FAIL BEFORE ACTUAL CONTENT SCRIPT IS INJECTED SO CAN CAUSE LOADING INDICATOR TO HANG


        //setTimeout(function () { throw err; }); // to trigger error onerror handeler

        showErrorNotification();
        //sendErrorMessage();
    })
function showErrorNotification() {
    try {
        let options = {
            type: 'basic',
            iconUrl: '../public/mindful-logo2.png',
            title: 'Unable to load advanced toxicity analysis tools.',
            message: 'Please try again.'

        };


        chrome.notifications.create('loadError', options);

    } catch (e) {
        console.error(e);
    }
}

function sendErrorMessage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { error: "true" });
    });
}

window.onerror = (message, source, lineno, colno, error) => {
    // for all other errors
    console.error(error);
    sendErrorMessage();
}



