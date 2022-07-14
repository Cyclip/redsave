// Content script to be injected into reddit pages

const SCROLL_THRESHOLD = 5000

function tryQuickUrl(post) {
    // check for imgs
    let imgs = post.querySelectorAll("img");
    for (let i = 0; i < imgs.length; i++) {
        let url = new URL(imgs[i].src);

        if (url.href.includes("award_images")) {
            continue;
        }

        if (url.hostname === "preview.redd.it") {
            // preview image, transform into final image
            return "https://i.redd.it" + url.pathname + url.search
        } else if (url.hostname === "external-preview.redd.it") {
            return url.href;
        }
    }

    // check for vids
    let vidSrc = post.querySelector("source");
    if (vidSrc !== null) {
        let url = new URL(vidSrc.src);
        return url.origin + url.pathname;
    }

    // unknown
    return post.lastChild.children[1].querySelector("a").href;
}

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
    }
}

var observables = document.querySelector(".rpBJOHq2PR60pnwJlUyP0");

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        addButtons();
    });    
});

var config = {childList: true};
observer.observe(observables, config);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "addButtons") {
            addButtons();
        }
    }
  );