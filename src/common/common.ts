import { CurrentStatus } from "./../types";

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
    if (url) { // meaning it came from a content script
      return { isEnabled }
    } else {
    const result: CurrentStatus = { domain, isEnabled, blacklist };
    return result;
    }
  } catch (e) {
    console.log(e);
    return { domain: "", isEnabled: true, blacklist: [] };
  }
}

export function setInitalBlacklist(): void { // try chrome.storage.local
  chrome.storage.local.set({ blacklist: [] });
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
    chrome.storage.local.get(["blacklist"], (result) => {
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

 
}


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
