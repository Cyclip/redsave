// Content script to be injected into reddit pages

function tryQuickUrl(post) {
    let imgs = post.querySelectorAll("img");
    for (let i = 0; i < imgs.length; i++) {
        let url = new URL(imgs[i].src);
        if (url.hostname === "preview.redd.it") {
            // preview image, transform into final image
        }
    }
}