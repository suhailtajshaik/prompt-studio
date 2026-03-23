# Skills Generator - Debug Reference

Quick reference for debugging Skills Generator issues.

## Quick Troubleshooting

### Issue: "Failed to parse module generation output"

**Step 1: Check Browser Console**
```
F12 → Console tab → Look for [PARSER] logs
```

**Step 2: Understand the Logs**
```
[PARSER DEBUG] Raw response length: 2847
  → Response was received and is 2847 characters

[PARSER] Found JSON in markdown code block
  → Parser detected and extracted JSON from ```json...``` block
  
[PARSER] Extracted JSON string, length: 2800
  → Parser found { to } in response

[PARSER] Successfully parsed JSON object directly
  → JSON is syntactically valid

[PARSER] Missing required fields: {name: undefined, main_code: true}
  → JSON is valid but missing "name" field (required)
```

**Step 3: Action Based on Logs**

| Log Message | Meaning | Action |
|---|---|---|
| `No JSON object found` | Response has no `{}` | Check API response format |
| `Failed to parse JSON: SyntaxError` | JSON is malformed | Check for unescaped quotes |
| `Missing required fields` | Missing `name` or `main_code` | Check system prompt |
| `Raw response length: 0` | API returned nothing | Check API key and network |

### Issue: Module Won't Display After Generation

1. Check console for `[PARSER]` logs
2. Verify all required fields in JSON:
   - `name` (string, kebab-case)
   - `main_code` (string, non-empty)
   - `description` (string)
   - `language` (python, nodejs, go, rust, java, cpp)
   - `main_file` (string, e.g., main.py)
   - `dependency_file` (string, e.g., requirements.txt)
   - `dependency_content` (string)
   - `readme` (string, markdown)
   - `example_file` (string)
   - `example_code` (string)

## System Prompts by Language

Located in: `src/data/skillGeneration.js`

Each language has specific requirements:

### Python
```
- Use Python 3.8+ with type hints
- Follow PEP 8 conventions
- Use standard library where possible
- Include argparse for CLI if applicable
- Use dataclasses or Pydantic for data structures
- Generate requirements.txt with versions
- Include proper logging setup
- Write docstrings in Google format
```

### Node.js/TypeScript
```
- Use TypeScript with strict mode
- Target Node.js 18+
- Follow ESLint + Prettier conventions
- Use async/await throughout
- Include proper error handling with custom error classes
- Generate package.json with all dependencies
- Add npm scripts for development
- Include JSDoc comments
- Use modern ES modules
```

### Go
```
- Use Go 1.21+
- Follow idiomatic Go conventions
- Use go.mod for dependency management
- Include proper error handling with custom error types
- Add logging with standard library or minimal deps
- Generate comprehensive example with main() function
- Use interfaces for extensibility
- Include unit tests in _test.go file
```

### Rust
```
- Use Rust 2021 edition
- Follow Rustfmt and Clippy conventions
- Minimize external dependencies
- Include proper error handling with Result/Option
- Add documentation comments with examples
- Generate Cargo.toml with minimal dependencies
- Include unit tests in lib.rs
- Use cargo doc compatible documentation
```

### Java
```
- Use Java 17+
- Follow Google Java Style Guide
- Use Maven for dependency management (pom.xml)
- Include proper exception handling
- Add comprehensive JavaDoc comments
- Use modern Java features
- Generate example with main() method
- Include unit tests with JUnit 5
```

### C++
```
- Use C++17 or later
- Follow Google C++ Style Guide
- Include proper CMakeLists.txt
- Use RAII principles
- Include comprehensive comments
- Add error handling and validation
- Generate standalone example executable
- Use standard library (STL) wherever possible
```

## Parser Function Logic

Location: `src/hooks/useSkillGenerator.js`

```javascript
function parseSkillOutput(text) {
  // 1. Validate input
  if (!text || typeof text !== 'string') return null
  
  // 2. Try markdown code blocks
  if (text.includes('```json')) {
    extract JSON between ``` markers
  }
  
  // 3. Try direct JSON extraction
  find first { and last }
  extract substring and parse
  
  // 4. Validate required fields
  if (!parsed.name || !parsed.main_code) return null
  
  // 5. Return parsed object
  return parsed
}
```

