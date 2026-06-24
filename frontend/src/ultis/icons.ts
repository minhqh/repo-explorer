const FILE_ICONS: Record<string, string> = {
  '.py': '🐍',
  '.ts': '📘',
  '.tsx': '📘',
  '.js': '💛',
  '.jsx': '💛',
  '.json': '📋',
  '.md': '📝',
  '.html': '🌐',
  '.css': '🎨',
  '.gitignore': '🚫',
  '.dockerignore': '🚫',
};

const SPECIAL_NAMES: Record<string, string> = {
  'dockerfile': '🐳',
  'docker-compose.yml': '🐳',
  'docker-compose.yaml': '🐳',
};

export const getFileIcon = (filename: string, isFolder: boolean, isOpen: boolean): string => {
  if (isFolder) return isOpen ? '📂' : '📁';

  const lowerName = filename.toLowerCase();
  
  // 1. Kiểm tra các tên file đặc biệt trước
  if (SPECIAL_NAMES[lowerName] || lowerName.includes('docker')) return '🐳';
  if (lowerName.includes('.env') || lowerName.includes('config')) return '⚙️';

  // 2. Kiểm tra phần mở rộng (extension) bằng cách tìm key khớp ở cuối chuỗi
  const extension = Object.keys(FILE_ICONS).find(ext => lowerName.endsWith(ext));
  
  return extension ? FILE_ICONS[extension] : '📄';
};