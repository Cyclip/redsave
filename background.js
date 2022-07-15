// when page loads (only on reddit)
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            func: addButtons,
        })

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(
                tabsId, 
                {action: "addButtons"}, 
                function(response) {
                    console.log("response from content script", response);
                }
            );
        });
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

// Download an unknown post type from a URL
async function download(url) {
    console.log("[Redsave] downloading", url);

    let type = determinePostType(url);
    if (type === "unknown") {
        return console.error("[Redsave] Unknown post type");
    } else if (type === "image") {
        return downloadImage(url);
    } else if (type === "video") {
        return downloadVideo(url);
    }
}

// Determine the type of post from a URL
function determinePostType(url) {
    url = new URL(url);
    if (url.origin === "https://v.redd.it") {
        return "video";
    }

    if( (url.origin === "https://i.redd.it") || (url.origin === "https://external-preview.redd.it")) {
        return "image";
    }

    return "unknown";
}

// Download an image from a URL
function downloadImage(url) {
    downloadFileFromUrl(url);
    return (true, "")
}

// Download a video from a URL
function downloadVideo(urL) {
    console.warn("Feature is not yet implemented");
    return (false, "Feature is not yet implemented");

    // code to be used in conjunction with redsave API
    // https://www.github.com/Cyclip/red-save
    
}

// Download a file from a URL directly
function downloadFileFromUrl(urL) {
    chrome.downloads.download({
        url: urL,
        saveAs: true
    });
}