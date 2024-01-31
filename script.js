
init();

function init(){
    chrome.tabs.query({
        "active": true,
        "currentWindow": true    
        }, async function (tabs) {
            console.log(tabs);
            let temp = await chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: getDataFromJira
            });

            renderPage(temp[0].result);
        });
}

function renderPage(obj){
   let commit =  createDescriptionCommit(obj);
   let result_div= document.getElementById("result_div");
   
   result_div.innerHTML = `<label for="basic-url">Commit description</label>
<div class="input-group mb-3">
  <input type="text" class="form-control" read-only id="input-commit-description" aria-describedby="basic-addon3" value="${commit}">
</div>
`  
}

async function copyToBoard(str){
    console.log(str);
   await navigator.clipboard.writeText(str);
}


function createDescriptionCommit(obj){
    return `feat(${obj.apiName}): ${obj.numberTask} - ${obj.titleTask}`
}

function getDataFromJira() {
    let obj = {
        titleTask: document.querySelectorAll('[data-testid="issue.views.issue-base.foundation.summary.heading"]')[0].innerText,
        numberTask: document.querySelectorAll('[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"]')[0].innerText,
        apiName: document.querySelectorAll('[data-testid="issue.views.common.tag.tag-item"]')[0].innerText,
    }
    return obj;
  }