import type { TreeNode } from '../types';
import TreeItem from './TreeItem';

interface Props {
  treeData: Record<string, TreeNode>;
}

export default function RepoTree({ treeData }: Props) {
  if (!treeData || Object.keys(treeData).length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Không có dữ liệu thư mục</div>;
  }

  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #d0d7de',
        borderRadius: '6px',
        padding: '16px',
        maxHeight: '600px',
        overflowY: 'auto',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px' }}>Cấu trúc dự án</h3>
      {Object.values(treeData)
        .sort((a, b) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === 'tree' ? -1 : 1;
        })
        .map((node) => (
          <TreeItem key={node.name} node={node} />
        ))}
    </div>
  );
}
