---
title: Asset and OSS Licenses
description: How to handle Creative Commons and open-source software licenses in games, credit attribution, font licenses, and the risk of existing code mixed into AI-generated code.
sidebar:
  order: 4
lastUpdated: 2026-09-29
---

## Overview

Solo-developed games contain many third-party components: free assets, OSS libraries, fonts, game engines, and more. Each comes with a license (terms of use) that you must follow.

- **Assets** (images, audio, 3D models): Creative Commons (CC) licenses are common
- **Code**: OSS licenses such as MIT, Apache 2.0, GPL
- **Fonts**: SIL Open Font License (OFL) or commercial licenses from font foundries
- **AI-generated code**: May contain portions of existing OSS code

This article explains the key points for each category and how to write credits properly.

## Creative Commons (CC) Licenses

CC licenses consist of combinations of terms. Here is a guide to using them in games.

| License | Meaning | Can use in commercial games |
|---|---|---|
| **CC0** | Author releases all rights to the public domain. According to CC, this is not technically a license. | Can use. No attribution required (but attribution is appreciated). |
| **BY** (Attribution) | Author credit is required. | Can use if you provide credit. |
| **SA** (ShareAlike) | Derivative works must be shared under the same license. | Can use, but any modifications must be distributed under SA terms. |
| **NC** (Noncommercial) | Prohibits commercial use. | **Cannot use in sold games** in most cases. Use with author permission if needed. |
| **ND** (No Derivatives) | Prohibits modification. | Can use if unmodified. Cropping, color changes, remixing, and other edits are not allowed. |

Additional notes:

