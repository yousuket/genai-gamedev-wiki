---
title: Playtesting
description: How to recruit playtesters, observe players, use surveys effectively, distribute with tools like Steam Playtest, and aggregate feedback with AI
sidebar:
  order: 5
lastUpdated: 2026-09-29
---

## Overview

- **Playtesting** means having others play your game in development to confirm you're creating the intended experience. It's different from QA (quality assurance), which focuses on finding bugs.
- Valve's Mike Ambinder views game design as a "hypothesis" and playtesting as an "experiment," advocating for early, frequent data collection and iterative improvement ([GDC 2009 presentation slides](https://cdn.akamai.steamstatic.com/apps/valve/2009/GDC2009_ValvesApproachToPlaytesting.pdf)).
- This article covers recruiting testers, observing players, when to use surveys, distribution methods like Steam Playtest, and using AI to aggregate feedback.

## When to test and who to ask

### Start early

Solo developer Adriaan de Jongh recommended in a GDC 2017 talk that you test continuously, not just near completion—from v0.1 through v1.0 ([Playtesting: Avoiding Evil Data (slides)](https://media.gdcvault.com/gdc2017/Presentations/deJongh_PlaytestingAvoidingEvilData.pdf)). Even a prototype with placeholder assets can show whether your [core loop](/en/design/core-loop/) is fun.

### Test with different people

That same talk noted that different testers can completely miss pain points others encounter. It recommends testing with a wide range of people.

| Source | Advantages | Notes |
|---|---|---|
| Friends and family | Easy to ask; you can observe in person | May hold back honest criticism |
| Other game developers | Offer specific, technical feedback | Perspective differs from typical players |
| Game dev meetups and events | See many first-time reactions at once | Takes time to prepare |
| SNS and Discord communities | Easy to recruit many testers | No face-to-face observation |
| Steam / itch.io public tests | Closer to actual purchasing audience | Requires setup of public pages first |

## How to observe

Focus on **what players do, not what they say**. Ambinder's slides emphasize that direct observation reveals what people actually do, not what they claim to do (though noting that observer presence can skew results).

### Before play starts

- Don't explain the game, controls, story, or unfinished features
- Only tell them "this isn't finished yet"

This is a key point from de Jongh's talk. Explanation prevents you from discovering the problems real players hit on first contact.

### While playing

The Level Design Book recommends standing slightly behind, taking notes on behavior and reactions, asking few questions, and only intervening if the player is completely stuck ([Playtesting](https://book.leveldesignbook.com/process/blockout/playtesting)).

**Example notes to track**

- Time and situation
- Moments when they're confused or paused (how many seconds)
- Actions that differ from your intent (e.g., they ignored where you wanted to direct them)
- Expressions and sounds (they laughed, sighed)
- Where they quit early

You can also try **think-aloud protocol**, where players narrate their thoughts. Ambinder notes this helps you understand "why" but can disrupt play and create an unnatural experience.

### After play ends

- Confirm understanding: "What did you think the orange light meant?"
- Confirm subjective experience: "Was the combat easy or hard?"
- Notable impressions

(Questions adapted from [The Level Design Book](https://book.leveldesignbook.com/process/blockout/playtesting))

For "How would you fix it?"—don't adopt that answer directly. Treat it as a clue that a problem exists, then solve it yourself.

## When to use surveys

Surveys have pros and cons.

- **Cautious approach**: de Jongh recommends avoiding surveys and online written feedback, prioritizing direct observation or gameplay recordings.
- **Combined approach**: Ambinder explains that multiple-choice questions reduce bias and allow time-series comparison, but lose nuance and make it harder to turn ratings into concrete changes. Valve combines observation, individual Q&A, and group Q&A.

For solo developers, **make observation primary and surveys secondary**. If you use surveys, keep these points in mind:

- Keep them to 5–10 questions
- Include the same questions each iteration ("difficulty," "clarity") to track changes over versions
- Avoid leading questions (✗"Was the new boss fun?" → ✓"What was your impression of the new boss?")
- Include 1–2 open-ended questions
- Ask only essential demographics (age, genres they usually play). Don't collect personal info unnecessarily.

## Distribution methods

### Steam Playtest

Steam has a **Steam Playtest** feature separate from the main game release ([Steamworks documentation](https://partner.steamgames.com/doc/features/playtest), as of September 2026).

- A sign-up prompt appears on your main game's store page
- You can choose to approve testers individually (default) or let them join automatically
- Free for both developers and testers
- Joining, leaving, and feedback don't affect the wishlist, and testers can't leave reviews on the main game

For store pages and wishlists, see [Building your wishlist](/en/monetization/wishlists/).

### itch.io

On itch.io, you can set a project to "Draft" to show only to people with a secret link, or "Restricted" to require a download key or password ([Limited Playtests & Releases](https://itch.io/docs/creators/limited-releases), [Access control](https://itch.io/docs/creators/access-control)).

### Other methods

- Hand builds to friends
- Publish a browser version at a limited URL

Whatever you choose, **arrange to collect gameplay recordings (video and audio)** to compensate for not being able to observe in person.

## Reducing overhead

de Jongh recommends preparing a list of testers, email templates, and reminders to lower the friction of running tests. The talk also shared that about 30% of people respond to online requests within 7 days, and sending reminders brings in another 30%.

## How to use AI

- **Aggregate feedback**: Pass free-response survey answers and observation notes to an LLM with instructions like "classify problems by scene, count how many people mentioned each one." This speeds up spotting trends.
- **Always require citations**: For each category in your summary, have the AI quote the original statement. Anthropic's documentation explains how to make the AI show supporting quotes and retract claims where it finds none, preventing fabricated opinions ([Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)).
- **Don't lose minority views**: Summaries often favor the majority. Ask the AI to "list problems mentioned by only one person separately."
- **Log analysis**: Ask AI to write a script that counts death locations or completion times from your logs to find bottlenecks ([Balancing](/en/design/balancing/)).
- **Protect privacy**: Remove tester names and contact info before sending data to AI services.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [Playtesting: Avoiding Evil Data (GDC Vault, 2017)](https://www.gdcvault.com/play/1024132/playtesting-avoiding-evil) — Talk on avoiding misleading data in playtesting ([slide PDF](https://media.gdcvault.com/gdc2017/Presentations/deJongh_PlaytestingAvoidingEvilData.pdf))
- [Valve's Approach to Playtesting: The Application of Empiricism (GDC Vault, 2009)](https://www.gdcvault.com/play/1566/Valve-s-Approach-to-Playtesting) — Strengths and weaknesses of observation, Q&A, surveys, and data collection ([slide PDF](https://cdn.akamai.steamstatic.com/apps/valve/2009/GDC2009_ValvesApproachToPlaytesting.pdf))
- [Playtesting (The Level Design Book)](https://book.leveldesignbook.com/process/blockout/playtesting) — How to observe and post-play questions
- [Steam Playtest (Steamworks documentation)](https://partner.steamgames.com/doc/features/playtest) — Official guide to Steam's playtest distribution feature
- [Limited Playtests & Releases (itch.io)](https://itch.io/docs/creators/limited-releases) — Limited distribution on itch.io
- [Access control (itch.io)](https://itch.io/docs/creators/access-control) — Setting access restrictions on itch.io
