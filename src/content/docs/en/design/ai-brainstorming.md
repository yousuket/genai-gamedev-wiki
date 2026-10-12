---
title: Using AI for Design Feedback
description: Prompt examples for using LLMs in brainstorming, design critique, and competitive research, plus strategies to counter common pitfalls like idea convergence and hallucination
sidebar:
  order: 7
lastUpdated: 2026-09-29
---

## Overview

- **Bouncing ideas off someone** means testing your thoughts against another person and refining them through their feedback. Large language models (LLMs) can play this role anytime, anywhere.
- This article shows three ways to use them, with prompt examples:
  - Brainstorming
  - Design critique
  - Competitive research
- We also cover two common pitfalls: convergence to generic ideas and hallucination (plausible-sounding errors).
- The prompt examples are service-agnostic. They work with Claude, ChatGPT, Gemini, and others.

## Fundamentals

- **AI generates, you decide**: LLMs produce many ideas quickly, but they can't judge which are interesting. Test that with [playtesting](/en/design/playtesting/).
- **Give context first**: Describe what you're making, your constraints (timeline, solo dev, available tech), and what fun you're after. Pasting a [one-page design document](/en/design/game-design-doc/) is the easiest way.
- **Don't stop at the first pass**: Pick ideas you like, explain why, and ask the AI to dig deeper in that direction.

## Ideation

### Combining constraints

Constraints spark wider ideas—a lesson from rapid prototyping ([How to Prototype a Game in Under 7 Days](https://www.gamedeveloper.com/game-platforms/how-to-prototype-a-game-in-under-7-days)).

```text
You are an indie game designer. Generate 10 game concepts that meet these constraints:

Requirements:
- Buildable solo within 6 months
- 2D, with AI-generated assets
- Core verb: "push"
- 15 minutes per play session

For each concept, show a one-line pitch, the core loop (three verbs), and how it differs from existing genres in a table.
Avoid obvious retreads of famous games. Make sure the 10 concepts differ from each other.
```

### Changing perspectives

```text
From the 10 concepts above, I chose concepts 3 and 7.
For each one, generate one improved version from the viewpoint of:
1. Someone who only plays puzzle games
2. Someone who loves competitive, skill-based multiplayer games
3. Someone who rarely plays games
```

### Working backward from aesthetics

```text
The experience I'm aiming for is Discovery and Expression in the MDA framework.
List 8 dynamics (what happens when you play) that create this experience.
For each dynamic, suggest 1 or 2 mechanics (rules) that make it happen.
```

See [The MDA Framework](/en/design/mda/) for more on this approach.

## Critiquing designs

LLMs tend to agree unless you ask them not to. Be explicit about wanting criticism.

```text
Here's my game design. Role-play as a tough publisher and critique it.

<design>
(paste one-page design document)
</design>

For each angle below, name the single deepest problem:
- What makes the core loop boring by the 10th play?
- What part of the scope could balloon for a solo developer?
- When store browsers see the pitch, what similar game comes to mind?
- What should playtesting verify first?

Don't praise. Mark guesses as "speculation."
```

**Pre-mortem** (imagine the game flopped and work backward to why) also works well.

```text
Imagine we shipped this game and, a year later, it sold nothing.
List 5 possible causes in each area: design, development, and marketing.
```

See [Building a Wishlist](/en/monetization/wishlists/) for marketing-specific insights.

## Competitive research

LLMs help you find similar games.

```text
I'm looking for existing games like this:
(one-line pitch and core loop)

List up to 10 candidates. For each, show:
- Title
- How it's similar
- How it differs
- Your confidence (high/medium/low)

Don't list games you're not sure exist. If you're unsure, say so.
```

- Never ask LLMs for sales numbers or revenue. They may confabulate data they haven't seen.
- If your tool has web search, ask it to cite sources.

## Common pitfalls and solutions

### 1. Convergence to generic ideas

Research shows that AI ideas tend to cluster, even from different users.

- In experiments by Doshi and Hauser, short stories generated with AI ideas were rated as creative individually, but similar across authors, lowering collective diversity ([Science Advances, 2024](https://www.science.org/doi/10.1126/sciadv.adn5290)).
- Anderson and colleagues tested 36 people. Those using ChatGPT generated semantically similar ideas across the group more than those using other tools, and felt less ownership of their work ([Creativity & Cognition 2024](https://dl.acm.org/doi/10.1145/3635636.3656204)).

**Solutions**

- Treat the first few ideas as "obvious stuff" and discard them. Ask for ideas "in a different direction."
- Assign different personas (viewpoints) to the AI. Research shows using multiple personas reduces convergence ([Wan & Kalman, arXiv](https://arxiv.org/abs/2504.13868)).
- **Think first**: Write 5 ideas yourself before asking the AI. Your own thinking won't be as easily pulled toward AI suggestions.
- Mix in material the AI wouldn't know: your own experience, things you love.

### 2. Hallucination

LLMs output false information confidently. OpenAI researchers point out that training and evaluation reward guessing over admitting "I don't know" ([Why language models hallucinate](https://openai.com/index/why-language-models-hallucinate/), 2025).

**Common cases in game design**

- Listing games that don't exist or adding features absent from real games
- Making up sales figures or player counts
- Answering rule questions with old or guessed information

**Solutions** (including methods from Anthropic's [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations))

- Explicitly permit "I don't know" answers.
- Ask for sources or reasoning with each claim. Withdraw unsupported claims.
- If you provide documents, say "use only the information I've shared."
- Ask the same question multiple times. Treat disagreements as red flags.
- For policy and rules, don't trust AI memory. Check [platform AI policies](/en/legal/platform-policies/) or [tool commercial terms](/en/legal/tool-terms/).

### 3. Delegating decisions to AI

Ask the AI "which idea is most fun?" and it will answer confidently. But that's not real player feedback. When narrowing ideas, build a small [core loop](/en/design/core-loop/) prototype and decide by feel. That's how you find out.

## How to use AI

- **Divide roles**: Use AI for divergence (broadening ideas), and yourself + playtesters for convergence (picking the best). This split reduces failure.
- **Keep conversations**: Save good prompts and outputs as Markdown in your design folder. Later, paste them into your design doc or GDD ([Design document template](/en/design/game-design-doc/)).
- **Connect to development**: Turn finalized designs into a GDD and use it as a spec for AI coding tools ([AI-driven development workflow](/en/dev-env/ai-workflow/)).
- **Genre choice**: Another angle is starting with genres that AI-generated assets suit well ([Genres that work with generative AI](/en/genres/ai-friendly/)).
- When inputting unpublished designs, check how the service handles input data (whether it trains on it, etc.).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Generative AI enhances individual creativity but reduces the collective diversity of novel content (Science Advances, 2024)](https://www.science.org/doi/10.1126/sciadv.adn5290) — Experiment showing homogenization in AI-generated creative work
- [Homogenization Effects of Large Language Models on Human Creative Ideation (C&C 2024)](https://dl.acm.org/doi/10.1145/3635636.3656204) — Homogenization in LLM-assisted brainstorming ([arXiv version](https://arxiv.org/abs/2402.01536))
- [Diverse AI Personas Can Mitigate the Homogenization Effect in Human-AI Collaborative Ideation (arXiv)](https://arxiv.org/abs/2504.13868) — Using multiple personas to maintain diversity
- [Why language models hallucinate (OpenAI, 2025)](https://openai.com/index/why-language-models-hallucinate/) — Explanation of why hallucination occurs
- [Reduce hallucinations (Claude Docs)](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) — Prompt techniques to reduce hallucination
