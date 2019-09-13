// ==UserScript==
// @name         Format Bitbucket PR title
// @version      0.1
// @description  Automatically format your Bitbucket PR title
// @author       Trent Rand <contact@trentrand.com>
// @match        https://code.squarespace.net/**
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const TITLE_CONTAINER_SELECTOR = '.pull-request-details .pull-request-title';
  const TITLE_INPUT_SELECTOR = TITLE_CONTAINER_SELECTOR + '> input';
  const TICKET_PARSER_REGEXP = /^\w+\/(\w{1,5}-\d{1,5})/g

  function titleCase(str) {
    return str.split(' ').map(function (word, index) {
      if (index === 0) return word;
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

  function formatTitle(str) {
    let formattedTitle = titleCase(str);

    const [branchIdentifier, ticketIdentifier] = TICKET_PARSER_REGEXP.exec(formattedTitle);
    formattedTitle = formattedTitle.replace(TICKET_PARSER_REGEXP, '');

    return `[${ticketIdentifier}]${formattedTitle}`;
  }

  if (document.title.toLowerCase().startsWith('pull request')) {
    addEditHook()
  } else if (document.title.toLowerCase().startsWith('create pull request')) {
    addButton()
  }

  let retryCount = 0;

  async function addEditHook() {
    let editBtn = document.querySelector('#pull-request-header-more > div > ul > li:nth-child(1) > button')

    if (!editBtn) {
      await timeout(250)
      if (retryCount < 10) {
        retryCount++
        addEditHook()
      }
      return
    }
    editBtn.addEventListener('click', () => {
      retryCount = 0
      addButton()
    })
  }


  async function addButton() {
    let prTitleContainer = document.querySelector(TITLE_CONTAINER_SELECTOR);
    let prTitleInput = document.querySelector(TITLE_INPUT_SELECTOR);
    if (!prTitleContainer) {
      await timeout(250)
      if (retryCount < 10) {
        retryCount++
        addButton()
      }
      return;
    }

    let formatButton = document.createElement('a')
    formatButton.innerText = "Format PR title"
    formatButton.addEventListener('click', () => {
      prTitleInput.value = formatTitle(prTitleInput.value);
    });

    prTitleContainer.appendChild(document.createElement('br'))
    prTitleContainer.appendChild(formatButton)
  }

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
})();