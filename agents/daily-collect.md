# 日次収集エージェント 指示書

実行: 毎日 06:07 JST（Claude Code クラウド定期実行）

あなたは「GenAI GameDev Wiki」の情報収集担当です。**生成AI・LLMを使ったゲーム制作**に関する直近48時間（前回実行以降）の動向を集め、収集ログを1ファイル書いてコミットします。サイトの記事（`src/content/docs/`）は**編集しません**。

**重要: ウェブ検索（WebSearch）だけで済ませない。** 検索結果には公開日が出ないため、直近の記事かどうかを判断できません。必ず「3. 取得するフィード」を1つずつ取得して、日付つきで確認してください。

## 1. 準備

1. `agents/STYLE.md` を読み、Wikiの読者とカテゴリを把握する。
2. 今日の日付（JST）を `TZ=Asia/Tokyo date +%F` で確認する。以下 `YYYY-MM-DD` はこの日付。
3. `research/daily/` の直近14日分のログを読み、既に収集済みのURLとトピックを把握する（重複排除のため）。
4. 今日分のログ `research/daily/YYYY-MM-DD.md` が既にある場合:
   - `items: 0` のとき（取得に失敗した日など）は、収集し直して**上書き**する。
   - `items` が1以上のときは、何もせずに終了する。

## 2. 取得の方法

- 取得は **Bash の `curl`** で行う（WebFetch は要約されて公開日が落ちることがあるため、日付の確認には使わない）。
  ```bash
  curl -sL -m 20 -A "genai-gamedev-wiki-bot/1.0" "URL" -o /tmp/feed.xml
  ```
- RSS / Atom は `python3` で、各記事の**題名・URL・公開日**を取り出し、直近48時間のものだけを残す。
- 取得に失敗した（HTTP 429 や 404 など）フィードは、ログの「確認したソース」に失敗と書いて、次に進む。1つの失敗で全体を止めない。
- 直近48時間の記事の**本文**は、WebFetch または curl で開いて確認する。題名だけで要約しない。

## 3. 取得するフィード（すべて取得する）

### AI企業・サービスの公式
| ソース | URL |
|---|---|
| OpenAI ニュース | `https://openai.com/news/rss.xml` |
| Google AI ブログ | `https://blog.google/technology/ai/rss/` |
| Anthropic | `https://www.anthropic.com/sitemap.xml`（`/news/` `/engineering/` のURLのうち新しいもの。日付はページを開いて確認） |

### ゲームエンジン・プラットフォーム
| ソース | URL |
|---|---|
| Godot ブログ | `https://godotengine.org/rss.xml` |
| Unity ブログ | `https://unity.com/blog/rss` |
| Steamworks 告知 | `https://store.steampowered.com/feeds/news/app/593110/` |

### ゲーム業界メディア
| ソース | URL |
|---|---|
| Game Developer | `https://www.gamedeveloper.com/rss.xml` |
| Automaton（日本語） | `https://automaton-media.com/feed/` |

### GitHub・論文
| ソース | URL |
|---|---|
| GitHub（ゲーム × MCP） | `https://api.github.com/search/repositories?q=game+mcp+in:name,description&sort=updated&per_page=20` |
| GitHub（ゲーム × LLM） | `https://api.github.com/search/repositories?q=game+llm+in:name,description&sort=updated&per_page=20` |
| arXiv | `https://export.arxiv.org/api/query?search_query=all:%22large+language+model%22+AND+all:game&sortBy=submittedDate&sortOrder=descending&max_results=20` |

GitHub の API を curl で取得して HTTP 403 になったときは、認証済みの `gh` コマンドで同じ URL を取得する（例: `gh api "search/repositories?q=game+mcp+in:name,description&sort=updated&per_page=20"`）。

GitHub は `pushed_at` / `created_at` が直近のもので、スターが多い（目安 50 以上）か、公式・著名な組織のものだけを対象にする。

### コミュニティ
| ソース | URL |
|---|---|
| Hacker News | `https://hn.algolia.com/api/v1/search_by_date?query=game%20LLM&tags=story&hitsPerPage=30`（`query` を `game AI`, `game generative` に替えて計3回） |
| Zenn（gamedev） | `https://zenn.dev/topics/gamedev/feed` |
| Zenn（生成AI） | `https://zenn.dev/topics/生成ai/feed`（URLエンコードして取得） |
| Qiita（gamedev） | `https://qiita.com/tags/gamedev/feed` |
| Reddit | `https://www.reddit.com/r/gamedev/new/.rss`、`https://www.reddit.com/r/aigamedev/new/.rss`、`https://www.reddit.com/r/IndieDev/new/.rss`、`https://www.reddit.com/r/godot/new/.rss`（HTTP 429 になることが多い。失敗したら記録して次へ） |

### 補助: ウェブ検索
上のフィードに載らない話題を拾うために、WebSearch を使ってもよい（例: 「Steam AI 開示 ポリシー 変更」「Google Play 手数料 日本 2026」）。ただし、検索結果は**公開日をページを開いて確認できたものだけ**を記録する。

## 4. 選定基準

- **対象**: 個人ゲーム制作者の制作・販売・収益化に影響するもの。新ツール、既存ツールの大きな更新、料金・規約・ポリシーの変更、注目の制作事例、実用的なノウハウ記事、重要な論文。
- **対象外**: ゲーム制作と無関係なAIニュース、単なる噂やリーク、出典が確認できない情報、宣伝だけの記事。
- **重複**: 過去14日のログにある URL やトピックは除く（続報で新しい事実がある場合のみ「続報」として記録）。
- 1日あたり5〜15件を目安にする。
- **0件にできるのは、「3. 取得するフィード」の取得が一通り終わり、それでも直近48時間の該当がなかった場合だけ。** 取得に成功したフィードが半分未満のときは、0件ではなく「取得失敗が多く収集不十分」とログに書く。

## 5. 出力

`research/daily/YYYY-MM-DD.md` を以下の形式で作成する。

```markdown
---
date: YYYY-MM-DD
items: 件数
---

# YYYY-MM-DD 収集ログ

## [重要度3] 見出し（日本語）
- URL: https://...
- 公開日: YYYY-MM-DD
- ソース: 公式 / GitHub / 論文 / コミュニティ
- カテゴリ: genres / design / dev-env / trailer / monetization / legal（複数可）
- 要約: 日本語2〜3行。何が起きたか、個人ゲーム制作者にとって何が変わるか。
- 反映候補: /dev-env/ai-coding-tools/（既存記事の「最新情報」欄に追記すべき場合の記事パス。なければ「なし」）

## [重要度2] ...

## 確認したソース
| ソース | 結果 | 直近48時間の記事数 |
|---|---|---|
| Godot ブログ | 成功 | 0 |
| Reddit r/gamedev | 失敗（HTTP 429） | - |
（「3. 取得するフィード」の全行について書く）
```

- **重要度**: 3 = 制作や販売に直接影響する（規約・料金・ポリシーの変更、主要ツールの大型リリース）/ 2 = 知っておくと役立つ / 1 = 参考
- 重要度の高い順に並べる。
- 要約には、出典に書かれていない推測を入れない。

## 6. コミット

```bash
git add research/daily/YYYY-MM-DD.md
git commit -m "research: daily log YYYY-MM-DD"
git push origin main
```

`research/` 以外のファイルは変更・コミットしない。push が競合したら `git pull --rebase origin main` してから再度 push する。
