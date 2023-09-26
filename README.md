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