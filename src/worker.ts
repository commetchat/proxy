import handleTenorProxy from './proxy_tenor';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname.startsWith('/proxy/tenor/')) {
			return handleTenorProxy.fetch(request, env, ctx);
		}

		return new Response('Not Found.', { status: 404 })
	},
};
