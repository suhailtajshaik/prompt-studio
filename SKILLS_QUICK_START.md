# Skills Generator - Quick Start Guide

## 🚀 What's New?

The **Skills** tab has replaced the **Agents** tab. You can now generate complete OpenClaw Agent Skills directly from Prompt Studio.

## 📍 How to Access

1. Open Prompt Studio
2. Click the **Skills** tab (icon: magic wand ✨)
3. You're ready to create!

## 🎯 How to Use

### Step 1: Describe Your Skill
In the textarea, describe what skill you want to create:

```
Example: "A skill to manage Kubernetes deployments with kubectl commands, 
status checks, scaling, and logging"
```

### Step 2: Generate
1. Make sure you have an API key configured (provider settings)
2. Click **"Generate Skill"** button
3. Wait for processing (typically 5-15 seconds)

### Step 3: Preview
The system shows:
- **Skill Name & Description**
- **Tags** (auto-generated topics)
- **Dependencies** (what the skill needs)
- **SKILL.md** (the full skill definition, expandable)
- **scripts/** (any helper scripts, expandable)
- **references/** (documentation links, if any)

### Step 4: Download
Choose your format:
- **ZIP** - Full skill directory structure (ready to use)
- **MD** - Just the SKILL.md file

## 📋 What Gets Generated

A complete skill includes:

```
my-skill/
├── SKILL.md              ← Full skill definition
├── scripts/              ← Optional utilities
│   ├── setup.sh
│   └── helper.js
└── references/           ← Optional docs
    ├── README.md
    └── EXAMPLES.md
```

### SKILL.md Structure

```markdown
# Skill Name

Author, description, requirements...

## Usage

`openclaw myskill --option value`

## Instructions

Step-by-step instructions for the skill

## Examples

Real-world usage examples

## Scripts

Description of any scripts provided
```

## 🎨 UI Features

### Loading States
- Spinner animation while generating
- "Generating skill..." status message

### Error Handling
- Clear error messages if something fails
- Option to try again
- Details view for debugging

### Animations
- Smooth fade-ins for preview
- Expandable/collapsible sections
- Success feedback on download

## ⚡ Tips & Tricks

### Better Skill Descriptions
❌ Bad: "Make a skill"
✅ Good: "A skill for automated backup of PostgreSQL databases to S3, with scheduling and recovery options"

### Features to Include
- What problem does it solve?
- What are the main actions/commands?
- What tools or APIs does it use?
- Any prerequisites or setup?

### Testing Generated Skills
1. Download the ZIP file
2. Extract to `~/.openclaw/workspace/skills/`
3. Run `openclaw myskill --help`
4. Try a command: `openclaw myskill do-something`

## 🔧 API Configuration

The Skills tab uses the same API configuration as Build tab:

1. Go to **Settings**
2. Choose provider (Anthropic, Gemini, OpenRouter)
3. Add API key
4. Return to Skills tab and generate!

## 📚 What's the Skill For?

OpenClaw Skills are reusable tools/utilities that:
- ✅ Extend OpenClaw with new capabilities
- ✅ Automate repeated tasks
- ✅ Integrate with external services
- ✅ Add custom CLI commands
- ✅ Are shareable with the community

## 💡 Example Use Cases

### 1. DevOps Skill
```
Create a skill for managing Docker containers:
- List running containers
- Deploy from images
- View logs
- Scale services
```

### 2. Data Processing Skill
```
Create a skill for batch processing files:
- Convert formats
- Extract metadata
- Generate reports
```

### 3. Integration Skill
```
Create a skill to sync data:
- Fetch from API
- Transform
- Push to another system
```

## 🐛 Troubleshooting

### "API key not found"
- Go to Settings
- Add API key for your provider
- Return to Skills tab

### "Failed to parse skill output"
- The LLM may have returned malformed JSON
- Try a clearer description
- Try again with more specific details

### Download not working?
- Check browser permissions for downloads
- Try a different format (.md instead of .zip)
- Check browser console for errors

### Skill looks incomplete?
- The LLM might need more context
- Add specific requirements to your description
- Include framework/tech stack preferences

## 🎓 Learn More

- AgentSkills Spec: Check OpenClaw docs
- Community Skills: Explore existing skills in the ecosystem
- Best Practices: See SKILLS_IMPLEMENTATION.md for technical details

## 🚀 Next Steps

1. **Try generating a skill** with your use case
2. **Download** the generated files
3. **Review** the SKILL.md structure
4. **Test** the skill in OpenClaw
5. **Share** with the community if helpful!

---

**Questions?** Check SKILLS_IMPLEMENTATION.md for technical details
