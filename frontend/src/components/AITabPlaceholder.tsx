export default function AITabPlaceholder() {
  const futureFeatures = [
    {
      icon: '💬',
      title: 'Chat với Repository',
      desc: 'Đặt câu hỏi bằng ngôn ngữ tự nhiên về kiến trúc, luồng dữ liệu hoặc cách setup dự án.'
    },
    {
      icon: '🛡️',
      title: 'Quét Lỗ Hổng (Vulnerability Scan)',
      desc: 'AI tự động đọc package.json / requirements.txt và cảnh báo các thư viện lỗi thời.'
    },
    {
      icon: '💡',
      title: 'Gợi ý Tối ưu (Code Review)',
      desc: 'Phân tích các hàm phức tạp và đề xuất cách viết clean code hoặc cải thiện hiệu năng.'
    },
    {
      icon: '📝',
      title: 'Tự động sinh Document',
      desc: 'Tạo tài liệu API hoặc giải thích luồng hoạt động chi tiết dựa trên mã nguồn thực tế.'
    }
  ];

  return (
    <div style={{ 
      backgroundColor: '#f8faff', 
      border: '1px dashed #0969da', 
      borderRadius: '8px', 
      padding: '40px 24px',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '32px' }}>
        <span style={{ fontSize: '48px' }}>✨</span>
        <h2 style={{ margin: '16px 0 8px 0', fontSize: '24px', color: '#0969da' }}>
          Trợ lý AI Phân tích Mã nguồn
        </h2>
        <p style={{ color: '#57606a', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
          Tính năng đang được phát triển. Trong tương lai, hệ thống sẽ kết hợp dữ liệu Tree và file README vừa cào được để nạp vào Context của LLM (như Gemini), biến Dashboard này thành một chuyên gia Review Code thực thụ.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {futureFeatures.map((feat, idx) => (
          <div key={idx} style={{
            backgroundColor: '#fff',
            border: '1px solid #d0d7de',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'left',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>{feat.icon}</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#24292e' }}>{feat.title}</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#57606a', lineHeight: 1.5 }}>{feat.desc}</p>
          </div>
        ))}
      </div>

      <button style={{
        marginTop: '40px',
        padding: '10px 24px',
        backgroundColor: '#ebf5ff',
        color: '#0969da',
        border: '1px solid #0969da',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'not-allowed',
        opacity: 0.8
      }}>
        🚧 Đang xây dựng Model...
      </button>
    </div>
  );
}