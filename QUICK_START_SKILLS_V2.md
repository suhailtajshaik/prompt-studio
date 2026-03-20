# Skills Generator v2 - Quick Start Guide

## What Changed?

**Old**: Generated OpenClaw skill definitions (SKILL.md)
**New**: Generates complete, production-ready code modules in 6 languages

## 5-Minute Test

### Step 1: Start the app
```bash
cd /home/r2d2/projects/prompt-studio-dev
npm run dev
```

### Step 2: Navigate to Skills Generator
Go to the Skills Generator tab in the UI.

### Step 3: Select Language
Click on **🐍 Python** to select Python.

### Step 4: Describe Your Module
Enter a simple description:
```
A CLI tool for converting Markdown files to HTML
```

### Step 5: Generate
Click the "Generate Skill" button (now says "Generate Module").

### Step 6: Preview
You'll see:
- 📋 README.md with usage instructions
- 🐍 main.py with complete source code
- 📦 requirements.txt with dependencies
- 📚 example.py showing how to use it
- ✅ test.py with unit tests

### Step 7: Download
- Click **"Download ZIP"** to get all files in one archive
- Click **"Download README"** to get just the documentation

## What Gets Generated?

### Python Example
```
module-name-module.txt contains:
├─ main.py (500-1000 lines of production code)
├─ requirements.txt (minimal dependencies)
├─ README.md (installation, usage, API docs)
├─ example.py (working example)
└─ test.py (unit tests with pytest/unittest)
```

### Each language has:
- **Source file** with full implementation
- **Dependency file** (requirements.txt, package.json, go.mod, etc.)
- **Documentation** (comprehensive README)
- **Example** (working code snippet)
- **Tests** (unit tests)

## Language-Specific Features

### 🐍 Python
- PEP 8 compliant
- Type hints throughout
- Standard library preferred
- Comprehensive docstrings
- Works with Python 3.8+

### ⚙️ Node.js/TypeScript
- TypeScript with strict mode
- async/await everywhere
- Modern npm scripts
- Clear error types
- Works with Node.js 18+

### 🐹 Go
- Idiomatic Go conventions
- Proper error handling
- Concurrent when needed
- go.mod dependency management
- Includes _test.go files

### 🦀 Rust
- Rust 2021 edition
- Memory-safe patterns
- Minimal dependencies
- Cargo.toml configured
- RAII principles

### ☕ Java
- Java 17+ features
- Maven for dependencies
- Comprehensive JavaDoc
- Modern Java patterns
- JUnit 5 tests

### ➕ C++
- C++17 standard
- CMakeLists.txt build
- STL library usage
- RAII and smart pointers
- Comprehensive comments

## Tips

### 1. Be Specific
Good: "A command-line tool to resize images in batch with JPEG/PNG support"
Bad: "Image tool"

### 2. Include Details
Good: "A JSON validator that checks schema compliance and returns detailed errors"
Bad: "JSON validator"

### 3. Mention Requirements
Good: "A web server that handles GET/POST requests with CORS support"
Bad: "Web server"

## Common Use Cases

### Data Processing
```
"A Python library to clean and normalize CSV files with null handling"
```
→ Generates CSV processing module with pandas integration

### API Clients
```
"A Node.js HTTP client wrapper with retry logic and request/response logging"
```
→ Generates TypeScript API client with proper error handling

### System Tools
```
"A Go CLI tool to monitor process memory usage and generate CSV reports"
```
→ Generates working Go executable with CLI flags

### Utilities
```
"A Rust function to validate email addresses according to RFC 5322"
```
→ Generates robust email validator with comprehensive tests

### Web Services
```
"A Java REST endpoint to convert between different image formats"
```
→ Generates Spring Boot ready code with proper exception handling

## After Generation

### Using the Module

1. **Download** the module archive
2. **Extract** all files
3. **Follow README.md** for installation
4. **Run example** to verify it works
5. **Run tests** to ensure quality
6. **Integrate** into your project

### Making Changes

- Edit `main.py` (or equivalent) for functionality
- Update `requirements.txt` if you add dependencies
- Add more tests in `test.py` as needed
- Update README.md with custom documentation

### Publishing

Each module is ready for:
- **Python**: `pip install` (publish to PyPI)
- **Node.js**: `npm install` (publish to npm)
- **Go**: `go get` (publish to GitHub)
- **Rust**: `cargo install` (publish to crates.io)
- **Java**: Maven Central
- **C++**: vcpkg, Conan, or standalone

## Troubleshooting

### Preview is empty
- Make sure API key is configured
- Check browser console (F12)
- Try again with a simpler description

### Code seems generic
- Be more specific in your description
- Include implementation details
- Mention libraries/frameworks you want

### Missing some files
- Not all modules need tests (but they're included)
- Check the preview sections for expandable content
- All generated files are in the archive

### Archive format
- Downloaded as `.txt` to maximize compatibility
- Each section clearly marked with headers
- Copy-paste each section to create individual files
- Or use the organized structure shown in README

## API Providers

Works with:
- **Claude** (Anthropic)
- **Gemini** (Google)
- **OpenRouter** (multiple models)

Add your API key in settings before generating.

## Advanced: System Prompts

Each language has a specific system prompt:

**Location**: `src/data/skillGeneration.js`

**Can customize:**
- Coding conventions
- Library preferences
- Architecture patterns
- Testing frameworks
- Documentation style

Modify `LANGUAGE_SPECIFIC` object to change generation behavior.

## FAQ

### Q: Can I use generated code commercially?
**A**: Yes! It's clean, production-ready code.

### Q: Are there external dependencies?
**A**: Minimal. Uses language standard libraries where possible.

### Q: Can I modify the code?
**A**: Absolutely! Edit, extend, refactor as needed.

### Q: How long do modules take to generate?
**A**: ~10-30 seconds depending on API and module complexity.

### Q: Can I generate multiple modules?
**A**: Yes! Select language, describe, generate. No limits.

### Q: Which language should I pick?
**A**: Pick what you know or need:
- **Python**: Quick, data-heavy, automation
- **Node.js**: Web/API, async operations, JavaScript ecosystem
- **Go**: Performance, concurrent, cloud-native
- **Rust**: Memory-safe, high-performance, systems
- **Java**: Enterprise, JVM ecosystem, strict typing
- **C++**: Systems-level, performance-critical, low-level

## Next: Full Documentation

See `SKILLS_GENERATOR_V2.md` for complete documentation.
See `IMPLEMENTATION_CHECKLIST.md` for technical details.

---

**Ready to generate?** Pick a language and describe your module! 🚀
