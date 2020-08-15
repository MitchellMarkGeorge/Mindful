// import common from '../common/common';
import { Card, Switch } from "antd";
import "antd/dist/antd.css";
import * as React from "react";
import * as ReactDom from "react-dom";
import { FormOutlined, GlobalOutlined } from "@ant-design/icons";
import * as common from "../common/common";
import { CurrentStatus } from "../types";

// const Popup: React.FC = () => {
//   return (
//     <Card
//       title={<div className="title">Mindful Extension 🤩</div>}
//       actions={[
//         <FormOutlined
//           className="icons"
//           onClick={() =>
//             window.open(
//               "http://mindful-extension-feedback.herokuapp.com",
//               "_blank"
//             )
//           }
//           key="Feedback"
//         />,

//         <GlobalOutlined
//           className="icons"
//           onClick={() =>
//             window.open("https://mindful-extension.netlify.com", "_blank")
//           }
//           key="Website"
//         />,
//       ]}
//     >
//       <div>
//         <p>Thank you for using this extension!</p>
//         <p>{"Let's make the Internet a safer place! 🤗"}</p>
//         {/* had to use string because of apt */}
//       </div>
//     </Card>
//   );
// };

class Popup extends React.Component {
  state: { status?: CurrentStatus };
  // componentWillMount() {

  // }
  componentDidMount() {
    this.getStatus();
  }
  // common.getBlacklist().then((blacklist) => )

  onChange = (checked: boolean) => {
    console.log("here");
    // eslint-disable-next-line prefer-const
    let { isEnabled, blacklist, domain } = this.state.status;
    if (isEnabled) { // use isEnabled or checked???
      blacklist = [...blacklist, domain];
      chrome.storage.sync.set({ blacklist }, () => {
        console.log(blacklist);
        this.setState({ status: { isEnabled: false, blacklist, domain } });
      });
    } else {
      console.log("here 2");
      const index = blacklist.indexOf(domain);

      // if the item is in the array
      if (index !== -1) {
        blacklist.splice(index, 1);
        chrome.storage.sync.set({ blacklist }, () => {
          console.log(blacklist)
          this.setState({ status: { isEnabled: true, blacklist, domain } });
        });
      }
    }
  };

  getStatus = () => {
    common
      .getStatus()
      .then((status) => {
        console.log(status);
        this.setState({ status });
      })
      .catch((err) => console.log(err));
  };

  render() {
    // const { status } = this?.state;
    console.log(this.state);
    return (
      <>
        <Card
          title={<div className="title">Mindful Extension 🤩</div>}
          actions={[
            <FormOutlined
              className="icons"
              onClick={() =>
                window.open(
                  "http://mindful-extension-feedback.herokuapp.com",
                  "_blank"
                )
              }
              key="Feedback"
            />,

            <GlobalOutlined
              className="icons"
              onClick={() =>
                window.open("https://mindful-extension.netlify.com", "_blank")
              }
              key="Website"
            />,
          ]}
        >
          <div>
            <p>Thank you for using this extension!</p>
            <p>{"Let's make the Internet a safer place! 🤗"}</p>
            {this?.state?.status && (
              <p>Perform analysis on {this.state.status.domain}?</p>
            )}
            {this?.state?.status && (
              <Switch
              className="switch"
              checkedChildren="ON" unCheckedChildren="OFF"
                checked={this.state.status.isEnabled}
                size="small"
                onClick={this.onChange}
              />
            )}
          </div>
        </Card>
      </>
    );
  }
}

ReactDom.render(<Popup />, document.getElementById("app"));

// ; (async function main() {
//     // const manifest = chrome.runtime.getManifest();
//     // document.getElementById('version').textContent = 'VERSION ' + manifest.version;
//     let tab: chrome.tabs.Tab; // top-level await
//     try {
//         [tab] = await common.getTabFromQuery({ active: true, currentWindow: true })
//     } catch (e) {
//         console.log(e);
//         return;
//     }

//     console.log(tab?.url);

//     let domain = common.getHostDomain(tab?.url);
//     let blacklist = common.getBlacklist();

//     let checkBoxText = document.getElementById('checkbox-text');
//     let checkbox: HTMLInputElement | HTMLElement = document.getElementById('checkbox');

//     checkBoxText.textContent = 'Perform analysis on ' + domain + '?';

//     if (blacklist.includes(domain)) {
//         (checkbox as HTMLInputElement).checked = false
//     } else {
//         (checkbox as HTMLInputElement).checked = true
//     }

//     checkbox.addEventListener('click', function (e) {
//         //console.log(checkbox.checked);
//         // if the user clicks on the check box for analysis on this site (and it was off befre), remove from blacklist
//         // if the checkbox is now clicked (meaning anlysis should be done on the page), remove the item (if it is there)
//         // and updates blacklist (setting the badge)
//         let element = (e.target as HTMLInputElement)
//         if (element.checked) {
//             common.removeFromBlacklist(domain)
//             chrome.browserAction.setBadgeText({ text: "", tabId: tab.id });
//         } else {
//             common.addToBlacklist(domain)
//             chrome.browserAction.setBadgeText({ text: "OFF", tabId: tab.id });
//         }
//     })

// })(); // check if this works

// })()

// gets current tab's url and sets appropriate values
