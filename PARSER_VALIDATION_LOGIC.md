# Parser Validation Logic - Technical Reference

## New Validation Flow

### 1. Parser Function (`parseSkillOutput`)

```javascript
// Old: Only checked for name and main_code
if (!parsed.name) return null;
if (!parsed.main_code) return null;

// New: Validates all required fields
const validation = validateSkillJSON(parsed, REQUIRED_FIELDS);
if (!validation.valid) {
  console.error('Missing required fields:', validation.missing);
  return null;
}
```

### 2. Validation Function (`validateSkillJSON`)

```javascript
function validateSkillJSON(obj, requiredFields) {
  const validation = {
    valid: true,
    missing: [],      // Fields that don't exist at all
    invalid: [],      // Fields that exist but are empty/falsy
    present: []       // Fields that are present and valid
  };

  for (const field of requiredFields) {
    if (!(field in obj)) {
      // Field missing entirely
      validation.missing.push(field);
      validation.valid = false;
    } else if (!obj[field]) {
      // Field exists but is empty/null/undefined/false
      validation.invalid.push({ field, value: obj[field] });
      validation.valid = false;
    } else {
      // Field is present and non-empty
      validation.present.push(field);
    }
  }

  return validation;
}
```

### 3. Required Fields

```javascript
const REQUIRED_FIELDS = [
  'name',
  'description',
  'language',
  'main_file',
  'main_code',
  'dependency_file',
  'dependency_content',
  'readme',
  'example_file',
  'example_code',
  'metadata'
];
```

**Note:** `test_file` and `test_code` are optional

## Error Handling Flow

### Before (Old)
```
LLM Response
  ↓
parseSkillOutput()
  ↓
Check: parsed.name && parsed.main_code?
  ├─ Yes → Return parsed ✅
  └─ No → Generic error "missing required fields" ❌
```

### After (New)
```
LLM Response
  ↓
parseSkillOutput()
  ↓
Extract JSON with first { and last }
  ↓
Parse JSON
  ↓
validateSkillJSON(parsed, REQUIRED_FIELDS)
  ├─ Valid? → Check all 11 fields present and non-empty
  │           ├─ Yes → Return parsed ✅
  │           └─ No → Log which fields missing, return null ❌
  │
  └─ Catch error → Log parse error with response preview ❌
  
When null returned → Show detailed error with:
  - List of expected fields
  - Debug info (response length, has JSON braces, etc)
  - Instruction to check console logs
```

## Console Logging

### Success Case
```
[PARSER] Starting parse, text length: 4523
[PARSER] Extracted JSON substring, length: 4456
[PARSER] ✅ JSON parsed successfully
[PARSER] ✅ All required fields present, skill: email-validator
```

### Missing Fields Case
```
[PARSER] ❌ Missing required fields: ['test_file']
[PARSER] Validation report: {
  "valid": false,
  "missing": ["test_file"],
  "invalid": [],
  "present": [
    "name", "description", "language", "main_file", 
    "main_code", "dependency_file", "dependency_content",
    "readme", "example_file", "example_code", "metadata"
  ]
}
```

### Parse Error Case
```
[PARSER] ❌ Failed to parse JSON: Unexpected token...
[PARSER] Response preview (first 500 chars): ...
[PARSER] Response preview (last 500 chars): ...
```

### Markdown Block Edge Case
```
[PARSER] Found JSON in markdown code block (attempting parse)
[PARSER] ⚠️ Markdown JSON missing fields: ['metadata']
// Falls through to try direct JSON extraction
```

## System Prompt Validation Rules

The BASE_SYSTEM_PROMPT now includes a VALIDATION CHECKLIST that tells the LLM to verify:

```
[check] Response starts with { and ends with }
[check] No markdown code blocks, no backticks
[check] All field names are exactly as specified above
[check] All required fields are present and non-empty
[check] main_code contains complete, production-ready implementation
[check] dependency_content is the exact format for that language
[check] readme includes installation, usage, and examples
[check] example_code is a working, runnable example
[check] metadata.version is a semantic version string
[check] No explanatory text before or after the JSON object
```

## Provider-Specific Error Messages

All three providers (Anthropic, Gemini, OpenRouter) now show:

```
⚠️ Failed to parse skill generation output. 
The response was malformed or missing required JSON fields.

Debug info:
{
  "responseLength": 2341,
  "firstChars": "Here is your skill: { name: ...",
  "hasJsonBraces": true,
  "parsed": "failed to parse JSON"
}

📋 Expected fields: 
name, description, language, main_file, main_code, 
dependency_file, dependency_content, readme, 
example_file, example_code, metadata

🔍 Check browser console for detailed parser logs 
showing which fields are missing.
```

## Expected vs Actual Response Example

### What LLM Should Output (Python module)
```json
{
  "name": "email-validator",
  "description": "Validates email addresses with RFC compliance",
  "language": "python",
  "main_file": "email_validator.py",
  "main_code": "import re\n\nclass EmailValidator:\n    def validate(self, email: str) -> bool:\n        pattern = r'^[^@]+@[^@]+\\.[^@]+$'\n        return bool(re.match(pattern, email))",
  "dependency_file": "requirements.txt",
  "dependency_content": "",
  "readme": "# Email Validator\n\nValidates email addresses...",
  "example_file": "example.py",
  "example_code": "from email_validator import EmailValidator\n\nvalidator = EmailValidator()\nprint(validator.validate('user@example.com'))",
  "test_file": "test_email_validator.py",
  "test_code": "import unittest\nfrom email_validator import EmailValidator\n\nclass TestValidator(unittest.TestCase):\n    def test_valid(self):\n        v = EmailValidator()\n        self.assertTrue(v.validate('user@example.com'))",
  "metadata": {
    "tags": ["email", "validation"],
    "version": "1.0.0",
    "author": "Generated by Skills Generator"
  }
}
```

### What Should NOT Happen (Old Error)
```
```json
{
  "name": "email-validator",
  "main_code": "..."
  // ❌ Missing other 9 required fields!
}
```

The parser will now catch this and report:
```
❌ Missing required fields: ['description', 'language', 'main_file', 'dependency_file', 'dependency_content', 'readme', 'example_file', 'example_code', 'metadata']
```

## Testing Checklist

- [ ] Test with Python skill generation
- [ ] Test with Node.js skill generation
- [ ] Test with Go skill generation
- [ ] Test with Rust skill generation
- [ ] Test with Java skill generation
- [ ] Test with C++ skill generation
- [ ] Verify console logs show validation details
- [ ] Verify error message shows expected fields when generation fails
- [ ] Verify successful generation doesn't show error banner
- [ ] Test with different providers (Anthropic, Gemini, OpenRouter if available)

## Migration Notes

No data migrations needed. The changes are purely in:
1. Frontend validation logic
2. System prompts to LLM
3. Error message formatting

All existing functionality remains unchanged.
