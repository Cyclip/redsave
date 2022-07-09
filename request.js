// Content script to be injected into reddit pages

function tryQuickUrl(post) {
    // check for imgs
    let imgs = post.querySelectorAll("img");
    for (let i = 0; i < imgs.length; i++) {
        let url = new URL(imgs[i].src);
        console.log("checking url", url.hostname, url.href);

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

    // unknown
    return post.lastChild.children[1].querySelector("a").href;
}