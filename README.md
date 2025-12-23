# Pegasus Swap

A fast, secure, non-custodial Solana token swapping platform that helps you reclaim SOL from unused token accounts.

![Pegasus Swap](public/pegasus-logo.png)

## Features

- **Token Swapping**: Swap tokens on Solana with competitive rates
- **SOL Reclamation**: Reclaim SOL from unused, zero-balance SPL token accounts
- **Non-Custodial**: Your keys, your crypto - we never hold your funds
- **Wallet Support**: Compatible with popular Solana wallets (Phantom, Solflare, Backpack, etc.)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Blockchain**: Solana Web3.js + SPL Token
- **Wallet Adapter**: @solana/wallet-adapter-react
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pegasus-swap.git

# Navigate to the project directory
cd pegasus-swap

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Deployment

### Netlify

This project is configured for easy deployment on Netlify:

1. Push your code to GitHub
2. Connect your GitHub repo to Netlify
3. Netlify will automatically detect the build settings from `netlify.toml`
4. Deploy!

Build settings (auto-detected):
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### Manual Deployment

You can also deploy the `dist` folder to any static hosting provider:
- Vercel
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront

## Project Structure

```
├── public/              # Static assets
│   ├── pegasus-logo.png # Logo/favicon
│   └── _redirects       # Netlify SPA redirects
├── src/
│   ├── assets/          # Imported assets
│   ├── components/      # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── SwapInterface.tsx
│   │   ├── TokenSearch.tsx
│   │   └── ...
│   ├── pages/           # Page components
│   │   ├── Index.tsx
│   │   ├── Dex.tsx
│   │   ├── Claim.tsx
│   │   └── ...
│   ├── providers/       # Context providers
│   └── hooks/           # Custom React hooks
├── netlify.toml         # Netlify configuration
└── vite.config.ts       # Vite configuration
```

## License

MIT License - see [LICENSE](LICENSE) for details.
