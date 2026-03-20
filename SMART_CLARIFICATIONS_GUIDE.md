# Smart Clarifications - Context-Aware Intent System

**Status:** ✅ Complete  
**Build:** Verified and passing  
**Approach:** Intelligent, contextual questions only

---

## Overview

Smart Clarifications analyze the user's skill description to understand intent, then ask **only the relevant questions** to clarify ambiguities. No generic options, no unnecessary questions.

### Key Principle
> Ask only what's unclear. Only about this specific skill type.

---

## How It Works

### 1. Intent Detection
When user enters skill description, system analyzes keywords:

```
User: "Create a JSON parser"
       ↓
Keyword matching: ['parse', 'json']
       ↓
Detected intent: data_processing
Confidence: 100% (2/2 keywords match)
```

### 2. Question Generation
Based on detected intent, generate relevant questions (max 4):

```
For data_processing intent, ask about:
- Input format? (CSV, JSON, XML, custom?)
- Data volume? (Small, Medium, Large/streaming?)
- Error handling? (Throw, Log, Configurable?)
```

### 3. Auto Display
Questions appear automatically as user types - no click needed:

```
User types "Create a JSON parser"
       ↓
Questions appear below input
       ↓
User sees 3-4 relevant options
       ↓
User selects answers
       ↓
Answers included in generation prompt
```

---

## Intent Patterns

### 1. Data Processing
**Keywords:** parse, process, transform, convert, extract, filter

**Questions:**
- Input format? (Single, Multiple, Custom)
- Data volume? (Small, Medium, Large/streaming)
- Error handling? (Throw, Log, Both)

**Examples:**
- "Create a JSON parser"
- "Build a CSV processor"
- "Make a log file analyzer"

### 2. API Service
**Keywords:** api, service, endpoint, rest, request, response, http

**Questions:**
- Authentication? (None, Bearer, OAuth2, Configurable)
- Response format? (JSON, Configurable)
- Rate limiting? (Yes, No, Built-in)
- Concurrency? (Sequential, Fixed pool, Unlimited)

**Examples:**
- "Create a REST API"
- "Build an API wrapper"
- "Make a webhook service"

### 3. Database/ORM
**Keywords:** database, db, store, persist, query, orm, schema, model

**Questions:**
- Target DB? (SQL, NoSQL, Both)
- Query complexity? (Simple CRUD, Complex, Both)
- Migrations? (Yes, No)

**Examples:**
- "Build a database abstraction"
- "Create an ORM"
- "Make a query builder"

### 4. CLI Tool
**Keywords:** cli, command, terminal, shell, command-line, console

**Questions:**
- Subcommands? (Single, Few, Many)
- Interactive mode? (No, Prompts, REPL)
- Config files? (No, Yes, Both)

**Examples:**
- "Create a CLI tool"
- "Build a command-line utility"
- "Make a terminal application"

### 5. Validation
**Keywords:** validate, validation, check, verify, schema, sanitize

**Questions:**
- Rule source? (Hardcoded, Configurable, Schema-based)
- Error reporting? (First error, All errors)
- Custom validators? (No, Yes)

**Examples:**
- "Build a validator"
- "Create input validation"
- "Make a schema checker"

### 6. Concurrency
**Keywords:** async, concurrent, parallel, queue, worker, thread, pool

**Questions:**
- Pool size? (Fixed, Dynamic, Configurable)
- Queue behavior? (Wait, Drop, Error)
- Priority support? (No, Yes)

**Examples:**
- "Create an async queue"
- "Build a worker pool"
- "Make a task scheduler"

### 7. Caching
**Keywords:** cache, caching, memoize, store, redis, in-memory

**Questions:**
- Cache backend? (In-memory, Redis, Both)
- Eviction policy? (LRU, LFU, TTL, Configurable)
- Invalidation? (TTL, Manual, Both)

**Examples:**
- "Build a cache layer"
- "Create a memoization library"
- "Make a caching service"

