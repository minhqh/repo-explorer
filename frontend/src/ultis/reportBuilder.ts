import type { RepositoryData } from '../types';

export const generateAnalysisReport = (data: RepositoryData): string => {
  const { info, health_score, languages, dependencies, git_stats } = data;

  const getGradeEmoji = (grade?: string) => {
    switch (grade) {
      case 'A': return '🏆';
      case 'B': return '🥈';
      case 'C': return '🥉';
      case 'D': return '⚠️';
      case 'F': return '🚨';
      default: return '❓';
    }
  };

  return `# 📊 Báo cáo Phân tích Kho lưu trữ: ${info.owner}/${info.name}

## 1. 🌟 Tổng quan
- **Mô tả:** ${info.description || 'Không có mô tả cho dự án này.'}
- **Ngôn ngữ chính:** ${info.language || 'N/A'}
- **Stars:** ${info.stars.toLocaleString()} ⭐ | **Forks:** ${info.forks.toLocaleString()} 🍴
- **Default Branch:** \`${info.default_branch}\`

## 2. 🩺 Sức khỏe Dự án (Health Score)
- **Điểm số:** ${health_score?.total_score || 0}/100
- **Hạng (Grade):** **${health_score?.grade || 'N/A'}** ${getGradeEmoji(health_score?.grade)}

### 🚨 Cần khắc phục (Penalties)
${health_score?.penalties.length 
  ? health_score.penalties.map(p => `- **${p.item}**: ${p.description} (${p.value} điểm)`).join('\n') 
  : '- *Không có lỗi nghiêm trọng nào.*'}

### ✨ Điểm cộng (Bonuses)
${health_score?.bonuses.length 
  ? health_score.bonuses.map(b => `- **${b.item}**: ${b.description} (+${b.value} điểm)`).join('\n') 
  : '- *Chưa có tiêu chí thưởng nào đạt yêu cầu.*'}

## 3. 💻 Thống kê Ngôn ngữ
${languages.length > 0 
  ? languages.map(l => `- **${l.name}**: ${l.percent}%`).join('\n')
  : '- *Không có dữ liệu ngôn ngữ.*'}

## 4. 📦 Thư viện (Dependencies)
- **Frontend:** ${dependencies.frontend.length > 0 ? dependencies.frontend.join(', ') : '*Không có hoặc không nhận diện được*'}
- **Backend:** ${dependencies.backend.length > 0 ? dependencies.backend.join(', ') : '*Không có hoặc không nhận diện được*'}

## 5. 📈 Hoạt động Git
- **Tổng số commit:** ${git_stats?.total_commits.toLocaleString() || 0}
- **Số người đóng góp:** ${git_stats?.unique_contributors || 0}

---
*Báo cáo được tạo tự động bởi **GitHub Repo Explorer**.*
`;
};