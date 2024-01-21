import { Router } from 'itty-router';
import tenor from './proxy_tenor';
import signal from './proxy_signal';
import { encryptedPreview } from './encrypted_preview/encrypted_preview';
import { encryptedPreviewImage } from './encrypted_preview/encrypted_preview_image';

const router = Router();

router.get('/proxy/tenor/api/:path+', ({ params, query }, env: Env) => {
    return tenor.proxyApi(params, query as { [key: string]: string }, env);
});

router.get('/proxy/tenor/media/:path+', ({ params, query }, env: Env) => {
    return tenor.proxyMedia(params, query as { [key: string]: string }, env);
});

router.get('/proxy/signal/stickers/:path+', ({ params, query }, env: Env) => {
    return signal.proxyStickers(params, query as { [key: string]: string }, env);
});

router.get('/url_preview/encrypted/metadata/:userKey/:encryptedUrl', ({ params, query, url }, env: Env) => {
    return encryptedPreview(params, query as { [key: string]: string }, url, env);
});

router.get('/url_preview/encrypted/image/:userKey/:encryptedUrl', ({ params, query }, env: Env) => {
    return encryptedPreviewImage(params, query as { [key: string]: string }, env);
});


router.all('*', () => new Response("Not found", { status: 404 }));

export default {
    fetch: router.handle,
};