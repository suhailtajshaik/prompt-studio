# Skills Generator v2 - Developer Reference

## Code Architecture

### Component Tree
```
SkillsView
├── Language Selector (LANGUAGES array)
├── Module Description Input (PromptInput)
├── Error Handler (ErrorBanner)
├── Generate Button (useSkillGenerator hook)
└── Preview Section
    └── SkillPreview
        ├── Metadata Card
        ├── README Preview
        ├── Main Code Preview
        ├── Dependencies Preview
        ├── Example Preview
        └── Tests Preview
```

### Data Flow
```
User Input
   ↓
SkillsView
   ↓
useSkillGenerator.generate()
   ↓
API Call (Anthropic/Gemini/OpenRouter)
   ↓
JSON Response
   ↓
skillDownloader (download)
```

## File Reference

### Frontend Components

#### SkillsView.jsx
**Location**: `src/components/SkillsView.jsx`

**State**:
```javascript
const [language, setLanguage] = useState('python');  // Selected language
const [input, setInput] = useState('');              // Module description
const [copied, setCopied] = useState(null);          // Download feedback
```

**Key Functions**:
- `handleGenerate()` - Calls useSkillGenerator.generate()
- `handleDownloadZip()` - Downloads module archive
- `handleDownloadMd()` - Downloads README.md

**Language Options**:
```javascript
const LANGUAGES = [
  { id: 'python', label: 'Python', icon: '🐍' },
  { id: 'nodejs', label: 'Node.js/TypeScript', icon: '⚙️' },
  // ... 4 more languages
];
```

#### SkillPreview.jsx
**Location**: `src/components/SkillPreview.jsx`

**State**:
```javascript
const [expandedSections, setExpandedSections] = useState({
  readme: true,
  main_code: true,
  example: false,
  dependencies: false,
  tests: false,
});
```

**Key Functions**:
- `toggleSection(section)` - Toggle expandable sections
- `SyntaxHighlightedCode()` - Simple syntax highlighting
- Dynamic language emoji lookup

**Displays**:
- Language badge with emoji
- Metadata and tags
- README preview
- Source code preview
- Dependencies preview
- Example code preview
- Unit tests preview

### Hooks

#### useSkillGenerator.js
**Location**: `src/hooks/useSkillGenerator.js`

**Function Signature**:
```javascript
generate(
  skillDescription,      // string: "A CLI image processor"
  language,              // string: "python" | "nodejs" | "go" | "rust" | "java" | "cpp"
  provider,              // string: "anthropic" | "gemini" | "openrouter"
  model,                 // string: specific model name
  apiKey                 // string: API key
) → Promise<boolean>
```

**State**:
```javascript
const [skill, setSkill] = useState(null);      // Generated module object
const [loading, setLoading] = useState(false); // Generation in progress
const [error, setError] = useState(null);      // Error object
```

**Return Value**:
```javascript
{
  skill,       // Module object with all generated files
  loading,     // boolean
  error,       // Error object or null
  generate,    // Function to call for generation
  reset        // Function to clear state
}
```

**API Response Parsing**:
```javascript
// Input JSON from API
{
  "name": "module-name",
  "language": "python",
  "main_file": "main.py",
  "main_code": "...",
  "dependency_file": "requirements.txt",
  "dependency_content": "...",
  "readme": "...",
  "example_file": "example.py",
  "example_code": "...",
  "test_file": "test.py",
  "test_code": "...",
  "metadata": { ... }
}

// Output to SkillPreview
{
  ...above,
  language: "python"  // Added by hook
}
```

### Data & Configuration

#### skillGeneration.js
**Location**: `src/data/skillGeneration.js`

**Exports**:
```javascript
export const SYSTEM_PROMPTS = {
  anthropic: { python, nodejs, go, rust, java, cpp },
  gemini: { python, nodejs, go, rust, java, cpp },
  openrouter: { python, nodejs, go, rust, java, cpp }
};

export const LANGUAGE_TEMPLATES = {
  python: { ext: 'py', depFile: 'requirements.txt', ... },
  // ... other languages
};
```

