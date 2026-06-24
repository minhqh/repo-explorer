import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface Props {
  content: string;
}

export default function ReadmeViewer({ content }: Props) {
  if (!content) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#57606a', border: '1px solid #d0d7de', borderRadius: '6px' }}>
        Dự án này không có file README.md
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #d0d7de',
      borderRadius: '6px',
      padding: '32px',
      maxHeight: '600px', // Đặt giới hạn chiều cao
      overflowY: 'auto',  // Tạo thanh cuộn dọc
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
    }}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}