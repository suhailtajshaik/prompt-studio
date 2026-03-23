/**
 * Test parser function with various API response formats
 * Run: node test-parser.js
 */

// Copy of the improved parseSkillOutput function for testing
function parseSkillOutput(text) {
  if (!text || typeof text !== 'string') {
    console.error('Invalid input: text is not a string', text);
    return null;
  }

  // Log the raw response for debugging
  console.log('[PARSER DEBUG] Raw response length:', text.length);
  console.log('[PARSER DEBUG] First 200 chars:', text.substring(0, 200));

  // Try to extract JSON from markdown code blocks first
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
  if (jsonMatch) {
    try {
      console.log('[PARSER] Found JSON in markdown code block');
      const parsed = JSON.parse(jsonMatch[1]);
      console.log('[PARSER] Successfully parsed JSON from markdown');
      return parsed;
    } catch (e) {
      console.error('[PARSER] Failed to parse JSON from markdown:', e.message);
    }
  }

  // Try to find JSON object directly (most robust approach)
  try {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('[PARSER] No JSON object found in response');
      return null;
    }

    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    console.log('[PARSER] Extracted JSON string, length:', jsonString.length);
    
    const parsed = JSON.parse(jsonString);
    console.log('[PARSER] Successfully parsed JSON object directly');
    
    // Validate required fields
    if (!parsed.name || !parsed.main_code) {
      console.error('[PARSER] Missing required fields:', {
        name: parsed.name,
        main_code: !!parsed.main_code
      });
      return null;
    }
    
    return parsed;
  } catch (e) {
    console.error('[PARSER] Failed to parse JSON:', e.message);
    console.log('[PARSER] Last 200 chars of response:', text.substring(Math.max(0, text.length - 200)));
    return null;
  }
}

// Test cases
const testCases = [
  {
    name: 'Clean JSON with all fields',
    input: JSON.stringify({
      name: 'hello-world',
      description: 'A simple hello world module',
      language: 'python',
      main_file: 'main.py',
      main_code: 'print("Hello, World!")',
      dependency_file: 'requirements.txt',
      dependency_content: '',
      readme: '# Hello World\nA simple hello world module',
      example_file: 'example.py',
      example_code: 'import main',
      metadata: { tags: ['simple'], version: '1.0.0' }
    }),
    shouldPass: true
  },
  {
    name: 'JSON wrapped in markdown code blocks',
    input: '```json\n' + JSON.stringify({
      name: 'test-module',
      description: 'Test module',
      language: 'python',
      main_file: 'main.py',
      main_code: 'print("test")',
      dependency_file: 'requirements.txt',
      dependency_content: 'requests==2.28.0',
      readme: '# Test',
      example_file: 'example.py',
      example_code: 'print("example")',
      metadata: { tags: ['test'], version: '1.0.0' }
    }) + '\n```',
    shouldPass: true
  },
  {
    name: 'JSON with surrounding text',
    input: 'Here is the generated module:\n\n' + JSON.stringify({
      name: 'data-parser',
      description: 'Parse data',
      language: 'python',
      main_file: 'parser.py',
      main_code: 'def parse(x): return x',
      dependency_file: 'requirements.txt',
      dependency_content: 'pandas==1.5.0',
      readme: '# Parser',
      example_file: 'example.py',
      example_code: 'result = parse(data)',
      metadata: { tags: ['parser'], version: '1.0.0' }
    }) + '\n\nThis module parses data structures.',
    shouldPass: true
  },
  {
    name: 'Missing required field (main_code)',
    input: JSON.stringify({
      name: 'incomplete-module',
      description: 'Incomplete module',
      language: 'python',
      main_file: 'main.py',
      dependency_file: 'requirements.txt',
      readme: '# Incomplete'
    }),
    shouldPass: false
  },
  {
    name: 'Missing required field (name)',
    input: JSON.stringify({
      description: 'No name module',
      language: 'python',
      main_file: 'main.py',
      main_code: 'print("hi")',
      dependency_file: 'requirements.txt',
      readme: '# No Name'
    }),
    shouldPass: false
  },
  {
    name: 'Invalid JSON',
    input: '{ "name": "broken-json", "main_code": "print(hello"',
    shouldPass: false
  }
];

// Run tests
console.log('====== PARSER TEST SUITE ======\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  console.log(`\n[TEST ${index + 1}] ${testCase.name}`);
  console.log('─'.repeat(50));
  
  const result = parseSkillOutput(testCase.input);
  const success = testCase.shouldPass ? (result !== null) : (result === null);
  
  if (success) {
    console.log('✅ PASS');
    if (result) {
      console.log(`   Module: ${result.name} (${result.language})`);
    }
    passed++;
  } else {
    console.log('❌ FAIL');
    if (testCase.shouldPass && result === null) {
      console.log('   Expected: Valid parsed object');
      console.log('   Got: null');
    } else if (!testCase.shouldPass && result !== null) {
      console.log('   Expected: null (validation should fail)');
      console.log(`   Got: ${result.name}`);
    }
    failed++;
  }
});

console.log('\n\n====== SUMMARY ======');
console.log(`✅ Passed: ${passed}/${testCases.length}`);
console.log(`❌ Failed: ${failed}/${testCases.length}`);
console.log(`Success rate: ${((passed / testCases.length) * 100).toFixed(0)}%`);
