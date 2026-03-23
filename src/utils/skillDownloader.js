/**
 * Utility functions for downloading modules as .zip files or individual files
 */

/**
 * Download README.md file
 */
export async function downloadMd(skill) {
  if (!skill || !skill.readme) return;

  const content = skill.readme;
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'README.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download complete module as structured text archive
 * Includes all source files, dependencies, README, and examples
 */
export async function downloadZip(skill) {
  if (!skill || !skill.main_code) return;

  downloadAsArchiveText(skill);
}

/**
 * Download module as a structured text file with all components
 */
function downloadAsArchiveText(skill) {
  const { name, main_file, main_code, dependency_file, dependency_content, readme, example_file, example_code, test_file, test_code } = skill;
  
  let content = `# ${sanitizeFileName(name)} - Complete Module\n\n`;
  content += `Language: ${skill.language || 'Unknown'}\n\n`;
  content += `---\n\n`;
  
  // Main source file
  content += `## ${main_file || 'main.py'}\n\n\`\`\`\n${main_code || ''}\n\`\`\`\n\n`;
  
  // Dependency file
  if (dependency_file && dependency_content) {
    content += `## ${dependency_file}\n\n\`\`\`\n${dependency_content}\n\`\`\`\n\n`;
  }
  
  // README
  if (readme) {
    content += `## README.md\n\n${readme}\n\n`;
  }
  
  // Example file
  if (example_file && example_code) {
    content += `## ${example_file} (Example Usage)\n\n\`\`\`\n${example_code}\n\`\`\`\n\n`;
  }
  
  // Test file
  if (test_file && test_code) {
    content += `## ${test_file} (Tests)\n\n\`\`\`\n${test_code}\n\`\`\`\n\n`;
  }
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFileName(name)}-module.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Sanitize filename for safe file system usage
 */
function sanitizeFileName(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 64);
}