**System Prompt Structure**:
```
BASE_SYSTEM_PROMPT (common requirements)
  ↓
LANGUAGE_SPECIFIC[language]
  ├─ Extends BASE
  ├─ Add language version (Python 3.8+, Go 1.21+, etc.)
  ├─ Add conventions (PEP 8, ESLint, rustfmt, etc.)
  ├─ Add best practices (type hints, error handling, etc.)
  └─ Specify output format (main_code, readme, etc.)
```

**Each prompt requires JSON output with**:
- `name`: kebab-case module name
- `description`: one-line description
- `language`: selected language
- `main_file`: source filename
- `main_code`: complete source code
- `dependency_file`: dependency filename
- `dependency_content`: full dependencies
- `readme`: comprehensive markdown docs
- `example_file`: example filename
- `example_code`: working example
- `test_file`: test filename (optional)
- `test_code`: unit tests (optional)
- `metadata`: tags, version, author

### Utilities

#### skillDownloader.js
**Location**: `src/utils/skillDownloader.js`

**Functions**:

```javascript
downloadMd(skill) {
  // Download only README.md
  // Filename: README.md
  // Type: text/markdown
}

downloadZip(skill) {
  // Download complete archive
  // Calls: downloadAsArchiveText()
  // Filename: {module-name}-module.txt
  // Type: text/plain
}

downloadAsArchiveText(skill) {
  // Internal: Creates text archive
  // Content: All files with markdown code blocks
  // Format: Clear headers for each file
}

sanitizeFileName(name) {
  // Convert to kebab-case
  // Remove special characters
  // Limit to 64 chars
}
```

**Archive Format**:
```
# module-name - Complete Module

Language: python

---

## main.py

```python
[source code here]
```

## requirements.txt

```
[dependencies here]
```

## README.md

[documentation here]

## example.py

```python
[example code here]
```

## test.py

```python
[tests here]
```
```

## API Integration

### Anthropic
**Endpoint**: `https://api.anthropic.com/v1/messages`

**Headers**:
```javascript
{
  'Content-Type': 'application/json',
  'anthropic-version': '2023-06-01',
  'x-api-key': apiKey,
  'anthropic-dangerous-direct-browser-access': 'true'
}
```

**Body**:
```javascript
{
  model: 'claude-3-5-sonnet-20241022',  // or specified model
  max_tokens: 4000,
  system: systemPrompt,
  messages: [{ role: 'user', content: userMessage }]
}
```

### Google Gemini
**Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`

**Body**:
```javascript
{
  systemInstruction: {
    parts: [{ text: systemPrompt }]
  },
  contents: [{
    parts: [{ text: userMessage }]
  }]
}
```

### OpenRouter
**Endpoint**: `https://openrouter.ai/api/v1/chat/completions`

**Headers**:
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`
}
```

**Body**:
```javascript
{
  model: usedModel,
  max_tokens: 4000,
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ]
}
```

## System Prompts Explained

### Common Base
All languages start with a base prompt requiring:
- Production-ready code (no placeholders)
- Self-contained (minimal external dependencies)
- Proper error handling
- Best practices adherence
- Clear documentation

### Python-Specific
- Python 3.8+, PEP 8 conventions
- Type hints throughout
- Standard library preference
- argparse for CLI
- Pydantic for data structures
- Google-format docstrings

### Node.js/TypeScript-Specific
- TypeScript with strict mode
- Node.js 18+
- ESLint + Prettier conventions
- async/await throughout
- Custom error classes
- npm scripts (build, test, lint)

### Go-Specific
- Go 1.21+
- Idiomatic Go conventions
- go.mod dependency management
- Proper error handling
- Concurrency patterns
- _test.go for tests

### Rust-Specific
- Rust 2021 edition
- Rustfmt and Clippy compliance
- Memory safety patterns
- RAII principles
- Cargo.toml configuration
- stdlib-first approach

### Java-Specific
- Java 17+ features
- Google Java Style Guide
- Maven (pom.xml)
- JavaDoc comments
- Modern features (records, sealed classes)
- JUnit 5 tests

