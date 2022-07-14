// when page loads (only on reddit)
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            func: addButtons,
        })
    }
})

chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        if (request.action === "downloadUrl") {
            let [result, response] = await download(request.url);

            sendResponse({
                success: result,
                response: response,
            });
        }
    }
);

function addButtons() {
    // get all current posts
    let posts = document.querySelectorAll("._1oQyIsiPHYt6nx7VOmd1sz:not(.redsaveButton");
    
    // add download button to all posts
    for (let i = 0; i < posts.length; i++) {
        // url of post
        let post = posts[i];
        post.classList.add("redsaveButton");

        // check if url can be quickly retrieved instead of 2 API calls
        let url = tryQuickUrl(post);

        let button = document.createElement("button");
        button.innerText = "Download";
        button.onclick = function() {
            chrome.runtime.sendMessage({
                action: "downloadUrl",
                url: url,
            }, function(response) {
                console.log("[Redsave] Downloaded response:", response);
              });
        };

        posts[i].lastChild.lastChild.lastChild.appendChild(button);
        console.log(`[Redsave] Created button with url ${url} at`, button);
    }
}

async function download(url) {
    console.log("[Redsave] downloading", url);

    return (true, "");
}