// document.addEventListener('DOMContentLoaded', function(event) {
//     console.log(location.hostname);
//   })

// chrome.tabs.onActivated.addListener((tabs) => {

//     console.log('changed')
//     chrome.tabs.get(tabs.tabId, (object) => {
//         console.log(object.url);
//     })

// })



// chrome.tabs.onUpdated.addListener((id, obj, tab) => {

//     console.log('UPDATED');
//     console.log(tab.url);

// })

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log(tabs[0].url.split("/")[2]); // hostname

    let hostname = tabs[0].url.split("/")[2];
    let blacklist = [];

    let checkBoxText = document.getElementById('checkbox-text');
    let checkbox = document.getElementById('checkbox');
    checkBoxText.innerHTML = 'Perform analysis on ' + hostname + '?';
    chrome.storage.sync.get(['blacklist'], function (result) {
        // if it is undefied or the lenght is 0
        if (result.blacklist === undefined || result.blacklist.length == 0) { // if 
            checkbox.checked = true;
            return; // or should it be cheked by defult and then the script runs and confirms?
        };
        blacklist = result.blacklist;
        // if the current website is blacklisted
        if (contains(blacklist, hostname)) {
            checkbox.checked = false;
            // chrome.browserAction.setBadgeText({text: "OFF", tabId: tabs[0].id});
        } else {
            checkbox.checked = true;
        }

    });
    
    checkbox.addEventListener('click', function (e) {
        console.log(checkbox.checked);
        // if the user clicks on the check box for analysis on this site (and it was off befre), remove from blacklist
        if (checkbox.checked) {
            // check if it contains?
            // use the same blacklist variable or a tempoary variable?
            blacklist = removeItem(blacklist, hostname);
            chrome.storage.sync.set({ blacklist: blacklist }, function () {
                console.log('Blacklist is set to ' + blacklist);
                //PORT CONNECTION SO ALL BADGE CODE IS HANLED BY BACKGROUND SCRIPT
                chrome.browserAction.setBadgeText({text: "", tabId: tabs[0].id});
            });
        } else {
            // if user click on the checkbox for analysis on this site (and it was on before), add to blacklist 

            blacklist.push(hostname);
            console.log(blacklist)
            chrome.storage.sync.set({ blacklist: blacklist }, function () {
                console.log('Blacklist is set to ' + blacklist);
                chrome.browserAction.setBadgeText({text: "OFF", tabId: tabs[0].id});
            });
        }
    })



});

function contains(array, element) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === element) {
            return true;
        }
    }
    return false;
}

function removeItem(arr, item) {
    let index = arr.indexOf(item);

    if (index !== -1) {
        arr.splice(index, 1);
    }

    return arr;

}