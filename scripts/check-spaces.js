const fs = require('fs');
const path = require('path');

const NOTE_DIR = path.join(__dirname, '..', 'docs', 'note');

function findSpaces(dir, basePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const issues = [];

  for (const entry of entries) {
    const relativePath = path.join(basePath, entry.name);

    if (entry.name.includes(' ')) {
      issues.push({
        path: relativePath,
        isDir: entry.isDirectory(),
      });
    }

    if (entry.isDirectory()) {
      const childIssues = findSpaces(path.join(dir, entry.name), relativePath);
      issues.push(...childIssues);
    }
  }

  return issues;
}

if (!fs.existsSync(NOTE_DIR)) {
  console.log('note 文件夹不存在');
  process.exit(1);
}

const issues = findSpaces(NOTE_DIR);

if (issues.length === 0) {
  console.log('所有文件和文件夹名称通过检查！');
} else {
  console.log(`发现 ${issues.length} 个包含空格的名称：`);
  for (const issue of issues) {
    const icon = issue.isDir ? '📁' : '📄';
    console.log(`  ${icon} ${issue.path}`);
  }
  console.log('\n建议将空格替换为下划线(_)');
  process.exit(1);
}
