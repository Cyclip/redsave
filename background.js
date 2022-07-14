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

async function download(url) {
    console.log("[Redsave] downloading", url);

    return (true, "");
}