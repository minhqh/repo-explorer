import type { RepositoryData } from '../types';

export function generateContextPack(data: RepositoryData): string {
  let md = `# Repository Context: ${data.info.name}\n\n`;

  md += `## 1. Overview\n`;
  md += `- **Owner:** ${data.info.owner}\n`;
  md += `- **Language:** ${data.info.language}\n`;
  md += `- **Default Branch:** ${data.info.default_branch}\n`;
  md += `- **Description:** ${data.info.description || 'N/A'}\n\n`;

  md += `## 2. Architecture Tree\n\`\`\`text\n`;
  const buildTree = (nodes: any, indent = '') => {
    let result = '';
    Object.values(nodes).forEach((node: any) => {
      result += `${indent}├── ${node.name}\n`;
      if (node.children) result += buildTree(node.children, indent + '│   ');
    });
    return result;
  };
  md += buildTree(data.tree);
  md += `\`\`\`\n\n`;

  md += `## 3. Dependencies\n`;
  md += `- **Frontend:** ${data.dependencies.frontend.join(', ') || 'None'}\n`;
  md += `- **Backend:** ${data.dependencies.backend.join(', ') || 'None'}\n\n`;

  if (data.git_stats && data.git_stats.recent_commits.length > 0) {
    md += `## 4. Recent Git History\n`;
    // Lấy 50 commit gần nhất bỏ vào ngữ cảnh để tránh tràn token AI
    data.git_stats.recent_commits.slice(0, 50).forEach((c) => {
      md += `- [${c.date}] ${c.author}: ${c.message} (${c.sha.substring(0, 7)})\n`;
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
