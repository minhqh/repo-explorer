import type { RepositoryData } from '../types';

export function generateContextPack(data: RepositoryData): string {
    let md = `# Repository Context: ${data.info.name}\n\n`;
    
    // --- 1. OVERVIEW (Bổ sung Description & Topics) ---
    md += `## 1. Overview\n`;
    md += `- **Owner:** ${data.info.owner}\n`;
    md += `- **Language:** ${data.info.language || 'N/A'}\n`;
    md += `- **Default Branch:** ${data.info.default_branch}\n`;
    md += `- **Description:** ${data.info.description || 'No description provided.'}\n`;
    md += `- **Topics:** ${data.info.topics?.join(', ') || 'None'}\n\n`;
    
    // --- 2. ARCHITECTURE TREE ---
    md += `## 2. Architecture Tree\n\`\`\`text\n`;
    const buildTree = (nodes: any, indent = '') => {
        let result = '';
        Object.values(nodes).forEach((node: any) => {
            result += `${indent}├── ${node.name}\n`;
            if (node.children && Object.keys(node.children).length > 0) {
                result += buildTree(node.children, indent + '│   ');
            }
        });
        return result;
    };
    md += buildTree(data.tree);
    md += `\`\`\`\n\n`;

    // --- 3. DEPENDENCIES ---
    md += `## 3. Dependencies\n`;
    md += `- **Frontend:** ${data.dependencies.frontend.join(', ') || 'None'}\n`;
    md += `- **Backend:** ${data.dependencies.backend.join(', ') || 'None'}\n\n`;

    // --- 4. GIT HISTORY ---
    if (data.git_stats && data.git_stats.recent_commits.length > 0) {
        md += `## 4. Recent Git History\n`;
        // Chỉ lấy 30 commit gần nhất để tối ưu Token AI
        data.git_stats.recent_commits.slice(0, 30).forEach(c => {
            md += `- [${c.date}] ${c.author}: ${c.message} (${c.sha.substring(0, 7)})\n`;
        });
        md += '\n';
    }

    // --- 5. TÍCH HỢP README (TASK 17) ---
    if (data.readme) {
        md += `## 5. README.md\n\`\`\`markdown\n`;
        // Truncate để an toàn cho Context Window
        md += data.readme.length > 3000 ? data.readme.substring(0, 3000) + '\n\n... (truncated due to length)' : data.readme;
        md += `\n\`\`\`\n\n`;
    }

    // --- 6. TÍCH HỢP MULTI-FILE SCANNER (TASK 17) ---
    if (data.markdown_files && Object.keys(data.markdown_files).length > 0) {
        md += `## 6. Important Documents\n`;
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