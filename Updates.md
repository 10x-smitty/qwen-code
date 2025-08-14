# Plan to Support Multiple LLMs in qwen-code

## Objective
Enable qwen-code to interface with multiple different Large Language Models (LLMs), allowing flexible backend selection and easier integration of new models in the future.

## Proposed Steps

1. **Audit Current LLM Usage**
   - Identify all places where an LLM is invoked or referenced.
   - Document input/output interfaces currently expected.

2. **Define a Model-Agnostic Abstraction**
   - Create a generic `LLMProvider` TypeScript interface or type for LLM interactions:
     - Methods: `generateResponse`, `getCompletions`, etc., with standardized parameters & results.
   - Ensure abstraction surface is extensible for chat, code generation, embeddings, etc.

3. **Implement Concrete LLM Adapters**
   - Example adapters: OpenAI, Gemini, Qwen, local models (llama.cpp, etc.), hypothetical/future providers.
   - Each implements the `LLMProvider` interface, handling authentication, API calls, and error handling internally.

4. **Add Model Selection Logic**
   - Allow LLM selection via config file, CLI flag, or environment variable.
   - Implement a registry of available adapters; load at runtime based on user/project configuration.

5. **Update All LLM Call Sites**
   - Refactor codebase to use the LLM abstraction everywhere an LLM is called.
   - Remove direct/one-off ‘hardcoded’ provider logic.

6. **Testing**
   - Write/expand tests for abstraction correctness and adapter selection.
   - Use mocking for external API calls in tests.

7. **Documentation & Examples**
   - Update README and usage docs with setup for different providers.
   - Include example config and CLI usage for switching LLMs.

## Future Extensions
- Add provider-specific settings (temperature, system prompt, etc.) at the config level.
- Dynamic provider/plugin support (runtime load/unload).
- UI support for switching models if applicable.

---
This plan aims to modularize LLM integration, future-proofing qwen-code for ongoing generative AI advances.