# Skills Generator v2 - Language-Specific Self-Contained Modules

## Overview

The Skills Generator has been completely rebuilt to generate **production-ready, self-contained code modules** in multiple programming languages. Instead of creating OpenClaw skills, it now creates complete, working modules that users can immediately use, modify, and integrate.

## Features

### 1. Language Selection (6 Languages)
Users select their preferred language **before** describing their module:
- **Python** 🐍 - Best for: Data processing, scripting, automation
- **Node.js/TypeScript** ⚙️ - Best for: Web services, async operations, cross-platform
- **Go** 🐹 - Best for: Performance-critical, concurrent systems
- **Rust** 🦀 - Best for: Memory-safe, high-performance systems
- **Java** ☕ - Best for: Enterprise applications, JVM ecosystems
- **C++** ➕ - Best for: System-level, performance-critical operations

### 2. Generation Process

```
User selects Language
       ↓
User describes module intent
       ↓
AI generates language-specific code
       ↓
Preview shows:
  - README.md (usage, installation, examples)
  - Main source code
  - Dependency file (package.json, requirements.txt, go.mod, etc.)
  - Example usage
  - Optional: Unit tests
       ↓
Download as .txt archive (all files included)
```

### 3. Output Structure

Each generated module contains:

```
module-name-module.txt (archive containing):
├── main.py / index.ts / main.go / main.rs / Main.java / main.cpp
├── requirements.txt / package.json / go.mod / Cargo.toml / pom.xml / CMakeLists.txt
├── README.md
├── example.py / example.ts / example.go / etc.
└── test.py / test.ts / test.go / etc. (optional)
```

## Implementation Details

### Updated Files

#### 1. **SkillsView.jsx**
- Added `LANGUAGES` array with 6 language options
- Added language selector dropdown with emoji badges
- Updated header and placeholder text for module generation
- Language selection passed to generate function

#### 2. **useSkillGenerator.js**
- Added `language` parameter to `generate()` function
- Signature: `generate(skillDescription, language, provider, model, apiKey)`
- Dynamically selects language-specific system prompt
- Updated user message to include language context
- Updated JSON parsing to expect new output structure:
  - `main_file`, `main_code` instead of `skillmd`
  - `dependency_file`, `dependency_content`
  - `readme`, `example_file`, `example_code`
  - `test_file`, `test_code` (optional)

#### 3. **skillGeneration.js** (data/skillGeneration.js)
Language-specific system prompts for each language:

**Python Prompt**:
- Python 3.8+, PEP 8 conventions
- Type hints, argparse for CLI
- Pydantic for data structures
- Standard library preference
- Google-style docstrings

**Node.js/TypeScript Prompt**:
- TypeScript with strict mode
- Node.js 18+, ESLint + Prettier
- async/await throughout
- Custom error classes
- npm scripts (build, test, lint)

**Go Prompt**:
- Go 1.21+, idiomatic conventions
- go.mod dependency management
- Proper error handling with custom types
- Comprehensive examples with main()
- Unit tests in _test.go

**Rust Prompt**:
- Rust 2021 edition
- Rustfmt + Clippy conventions
- Minimal dependencies (std library first)
- Result/Option error handling
- cargo doc compatible documentation

**Java Prompt**:
- Java 17+, Google Style Guide
- Maven for dependency management
- Comprehensive JavaDoc
- Modern Java features
- JUnit 5 tests

**C++ Prompt**:
- C++17+, Google C++ Style Guide
- CMakeLists.txt for building
- RAII principles
- Standard library (STL) preference
- Comprehensive comments

#### 4. **SkillPreview.jsx**
Complete rewrite to preview language-specific modules:
- Shows language emoji badge
- Displays README.md with syntax highlighting
- Shows main source file code
- Shows dependency file (package.json, requirements.txt, etc.)
- Shows example usage
- Shows optional unit tests
- Expandable sections for quick preview

#### 5. **skillDownloader.js**
Updated download logic:
- `downloadMd()` now downloads README.md only
- `downloadZip()` creates a text archive with all files
- Archive format preserves file structure and content
- Clear section headers for each file
- All code wrapped in markdown code blocks

## User Experience Flow

### Step 1: Language Selection
```
┌─────────────────────────────────────────┐
│ 🐍 Python  │ ⚙️ Node.js/TS  │ 🐹 Go   │
│ 🦀 Rust    │ ☕ Java        │ ➕ C++  │
└─────────────────────────────────────────┘
Selected: Python
```

### Step 2: Describe Module
```
┌─────────────────────────────────────────┐
│ "A CLI tool for batch image processing" │
└─────────────────────────────────────────┘
```

