import { Router } from 'itty-router';
import tenor from './proxy_tenor';
import klipy from './proxy_klipy';
import signal from './proxy_signal';
const router = Router();

router.get('/proxy/tenor/api/:path+', ({ params, query }, env: Env) => {
    return tenor.proxyApi(params, query as { [key: string]: string }, env);
});

router.get('/proxy/tenor/media/:path+', ({ params, query }, env: Env) => {
    return tenor.proxyMedia(params, query as { [key: string]: string }, env);
});

router.get('/proxy/klipy/api/:path+', ({ params, query }, env: Env) => {
    return klipy.proxyApi(params, query as { [key: string]: string }, env);
});

router.get('/proxy/klipy/media/:path+', ({ params, query }, env: Env) => {
    return klipy.proxyMedia(params, query as { [key: string]: string }, env);
});


router.get('/proxy/signal/stickers/:path+', ({ params, query }, env: Env) => {
    return signal.proxyStickers(params, query as { [key: string]: string }, env);
});

router.all('*', () => new Response("Not found", { status: 404 }));

export default {
    fetch: router.handle,
};