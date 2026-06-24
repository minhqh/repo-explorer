import { useState } from 'react';
import type { TreeNode } from '../types';
import { getFileIcon } from '../ultis/icons';

interface Props {
  node: TreeNode;
  level?: number;
}

export default function TreeItem({ node, level = 0 }: Props) {
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
          paddingLeft: `${level * 20}px`,
          cursor: isFolder ? 'pointer' : 'default',
          color: isFolder ? '#0969da' : '#24292e',
          backgroundColor: '#fff',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f6f8fa'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
      >
        <span style={{ marginRight: '8px', width: '20px', textAlign: 'center' }}>
          {getFileIcon(node.name, isFolder, isOpen)}
        </span>
        <span style={{ fontSize: '14px', fontFamily: 'monospace' }}>
          {node.name}
        </span>
      </div>

      {isFolder && isOpen && (
        <div>
          {Object.values(node.children)
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
}