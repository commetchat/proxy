export default {
	async proxyApi(params: { [key: string]: string }, query: { [key: string]: string }, env: Env): Promise<Response> {
		var proxyUrl = new URL(env.TENOR_API_URL + params.path);

		if (!["v2/search"].includes(params.path)) {
			return new Response('Invalid request', { status: 401 })
		}

		["q"].forEach((key: string) => {
			if (query.hasOwnProperty(key))
				proxyUrl.searchParams.append(key, query[key]);
		});

		proxyUrl.searchParams.append("key", env.TENOR_API_KEY);
		return fetch(proxyUrl);
	},

	async proxyMedia(params: { [key: string]: string }, query: { [key: string]: string }, env: Env): Promise<Response> {
		var proxyUrl = new URL(env.TENOR_MEDIA_URL + params.path);
		return fetch(proxyUrl);
	},
};
