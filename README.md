<p align="center" style="padding-top:20px">
<h1 align="center">Proxy</h1>
<p align="center">Simple service to proxy api requests to third party services</p>

<p align="center">
    <a href="https://matrix.to/#/#commet:matrix.org">
        <img alt="Matrix" src="https://img.shields.io/matrix/commet%3Amatrix.org?logo=matrix">
    </a>
    <a href="https://fosstodon.org/@commetchat">
        <img alt="Mastodon" src="https://img.shields.io/mastodon/follow/109894490854601533?domain=https%3A%2F%2Ffosstodon.org">
    </a>
    <a href="https://twitter.com/intent/follow?screen_name=commetchat">
        <img alt="Twitter" src="https://img.shields.io/twitter/follow/commetchat?logo=twitter&style=social">
    </a>
</p>


# Development
This service is built as a Cloudflare Worker. Check out [this guide](https://developers.cloudflare.com/workers/get-started/guide/) if you are unfamiliar.

For development purposes, you will need to supply your own Tenor API key in `.dev.vars` file. Have a look at [this guide](https://developers.google.com/tenor/guides/quickstart) to get started working with Tenor api.

## API
Interacting should be nearly identical to working with the third party API itself, but with limited functionality. It will only allow queries that are integral to the functionality required by Commet.

### Requests
Requests may not share the exact same path as you might expect for a given api. 

For example, the Tenor search api structures a request like so:

`https://tenor.googleapis.com/v2/search?q=comet`

Making this same request via this proxy would look like this:

`https://proxy.commet.chat/proxy/tenor/api/v2/search?q=comet`