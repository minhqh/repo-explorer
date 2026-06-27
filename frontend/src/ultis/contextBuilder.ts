import type { RepositoryData } from '../types';

export function generateContextPack(data: RepositoryData): string {
  let md = `# Repository Context: ${data.info.name}\n\n`;

  md += `## 1. Overview\n`;
  md += `- **Owner:** ${data.info.owner}\n`;
  md += `- **Language:** ${data.info.language || 'N/A'}\n`;
  md += `- **Default Branch:** ${data.info.default_branch}\n`;
  md += `- **Description:** ${data.info.description || 'No description provided.'}\n`;
  md += `- **Topics:** ${data.info.topics?.join(', ') || 'None'}\n\n`;

  // --- 2. ENTRY POINTS (Điểm mù của AI đã được fix) ---
  md += `## 2. Entry Points\n`;
  const entryPointsList: string[] = [];
  const entryFileNames = [
    'main.py',
    'app.py',
    'server.js',
    'index.js',
    'main.tsx',
    'App.tsx',
    'index.ts',
  ];

  const findEntryPoints = (nodes: any, path = '') => {
    Object.entries(nodes).forEach(([name, node]: [string, any]) => {
      const fullPath = path ? `${path}/${name}` : name;
      if (node.type === 'blob' && entryFileNames.includes(name)) {
        entryPointsList.push(fullPath);
      } else if (node.type === 'tree' && node.children) {
        findEntryPoints(node.children, fullPath);
      }
    });
  };
  findEntryPoints(data.tree);

  if (entryPointsList.length > 0) {
    entryPointsList.forEach((ep) => (md += `- ${ep}\n`));
  } else {
    md += `- Not explicitly found. AI should explore root directory.\n`;
  }
  md += `\n`;

  // --- 3. COMPACT ARCHITECTURE TREE (Tiết kiệm 40-60% Token) ---
  md += `## 3. Compact Architecture Tree\n\`\`\`text\n`;
  const IGNORED_EXTENSIONS = [
    '.png',
    '.jpg',
    '.jpeg',
    '.svg',
    '.ico',
    '.gif',
    '.mp4',
    '.pdf',
    '.lock',
    '.woff',
    '.ttf',
  ];

  const buildCompactTree = (nodes: any, indent = '') => {
    let result = '';
    Object.values(nodes).forEach((node: any) => {
      if (node.type === 'blob') {
        const ext = node.name.substring(node.name.lastIndexOf('.')).toLowerCase();
        // Bỏ qua các file ảnh, lock, media...
        if (IGNORED_EXTENSIONS.includes(ext) || node.name.includes('-lock')) return;
      }

      result += `${indent}├── ${node.name}\n`;
      if (node.children && Object.keys(node.children).length > 0) {
        result += buildCompactTree(node.children, indent + '│   ');
      }
    });
    return result;
  };
  md += buildCompactTree(data.tree) || 'No tree data available.';
  md += `\n\`\`\`\n\n`;

  // --- 4. DEPENDENCIES ---
  md += `## 4. Dependencies\n`;
  md += `- **Frontend:** ${data.dependencies.frontend.join(', ') || 'None'}\n`;
  md += `- **Backend:** ${data.dependencies.backend.join(', ') || 'None'}\n\n`;

  // --- 5. DEVELOPMENT TIMELINE (Phân loại thông minh cho AI) ---
  if (data.git_stats && data.git_stats.recent_commits.length > 0) {
    md += `## 5. Development Timeline\n`;

    const commits = data.git_stats.recent_commits.slice(0, 50);
    const features = commits.filter((c) => c.message.toLowerCase().includes('feat'));
    const fixes = commits.filter((c) => c.message.toLowerCase().includes('fix'));
    const others = commits
      .filter(
        (c) => !c.message.toLowerCase().includes('feat') && !c.message.toLowerCase().includes('fix')
      )
      .slice(0, 5); // Lấy tượng trưng

    if (features.length > 0) {
      md += `### Core Features Developed:\n`;
      features.forEach((c) => (md += `- ${c.message}\n`));
    }
    if (fixes.length > 0) {
      md += `\n### Crucial Fixes:\n`;
      fixes.forEach((c) => (md += `- ${c.message}\n`));
    }
    if (others.length > 0) {
      md += `\n### Chores & Configurations:\n`;
      others.forEach((c) => (md += `- ${c.message}\n`));
    }
    md += '\n';
  }

  // --- 6 & 7. README VÀ DOCS KÈM THEO ---
  if (data.readme) {
    md += `## 6. README.md\n\`\`\`markdown\n`;
    md +=
      data.readme.length > 3000
        ? data.readme.substring(0, 3000) + '\n\n... (truncated)'
        : data.readme;
    md += `\n\`\`\`\n\n`;
  }

  if (data.markdown_files && Object.keys(data.markdown_files).length > 0) {
    md += `## 7. Important Documents\n`;
    Object.entries(data.markdown_files).forEach(([filename, content]) => {
      md += `### ${filename}\n\`\`\`markdown\n`;
      md += content.length > 2000 ? content.substring(0, 2000) + '\n\n... (truncated)' : content;
      md += `\n\`\`\`\n\n`;
    });
  }

  return md;
}

export function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
