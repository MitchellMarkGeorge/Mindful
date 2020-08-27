import { ToxicAPIResponse } from "./../types";

import axios from "axios";

import * as common from "../common/common";

const API_URL =
  "https://us-central1-mindfulmodel.cloudfunctions.net/advanced_analysis";

/* 

SENTRY ERROR REPORTING

*/



chrome.runtime.onInstalled.addListener((data) => {
  console.log(data);

  if (data.reason === "install") {
    chrome.runtime.setUninstallURL(
      "http://mindful-extension-feedback.herokuapp.com"
    );

    common.setInitalBlacklist();
  }
});

// look at documentation for async
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  axios
    .post(API_URL, message)
    .then((response) => {
      const data: ToxicAPIResponse = response.data;
      console.log(response.data);
      sendResponse(data);
    })
    .catch((err) => {
      console.log(err);
      sendResponse({ error: true });
    });

  return true;
});
