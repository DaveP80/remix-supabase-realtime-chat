# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)
- [Netlify Functions](https://www.netlify.com/products/functions/)

## Netlify Setup

1. Install the [Netlify CLI](https://www.netlify.com/products/dev/):

```sh
npm i -g netlify-cli
```

If you have previously installed the Netlify CLI, you should update it to the latest version:

```sh
npm i -g netlify-cli@latest
```

2. Sign up and log in to Netlify:

```sh
netlify login
```

3. Create a new site:

```sh
netlify init
```

## Development

The Remix dev server starts your app in development mode, rebuilding assets on file changes. To start the Remix dev server:

```sh
npm run dev
```

## Deployment

I recommend Google Cloud Run, since the package json and the remix config is setup with remix-run/serve to make it good to go.
This video explains how to deploy using your terminal:
https://youtu.be/eemS-UTjdb0?si=2YJe8yiZsodQGxEn

- To Get gcloud: [gcloud tar](https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-darwin-arm.tar.gz)

```bash
gcloud auth login
gcloud config set project <PROJECT_ID>
```

## Notes

- Transformers local LLM is used to make the GPT chat route. The `__session` cookie I added doesnt do a whole lot, but it is in development to help with handling possible server errors.

## Environment Variables

SUPABASE_URL=
SUPABASE_PUBLIC_KEY=
REQ_COOKIE=
VITE_API_URL=
DOMAIN_URL=

<details>Author: David Paquette</details>