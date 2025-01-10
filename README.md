# AI Chat Assistant

A real-time chat application powered by OpenAI's Assistant API, featuring streaming responses and a modern UI built with Next.js and Express.

## Features

- 🤖 OpenAI Assistant API integration with GPT-4 Turbo
- ⚡ Real-time streaming responses
- 💬 Thread-based conversations
- 🎨 Modern UI with dark mode support
- 🔄 Persistent chat history
- 🛠 Multiple assistant support

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Express.js, OpenAI API
- **Package Manager**: PNPM
- **Monorepo**: Turborepo

## Project Structure

```
apps/
  ├── web/                # Next.js frontend
  │   ├── app/           # App router pages
  │   ├── components/    # React components
  │   └── types/         # TypeScript types
  └── api/               # Express backend
      ├── controllers/   # API controllers
      └── routes/        # API routes
```

## Getting Started

### Prerequisites

- Node.js 18+
- PNPM
- OpenAI API Key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ai-chat-assistant
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Create `apps/api/.env`:

```env
OPENAI_API_KEY=your_openai_api_key
```

### Development

Start the development servers:

```bash
pnpm dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## API Endpoints

- `GET /api/assistant/list` - List all assistants
- `POST /api/assistant/create` - Create a new assistant
- `POST /api/assistant/thread` - Create a new thread
- `GET /api/assistant/message` - Send and stream message
- `GET /api/assistant/messages/:threadId` - Get thread messages

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