---

## Code Architecture

### `smartClarifications.js`

**Key Functions:**

```javascript
// Detect intent from description
detectIntent(description) 
  → Returns: [{intent, confidence, questions}, ...]
  → Sorted by confidence (highest first)
  → Example: "JSON parser" → [{intent: 'data_processing', confidence: 1.0, ...}]

// Generate relevant questions (max 4)
generateClarifications(description)
  → Returns: [question1, question2, ...]
  → Only questions relevant to top intent(s)
  → Max 4 questions to avoid overwhelming user
  → Example: "JSON parser" → [inputFormat, dataVolume, errorHandling]

// Build context for prompt
buildClarificationContext(answers)
  → Returns: "User Clarifications:\n- inputFormat: JSON\n..."
  → Only includes answered questions
  → Formatted for system prompt inclusion
```

**Question Structure:**

```javascript
{
  id: 'input-format',
  text: 'What input format(s) should it support?',
  hint: 'e.g., CSV, JSON, XML, etc.',  // Optional
  options: [
    {
      id: 'single',
      label: 'Single format',
      desc: 'Only one format needed'  // Optional
    },
    // ... more options
  ]
}
```

### `SmartClarifications.jsx`

**Component Flow:**

```
SmartClarifications (main)
  ├─ useEffect (monitors description)
  │   └─ generateClarifications(description)
  │       └─ setQuestions([...])
  │
  ├─ if loading → Show spinner + "Analyzing..."
  ├─ if no questions → Show info message
  └─ if questions → Show QuestionCard for each
      └─ QuestionCard
          ├─ Question header + hint
          ├─ Show selected answer (if any)
          └─ Show option buttons for selection
```

### `useSmartClarifications.js`

**Hook State:**

```javascript
const {
  answers,           // {questionId: optionId, ...}
  answerQuestion,    // (questionId, optionId) → void
  clearAnswers,      // () → void
  getAnswerText,     // (questionId, questions) → string
  hasAnswers,        // boolean
} = useSmartClarifications();
```

---

## User Experience Flow

### Scenario 1: Clear Description
```
User: "Build a JSON parser"
       ↓
System detects: data_processing
       ↓
System shows 3 questions:
  • Input format? (Single/Multiple/Custom)
  • Data volume? (Small/Medium/Large)
  • Error handling? (Throw/Log/Both)
       ↓
User selects:
  • Input format: Single
  • Data volume: Medium
       ↓
User clicks "Generate"
       ↓
Generated with context:
  "User Clarifications:
   - inputFormat: Single format
   - dataVolume: Medium (100MB - 1GB)"
```

### Scenario 2: Vague Description
```
User: "Create an API service"
       ↓
System detects: api_service
       ↓
System shows 4 questions:
  • Authentication? (None/Bearer/OAuth2/Configurable)
  • Response format? (JSON/Configurable)
  • Rate limiting? (Yes/No/Built-in)
  • Concurrency? (Sequential/Fixed/Unlimited)
       ↓
User selects answers...
       ↓
Generated with full context
```

### Scenario 3: No Clear Intent
```
User: "Build something useful"
       ↓
System can't detect clear intent
       ↓
Shows: "This skill description is clear enough!"
       ↓
User can generate directly
       ↓
Works fine without clarifications
```

---

## Integration with Generator

### Before Generation

```javascript
const handleGenerate = async () => {
  // Get clarification context from answers
  const clarificationContext = buildClarificationContext(answers);
  
  // Pass to generator
  await generate(
    input,
    language,
    provider,
    model,
    apiKey,
    clarificationContext  // ← NEW
  );
};
```

### In System Prompt

```
User Description: "Create a JSON parser"

User Clarifications:
- inputFormat: Single format
- dataVolume: Medium (100MB - 1GB)
- errorHandling: Both (throw or configurable)

Requirements: [... standard requirements ...]
```

---

## Key Features