## Common Issues and Fixes

### Issue: JSON Parse Error
**Symptom:** `[PARSER] Failed to parse JSON: SyntaxError`

**Cause:** JSON has syntax errors (usually unescaped quotes in strings)

**Fix:**
1. Check system prompt - request proper JSON escaping
2. Look at raw response in console
3. If quotes in `main_code`, they should be escaped: `\"`

**Example:**
```javascript
// ❌ Wrong - unescaped quotes
"main_code": "print("hello")"

// ✅ Correct - escaped quotes  
"main_code": "print(\"hello\")"
```

### Issue: Response Too Short
**Symptom:** Module generated but missing fields

**Cause:** API token limit hit before completion

**Fix:**
1. Reduce skill description length
2. Try simpler skill request
3. Increase API max_tokens in `useSkillGenerator.js` (currently 4000)

**Current Limits:**
```javascript
max_tokens: 4000  // Line ~65-67 for each provider
```

### Issue: API Key Not Working
**Symptom:** API error in response

**Cause:** Invalid or expired API key

**Fix:**
1. Check API key in input field
2. Verify key is for correct provider
3. Check API key has required permissions
4. Generate new key if expired

## Provider-Specific Debugging

### Anthropic
```
Error check: data.error
Error format: {type: string, message: string}
Success check: data.content[0].text exists
```

**Common Errors:**
- `invalid_api_key` - Check API key
- `rate_limit_error` - Wait and retry
- `context_length_exceeded` - Reduce description

### Google Gemini
```
Error check: data.error
Error format: {code: number, message: string}
Success check: data.candidates[0].content.parts[0].text exists
```

**Common Errors:**
- `INVALID_ARGUMENT` - Check model name
- `PERMISSION_DENIED` - Check API key permissions
- `RESOURCE_EXHAUSTED` - Rate limited, wait

### OpenRouter
```
Error check: data.error
Error format: {message: string}
Success check: data.choices[0].message.content exists
```

**Common Errors:**
- `Unauthorized` - Check API key
- `Model not found` - Check model name
- `Rate limited` - Wait before retry

## Testing the Fix

Run parser test suite:
```bash
cd /home/r2d2/projects/prompt-studio-dev
node test-parser.js
```

Expected output:
```
✅ Passed: 6/6
Success rate: 100%
```

## Adding Logging

To add more debugging, edit `parseSkillOutput()`:

```javascript
// Add at start of function
console.log('[PARSER DEBUG] Input:', text.substring(0, 100))

// Add in try block
console.log('[PARSER] Attempting extraction at position:', jsonStart)

// Add after parse
console.log('[PARSER] Parsed fields:', Object.keys(parsed))
```

Then check console in browser to see logs.

## Files to Inspect

### When Parser Fails
1. `src/hooks/useSkillGenerator.js` - parseSkillOutput function
2. Check browser console for [PARSER] logs
3. `src/data/skillGeneration.js` - system prompt

### When Module Won't Display
1. `src/components/SkillPreview.jsx` - rendering logic
2. Console for parsing logs
3. Verify all fields exist in parsed object

### When Download Fails
1. `src/utils/skillDownloader.js` - export logic
2. Check if skill object has required fields

## Performance Considerations

- **Parser speed:** <1ms for typical responses
- **Logging overhead:** Negligible (only in browser console)
- **Memory usage:** ~50KB per response
- **Typical response size:** 2-5KB

## Future Debug Features

Potential improvements:
- [ ] Raw response viewer in UI
- [ ] JSON validation with JSON Schema
- [ ] Response formatting tool
- [ ] Automatic retry on failure
- [ ] Provider-specific error documentation

## Contact for Issues

If parser still fails after checking above:
1. Share browser console logs (Ctrl+Shift+J)
2. Include skill description
3. Include provider and model name
4. Include error message
