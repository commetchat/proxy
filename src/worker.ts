import handleTenorProxy from './proxy_tenor';
import router from './router';

const corsHeaders: Record<string, string> = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
	"Access-Control-Max-Age": "86400",
};

function handleOptions(request: Request) {
	// Make sure the necessary headers are present
	// for this to be a valid pre-flight request
	let headers = request.headers
	if (
		headers.get("Origin") !== null &&
		headers.get("Access-Control-Request-Method") !== null &&
		headers.get("Access-Control-Request-Headers") !== null
	) {
		// Handle CORS pre-flight request.
		// If you want to check or reject the requested method + headers
		// you can do that here.
		let respHeaders = {
			...corsHeaders,
			// Allow all future content Request headers to go back to browser
			// such as Authorization (Bearer) or X-Client-Name-Version
			"Access-Control-Allow-Headers": headers.get("Access-Control-Request-Headers") || "",
		}
		return new Response(null, {
			headers: respHeaders,
		})
	}
	else {
		// Handle standard OPTIONS request.
		// If you want to allow other HTTP Methods, you can do that here.
		return new Response(null, {
			headers: {
				Allow: "GET, HEAD, POST, OPTIONS",
			},
		})
	}
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		let response: Response
		if (request.method === "OPTIONS") {
			response = handleOptions(request);
		} else {
			response = await router.fetch(request, env);
			response = new Response(response.body, response)
			response.headers.set("Access-Control-Allow-Origin", "*")
			response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		}

		return response;
	},
};
