import { useState, useMemo } from 'react';
import type { RepoTreeItem } from '../types';

interface Props {
  treeData: RepoTreeItem[];
}

interface TreeNode {
  name: string;
  type: string;
  size: number | null;
  children: Record<string, TreeNode>;
}

const buildTree = (items: RepoTreeItem[]): Record<string, TreeNode> => {
  const root: Record<string, TreeNode> = {};

  items.forEach(item => {
    const parts = item.path.split('/');
    let current = root;

    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = {
          name: part,
          type: index === parts.length - 1 ? item.type : 'tree',
          size: index === parts.length - 1 ? item.size : null,
          children: {}
        };
      }
      current = current[part].children;
    });
  });

  return root;
};

const TreeItem = ({ node, level = 0 }: { node: TreeNode, level?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = node.type === 'tree';

  return (
    <div>
      <div 
        onClick={() => isFolder && setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 8px',
          paddingLeft: `${level * 20}px`, // Thụt lề theo độ sâu
          cursor: isFolder ? 'pointer' : 'default',
          color: isFolder ? '#0969da' : '#24292e',
          backgroundColor: '#fff',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f6f8fa'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
      >
        <span style={{ marginRight: '8px', width: '16px' }}>
          {isFolder ? (isOpen ? '📂' : '📁') : '📄'}
        </span>
        <span style={{ fontSize: '14px', fontFamily: 'monospace' }}>
          {node.name}
        </span>
      </div>

      {/* Render đệ quy các children nếu folder đang mở */}
      {isFolder && isOpen && (
        <div>
          {Object.values(node.children)
            // Ưu tiên hiển thị thư mục (tree) trước, file (blob) sau
            .sort((a, b) => {
              if (a.type === b.type) return a.name.localeCompare(b.name);
              return a.type === 'tree' ? -1 : 1;
            })
            .map(child => (
              <TreeItem key={child.name} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function RepoTree({ treeData }: Props) {
  // useMemo giúp thuật toán không bị chạy lại mỗi khi component re-render
  const treeRoot = useMemo(() => buildTree(treeData), [treeData]);

  if (!treeData || treeData.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Không có dữ liệu thư mục</div>;
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #d0d7de',
      borderRadius: '6px',
      padding: '16px',
      maxHeight: '600px',
      overflowY: 'auto' // Tạo thanh cuộn cho cây thư mục dài
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px' }}>Cấu trúc dự án</h3>
      {Object.values(treeRoot)
        .sort((a, b) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === 'tree' ? -1 : 1;
        })
        .map(node => (
          <TreeItem key={node.name} node={node} />
      ))}
    </div>
  );
}