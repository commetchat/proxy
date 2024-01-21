export { extractTags }

async function extractTags(url: URL): Promise<{ [key: string]: string }> {
    var response = await fetch(new URL(url))

    const tags: { [key: string]: string } = {};

    const rewriter = new HTMLRewriter()
        .on("meta", {
            element(el) {
                var prop = el.getAttribute("property")
                var content = el.getAttribute("content")

                if (prop == null || content == null) {
                    return
                }

                if (["og:site_name", "og:url", "og:title", "og:description", "og:image"].includes(prop) == false) {
                    return
                }

                tags[prop] = content
            }
        })

    await consume(rewriter.transform(response).body!)

    return tags
}

async function consume(stream: ReadableStream) {
    const reader = stream.getReader();
    while (!(await reader.read()).done) { /* NOOP */ }
}