import common from '../common/common';
// ; (async function main() {
    // try catch
    let blacklist = common.getBlacklist();
    console.log(blacklist)
    if (blacklist.length > 0) {
        let listOfWebsites = document.createElement('ul');

        blacklist.forEach((item) => {
            let listItemElement = document.createElement('li');
            listItemElement.textContent = item;
            listOfWebsites.appendChild(listItemElement);
        })
        // for (var i = 0; i < blacklist.length; i++) {
        //     var listItemElement = document.createElement('li');
        //     listItemElement.textContent = blacklist[i];
        //     listOfWebsites.appendChild(listItemElement);

        // }

        document.body.appendChild(listOfWebsites);
    } else {
        let noListElement = document.createElement('p');
        noListElement.textContent = 'No websites blacklisted. If you have any, they will appear here.';
        document.body.appendChild(noListElement);
    }

// })()

