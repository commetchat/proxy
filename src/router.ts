import { Router } from 'itty-router';
import tenor from './proxy_tenor';

const router = Router();

router.get('/proxy/tenor/api/:path+', ({ params, query }, env: Env) => {
    return tenor.proxyApi(params, query as { [key: string]: string }, env);
});

router.get('/proxy/tenor/media/:path+', ({ params, query }, env: Env) => {
    return tenor.proxyMedia(params, query as { [key: string]: string }, env);
});

router.all('*', () => new Response("Not found", { status: 404 }));

export default {
    fetch: router.handle,
};