import b64 from '../utils/base_64';
import a from '../utils/array';

export {
    generateContentKey, encryptContentKey, encryptContent, decodeAndDecryptProxyUrl, decodeClientPublicKey, loadServerPublicKey, loadServerPrivateKey
}

async function generateContentKey(): Promise<CryptoKey> {
    let key = await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"],
    ) as CryptoKey;
    return key
}

async function encryptContentKey(clientPublicKey: CryptoKey, contentKey: CryptoKey): Promise<ArrayBuffer> {
    const exported = await crypto.subtle.exportKey("raw", contentKey) as ArrayBuffer;

    var encrypted = await crypto.subtle.encrypt({
        name: "RSA-OAEP",
    }, clientPublicKey, exported)

    return encrypted
}

async function loadServerPrivateKey(env: Env): Promise<CryptoKey> {
    var privateKeyB64 = env.ENCRYPTED_PREVIEW_PRIVATE_KEY_B64
    var key = new TextDecoder().decode(b64.base64ToArrayBuffer(privateKeyB64))

    var privateKey = privateKeyPemToCryptoKey(key);
    return privateKey;
}

async function loadServerPublicKey(env: Env): Promise<CryptoKey> {
    var publicKeyB64 = env.ENCRYPTED_PREVIEW_PUBLIC_KEY_B64;
    var key = new TextDecoder().decode(b64.base64ToArrayBuffer(publicKeyB64))


    return publicKeyPemToCryptoKey(key);
}

async function publicKeyPemToCryptoKey(pem: String): Promise<CryptoKey> {
    pem = pem.replace(/[\n\r]/g, '');

    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(
        pemHeader.length,
        pem.length - pemFooter.length,
    );

    const binaryDerString = atob(pemContents);
    const binaryDer = b64.stringToArrayBuffer(binaryDerString);

    return crypto.subtle.importKey(
        "spki",
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: { name: "SHA-256" }
        },
        true,
        ["encrypt"],
    );
}

function privateKeyPemToCryptoKey(pem: String): Promise<CryptoKey> {
    pem = pem.replace(/[\n\r]/g, '');

    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = pem.substring(
        pemHeader.length,
        pem.length - pemFooter.length - 1,
    );
    // base64 decode the string to get the binary data
    const binaryDerString = atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = b64.stringToArrayBuffer(binaryDerString);

    return crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: { name: "SHA-256" }
        },
        true,
        ["decrypt"],
    );
}

async function decodeClientPublicKey(userKeyData: string): Promise<CryptoKey> {
    var decoded = decodeURIComponent(userKeyData)
    var data = b64.base64ToArrayBuffer(decoded)
    var text = new TextDecoder().decode(data)

    var userKey = await publicKeyPemToCryptoKey(text)
    return userKey
}

async function encryptContent(content: Uint8Array, contentKey: CryptoKey): Promise<ArrayBuffer> {
    const iv = crypto.getRandomValues(new Uint8Array(16));
    var encrypted = await crypto.subtle.encrypt({
        name: "AES-GCM",
        iv: iv,
    }, contentKey, content)

    var result = a.joinArray(iv, new Uint8Array(encrypted))
    return result;
}

async function decodeAndDecryptProxyUrl(urlData: string, env: Env): Promise<string> {
    var privateKey = await loadServerPrivateKey(env)

    var decoded = decodeURIComponent(urlData)
    var data = b64.base64ToArrayBuffer(decoded)

    var decrypted = await crypto.subtle.decrypt({
        name: "RSA-OAEP",
    }, privateKey, data)

    var url = new TextDecoder().decode(decrypted)
    return url
}