# MedConnect

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Running a local signaling server (for real video calls)

This project includes a minimal WebSocket signaling server used by the demo WebRTC implementation.

1. Install the `ws` package if you haven't already: `npm install` (it is included in devDependencies)
2. Start the signaling server: `npm run signaling` (runs `scripts/signaling-server.js` on ws://localhost:4000)
3. Start the app: `npm run dev`

Open the app on two devices or browsers, login as `Médico` on one and `Paciente` on the other (they must use the same `consultationId` — the app uses the query/consultation id to join the same room). The video call will use the signaling server to exchange SDP and ICE so each side sees the other's camera.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