- CC licenses **cannot be revoked**. Once content is published under CC, it remains usable under those terms even if the author later removes it ([CC FAQ](https://creativecommons.org/faq/)).
- **CC is not recommended for software licensing**. Use OSS licenses for code ([CC FAQ](https://creativecommons.org/faq/)).
- Combining CC-BY-ND music with a video is considered a "modification" according to CC, so ND-licensed music cannot be used for trailers ([CC recommended attribution practices](https://wiki.creativecommons.org/wiki/Recommended_practices_for_attribution)). See also [AI Video Generation](/en/trailer/ai-video/).
- Free-tier outputs from some AI tools carry CC licenses. For example, Meshy's free plan outputs are CC BY 4.0 ([Commercial use terms for AI tools](/en/legal/tool-terms/)).

## OSS Licenses

| License | Type | What to include in game distribution |
|---|---|---|
| **MIT** / BSD | Permissive | Include copyright notice and license text. |
| **Apache 2.0** | Permissive | Include license text. If a NOTICE file exists, include its contents. Mark files you have modified. |
| **GPL** | Copyleft | Distribute the entire program under GPL and provide access to source code. |
| **LGPL** | Weak Copyleft | If you follow the library terms, you may use a different license for the game itself in some cases. |

Full license texts: [MIT](https://opensource.org/license/mit), [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0), [GPL](https://www.gnu.org/licenses/gpl-3.0.html)

### GPL Considerations

The [GPL FAQ](https://www.gnu.org/licenses/gpl-faq.html) explains the following:

- Linking to a GPL library (not LGPL) extends GPL conditions to the entire work (FAQ "IfLibraryIsGPL")
- Selling copies of GPL software is permitted (FAQ "DoesTheGPLAllowMoney")
- In video games, art and audio may use licenses different from GPL code (FAQ "WhatCaseIsOutputGPL")

For commercial games where you do not want to release source code, the standard practice is to avoid GPL code. Check dependency licenses in your package manager or in the LICENSE file in the repository.

### Game Engine Licenses

Game engines themselves have licenses. For example, Godot uses the MIT license. The official documentation lists several ways to include the engine license in games: credit screens, license menus, bundled files, and more. It also covers third-party components included in the engine (see `COPYRIGHT.txt`) ([Godot: Complying with licenses](https://docs.godotengine.org/en/stable/about/complying_with_licenses.html)). Unity and Unreal Engine follow their own terms of service.

## Font Licenses

### SIL Open Font License (OFL)

Many Google Fonts use the OFL. Key points from the [OFL FAQ](https://openfontlicense.org/ofl-faq/) are:

- Can be bundled in games and mobile apps. Commercial use is allowed.
- When bundling, include copyright notice and license text.
- **Cannot sell the font as a standalone product.**
- If the author declared a Reserved Font Name, derivative fonts must have a different name.

### Commercial Fonts

Commercial font licenses may differ depending on usage: creating images for UI versus embedding the font data in the game.

For example, Morisawa permits using font-based images (logos, menus) in games without additional fees. However, bundling the font file itself for use as a game font requires a separate contract ([Morisawa Commercial Use](https://www.morisawa.co.jp/products/fonts/commercial-use/), as of September 2026) (in Japanese). Specialized licenses are available for game and app embedding ([App and Game Embedding](https://www.morisawa.co.jp/products/fonts/embedding/mat/)) (in Japanese).

Some free fonts prohibit embedding or require attribution. Check the license terms on the distribution page.

## How to Write Credits

**TASL** is the recommended attribution method for CC content ([CC recommended attribution practices](https://wiki.creativecommons.org/wiki/Recommended_practices_for_attribution)):

- **T**itle: Asset name (can be omitted in CC 4.0)
- **A**uthor: The name as the creator prefers
- **S**ource: URL of the original work
- **L**icense: License name with link to its description page

Examples for in-game credits or README:

```text
■ Graphics
"Forest Tileset" by Taro Yamada (https://example.com/forest)
  is licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)

■ Fonts
(Font Name) — Copyright (Copyright holder listed on font) — SIL Open Font License 1.1
(Full license: see licenses/OFL.txt)

■ Software
This game uses Godot Engine, available under the MIT license.
(Full license: see licenses/ directory)

■ AI-Generated Assets
Some 3D models were generated with Meshy (free plan) and are credited under CC BY 4.0.
```

Practical tips:

- Record each asset in a ledger (name, author, URL, license, whether modified) when you add it.
- Keep full license texts in a `licenses/` folder and make them accessible from the credit screen.
- Include main credits in your store page description to reduce inquiries.

## Risk of Existing Code Mixed into AI-Generated Code

AI coding tools sometimes output code that closely matches OSS code they learned from. If that code has a copyleft license like GPL, the license attribution may not be included when the code enters your game.

- GitHub Copilot includes a "code referencing" feature that checks if suggestions match public code. It compares the suggestion and surrounding ~150 characters against GitHub's public repositories. When there is a match, it shows the original file URL and license name. According to GitHub, matches occur in less than 1% of suggestions ([GitHub Docs](https://docs.github.com/en/copilot/concepts/completions/code-referencing)).
- You can set "Suggestions matching public code" to **Block** in your personal settings to prevent suggestions matching public code from appearing ([GitHub Docs](https://docs.github.com/copilot/how-tos/manage-your-account/managing-copilot-policies-as-an-individual-subscriber)).
- In Doe v. GitHub, on September 16, 2026, the US Court of Appeals for the Ninth Circuit supported dismissal of claims under DMCA Section 1202 (removal of copyright management information). However, contract claims based on OSS license violations are still being litigated in the district court ([Authors Alliance](https://www.authorsalliance.org/2026/09/23/resolving-an-interlocutory-appeal-ninth-circuit-affirms-dismissal-of-section-1202-dmca-claims-in-ongoing-doe-v-github-litigation/)). **This ruling does not mean you can use code in violation of licenses.**

Mitigation steps:

- [ ] Enable settings to block or show matches against public code
- [ ] Avoid prompts like "write the implementation of XX library as is". If you need a library, add it as a proper dependency.
- [ ] If you receive long, cohesive algorithm code, search for parts of it to verify it does not match existing code.
- [ ] Include a tool in your build process that lists all dependency licenses.

See [Commercial use terms for AI tools](/en/legal/tool-terms/) for tool-specific terms, and [AI Coding Tools](/en/dev-env/ai-coding-tools/) for choosing tools.

## How to use AI

- **Auto-generate license ledgers and credits**: Have AI write a script that generates a license list and credit screen text from `package.json` or asset folder metadata.
- **Understand license terms**: Ask an LLM whether you can use specific code under a license. The response serves as a starting point.
- **AI-generated assets also have licenses**: Some free-tier tools attach CC licenses; others require attribution. Add a "Generation tool and plan" column to your asset ledger. Related: [Asset Generation](/en/dev-env/asset-generation/)

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Creative Commons FAQ](https://creativecommons.org/faq/) — CC license and CC0 basics
- [Recommended practices for attribution (CC)](https://wiki.creativecommons.org/wiki/Recommended_practices_for_attribution) — TASL-based attribution
- [GPL FAQ (GNU)](https://www.gnu.org/licenses/gpl-faq.html) — GPL scope, sales, and asset handling in games
- [MIT License (OSI)](https://opensource.org/license/mit) — License text
- [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) — License text
- [Godot: Complying with licenses](https://docs.godotengine.org/en/stable/about/complying_with_licenses.html) — How to display engine license
- [OFL FAQ](https://openfontlicense.org/ofl-faq/) — Bundling and modifying OFL fonts
- [Morisawa Commercial Use](https://www.morisawa.co.jp/products/fonts/commercial-use/) — Example of commercial fonts in games (in Japanese)
- [GitHub Copilot code referencing](https://docs.github.com/en/copilot/concepts/completions/code-referencing) — Checking for public code matches
