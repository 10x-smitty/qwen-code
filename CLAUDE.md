# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Building and Development
- `npm run build` - Build the main project (builds all packages)
- `npm run build:all` - Build everything including sandbox and VS Code extension
- `npm run build:packages` - Build all workspace packages individually 
- `npm start` or `make start` - Start the Qwen CLI in development mode
- `npm run debug` or `make debug` - Start in debug mode with inspector
- `npm run bundle` - Generate bundle with git commit info and copy assets

### Testing
- `npm test` - Run all tests across workspaces
- `npm run test:ci` - Run tests with coverage for CI
- `npm run test:e2e` - Run end-to-end integration tests
- `npm run test:integration:all` - Run all integration tests (different sandbox modes)
- `npm run test:integration:sandbox:none` - Run integration tests without sandbox
- Individual package tests: `npm run test --workspace=packages/cli`

### Code Quality
- `npm run lint` - Run ESLint on TypeScript files
- `npm run lint:fix` - Fix auto-fixable lint issues
- `npm run lint:ci` - Lint with zero warnings tolerance for CI
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking across workspaces
- `npm run preflight` - Full quality check (clean, install, format, lint, build, typecheck, test)

### Development Workflow
- `npm run clean` - Remove generated files and build artifacts
- `npm ci` - Clean install dependencies (recommended for consistent builds)
- `make help` - Show all available Makefile targets

## Project Architecture

### Monorepo Structure
This is a TypeScript monorepo with npm workspaces containing three main packages:

1. **`packages/cli`** - User-facing CLI interface
   - Handles user input/output, terminal UI, authentication flows
   - Built with React/Ink for terminal rendering
   - Entry point: `dist/index.js` (binary: `qwen`)

2. **`packages/core`** - Backend engine and API client
   - Gemini/OpenAI API communication, tool execution, session management
   - Contains all tools (`src/tools/`) for file system, shell, web operations
   - Handles prompt construction, model switching, and telemetry

3. **`packages/vscode-ide-companion`** - VS Code extension
   - Provides IDE integration for Qwen Code
   - Handles file synchronization and editor context

### Key Components

**Tool System** (`packages/core/src/tools/`)
- Modular tool architecture for extending AI capabilities
- Tools include: file operations, shell execution, web fetch, memory, MCP client
- Tools require user confirmation for destructive operations

**Authentication** (`packages/cli/src/config/auth.ts`)
- Supports Qwen OAuth (recommended), OpenAI-compatible APIs
- Multiple provider options: Alibaba Cloud, ModelScope, OpenRouter

**Configuration** (`packages/cli/src/config/`)
- Settings in `.qwen/settings.json` (home directory)
- Environment variable support via `.env` files
- Theme system with multiple built-in themes

## Important Notes

### Authentication Setup
- Primary: Qwen OAuth (2000 requests/day free) - run `qwen` and authenticate
- Alternative: OpenAI-compatible APIs via `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL`
- Regional providers: Alibaba Cloud (China), ModelScope (China), OpenRouter (International)
- Temperature control: Set `TEMPERATURE` environment variable (default: 0, some OpenAI models require 1)

### Model Configuration
- Adapted for Qwen-Coder models with specialized parsing
- Supports model fallback and switching
- Token limits configurable via `sessionTokenLimit` setting

### Build System
- Uses esbuild for bundling with custom build scripts
- Generates single executable bundle at `bundle/gemini.js`
- Docker sandbox support with configurable security profiles
- Git commit info embedded during build process

### Testing Strategy
- Unit tests with Vitest in each package
- Integration tests for tool functionality
- Sandbox testing with Docker/Podman support
- CI pipeline includes lint, typecheck, and full test suite

### Development Considerations
- Node.js >= 20 required
- Uses ESM modules throughout
- Extensive telemetry and logging system
- Graceful error handling with retry mechanisms
- Memory management for large codebases with token compression