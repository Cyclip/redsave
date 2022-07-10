chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        console.log("Complete", tab, tabId);
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            func: addButtons,
        })
    }
})

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension"
        );
        
        if (request.request === "downloadUrl") {
            let [result, response] = download(request.url);

            sendResponse({
                success: result,
                response: response,
            });
        }
    }
);

function addButtons() {
    // get all current posts
    let posts = document.getElementsByClassName("_1oQyIsiPHYt6nx7VOmd1sz");
    
    // add download button to all posts
    for (let i = 0; i < posts.length; i++) {
        // url of post
        let post = posts[i];

        // check if url can be quickly retrieved instead of 2 API calls
        let url = tryQuickUrl(post);

        let button = document.createElement("button");
        button.innerText = "Download";
        button.onclick = function() {
            chrome.runtime.sendMessage({
                request: "downloadUrl",
                url: url,
            }, function(response) {
                console.log("WEEE", response);
              });
              
        };

        posts[i].lastChild.lastChild.lastChild.appendChild(button);
    }
}

function download(url) {
    console.log("downloading", url);
    chrome.downloads.download({
        url: url,
        saveAs: true,
        filename: "test.jpg",
    }, function(res) {
            console.log(res);
        }
    );

    return (true, "");
}