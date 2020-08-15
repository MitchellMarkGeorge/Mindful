import { CurrentStatus } from "./../types";
// CurrentStatus

// class Common {
//     // WORK ON THIS

//     private blacklist: string[] = [];

//     // API_URL = 'http://localhost:5000/advanced_analysis';
//     API_URL = 'https://us-central1-mindfulmodel.cloudfunctions.net/advanced_analysis';
//     constructor() {

//         // chrome.storage.sync.get(['blacklist'], (result) => {
//         //     this.blacklist = result.blacklist;
//         //     console.log(this.blacklist);
//         // })

//     }

// export function addUpdateListener(): void {
//     chrome.storage.onChanged.addListener((changes) => {
//         console.log(changes.blacklist.newValue);
//         this.blacklist = changes.blacklist.newValue;
//         // console.log(blacklist);
//     }); //
// }

export async function getStatus(url?: string): Promise<CurrentStatus> {
  try {
    let domain: string;
    if (url) {
      domain = getHostDomain(url);
    } else {
      const [first] = await getTabFromQuery();
      domain = getHostDomain(first?.url);
    }

    const blacklist = await getBlacklist();
    console.log(blacklist);
    const isEnabled = !blacklist.includes(domain);
    const result: CurrentStatus = { domain, isEnabled, blacklist };
    return result;
  } catch (e) {
    console.log(e);
    return { domain: "", isEnabled: true, blacklist: [] };
  }
}

export function setInitalBlacklist(): void { // try chrome.storage.local
  chrome.storage.sync.set({ blacklist: [] });
}

// getBlacklistFromStorage(): Promise<string[]> {
//     return new Promise((resolve, reject) => {
//         chrome.storage.sync.get(['blacklist'], (result) => {
//             // this.blacklist = result.blacklist;
//             if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
//             return resolve(<string[]>result.blacklist);
//         })
//     })
// }

export function getTabFromQuery(
  config: chrome.tabs.QueryInfo = { active: true, currentWindow: true }
): Promise<chrome.tabs.Tab[]> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(config, (result) => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      return resolve(result);
    });
  });
}

export function getBlacklist(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["blacklist"], (result) => {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
        return reject(chrome.runtime.lastError);
      }
      const blacklist = result.blacklist || []; 
    //   console.log(blacklist);
      return resolve(blacklist);
      // console.log(this.blacklist);
    });
  });

  // return this.blacklist;
  // return [''];
}

// function addToBlacklist(domain: string) {
//     this.blacklist.push(domain);
//     chrome.storage.sync.set({ blacklist: this.blacklist })
// }

// function removeFromBlacklist(domain: string) {
//     let index = this.blacklist.indexOf(domain);
//     // if the item is in the array
//     if (index !== -1) {
//         this.blacklist.splice(index, 1);
//     }

//     chrome.storage.sync.set({ blacklist: this.blacklist })

// }

export function getHostDomain(url: string): string {
  let domain: string;
  //find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf("://") > -1) {
    domain = url.split("/")[2];
  } else {
    domain = url.split("/")[0];
  }
  //find & remove www
  if (domain.indexOf("www.") > -1) {
    domain = domain.split("www.")[1];
  }
  domain = domain.split(":")[0]; //find & remove port number
  domain = domain.split("?")[0]; //find & remove url params

  return domain;
}

// (async function() {
//     common = new Common();
//     try {

//     } catch (e) {
//         console.log(e)
//     }
//     await common.init();
// })()

// common = new Common();
//  common.init().then(() => {
//     module.exports.common = common
//
//  });
