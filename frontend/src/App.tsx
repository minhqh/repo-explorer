import { useRepoAnalyzer } from './hooks/useRepoAnalyzer';
import { useState } from 'react';
import './App.css';
import {
  SearchBar,
  RepoInfo,
  ReadmeViewer,
  RepoTree,
  LanguageChart,
  DependenciesTab,
  AITabPlaceholder,
  GitActivityTab,
  EmptyState,
  ErrorState,
  HealthScoreDashboard,
} from './components';
import { downloadMarkdown, generateContextPack } from './ultis/contextBuilder';
import { generateAnalysisReport } from './ultis/reportBuilder';

function App() {
  const { data, isLoading, error, analyze } = useRepoAnalyzer();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'architecture' | 'dependencies' | 'activity' | 'ai'
  >('overview');

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10vh 20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '3rem', margin: '0 0 10px 0', color: '#24292e' }}>Repo Explorer</h2>
        <p style={{ color: '#57606a', fontSize: '1.1rem', margin: 0 }}>
          Bóc tách kiến trúc và công nghệ của bất kỳ dự án GitHub nào
        </p>
      </div>

      <SearchBar onSearch={analyze} isLoading={isLoading} />

      <div style={{ marginTop: '40px', width: '100%', maxWidth: '1000px' }}>
        {/* 1. Trạng thái Loading */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#57606a' }}>
            <span
              style={{
                fontSize: '32px',
                display: 'inline-block',
                animation: 'spin 1s linear infinite',
              }}
            >
              ⏳
            </span>
            <p>Đang bóc tách mã nguồn...</p>
          </div>
        )}

        {/* 2. Trạng thái Lỗi */}
        {error && !isLoading && <ErrorState message={error} />}

        {/* 3. Trạng thái Trống (Chưa search) */}
        {!data && !isLoading && !error && <EmptyState />}

        {/* 4. Trạng thái Thành công (Render Tabs) */}
        {data && !isLoading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* ... Toàn bộ logic hiển thị Tabs và các Component giữ nguyên ... */}
          </div>
        )}

        {data && !isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 1. Thanh điều hướng Tab */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                borderBottom: '1px solid #d0d7de',
                paddingBottom: '10px',
              }}
            >
              <button
                onClick={() => setActiveTab('overview')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 16px',
                  fontWeight: activeTab === 'overview' ? 'bold' : 'normal',
                  borderBottom: activeTab === 'overview' ? '2px solid #fd8c73' : 'none',
                  cursor: 'pointer',
                }}
              >
                📖 Tổng quan
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 16px',
                  fontWeight: activeTab === 'architecture' ? 'bold' : 'normal',
                  borderBottom: activeTab === 'architecture' ? '2px solid #fd8c73' : 'none',
                  cursor: 'pointer',
                }}
              >
                🗂️ Kiến trúc (Tree)
              </button>
              <button
                onClick={() => setActiveTab('dependencies')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 16px',
                  fontWeight: activeTab === 'dependencies' ? 'bold' : 'normal',
                  borderBottom: activeTab === 'dependencies' ? '2px solid #fd8c73' : 'none',
                  cursor: 'pointer',
                }}
              >
                📦 Thư viện
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 16px',
                  fontWeight: activeTab === 'activity' ? 'bold' : 'normal',
                  borderBottom: activeTab === 'activity' ? '2px solid #fd8c73' : 'none',
                  cursor: 'pointer',
                }}
              >
                📈 Hoạt động
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 16px',
                  fontWeight: activeTab === 'ai' ? 'bold' : 'normal',
                  borderBottom: activeTab === 'ai' ? '2px solid #fd8c73' : 'none',
                  cursor: 'pointer',
                  color: '#9b59b6',
                }}
              >
                ✨ AI Analyze
              </button>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                {/* Nút mới: Export Report dành cho con người */}
                <button
                  onClick={() => {
                    const report = generateAnalysisReport(data);
                    downloadMarkdown(report, `${data.info.name}_analysis_report.md`);
                  }}
                  style={{
                    backgroundColor: '#0969da', // Xanh dương GitHub
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  📄 Export Report
                </button>
                <button
                  onClick={() => {
                    const mdContext = generateContextPack(data);
                    downloadMarkdown(mdContext, `${data.info.name}_context_pack.md`);
                  }}
                  style={{
                    backgroundColor: '#2da44e',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  📦 Download AI Context
                </button>
              </div>
            </div>
            {/* 2. Nội dung thay đổi theo Tab */}
            {activeTab === 'overview' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  width: '100%',
                }}
              >
                {data.health_score && <HealthScoreDashboard scoreData={data.health_score} />}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '24px',
                    alignItems: 'start',
                  }}
                >
                  <RepoInfo info={data.info} />
                  <ReadmeViewer content={data.readme} />
                </div>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr',
                  gap: '24px',
                  alignItems: 'start',
                }}
              >
                {/* Cột trái: Cây thư mục */}
                <RepoTree treeData={data.tree} />

                {/* Cột phải: Biểu đồ ngôn ngữ */}
                <LanguageChart languages={data.languages} />
              </div>
            )}
            {activeTab === 'dependencies' && <DependenciesTab dependencies={data.dependencies} />}
            {activeTab === 'ai' && <AITabPlaceholder />}
            {activeTab === 'activity' && (
              <GitActivityTab
                stats={data.git_stats}
                owner={data.info.owner}
                repo={data.info.name}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
