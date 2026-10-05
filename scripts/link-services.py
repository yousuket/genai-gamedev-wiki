"""サービス名を、公式サイトのトップページへのリンクにする。
使い方:
  python3 scripts/link-services.py [ファイル...]           # 変更の予定だけを表示（ファイルを省くと、すべての記事）
  python3 scripts/link-services.py --apply [ファイル...]   # 実際に書き換える
名前とURLの対応は、下の TERMS に書く。新しいサービスを扱うときは、ここに足す（URLは、開けることを確認する）。
何度実行しても、すでにリンクになっている名前は、その節では重ねて付けない。

- 各 h2 の節で、最初に出てくる名前だけをリンクにする
- 表は、1列目の名前を、必ずリンクにする（見出しの行は除く）
- コードブロック、インラインコード、見出し、すでにあるリンク、URL、「参考リンク」の節には触らない
"""
import re, sys, glob

TERMS = [  # 長い名前を先に。ここに無い名前は触らない
    ("Stable Audio", "https://stability.ai/stable-audio"),
    ("ElevenLabs", "https://elevenlabs.io/"),
    ("ACE-Step", "https://ace-step.github.io/"),
    ("Lyria", "https://deepmind.google/models/lyria/"),
    ("Suno", "https://suno.com/"),
    ("Udio", "https://www.udio.com/"),
    ("AIVA", "https://www.aiva.ai/"),
    ("Apple Developer Program", "https://developer.apple.com/programs/"),
    ("Cloudflare Workers", "https://workers.cloudflare.com/"),
    ("Cloudflare Pages", "https://pages.cloudflare.com/"),
    ("Firebase Hosting", "https://firebase.google.com/products/hosting"),
    ("GitHub Pages", "https://pages.github.com/"),
    ("GitLab Pages", "https://docs.gitlab.com/user/project/pages/"),
    ("Global Game Jam", "https://globalgamejam.org/"),
    ("Ludum Dare", "https://ldjam.com/"),
    ("CrazyGames", "https://www.crazygames.com/"),
    ("Newgrounds", "https://www.newgrounds.com/"),
    ("StackBlitz", "https://stackblitz.com/"),
    ("CodeSandbox", "https://codesandbox.io/"),
    ("js13kGames", "https://js13kgames.com/"),
    ("Steamworks", "https://partner.steamgames.com/"),
    ("TestFlight", "https://developer.apple.com/testflight/"),
    ("Capacitor", "https://capacitorjs.com/"),
    ("BitSummit", "https://bitsummit.org/"),
    ("unityroom", "https://unityroom.com/"),
    ("Game Jolt", "https://gamejolt.com/"),
    ("Google Play", "https://play.google.com/console/about/"),
    ("App Store", "https://developer.apple.com/app-store/"),
    ("Electron", "https://www.electronjs.org/"),
    ("Vibe Jam", "https://vibej.am/"),
    ("CodePen", "https://codepen.io/"),
    ("Netlify", "https://www.netlify.com/"),
    ("itch.io", "https://itch.io/"),
    ("Vercel", "https://vercel.com/"),
    ("Render", "https://render.com/"),
    ("Steam", "https://store.steampowered.com/"),
    ("Tauri", "https://tauri.app/"),
    ("Vite", "https://vite.dev/"),
    ("Poki", "https://poki.com/"),
]
NAMES = "|".join(re.escape(n) for n, _ in TERMS)
URL = dict(TERMS)
TERM_RE = re.compile(rf"(?<![A-Za-z0-9./_-])({NAMES})(?![A-Za-z0-9_])")
SKIP_RE = re.compile(r"(`[^`]*`|\[[^\]]*\]\([^)]*\)|https?://[^\s)>\]]+|<[^>]+>)")

def link_text(text, seen, force):
    """text の中の名前をリンクにする。seen: すでにリンクにした名前（節ごと）。force: 見た名前でも必ずリンクにする"""
    out, added = [], 0
    for part in SKIP_RE.split(text):
        if SKIP_RE.fullmatch(part) or not part:
            m0 = re.match(r"^\[([^\]]+)\]\(", part)
            if m0 and m0.group(1) in URL: seen.add(m0.group(1))  # すでにリンクになっている名前は、その節で重ねて付けない
            out.append(part); continue
        def rep(m):
            nonlocal added
            name = m.group(1)
            if name in seen and not force: return name
            seen.add(name); added += 1
            return f"[{name}]({URL[name]})"
        if force:
            done = set()
            def rep2(m):
                nonlocal added
                name = m.group(1)
                if name in done: return name
                done.add(name); seen.add(name); added += 1
                return f"[{name}]({URL[name]})"
            out.append(TERM_RE.sub(rep2, part))
        else:
            out.append(TERM_RE.sub(rep, part))
    return "".join(out), added

def process(src):
    m = re.match(r"^---\n[\s\S]*?\n---\n", src)
    head, body = (m.group(0), src[m.end():]) if m else ("", src)
    lines, res, fence, seen, skip_section, total = body.split("\n"), [], None, set(), False, 0
    i = 0
    while i < len(lines):
        ln = lines[i]
        f = re.match(r"^(`{3,})", ln)
        if fence:
            res.append(ln)
            if f and len(f.group(1)) >= len(fence) and ln.strip() == f.group(1): fence = None
            i += 1; continue
        if f: fence = f.group(1); res.append(ln); i += 1; continue
        if ln.startswith("## "):
            seen = set(); skip_section = ln.strip() in ("## 参考リンク", "## 最新情報"); res.append(ln); i += 1; continue
        if ln.startswith("#") or skip_section:
            res.append(ln); i += 1; continue
        if ln.startswith("|"):
            is_header = i + 1 < len(lines) and re.match(r"^\|[\s:|-]+\|$", lines[i + 1] or "")
            is_sep = re.match(r"^\|[\s:|-]+\|$", ln)
            if is_header or is_sep:
                res.append(ln); i += 1; continue
            cells = ln.split("|")
            for k in range(1, len(cells) - 1):
                cells[k], a = link_text(cells[k], seen, force=(k == 1)); total += a
            res.append("|".join(cells)); i += 1; continue
        new, a = link_text(ln, seen, force=False); total += a
        res.append(new); i += 1
    return head + "\n".join(res), total

if __name__ == "__main__":
    apply = "--apply" in sys.argv
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    files = args or sorted(glob.glob("src/content/docs/**/*.md", recursive=True))
    grand = 0
    for f in files:
        src = open(f).read()
        new, n = process(src)
        grand += n
        print(f"{n:3d} 件  {f}")
        if apply and new != src: open(f, "w").write(new)
    print(f"合計 {grand} 件", "（適用済み）" if apply else "（予定。まだ何も変更していません）")
