import common from '../common/common';




// class Popup extends React.Component {

//     state = {

//     }
//     async componentDidMount() {

//     }

//     render() {
//         return (
//             <>
//                 <div className="title">Mindful Extension 🤩</div>

//                 <div className="popup-body">
//                     <span id="checkbox-text"></span> <input id="checkbox" type="checkbox">
//                         <div>For changes to take effect, please reload the web page. 🤗</div>
    
    
//                 </div>
//             </>
//         )
//     }
// }

;(async function main () {
                    // const manifest = chrome.runtime.getManifest();
                    // document.getElementById('version').textContent = 'VERSION ' + manifest.version;
                    let tab: chrome.tabs.Tab; // top-level await
    try {
                    [tab] = await common.getTabFromQuery({ active: true, currentWindow: true })
                } catch (e) {
                    console.log(e);
        return;
    }

    console.log(tab?.url);

    let domain = common.getHostDomain(tab?.url);
    let blacklist = common.getBlacklist();

    let checkBoxText = document.getElementById('checkbox-text');
    let checkbox: HTMLInputElement | HTMLElement = document.getElementById('checkbox');

    checkBoxText.textContent = 'Perform analysis on ' + domain + '?';

    if (blacklist.includes(domain)) {
                    (checkbox as HTMLInputElement).checked = false
                } else {
                    (checkbox as HTMLInputElement).checked = true
                }


    checkbox.addEventListener('click', function (e) {
                    //console.log(checkbox.checked);
                    // if the user clicks on the check box for analysis on this site (and it was off befre), remove from blacklist
                    // if the checkbox is now clicked (meaning anlysis should be done on the page), remove the item (if it is there) 
                    // and updates blacklist (setting the badge)
                    let element = (e.target as HTMLInputElement)
        if (element.checked) {
                    common.removeFromBlacklist(domain)
            chrome.browserAction.setBadgeText({text: "", tabId: tab.id});
        } else {
                    common.addToBlacklist(domain)
            chrome.browserAction.setBadgeText({text: "OFF", tabId: tab.id});
        }
    })



})(); // check if this works

// })()



// gets current tab's url and sets appropriate values


