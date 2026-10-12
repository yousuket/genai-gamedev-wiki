---
title: Differentiation beyond one-shot generation
description: Games made with one-shot generation can be created similarly by anyone. We organize eight axes of differentiation, showing which parts agents can handle, which parts humans must decide, and provide prompt examples. We include market data and exercises.
sidebar:
  order: 3
lastUpdated: 2026-09-29
---

## Overview

Games that emerge from one-shot generation can be created at similar quality by anyone using the same prompt. Differentiation is born from the differences that humans decide afterward.
This article divides differentiation into eight axes: Rules, Theme, Constraints, Art and Sound, Content, Game Feel, Operations, and Combinations. For each axis, we show which parts can be delegated to agents, which parts humans must decide, and provide prompt examples.
We also include market data about how the audience responds, and exercises with checklists that you can apply to your own game design.
The prompt examples in this article were written specifically for this article.

## Why one-shot generation produces identical results

Three reasons emerge from case studies.

- It gets reproduced. The Claude of Duty prompt is public, and James Altucher created another shooter with the same prompt ([Decrypt](https://decrypt.co/374560/dumbest-ai-prompt-claude-beat-careful-game-design), July 28, 2026). The author of the Homeworld-style space strategy [Starfall](/en/cases/oneshot-starfall/) modified this prompt, as stated in their repository ([prompt.md](https://github.com/e01-ai/starfall/blob/main/prompt.md))
- It trends toward the average. The same Decrypt article mentions that many public repositories contain first-person shooter implementations, suggesting the model combined existing patterns. The README says the authors themselves acknowledge it did not reach the Call of Duty standard they aimed for
- Copying becomes cheaper. Analyst Mat Piscatella from Circana warns that with AI-driven code generation, other companies' games can be reproduced in tens of hours, and good games get cloned and buried ([GamesRadar](https://www.gamesradar.com/games/good-games-will-get-cloned-and-buried-ai-vibe-coding-is-one-of-the-biggest-threats-on-storefronts-like-steam-analyst-warns/), as of September 2026)

In other words, one-shot generation returns "the typical game in that genre." What agents made cheaper is the implementation. What remains expensive is the next decision.

- What to make
- Who is it for
- What kind of experience to create
- What to leave out

## What the market is watching

| Metric | Number (as of September 2026) | Source |
|---|---|---|
| Steam new releases with AI-generated content disclosure | 2024: 10.9%, 2025: 19.9%, 2026: 30.8% | [GamesRadar on Sulka Haro's analysis](https://www.gamesradar.com/games/steam-study-of-over-53-000-games-finds-60-90-percent-of-the-growth-in-monthly-releases-on-valves-store-is-from-games-using-ai-and-almost-none-of-them-make-money/) |
| Proportion of disclosed works in new releases and estimated revenue | Q1 2026: 28% and 17%, Q2 2026: 33% and 10% | Same as above |
| Distribution of overall revenue | Top 1% accounts for approximately 94% of estimated revenue | Same as above |
| Survey of about 3,800 Steam players | 43% have no problem with AI-disclosed games, 26% are neutral, 31% are negative. 8.1% would not play under any circumstances | [GamesRadar on GameDiscoverCo survey](https://www.gamesradar.com/games/survey-finds-only-31-percent-of-steam-users-have-a-problem-with-ai-in-games-with-43-percent-totally-fine-with-it/) |
| Game industry professionals | 52% responded that generative AI has a negative impact on the industry (30% the previous year) | [GDC 2026 State of the Game Industry](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/) |

Haro's analysis is a comprehensive survey of all 53,597 games released on Steam from July 2023 to July 2026. He concludes that games using AI, like those without, mostly do not sell well, and AI was not a panacea.
Survey respondents represent a more engaged audience than typical Steam users.

Steam's content survey indicates that use of AI tools to streamline development is not the focus of disclosure, and instead covers pre-generated and in-game AI-generated content ([Steamworks](https://partner.steamgames.com/doc/gettingstarted/contentsurvey), as of September 2026). Having an agent write code does not directly trigger disclosure requirements.

Here are the implications we can draw (the author's interpretation):

- The problem is not whether AI was used, but becoming one of many similar games that flood the market. Revenue concentration has been strong before AI
- You need a reason to be discovered. Simply staying as the typical game in a genre gives you no such reason
- If you use AI-generated content in visible parts (images, sound, text), you need disclosure and unified direction

## Eight axes of differentiation

| Axis | In one word | Degree of delegation | What humans must decide |
|---|---|---|---|
| 1 Rules and core loop | Sharpen one point | Delegate implementation, collaborate on ideas | Which one point to sharpen |
| 2 Theme, world, expertise | Content only you can make | Delegate writing and organization | Facts and what you find interesting |
| 3 Constraints | Intentional limitations | Delegate implementation | What to limit with |
| 4 Art and sound | Unified direction | Delegate generation and implementation | References, colors, shapes, sound character |
| 5 Content | Quantity and arrangement | Delegate mass production and verification | Order, difficulty spikes, teaching approach |
| 6 Game feel | Satisfying to touch | Delegate system building | Numeric feel values from hands-on testing |
| 7 Operations and community | Relationships after launch | Delegate update implementation | Strategy and dialogue |
| 8 Combination of niches | Crossing niches | Delegate prototyping | Which combination to choose |

You do not need to pursue all of them. Choose one primary axis and one secondary axis. How to choose is explained in later sections.

### 1 Rules and core loop: One-point breakthrough

Baba Is You is a puzzle where the rules themselves are movable word tiles on the playfield. A short demo created at Nordic Game Jam in 2017 was the prototype, released in 2019 with 481 levels ([Wikipedia](https://en.wikipedia.org/wiki/Baba_Is_You)). An example of digging deep into one idea until the end.

- Delegate to agents: Minimal implementations of derivative ideas, organizing into switchable forms, value tables
- Humans decide: Which one point to sharpen. Whether it is fun to play
- How: Write the core loop in three verbs ([Core Loop](/en/design/core-loop/)), then ask the agent to create three variants in parallel, each changing one verb or adding one rule. Do not ask the agent to evaluate which idea is better. Only humans have a way to verify fun

```text
The current core loop is "avoid → pick up → shoot" (docs/core-loop.md).
Create three variants of this, each adding only one rule, in separate branches as minimal implementations.
- Use rules that require few changes to existing code
- For each variant, write two lines about the new decision that emerges for players
- For each variant, save screenshots and the result of a 30-second operation script
No evaluation of which variant is better. I will choose.
```

### 2 Theme, world, and expertise only you have

The Long Silence begins with the setting that 900 inhabited worlds fell silent in four days. Players investigate with a survey ship, examining seven devices to progress ([README](https://github.com/achimala/TheLongSilence)). Because there is a setting and purpose, procedurally generated space gains reason to explore.

- Delegate to agents: Glossaries, mass-producing text, converting to data, checking consistency
- Humans decide: Facts (how things really work in practice), what you find interesting, how much to simplify from reality
- How: Use your own work experience, hobbies, hometown, and so on as material. You write the facts yourself, and ask the agent for organization and structuring

```text
My material is "on-call response in the middle of the night," which I have experienced in actual work. Treat the following as facts.
(Here, write the facts you know in bullet-point form)
1. For this material, list ten decisions that would confuse a player. Order them by what really confuses you at work
2. For each decision, map it to in-game actions (choosing, placing, waiting)
3. List where you simplified from reality. Only ones I approve will go into SPEC.md
```

### 3 Constraint design

Return of the Obra Dinn achieved one-bit (black and white) visuals with a custom engine and won Best Art Direction ([Wikipedia](https://en.wikipedia.org/wiki/Return_of_the_Obra_Dinn)). An example where constraints became the face of the work.
Claude of Duty's distinctive feature is the constraint of using no image or audio files. Vibe Jam's "play without signing up" and "fast loading" are also constraints.

- Delegate to agents: Implementation within constraints, constraint violation detection (checking file counts, color counts)
- Humans decide: What to constrain with. Whether the constraint becomes the face of the work
- How: Write constraints in the instruction file and enforce them with check scripts. If constraints are not written, agents revert to standard, safe approaches

```text
Add the following constraints to CLAUDE.md.
- Screen colors are a maximum of four. Use no colors outside the definitions in src/palette.js
- Input is one button only (spacebar or tap)
- One play is within 90 seconds
Create npm run check:rules to verify these are kept, and run it with every change.
```

### 4 Art and sound direction

One-shot generation's visuals trend toward the typical in that field. The Claude of Duty README notes as problems that hands look like flat blocks and enemies look like mannequins. The Long Silence adds materials created with image generation models and Blender to ground and ship hull.

- Delegate to agents: Procedural generation code, palette application, shaders, asset export
- Humans decide: Reference works, colors, the language of forms, sound character
- How: Create one style guide as the standard. Choose reference images yourself, ask the agent to verbalize the rules, and have humans correct them. For rights when shipping generated materials, see [Copyright in AI-generated assets](/en/legal/copyright/) and [Asset generation](/en/dev-env/asset-generation/). For code-based methods, see [Procedural assets](/en/agent-dev/procedural-assets/)

```text
Create docs/style.md. Reference images are in refs/.
1. Verbalize rules for colors (six or fewer, hex notation), shapes (angular or rounded, thickness), and light from reference images
2. Write the character of sound effects and background music (timbre, tempo, sounds to avoid)
3. List five examples of "does not feel like this game"
What I correct becomes the standard, and all future implementation follows this.
```

### 5 Content (levels, data, scenarios)

Baba Is You added a level editor and 250 new levels in a 2021 update ([Wikipedia](https://en.wikipedia.org/wiki/Baba_Is_You)). For puzzles, the quantity and order of levels are the product itself.

- Delegate to agents: Level generation, solution verification, shortest-move calculation, data formatting
- Humans decide: Order to present, order to teach, position of difficulty spikes, pacing of the whole
- How: Ask the agent to build tools for mass production and verification. Adoption is decided by humans through actually playing ([Level design](/en/design/level-design/), [Playtesting](/en/design/playtesting/))

```text
Read JSON in levels/ and create npm run check:levels to verify:
- All levels have solutions (confirmed by solver)
- Output a table of shortest moves and whether levels increase in difficulty with level number
- Warn about sections where the same solution repeats for three or more levels
Create 20 new levels in levels/draft/. I will decide whether to adopt them.
```

### 6 Game feel adjustment

In Claude of Duty, weapon appearance, recoil, and screen movement were issues until the very end. Game feel is an area where you can only adjust by hands-on testing ([Game feel](/en/agent-dev/game-feel/)).

- Delegate to agents: Extracting constants, debug UI to change values at runtime, recording changes
- Humans decide: Numeric values that feel good to the touch
- How: Communicate through numbers, not "make it lighter." See [Balancing](/en/design/balancing/) for balance

```text
Gather jump-related constants (gravity, initial velocity, airborne acceleration, grace period after leaving a cliff to still jump, time window to accept button input before landing) into src/feel.js,
Make them changeable at runtime via a slider that opens with the F1 key.
Save changed values to localStorage, and add a button to "output current values in feel.js format."
```

### 7 Operations, community, and updates

The relationship after launch is also differentiation. Baba Is You released an update with a level editor about two years and eight months after launch. In Haro's analysis, revenue concentrates in the top 1 percent. You need activity to be discovered after launch ([Wishlists](/en/monetization/wishlists/)).

- Delegate to agents: Reproducing bugs, fixing them, drafting release notes, implementing updates
- Humans decide: What to fix and what not to fix, how to dialogue with the community
- How: File each report as an issue one at a time, and ask the agent to create reproduction steps

```text
Read one report from issues/, and write a test to reproduce it.
If reproduced, create a fix proposal and explain the difference in behavior before and after the fix in two lines.
If not reproducible, list three things you should ask additionally.
```

### 8 Combining niches

Balatro combines poker hand rankings with roguelike deck building. Solo developer LocalThunk made it with the Löve framework. The inspiration came from the Cantonese card game "Big Two" (大老二) and Luck Be a Landlord, a roguelike themed around slot machines. Launched in February 2024 and sold over 5 million copies by January 2025, winning Game of the Year at Game Developers Choice Awards ([Wikipedia](https://en.wikipedia.org/wiki/Balatro)).

- Delegate to agents: Enumerating combination ideas, minimal prototyping, researching existing works
- Humans decide: Which combination to choose. Actually playing and checking if it is fun
- How: Create a table of "Genre A times Genre B times Your theme" and prototype promising combinations

```text
Create a table of 30 combinations of ten genres with my materials (on-call response, home gardening, railway schedules).
Columns should be "One-sentence description," "Core loop (three verbs)," "Similar existing work," "Difficulty to make (1-5)."
Prototype the three I choose into playable form, each playable in one hour.
```

## How to choose your axes

1. Write out your assets. Expertise, aesthetic sense, and activities you can sustain (sharing, community).
2. Make the axis closest to your assets your primary axis. The parts agents cannot make cheaper are harder for others to copy
3. Choose one secondary axis from the lower-cost axes. Constraints (axis 3) is an axis where effort pays off quickly
4. The axes you do not choose can remain one-shot. Polishing everything expands scope ([Scope](/en/getting-started/scope/))

## Claude of Duty through the lens of differentiation

What made Claude of Duty unique was not the game itself, but how it was made. The constraint of procedurally generating everything, the system of critic sub-agents scoring, and publishing verification scripts. The README itself suggests the tools might be more interesting than the game.
As a game, it targets an existing work (Call of Duty) and is a typical game in the genre. To make an original work from here, humans must decide at least one of the "Rules," "Theme," or "Constraints" axes.

## Exercise: Three things to change after one-shot generation

1. Play the one-shot result for 30 minutes. Note down scenes where you think, "I have seen this in every game." That is the averaged part
2. Choose three things to change. This combination uses little work for much effect:
   - One in Rules (axis 1)
   - One in Theme or Constraints (axis 2 or 3)
   - One in Art or Sound (axis 4)
3. Write each of the three in the form of the table below
4. Implement one by one, play each time yourself and have others play. See whether the change shows in the experience

| What to change | Specification (one line) | Completion condition | Verification |
|---|---|---|---|
| Rules | Example: Stop automatic attacks, manually arrange weapons by enemy weakness | Weapon arrangement changes winning or losing in the first two minutes | Play yourself |
| Theme | Example: Make enemies into alerts, use overnight incident response as material | Enemy names and behavior are explainable with work terminology | Read it yourself, show to coworkers |
| Art | Example: Fix at four colors, make it one-bit style | Screen colors stay within four colors in palette.js | Check script |

(The table examples are sample applications of a survivor-genre one-shot result.)

### Differentiation checklist

- [ ] When you describe this game in one sentence, you do not need to use the names of other works
- [ ] At least one rule does not appear in one-shot generation
- [ ] Your experience or knowledge is in the theme
- [ ] You decided one constraint and enforce it with instruction files and checks
- [ ] Art and sound follow a style guide
- [ ] Game feel numeric values are decided by you hands-on
- [ ] You had someone else play for 30 minutes and recorded their thoughts
- [ ] You have one-sentence answer ready for "there are others like it"
- [ ] You organized which parts use generated content and whether disclosure is needed
- [ ] You wrote what not to do in the game design document ([Game design document template](/en/design/game-design-doc/))

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Claude of Duty (GitHub)](https://github.com/mshumer/Claude-of-Duty) — Distinctive features of constraints and approach, author's own evaluation
- [Decrypt: The Dumbest-Looking AI Prompt Just Beat Months of Careful Game-Design Prompt Engineering](https://decrypt.co/374560/dumbest-ai-prompt-claude-beat-careful-game-design) — Reproduction and the view that it recombines existing implementations
- [explainx: Top 10 Claude Opus 5 Game Prompts](https://www.explainx.ai/blog/claude-opus-5-top-10-game-prompts-july-2026) — Summary of Opus 5 examples (secondary information)
- [GamesRadar: Steam study of over 53,000 games](https://www.gamesradar.com/games/steam-study-of-over-53-000-games-finds-60-90-percent-of-the-growth-in-monthly-releases-on-valves-store-is-from-games-using-ai-and-almost-none-of-them-make-money/) — Introduction to Sulka Haro's comprehensive survey
- [GamesRadar: Survey finds only 31% of Steam users have a problem with AI in games](https://www.gamesradar.com/games/survey-finds-only-31-percent-of-steam-users-have-a-problem-with-ai-in-games-with-43-percent-totally-fine-with-it/) — Introduction to GameDiscoverCo's player survey
- [GamesRadar: "Good games will get cloned and buried"](https://www.gamesradar.com/games/good-games-will-get-cloned-and-buried-ai-vibe-coding-is-one-of-the-biggest-threats-on-storefronts-like-steam-analyst-warns/) — Warning from Mat Piscatella at Circana
- [GDC 2026 State of the Game Industry](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/) — Industry view of generative AI
- [Steamworks: Content survey](https://partner.steamgames.com/doc/gettingstarted/contentsurvey) — Scope of AI-generated content disclosure
- [The Long Silence (GitHub)](https://github.com/achimala/TheLongSilence) — README of procedural generation game with setting and purpose
- [Baba Is You (Wikipedia)](https://en.wikipedia.org/wiki/Baba_Is_You) — Origin of puzzle with rules placed on board
- [Return of the Obra Dinn (Wikipedia)](https://en.wikipedia.org/wiki/Return_of_the_Obra_Dinn) — One-bit visuals and constraints
- [Balatro (Wikipedia)](https://en.wikipedia.org/wiki/Balatro) — Solo developer work created by combining genres
