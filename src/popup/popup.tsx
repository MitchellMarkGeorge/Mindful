// import common from '../common/common';
import { Card, Switch } from "antd";
import "antd/dist/antd.css";
import * as React from "react";
import * as ReactDom from "react-dom";
import { FormOutlined, GlobalOutlined } from "@ant-design/icons";
import * as common from "../common/common";
import { CurrentStatus } from "../types";

class Popup extends React.Component {
  state: { status?: CurrentStatus };

  componentDidMount() {
    this.getStatus();
  }
 
  onChange = (checked: boolean) => {
    console.log("here");
    // eslint-disable-next-line prefer-const
    let { isEnabled, blacklist, domain } = this.state.status;
    if (isEnabled) { // use isEnabled or checked???
      blacklist = [...blacklist, domain];
      chrome.storage.local.set({ blacklist }, () => {
        console.log(blacklist);
        this.setState({ status: { isEnabled: false, blacklist, domain } });
      });
    } else {
      console.log("here 2");
      const index = blacklist.indexOf(domain);

      // if the item is in the array
      if (index !== -1) {
        blacklist.splice(index, 1);
        chrome.storage.local.set({ blacklist }, () => {
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
