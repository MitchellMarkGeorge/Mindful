import * as toxicity from '@tensorflow-models/toxicity';

let model;

chrome.runtime.onInstalled.addListener(function () {
    // run it when extension is installed????
       
})

chrome.tabs.onActivated.addListener((tabs) => {

    console.log('changed')
    chrome.tabs.get(tabs.tabId, (object) => {
        console.log(object.url);
    })

})

let blacklist = [];
let hostname;

chrome.tabs.onUpdated.addListener((id, obj, tab) => {

    console.log('UPDATED');
    console.log(tab.url);
    hostname = tab.url.split("/")[2];
    chrome.storage.sync.get(['blacklist'], function (result) {
        // if it is undefied or the lenght is 0
        if (result.blacklist === undefined || result.blacklist.length == 0) { // if 
            
            return; // or should it be cheked by defult and then the script runs and confirms?
        };
        blacklist = result.blacklist;
        // if the current website is blacklisted
        if (contains(blacklist, hostname)) {
            
            chrome.browserAction.setBadgeText({text: "OFF", tabId: tab.id});
        } else {
            chrome.browserAction.setBadgeText({text: "", tabId: tab.id});
        }
    })

})

function contains(array, element) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === element) {
            return true;
        }
    }
    return false;
}

// The minimum prediction confidence. https://github.com/tensorflow/tfjs-models/tree/master/toxicity
const threshold = 0.7// 0.9;
// rethink threshold 

toxicity.load(threshold) 
    .then(modelObject => { 
        model = modelObject;
        console.log(model);
        // listen for event
        chrome.runtime.onConnect.addListener(
            function(port) {
                if (port.name !== "ToxicML") return;
                port.onMessage.addListener(function(msg) {
                    console.log(msg.text);
                    if (msg.text === '') return
                    modelObject.classify(msg.text).then(predict => {
                        console.log(predict);
                        port.postMessage({prediction: predict});
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
        console.log(err)
    })

    

