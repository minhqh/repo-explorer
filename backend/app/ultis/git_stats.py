from collections import Counter
from typing import List
from app.schemas.github import CommitDetail, GitStats, ContributorStat, CommitActivity


def calculate_git_statistics(commits_data: List[dict]) -> GitStats:
    """Xử lý dữ liệu thô từ GitHub API để tính toán Raw Metrics và Derived Ratios."""
    total_commits = len(commits_data)
    if total_commits == 0:
        return GitStats(
            total_commits=0,
            unique_contributors=0,
            top_contributors=[],
            commit_timeline=[],
            recent_commits=[],
        )

    authors = []
    dates = []
    recent_commits = []

    for item in commits_data:
        # Bóc tách Tác giả
        author_name = "Unknown"
        if item.get("author") and item["author"].get("login"):
            author_name = item["author"]["login"]
        elif (
            item.get("commit")
            and item["commit"].get("author")
            and item["commit"]["author"].get("name")
        ):
            author_name = item["commit"]["author"]["name"]
        authors.append(author_name)

        # Bóc tách Ngày
        if (
            item.get("commit")
            and item["commit"].get("author")
            and item["commit"]["author"].get("date")
        ):
            raw_date = item["commit"]["author"]["date"]
            date_str = raw_date.split("T")[0]
            dates.append(date_str)

        sha = item.get("sha", "")
        msg_raw = item.get("commit", {}).get("message", "No message")
        message = msg_raw.split('\n')[0]

        recent_commits.append(CommitDetail(sha=sha, message=message, author=author_name, date=date_str))

    author_counts = Counter(authors)
    date_counts = Counter(dates)

    # Tính tỷ lệ % và sắp xếp
    top_contributors = [
        ContributorStat(
            author=author,
            commits=count,
            percentage=round((count / total_commits) * 100, 2),
        )
        for author, count in author_counts.items()
    ]
    top_contributors.sort(key=lambda x: x.commits, reverse=True)

    # Sắp xếp timeline
    commit_timeline = [CommitActivity(date=d, count=c) for d, c in date_counts.items()]
    commit_timeline.sort(key=lambda x: x.date)

    return GitStats(
        total_commits=total_commits,
        unique_contributors=len(author_counts),
        top_contributors=top_contributors,
        commit_timeline=commit_timeline,
        recent_commits=recent_commits,
    )