✅ **Smart Detection**
- Analyzes keywords to understand intent
- Detects multiple intents and ranks by confidence
- Works for 7 common skill types

✅ **Contextual Questions**
- Only asks about relevant ambiguities
- Max 4 questions (never overwhelming)
- Each question has 2-4 specific options

✅ **Auto Display**
- Shows questions automatically as user types
- No extra steps or clicks
- Removes when input is cleared

✅ **Optional**
- Questions are optional
- Users can generate without answering
- Works fine either way

✅ **Responsive**
- Beautiful card UI
- Works on mobile/tablet/desktop
- Smooth animations

---

## Examples by Skill Type

### Data Processing Module
**User Input:** "Create a CSV to JSON converter"
**Detected:** data_processing
**Questions Asked:**
1. Input format(s)? (Single/Multiple/Custom)
2. Data volume? (Small/Medium/Large)
3. Error handling? (Throw/Log/Configurable)

---

### API Service
**User Input:** "Build a REST API for user management"
**Detected:** api_service
**Questions Asked:**
1. Authentication method? (None/Bearer/OAuth2/Configurable)
2. Response format? (JSON/Configurable)
3. Rate limiting? (Yes/No/Built-in)
4. Concurrent requests? (Sequential/Fixed/Unlimited)

---

### CLI Tool
**User Input:** "Make a file organizer CLI"
**Detected:** cli_tool
**Questions Asked:**
1. Number of commands? (Single/Few/Many)
2. Interactive mode? (No/Prompts/REPL)
3. Config file support? (No/Yes/Both)

---

### Validation Library
**User Input:** "Create a data validator"
**Detected:** validation
**Questions Asked:**
1. Where do rules come from? (Hardcoded/Configurable/Schema)
2. Error reporting? (First error/All errors)
3. Custom validators? (No/Yes)

---

## Troubleshooting

### Questions Don't Appear
- Check that user has typed in description
- Verify intent detection is working (check console)
- Ensure component is mounted in SkillsView

### Wrong Questions Shown
- Description is ambiguous - multiple intents detected
- System picks top intent by confidence
- Consider being more specific in description

### No Questions (Even for Clear Description)
- Description might not match any pattern
- Try using keyword that matches (e.g., "parse" for data processing)
- Can still generate without clarifications

### Building/Extending

To add a new intent type:

1. Add to `INTENT_PATTERNS` in `smartClarifications.js`:
```javascript
my_intent: {
  keywords: ['keyword1', 'keyword2'],
  questions: [
    {
      id: 'question1',
      text: 'Your question?',
      options: [...]
    }
  ]
}
```

2. Test with description: "something with keyword1"
3. Questions should auto-appear

---

## Performance Notes

- **Intent Detection:** O(description.length × keywords)
  - For typical descriptions: <5ms
  - Debounced with 300ms timer to avoid excess processing

- **Question Generation:** O(questions.length)
  - Usually 0-4 questions shown
  - Negligible performance impact

- **Total Overhead:** <10ms typical
  - No noticeable lag for user

---

## Future Enhancements

1. **Learning from Usage**
   - Track which questions users answer
   - Improve intent detection based on data

2. **Language-Specific Patterns**
   - Different questions per programming language
   - Language-specific options

3. **Advanced Detection**
   - Use LLM for intent detection instead of keywords
   - Better understand complex descriptions

4. **Follow-up Questions**
   - Ask conditional follow-ups
   - "If data volume is Large, how handle streaming?"

5. **Saved Patterns**
   - Users can save their preferences
   - Reuse for similar projects

---

## Summary

Smart Clarifications provide:

**For Users:**
- ✅ No generic questions
- ✅ Only relevant, specific questions
- ✅ Automatic display, no extra steps
- ✅ Better results through context

**For Development:**
- ✅ Easy to add new intent patterns
- ✅ Clean, maintainable code
- ✅ Well-documented patterns
- ✅ Extensible architecture

**Key Result:**
Better skills generated because system understands context and asks only what matters.
