# Synthetic Data Generator

A minimal and fast tool to generate structured JSON test data using AI.
Generate → Copy → Go

## Features

- **Instant Generation**: Create realistic data for Users, Products, Orders, Support Tickets, and IoT Events.
- **Customizable Quantity**: Generate 1, 5, or 10 items at a time.
- **Easy Export**: Copy to clipboard or download as a `.json` file.
- **Modern UI**: Built with Next.js 15, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI**: OpenAI API (or compatible)

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/akinghill/synthetic-data-generator.git
   cd synthetic-data-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Copy `.env.example` to `.env.local` and add your API Key.
   ```bash
   cp .env.example .env.local
   ```
   
   Open `.env.local`:
   ```env
   LLM_API_KEY=sk-your-openai-api-key
   LLM_MODEL=gpt-4o-mini
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Presets

- **Users**: Random user profiles with roles and contact info.
- **Products**: E-commerce product catalog items.
- **Orders**: Transactional data with line items.
- **Support Tickets**: Customer service issues with status and priority.
- **IoT Events**: Device telemetry and status updates.

## Deployment

Deploy easily to Vercel. Ensure you set the `LLM_API_KEY` environment variable in your Vercel project settings.

## License

MIT
