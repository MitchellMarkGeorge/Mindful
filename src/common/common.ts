class Common {
    // WORK ON THIS

    private blacklist: string[] = [];
    API_URL: string = 'https://us-central1-mindful-279120.cloudfunctions.net/advanced-analysis'
    // API_URL: string = 'https://mindful-279120.uc.r.appspot.com/avanced_analysis'
    constructor() {

        // chrome.storage.sync.get(['blacklist'], (result) => {
        //     this.blacklist = result.blacklist;
        //     console.log(this.blacklist);
        // })




    }

    addUpdateListener(): void {
        chrome.storage.onChanged.addListener((changes) => {
            console.log(changes.blacklist.newValue);
            this.blacklist = changes.blacklist.newValue;
            // console.log(blacklist);
        }); //
    }

    setInitalBlacklist(): void {
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

    getTabFromQuery(config: chrome.tabs.QueryInfo = { active: true, currentWindow: true }): Promise<chrome.tabs.Tab[]> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query(config, (result) => {
                if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
                return resolve(result);
            })
        })
    }

    init(): Promise<string[]> {

        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(['blacklist'], (result) => {
                if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
                this.blacklist = result.blacklist;
                return resolve(this.blacklist);
                // console.log(this.blacklist);
            })
        })
        


        // return this.blacklist;
        // return [''];
    }


    

    getBlacklist() {

        // return new Promise((resolve, reject) => {
        //     chrome.storage.sync.get(['blacklist'], (result) => {
        //         if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        //         this.blacklist = result.blacklist;
        //         return resolve(this.blacklist);
        //         // console.log(this.blacklist);
        //     })
        // })
        


        return this.blacklist;
        // return [''];
    }

    addToBlacklist(domain: string) {
        this.blacklist.push(domain);
        chrome.storage.sync.set({ blacklist: this.blacklist })
    }

    removeFromBlacklist(domain: string) {
        let index = this.blacklist.indexOf(domain);
        // if the item is in the array
        if (index !== -1) {
            this.blacklist.splice(index, 1);
        }

        chrome.storage.sync.set({ blacklist: this.blacklist })


    }

    getHostDomain(url: string): string {
        let domain: string;
        //find & remove protocol (http, ftp, etc.) and get domain
        if (url.indexOf("://") > -1) {
            domain = url.split('/')[2];
        } else {
            domain = url.split('/')[0];
        }
        //find & remove www
        if (domain.indexOf("www.") > -1) {
            domain = domain.split('www.')[1];
        }
        domain = domain.split(':')[0]; //find & remove port number
        domain = domain.split('?')[0]; //find & remove url params

        return domain;
    }
}

let common: Common;

(async function() {
    common = new Common();
    try {

    } catch (e) {
        console.log(e)
    }
    await common.init();
})()

export default common;

// common = new Common();
//  common.init().then(() => {
//     module.exports.common = common
//     
//  });

