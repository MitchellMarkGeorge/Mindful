import * as toxicity from '@tensorflow-models/toxicity';

let model;

chrome.runtime.onInstalled.addListener(function () {
    // run it when extension is installed????
    
})

const threshold = 0.9;

toxicity.load(threshold)
    .then(modelObject => {
        model = modelObject;
        console.log(model);
        // listen for event
        model.classify('hello').then(predict => {console.log(predict)});
    })
    .catch(err => {
        console.log(err)
    })

