import * as toxicity from '@tensorflow-models/toxicity';

let model;

chrome.runtime.onInstalled.addListener(function () {
    // run it when extension is installed????
       
})

const threshold = 0.7// 0.9;
// rethink threshold 

toxicity.load(threshold) 
    .then(modelObject => {  
        model = modelObject;
        console.log(model);
        // listen for event
        chrome.runtime.onConnect.addListener(
            function(port) {
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
        model.classify('hello').then(predict => {console.log(predict)});
    })
    .catch(err => {
        console.log(err)
    })

