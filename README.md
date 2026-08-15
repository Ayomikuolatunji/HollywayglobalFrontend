# Hollyway Global Quick Sales Landing Page

Desktop-first landing page matching the approved visual direction.

## Run
```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Included
- Next.js 16.3
- 10+ landing-page sections
- Hollyway Global navy/orange visual system
- Approved brand logo + site logo assets
- WhatsApp, Facebook, Instagram, TikTok, X and LinkedIn links
- Responsive mobile fallback
- No UI framework dependency; styling is in `app/globals.css`
- Contact and newsletter forms submit through AudienceRelay's publishable browser endpoint

## AudienceRelay production setup

Create and activate one Contact Form and one Newsletter in the Hollyway AudienceRelay workspace.
Add a `topic` select field to the Contact Form. Add `https://hollywayglobal.com` and
`https://www.hollywayglobal.com` to both forms' allowed origins, then set these variables in the
production hosting environment using `.env.example` as the reference:

- `NEXT_PUBLIC_AUDIENCE_RELAY_CONTACT_FORM_TOKEN`: the contact form's publishable token
- `NEXT_PUBLIC_AUDIENCE_RELAY_NEWSLETTER_FORM_TOKEN`: the newsletter's publishable token
- `AUDIENCE_RELAY_API_KEY`: the paid server key for retrieval endpoints; never expose it with a
  `NEXT_PUBLIC_` prefix

Publishable form tokens are intentionally safe for browser submissions and preserve per-visitor
abuse controls. The secret API key is server-only and is not required for public form writes.

## Development

The `dev` branch is used for ongoing landing-page improvements before they are merged into `main`.
