import { extractTags } from "../utils/url_preview_generator";
import b64 from '../utils/base_64';
import a from '../utils/array';
import { decodeAndDecryptProxyUrl, decodeClientPublicKey, encryptContent, encryptContentKey, generateContentKey, loadServerPublicKey } from "./common";

export { encryptedPreview }

async function encryptedPreview(params: { [key: string]: string }, query: { [key: string]: string }, url: string, env: Env) {
    var requestedUrl = await decodeAndDecryptProxyUrl(params['encryptedUrl'], env)
    var clientPublicKey = await decodeClientPublicKey(params['userKey'])
    var contentKey = await generateContentKey()

    var tags = await extractTags(new URL(requestedUrl))

    var imageUrl = tags["og:image"]
    if (imageUrl != null) {
        var encryptedImageUrl = await encryptAndEncodeUrl(imageUrl, env)

        var thisUrl = new URL(url);
        thisUrl.pathname = `/url_preview/encrypted/image/${params['userKey']}/${encryptedImageUrl}`
        imageUrl = thisUrl.toString()
    }

    for (var key in tags) {
        tags[key] = await encryptAndEncodeContentString(tags[key], contentKey)
    }

    tags["og:image"] = imageUrl
    tags["og:commet:content_key"] = await encryptAndEncodeContentKey(clientPublicKey, contentKey)

    return generateResponse(tags);
}

function generateResponse(tags: { [key: string]: string; }) {
    var tagsHtml = "";
    for (var key in tags) {
        tagsHtml += `<meta property="${key}" content="${tags[key]}">\n`;
    }

    var response = new Response(
        `
    <!doctype html>
    <html lang="en">
    <head>
        ${tagsHtml}
    </head>
    </html>
    `
    );
    response.headers.set('Content-Type', 'text/html')

    return response;
}

async function encryptAndEncodeContentKey(clientPublicKey: CryptoKey, contentKey: CryptoKey): Promise<string> {
    var encrypted = await encryptContentKey(clientPublicKey, contentKey)
    return b64.arrayBufferToBase64(encrypted)
}

async function encryptAndEncodeContentString(value: string, contentKey: CryptoKey): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(16));
    var bytes = await encryptContent(new TextEncoder().encode(value), contentKey)
    return b64.arrayBufferToBase64(bytes)
}

async function encryptAndEncodeUrl(url: string, env: Env): Promise<string> {
    var publicKey = await loadServerPublicKey(env)
    var data = new TextEncoder().encode(url)

    var encrypted = await crypto.subtle.encrypt({
        name: "RSA-OAEP",
    }, publicKey, data);

    return encodeURIComponent(b64.arrayBufferToBase64(encrypted));
}