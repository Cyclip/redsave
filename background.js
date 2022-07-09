chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        console.log("Complete", tab, tabId);
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            function: addButtons
        })
    }
  })
  

function addButtons() {
    // get all current posts
    let posts = document.getElementsByClassName("_1oQyIsiPHYt6nx7VOmd1sz");
    
    // add download button to all posts
    for (let i = 0; i < posts.length; i++) {
        // url of post
        let post = posts[i];

        // check if url can be quickly retrieved instead of 2 API calls
        let url = tryQuickUrl(post);
        let onClickFunc = `download("${url}")`;

        console.log(onClickFunc);

        posts[i].lastChild.lastChild.lastChild.innerHTML += `<button onClick='${onClickFunc}'>Download</button>`;
    }
}