// document.addEventListener('DOMContentLoaded', function(event) {
    // console.log(location.hostname);
//   })

// chrome.tabs.onActivated.addListener((tabs) => {

    // console.log('changed')
//     chrome.tabs.get(tabs.tabId, (object) => {
        // console.log(object.url);
//     })

// })



// chrome.tabs.onUpdated.addListener((id, obj, tab) => {

    // console.log('UPDATED');
    // console.log(tab.url);

// })
// get 
const manifest = chrome.runtime.getManifest();

document.getElementById('version').textContent = 'VERSION ' + manifest.version;
// gets current tab's url and sets appropriate values
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //console.log(tabs[0].url.split("/")[2]); // hostname - third part of split array

    let hostname = tabs[0].url.split("/")[2];
    let blacklist = [];

    let checkBoxText = document.getElementById('checkbox-text');
    let checkbox = document.getElementById('checkbox');
    checkBoxText.textContent = 'Perform analysis on ' + hostname + '?';
    chrome.storage.sync.get(['blacklist'], function (result) {
        // if it is undefied or there are no black listed items
        if (result.blacklist === undefined || result.blacklist.length == 0) { // if 
            checkbox.checked = true;
            return; // is this still needed if set bellow?
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
        //console.log(checkbox.checked);
        // if the user clicks on the check box for analysis on this site (and it was off befre), remove from blacklist
        // if the checkbox is now clicked (meaning anlysis should be done on the page), remove the item (if it is there) 
        // and updates blacklist (setting the badge)
        if (checkbox.checked) {
            
            // removes the item blacklis
            blacklist = removeItem(blacklist, hostname);
            chrome.storage.sync.set({ blacklist: blacklist }, function () {
                // console.log('Blacklist is set to ' + blacklist);
                //PORT CONNECTION SO ALL BADGE CODE IS HANLED BY BACKGROUND SCRIPT
                chrome.browserAction.setBadgeText({text: "", tabId: tabs[0].id});
            });
        } else { 
            // if user click on the checkbox for analysis on this site (and it was on before), add to blacklist 
            // if the check box is now false, add the item to the blacklist and set badge
            blacklist.push(hostname);
            // console.log(blacklist)
            chrome.storage.sync.set({ blacklist: blacklist }, function () {
                // console.log('Blacklist is set to ' + blacklist);
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
    // if the item is in the array
    if (index !== -1) {
        arr.splice(index, 1);
    }

    return arr;

}