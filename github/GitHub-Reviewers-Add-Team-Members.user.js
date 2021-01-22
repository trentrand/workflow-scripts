// ==UserScript==
// @name         GitHub Reviewers - Add Team Members
// @version      1.1
// @description  Add each team member individually as reviewers
// @author       Trent Rand <contact@trentrand.com>
// @match        https://github.com/sqsp/squarespace-v6/*
// @grant        none
// ==/UserScript==

const PR_FORM_SELECTOR = 'form#new_pull_request';

const REVIEWER_SEARCH_INPUT_SELECTOR = `${PR_FORM_SELECTOR} input#review-filter-field`;

const REVIEWER_SEARCH_LIST_SELECTOR = `${PR_FORM_SELECTOR} .select-menu-list > div[data-filterable-for="review-filter-field"]`;
const REVIEWER_SEARCH_LIST_ITEM_SELECTOR = `${REVIEWER_SEARCH_LIST_SELECTOR} .select-menu-item`;
const REVIEWER_TEAM_NAME_SELECTOR = `${REVIEWER_SEARCH_LIST_ITEM_SELECTOR} .select-menu-item-heading>.js-username`;

const INJECTION_PARENT_SELECTOR = '.select-menu-item';
const INJECTION_SELECTOR = '.select-menu-item-gravatar';

let userIDs = {
  'styling-system': ['zonika', 'dotrakoun-sqsp', 'pynate', 'trentrand', 'calexander-sqs', 'deanhunt'],
}

var Spy = (function () {
  function Spy() {}
  Spy.observe = function (targetNode) {
    Spy.observer.observe(targetNode, Spy.config);
  };
  Spy.disconnect = function () {
    Spy.observer.disconnect();
  };
  Spy.inject = function (mutationsList, observer) {
    var buttonsAddReviewer = document.querySelectorAll(REVIEWER_TEAM_NAME_SELECTOR);
    buttonsAddReviewer.forEach((addReviewerButton) => {
      const reviewerId = addReviewerButton.textContent;
      if (reviewerId.startsWith('sqsp/')) {
        var hasInjectedNode = addReviewerButton.querySelector('#addTeamMembers') !== null;
        var teamName = addReviewerButton.textContent.split('sqsp/')[1];
        var isSupportedTeam = Object.keys(userIDs).includes(teamName);
        if (!hasInjectedNode && isSupportedTeam) {
          var btnAddTeamMembers = document.createElement('div');
          btnAddTeamMembers.innerHTML =
            '<span class="btn btn-sm">' +
            '<svg class="octicon octicon-people" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">' +
            '<path fill-rule="evenodd" d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"></path>' +
            '</svg>' +
            '</span>';
          btnAddTeamMembers.setAttribute('id', 'addTeamMembers');
          btnAddTeamMembers.setAttribute('style', 'float:left; padding-right: 5.5px;');

          const injectionNode = addReviewerButton.closest(INJECTION_PARENT_SELECTOR);
          if (injectionNode) {
            const nodeToReplace = injectionNode.querySelector(INJECTION_SELECTOR);
            if (nodeToReplace) {
              nodeToReplace.replaceWith(btnAddTeamMembers);
            }
          }
          btnAddTeamMembers.addEventListener("click", function() {
            autoAddReviewers(userIDs[teamName]);
          }, false);
        }
      }
    });
  };
  Spy.config = { attributes: false, childList: true };
  Spy.observer = new MutationObserver(Spy.inject);
  return Spy;
}());

async function autoAddReviewers(members){
  let element = document.querySelector(REVIEWER_SEARCH_INPUT_SELECTOR)
  for (let userID of members) {
    element.value = userID
    element.dispatchEvent(new Event('input'))
    await timeout(250);
    element.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
  }
}

setInterval(function injectPageElement() {
  const reviewFilterField = document.querySelector(REVIEWER_SEARCH_LIST_SELECTOR);
  if (reviewFilterField !== undefined) {
    Spy.observe(reviewFilterField);
  }
}, 250);

function timeout(ms){
  return new Promise(resolve => setTimeout(resolve, ms))
}

