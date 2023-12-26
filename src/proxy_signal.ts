export default {

    async proxyStickers(params: { [key: string]: string }, query: { [key: string]: string }, env: Env): Promise<Response> {
        var proxyUrl = new URL(env.SIGNAL_STICKERS_URL + "stickers/" + params.path);
        return fetch(proxyUrl);
    },
};
