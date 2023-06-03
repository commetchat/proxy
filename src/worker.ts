import handleTenorProxy from './proxy_tenor';
import router from './router';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return router.fetch(request, env);
	},
};
