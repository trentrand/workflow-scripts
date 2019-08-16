// ==UserScript==
// @name         BitBucket Click to Copy Branch Name
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copy branch name to clipboard when clicking it within BitBucket PRs
// @author       Trent Rand
// @match        https://code.squarespace.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const branchNameLabels = document.querySelectorAll('.branch-from-to .branch-name')

    branchNameLabels.forEach((branchNameLabel) => {
        branchNameLabel.addEventListener('click', function(event) {
        const branchName = event.target.textContent;
        navigator.clipboard.writeText(branchName).then(function() {
            console.log('Copied to clipboard!');
            branchNameLabel.style.backgroundColor = "yellow";
            branchNameLabel.textContent = "Copied!".padEnd(branchName.length);
            setTimeout(function() {
                branchNameLabel.textContent = branchName;
                branchNameLabel.style.backgroundColor = "unset";
            }, 500);
        });
    });
  });
})();