### Step 3: Preview & Download
```
Module: batch-image-processor
Language: 🐍 Python
Files: main.py | requirements.txt | README.md

[Expandable Sections]
├─ README.md (usage, installation, examples)
├─ main.py (complete source code)
├─ requirements.txt (dependencies)
├─ example.py (working example)
└─ test.py (unit tests)

[Download ZIP] [Download README]
```

## Code Quality Requirements

Each generated module includes:

### 1. **Production-Ready Code**
- ✅ No placeholders or TODOs
- ✅ Proper error handling throughout
- ✅ Comprehensive input validation
- ✅ Clear logging/debug output

### 2. **Self-Contained**
- ✅ Minimal external dependencies
- ✅ Uses language standard library where possible
- ✅ Fully functional with examples
- ✅ Can be run/tested immediately

### 3. **Best Practices**
- ✅ Language-specific conventions (PEP 8, ESLint, rustfmt, etc.)
- ✅ Proper naming and structure
- ✅ Clear comments and docstrings
- ✅ Type hints/annotations

### 4. **Documentation**
- ✅ Comprehensive README.md
- ✅ Installation instructions
- ✅ Usage examples
- ✅ API documentation
- ✅ Inline code comments

### 5. **Testing** (Optional)
- ✅ Unit tests included
- ✅ Example usage file
- ✅ Test runner configured

## Example: Python Image Processing Module

**User Input:**
```
Language: Python
Description: "A CLI tool for batch image processing with resize, crop, and filter operations"
```

**Generated Files:**

`main.py`:
```python
#!/usr/bin/env python3
"""Image batch processor module."""

import argparse
import logging
from pathlib import Path
from typing import List
from PIL import Image

class ImageProcessor:
    """Handles batch image processing operations."""
    
    def __init__(self, quality: int = 85):
        """Initialize processor with quality setting."""
        self.quality = quality
        self.logger = self._setup_logging()
    
    def _setup_logging(self) -> logging.Logger:
        """Configure logging."""
        logger = logging.getLogger(__name__)
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger
    
    def resize_batch(self, input_dir: Path, output_dir: Path, width: int, height: int):
        """Resize all images in a directory."""
        output_dir.mkdir(parents=True, exist_ok=True)
        
        for image_path in input_dir.glob('*.png'):
            try:
                img = Image.open(image_path)
                img_resized = img.resize((width, height), Image.Resampling.LANCZOS)
                output_path = output_dir / image_path.name
                img_resized.save(output_path, quality=self.quality)
                self.logger.info(f"Processed: {image_path.name}")
            except Exception as e:
                self.logger.error(f"Error processing {image_path}: {e}")

def main():
    """CLI entry point."""
    parser = argparse.ArgumentParser(description='Batch image processor')
    parser.add_argument('input', help='Input directory')
    parser.add_argument('output', help='Output directory')
    parser.add_argument('--width', type=int, default=800, help='Output width')
    parser.add_argument('--height', type=int, default=600, help='Output height')
    parser.add_argument('--quality', type=int, default=85, help='JPEG quality')
    
    args = parser.parse_args()
    
    processor = ImageProcessor(quality=args.quality)
    processor.resize_batch(Path(args.input), Path(args.output), args.width, args.height)

if __name__ == '__main__':
    main()
```

`requirements.txt`:
```
Pillow==10.1.0
```

`README.md`:
```markdown
# Batch Image Processor

CLI tool for batch image processing with resize, crop, and filter operations.

## Installation

```bash
pip install -r requirements.txt
python main.py --help
```

## Usage

### Resize all images in a directory:
```bash
python main.py ./input ./output --width 800 --height 600
```

### With custom quality:
```bash
python main.py ./input ./output --quality 90
```

## API

### ImageProcessor

**Constructor:**
- `quality` (int, default=85): JPEG output quality

**Methods:**
- `resize_batch(input_dir, output_dir, width, height)`: Resize all images

## Examples

See `example.py` for complete working examples.
```

`example.py`:
```python
#!/usr/bin/env python3
"""Example usage of ImageProcessor."""

from pathlib import Path
from main import ImageProcessor

# Initialize processor
processor = ImageProcessor(quality=90)

# Create test directories
input_dir = Path('./test_images')
output_dir = Path('./test_output')

# Resize images
processor.resize_batch(input_dir, output_dir, 1024, 768)
```