### C++-Specific
- C++17 standard
- Google C++ Style Guide
- CMakeLists.txt for build
- RAII and smart pointers
- STL library usage
- Comprehensive comments

## Error Handling

### User Input Errors
```javascript
if (!skillDescription.trim()) return;  // Validate input
if (!language) return;                 // Validate language
if (!apiKey) {
  // Show: "No API key configured"
}
```

### API Errors
```javascript
if (data.error) {
  setError(makeError(
    'Human-readable message',
    `Details: ${error.message}`
  ));
}
```

### Parsing Errors
```javascript
const parsed = parseSkillOutput(text);
if (!parsed || !parsed.name || !parsed.main_code) {
  setError(makeError(
    'Failed to parse output',
    `Response: ${text.substring(0, 500)}...`
  ));
}
```

## State Management

### Global
- Language selection (SkillsView)
- User input (SkillsView)
- Generated skill (useSkillGenerator)
- Loading state (useSkillGenerator)
- Error state (useSkillGenerator)

### Local
- Expanded sections (SkillPreview)
- Copy feedback (SkillsView)

### No Redux/Zustand
- Simple state sufficient for feature
- Props pass data down
- Callbacks bubble events up

## Performance Considerations

### Generation Time
- API calls: 10-30 seconds
- User message: ~500 tokens
- Response: ~3500 tokens
- Total: Dominated by API latency

### UI Responsiveness
- SkillPreview: Lazy expandable sections
- Code syntax highlighting: Client-side
- Download: JavaScript blob creation
- No real-time updates needed

### Bundle Impact
- No new dependencies
- Component-based structure
- Lazy loading via AnimatePresence

## Testing Guide

### Test Language: Python
```
Select: Python 🐍
Input: "A CLI tool for batch image processing"
Expected:
  ✓ main.py with PIL import and Image class
  ✓ requirements.txt with Pillow
  ✓ argparse CLI with width/height/quality options
  ✓ comprehensive README
  ✓ example.py showing usage
  ✓ test.py with unittest
```

### Test Language: TypeScript
```
Select: Node.js/TypeScript ⚙️
Input: "A REST API client with retry logic"
Expected:
  ✓ index.ts with async/await
  ✓ package.json with npm scripts
  ✓ TypeScript strict mode
  ✓ Custom error classes
  ✓ example.ts with real usage
  ✓ test.ts with Jest
```

### Verify All Files Present
```
[✓] README.md
[✓] main_file code
[✓] dependency_file
[✓] example_file
[✓] test_file (optional)
```

## Common Modifications

### Add New Language
1. Add to LANGUAGES array in SkillsView.jsx
2. Create language-specific prompt in skillGeneration.js
3. Add emoji to preview component
4. Test generation and preview

### Change System Prompt
1. Edit appropriate prompt in skillGeneration.js
2. Be specific about:
   - Version requirements
   - Naming conventions
   - Library preferences
   - Error handling style
   - Documentation format

### Customize Output Fields
1. Update JSON schema in system prompt
2. Update parseSkillOutput() in hook
3. Update SkillPreview to display new fields
4. Update skillDownloader for archive

### Modify UI Layout
1. Edit SkillsView.jsx for language selector layout
2. Edit SkillPreview.jsx for preview sections
3. Adjust Tailwind classes as needed
4. Test responsive design

## Debugging Tips

### Console Logging
```javascript
console.log('Language:', language);           // Track selection
console.log('User message:', userMessage);    // Check prompt
console.log('API response:', data);           // Raw response
console.log('Parsed:', parsed);               // Parsed JSON
```

### Browser DevTools
```
F12 → Network Tab
- Monitor API requests
- Check headers and body
- Verify response content

F12 → Console Tab
- Check for errors
- View parsed data
- Trace execution

F12 → Application Tab
- Check localStorage (API keys)
- Verify state changes
```

### API Response Debug
Add to parseSkillOutput():
```javascript
console.log('Response text:', text.substring(0, 1000));
console.log('JSON match:', jsonMatch?.[1]);
```

---

**Last Updated**: 2026-03-20
**Version**: 2.0.0
**Status**: Production Ready
