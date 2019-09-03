// ==UserScript==
// @name         Sanitize Jira ticket number on clipboard copy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copying a ticket number Jira sometimes includes extra data. This script will sanitize your clipboard copy!
// @author       Trent Rand <contact@trentrand.com>
// @match        https://jira.squarespace.net/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function isIssueLink(event) {
    return event.target.parentNode.id === 'issuekey-val';
  }

  function addLink(event) {
    event.preventDefault();

    var copytext = window.getSelection().toString();

    if (event.clipboardData && isIssueLink(event)) {
      event.clipboardData.setData('Text', event.target.innerText);
    }
  }

  document.addEventListener('copy', addLink);
})();