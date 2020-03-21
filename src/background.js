import * as toxicity from '@tensorflow-models/toxicity';

// lazy load instead

let model;
let blacklist = []; 
let hostname;

// might wrap in if (!model) conditional
//loadModel();

chrome.runtime.setUninstallURL('http://mindful-extension-feedback.herokuapp.com');

// when the backgroung script starts
chrome.runtime.onStartup.addListener(async function () {
    console.log('starting...');
     loadModel(); // might not even need await here
     // removed await
    

})


chrome.runtime.onInstalled.addListener(data => {
   

    // anytime this event is called, the model should be loaded just in case
     loadModel();  // dont think i need this
    
    console.log(data); // set blacklist as empy array on install
    if (data.reason === "install") {
        chrome.storage.sync.set({ blacklist: [] });


        //loadModel();
    }
});

chrome.storage.sync.get(["blacklist"], function (result) {
    console.log('here', result.blacklist);

    if (result.blacklist === undefined ) {
     

        return; 
    } // do i need this? is should never be undefined
    blacklist = result.blacklist;
    console.log(blacklist);
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //     console.log(tabs[0].url.split("/")[2]); // hostname

    //     hostname = tabs[0].url.split("/")[2];
    //     console.log('tab obj' + tabs[0])
    //     changeBadgeText(hostname, tabs[0].id);
    // })
});

//Called when a port connection is made in Content Script
chrome.runtime.onConnect.addListener(function (port) {
    if (port.name !== "ToxicML") return;
    port.onMessage.addListener(async function (msg) {
        console.log(msg.userText);
        if (!msg.userText) return;
        
        // if (!model) {
        //     await loadModel(); 
        // }
        // For testing purposes only
        // sendErrorMessage()
        //  return;
        try {
            if (!model) {
                await loadModel(); 
            }
             
            const predict = await model.classify(msg.userText);
            port.postMessage({ prediction: predict, id: msg.id });
           
        } catch (err) {
            console.log(err);
            sendErrorMessage();

        }
    })
})







chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log(changes.blacklist.newValue);
    blacklist = changes.blacklist.newValue;
    console.log(blacklist);
});

chrome.tabs.onActivated.addListener( () => {
    console.log("changed tab");
    // could just use active tab
    // occasionally yields errors due to async nature - switch to acync await with browser api
    // chrome.tabs.get(tabs.tabId, object => {
    //     console.log(object.url);
    //     hostname = object.url.split("/")[2]; // pass in directly
    //     changeBadgeText(hostname, tabs.tabId); // or use object.id??
    // });
    // get active tab - this works
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        hostname = tabs[0].url.split("/")[2];
        changeBadgeText(hostname, tabs[0].id)
    });
});

chrome.tabs.onUpdated.addListener((id, obj, tab) => {
    console.log("UPDATED");
    hostname = tab.url.split("/")[2]; // pass in directly?
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

   //contains(blacklist, pageHostname)
    
    if (blacklist.includes(pageHostname)) {
        //blacklist.includes(pageHostname);
        chrome.browserAction.setBadgeText({ text: "OFF", tabId: id });
    } else {
        chrome.browserAction.setBadgeText({ text: "", tabId: id });
    }
    //})
}


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
        // The minimum prediction confidence. https://github.com/tensorflow/tfjs-models/tree/master/toxicity
// const threshold = 0.7; // 0.9; repo uses 8.5
        const threshold = 0.7;
        // const toxicity = await import('@tensorflow-models/toxicity'); // THIS WORKS BUT ADDS NO BUNDLE DIFFERENCES!!!
        model = await toxicity.load(threshold);
        // console.log(model);
        //return model;
    } catch (err) {
        console.error(err);
        showErrorNotification();
        //return; //?
    }
}

