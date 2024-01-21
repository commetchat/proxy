import base_64 from "../utils/base_64"
import a from '../utils/array';
import { decodeAndDecryptProxyUrl, decodeClientPublicKey, encryptContent, encryptContentKey, generateContentKey } from "./common";

export { encryptedPreviewImage }

async function encryptedPreviewImage(params: { [key: string]: string }, query: { [key: string]: string }, env: Env) {
    var requestedUrl = await decodeAndDecryptProxyUrl(params['encryptedUrl'], env)
    var clientPublicKey = await decodeClientPublicKey(params['userKey'])
    var contentKey = await generateContentKey()

    var response = await fetch(new URL(requestedUrl))
    var type = response.headers.get("Content-Type")
    var imageBytes = await response.arrayBuffer();

    var encryptedImage = new Uint8Array(await encryptContent(new Uint8Array(imageBytes), contentKey))
    var encryptedContentKey = new Uint8Array(await encryptContentKey(clientPublicKey, contentKey))

    var result = a.joinArray(encryptedContentKey, encryptedImage)

    var response = new Response(result);

    if (type != null) {
        response.headers.set('Content-Type', type)
    }

    return response
}