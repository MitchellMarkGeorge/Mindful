let blacklist = [];
chrome.storage.sync.get(['blacklist'], function (result) {

    blacklist = result.blacklist;

    if (Array.isArray(blacklist) && blacklist.length) {
        let listOfWebsites = document.createElement('ul');
        for (var i = 0; i < blacklist.length; i ++) {
            var listItemElement = document.createElement('li');
            listItemElement.innerHTML = blacklist[i];
            listOfWebsites.appendChild(listItemElement);

        }

        document.body.appendChild(listOfWebsites);
    } else {
        let noListElement = document.createElement('p');
        noListElement.innerHTML = 'No websites blacklisted'
    }

})