`test.py`:
```python
#!/usr/bin/env python3
"""Unit tests for ImageProcessor."""

import unittest
import tempfile
from pathlib import Path
from PIL import Image
from main import ImageProcessor

class TestImageProcessor(unittest.TestCase):
    """Test ImageProcessor class."""
    
    def setUp(self):
        """Create test fixtures."""
        self.temp_dir = tempfile.TemporaryDirectory()
        self.processor = ImageProcessor(quality=85)
    
    def tearDown(self):
        """Clean up."""
        self.temp_dir.cleanup()
    
    def test_initialization(self):
        """Test processor initialization."""
        self.assertEqual(self.processor.quality, 85)
    
    def test_resize_batch(self):
        """Test batch resizing."""
        input_dir = Path(self.temp_dir.name) / 'input'
        output_dir = Path(self.temp_dir.name) / 'output'
        input_dir.mkdir()
        
        # Create test image
        img = Image.new('RGB', (200, 200), color='red')
        img.save(input_dir / 'test.png')
        
        # Process
        self.processor.resize_batch(input_dir, output_dir, 100, 100)
        
        # Verify
        self.assertTrue((output_dir / 'test.png').exists())

if __name__ == '__main__':
    unittest.main()
```

## Testing the Implementation

### Test Case 1: Python Module Generation
1. Select **Python** language
2. Enter: "A CLI tool for batch image processing"
3. Verify:
   - ✅ Preview shows Python code
   - ✅ README.md explains usage
   - ✅ main.py has error handling and logging
   - ✅ requirements.txt lists dependencies
   - ✅ example.py shows working code
   - ✅ test.py contains unit tests
   - ✅ Download creates module archive

### Test Case 2: Node.js/TypeScript Module
1. Select **Node.js/TypeScript**
2. Enter: "A data validation library"
3. Verify:
   - ✅ Code uses TypeScript with strict mode
   - ✅ package.json includes npm scripts
   - ✅ README shows installation and usage
   - ✅ Example uses async/await

### Test Case 3: Go Module
1. Select **Go**
2. Enter: "A concurrent task queue processor"
3. Verify:
   - ✅ Code uses goroutines and channels
   - ✅ go.mod has minimal dependencies
   - ✅ Example shows main() function
   - ✅ Tests use _test.go naming

## Benefits Over Previous Version

| Aspect | Previous | New |
|--------|----------|-----|
| **Output** | OpenClaw skill SKILL.md | Complete working modules |
| **Languages** | Generic | 6 specific languages |
| **Dependencies** | OpenClaw-specific | Minimal, language-native |
| **Usability** | Requires OpenClaw setup | Copy/paste ready |
| **Testing** | Not included | Unit tests included |
| **Examples** | Generic | Working, language-specific |

## Future Enhancements

1. **Real .zip downloads** - Use JSZip library for actual .zip files
2. **CI/CD templates** - GitHub Actions, GitLab CI configs
3. **Docker support** - Dockerfiles for containerization
4. **Cloud deployment** - AWS Lambda, Google Cloud Functions
5. **More languages** - Ruby, PHP, Swift, Kotlin, etc.
6. **Template library** - Pre-built module templates
7. **Version management** - Semantic versioning guidance
8. **Publishing guides** - PyPI, npm, crates.io publishing steps

## API Reference

### System Prompts

Located in `src/data/skillGeneration.js`:
- `SYSTEM_PROMPTS.anthropic[language]`
- `SYSTEM_PROMPTS.gemini[language]`
- `SYSTEM_PROMPTS.openrouter[language]`

Each prompt includes language-specific best practices and requirements.

### JSON Output Schema

```json
{
  "name": "module-name",
  "description": "One-line description",
  "language": "python|nodejs|go|rust|java|cpp",
  "main_file": "main.py",
  "main_code": "Complete source code...",
  "dependency_file": "requirements.txt",
  "dependency_content": "pillow==10.1.0\n...",
  "readme": "# Module\n\n...",
  "example_file": "example.py",
  "example_code": "#!/usr/bin/env python3\n...",
  "test_file": "test.py",
  "test_code": "import unittest\n...",
  "metadata": {
    "tags": ["cli", "image-processing"],
    "version": "1.0.0",
    "author": "Generated by Skills Generator"
  }
}
```

## Troubleshooting

### Empty Preview
- Ensure API key is configured
- Check browser console for parsing errors
- Verify JSON response from API

### Large Module Truncated
- API may have token limits (4000 max_tokens set)
- For very complex modules, break into smaller pieces
- Try with a simpler description

### Wrong Language Generated
- Verify language is selected before clicking Generate
- Check that system prompt is being used
- Try again with clearer language specification

## Notes for Developers

- System prompts are language-specific and stored in `LANGUAGE_SPECIFIC` object
- Each language has its own template with conventions and best practices
- The JSON output schema is consistent across all languages
- Preview component dynamically handles all file types
- Download creates plain text archive for maximum compatibility

---

**Version:** 2.0.0
**Date:** 2026-03-20
**Status:** Ready for production testing
