export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname.startsWith("/proxy/tenor/api")) {
			return this.proxyApi(url, env);
		}

		if (url.pathname.startsWith("/proxy/tenor/media")) {
			return this.proxyMedia(url, env);
		}

		return new Response('Not Found.', { status: 404 });
	},

	async proxyApi(url: URL, env: Env): Promise<Response> {
		var split = url.pathname.split('/')
		var path = split.slice(4).join("/")

		console.log(env.TENOR_API_URL);
		var proxyUrl = new URL(env.TENOR_API_URL + path);

		proxyUrl.searchParams.append("key", env.TENOR_API_KEY)

		url.searchParams.forEach((value, key) => {
			proxyUrl.searchParams.append(key, value);
		})

		let res = await fetch(proxyUrl);

		return res;
	},

	async proxyMedia(url: URL, env: Env): Promise<Response> {

		var split = url.pathname.split('/')
		var path = split.slice(4).join("/")

		var proxyUrl = new URL(env.TENOR_MEDIA_URL + path);

		url.searchParams.forEach((value, key) => {
			console.log(key);
			if (key) {
				proxyUrl.searchParams.append(key, value);
			}
		})

		let res = await fetch(proxyUrl);

		return res;
	},
};
