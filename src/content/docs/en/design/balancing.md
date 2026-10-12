---
title: Balancing
description: Numerical design concepts, management in spreadsheets, verification through simulation, and how to use AI to write simulation code
sidebar:
  order: 4
lastUpdated: 2026-09-29
---

## Overview

- **Balancing** is the process of deciding numerical values such as HP, attack power, price, and spawn rates so that the game is fair, appropriately challenging, and no single choice is overpowered.
- Ian Schreiber describes much of balancing as "deciding which numbers to use in your game" ([Game Balance Concepts, Level 1](https://gamebalanceconcepts.wordpress.com/2010/07/07/level-1-intro-to-game-balance/)).
- This article covers the fundamentals of numerical design, management in spreadsheets, verification through simulation, and how to have AI write simulation code.
- For engineers, this is a phase where you can leverage your strengths most easily.

## Fundamentals of numerical design

### Start with your design goal

Numbers should be determined by working backward from the experience you want to create ([MDA Framework](/en/design/mda/)). For example, write down clear goals like these first:

- Players should win against the first boss about 1 in 3 times on first attempt
- One playthrough (one run) should take 20–30 minutes
- The win rate difference between any two weapons should be within 10%

If your goals are expressed numerically, you can later measure progress against them using simulation or play data.

### Align cost with effect

Schreiber explains a method for elements like cards or items where "you pay a cost to get an effect": decide the **cost curve** (the relationship between cost and effect) before assigning individual values ([Level 3: Transitive Mechanics and Cost Curves](https://gamebalanceconcepts.wordpress.com/2010/07/21/level-3-transitive-mechanics-and-cost-curves/)).

- A curve where higher costs have smaller effect growth makes early choices crucial
- A curve where higher costs have larger effect growth makes late-game choices crucial
- An abrupt shift in the curve at a certain point creates distinct early, mid, and late game phases

### Common numerical formulas

| Purpose | Common formula | Characteristics |
|---|---|---|
| Experience needed to level up | `base * level ^ k` (start with k ≈ 1.5–2) | Growth accelerates toward the end; adjust k to control the curve |
| Enemy strength | `base * (1 + rate) ^ stage` | Grows exponentially; compare against player progression |
| Price | Effect amount × coefficient + fixed cost | Same concept as cost curves |

The coefficients here are starting points. The correct value varies by game, so verify using the methods in the next section.

## Manage in a spreadsheet

Keep numbers in a spreadsheet (Google Sheets, Excel, LibreOffice Calc, etc.) rather than hardcoding them. Then export to CSV or JSON and load them in your game. This makes adjustments much easier.

**Recommended sheet structure (example)**

| Sheet | Content |
|---|---|
| params | Global constants that affect the whole game (base HP, growth rate, etc.) |
| units / cards | One row per element; columns for cost, effect, and "theoretical value" calculated from the cost curve |
| curves | Experience requirements by level or enemy strength by stage; include charts |
| log | A record of when, what, and why values changed |

- Create a **difference from theoretical value** column to instantly spot overpowered or underpowered elements.
- Track numerical files in Git so you can correlate changes with playtesting results.
- For systematic learning, Schreiber and Brenda Romero's book "Game Balance" (CRC Press, 2021) covers spreadsheet techniques in detail ([Routledge](https://www.routledge.com/Game-Balance/Schreiber-Romero/p/book/9781498799577)).

## Verify with simulation

Games with randomness and many combinations are hard to predict mentally or with spreadsheets alone. Instead, run simplified code representing your game rules thousands of times and examine the distribution of results (**Monte Carlo simulation**).

The MDA paper itself uses a probability distribution for two dice to estimate how long it takes to go around a Monopoly board, showing that impact can be predicted before changing board size ([MDA paper](https://users.cs.northwestern.edu/~hunicke/MDA.pdf)).

### Example: Boss fight win rate by weapon

```python
import random
import statistics

WEAPONS = {
    # name: (damage per hit, crit rate, crit multiplier)
    "sword": (12, 0.10, 2.0),
    "dagger": (8, 0.35, 2.5),
    "axe": (18, 0.05, 1.5),
}
PLAYER_HP = 100
BOSS_HP = 130
BOSS_DAMAGE = (6, 14)  # Boss damage range per turn

def fight(weapon, rng):
    atk, crit_rate, crit_mul = WEAPONS[weapon]
    hp, boss = PLAYER_HP, BOSS_HP
    turns = 0
    while hp > 0:
        turns += 1
        dmg = atk * (crit_mul if rng.random() < crit_rate else 1)
        boss -= dmg
        if boss <= 0:
            return True, turns
        hp -= rng.randint(*BOSS_DAMAGE)
    return False, turns

def simulate(weapon, n=10_000, seed=0):
    rng = random.Random(seed)
    results = [fight(weapon, rng) for _ in range(n)]
    win_rate = sum(win for win, _ in results) / n
    avg_turns = statistics.mean(t for _, t in results)
    return win_rate, avg_turns

for w in WEAPONS:
    rate, turns = simulate(w)
    print(f"{w:7s} win rate {rate:6.1%}  avg turns {turns:5.1f}")
```

Output (Python 3):

```text
sword   win rate  76.4%  avg turns   9.8
dagger  win rate  42.4%  avg turns  10.1
axe     win rate 100.0%  avg turns   7.7
```

This output shows that the axe is overpowered and the dagger is underpowered. Both fall far outside the goal of "win rate difference within 10%", so you'd try adjustments like lowering axe damage or raising dagger crit rate, then rerun the simulation.

- Fix the random seed so you only compare the difference when numbers change.
- The key is to output the **goal metrics** you defined upfront: win rate, time to complete, etc.
- Using a small model with just the rules—not the full game code—lets you run thousands of iterations quickly.

### No-code option

[Machinations](https://machinations.io/) is a browser-based tool for diagramming and simulating flows of resources in a game (like currency income and spending). It's available free to start (as of September 2026). Choose between writing code or building diagrams based on what suits you.

### Compare with play data

Simulation is a hypothesis. Ultimately, you verify with real play results. Mega Crit (developer of Slay the Spire) collects server data on card selection rate when offered and win rate of decks including each card, then uses this for balancing decisions (presented at GDC 2019 on [GDC Vault](https://www.gdcvault.com/play/1025731/-Slay-the-Spire-Metrics) and covered in a [Game Developer article](https://www.gamedeveloper.com/design/how-i-slay-the-spire-i-s-devs-use-data-to-balance-their-roguelike-deck-builder)). Even in solo development, a test build with simple logging helps ([Playtesting](/en/design/playtesting/)).

## How to use AI

- **Generate simulation code**: Write out your rules as bullet points, give them to an LLM, and ask something like "Write a Monte Carlo simulation of this in Python. Fix the seed, output win rate and average turns for each weapon." You'll get code like the example above in minutes.
- **Write the rules clearly first**: If your explanation to the AI is vague, it will make assumptions. Give the instruction "Ask before guessing when specs are unclear."
- **Spreadsheet formulas**: Tasks like "Calculate theoretical values from the cost curve and highlight the difference from actual values in color" are also straightforward to delegate.
- **Analyze results**: You can also give the AI a table of simulation results and ask it to flag items that miss your goals and suggest changes.

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial publication.
<!-- AUTO-UPDATE:END -->

## References

- [Game Balance Concepts (Ian Schreiber)](https://gamebalanceconcepts.wordpress.com/) — A free online course teaching balancing in 10 lessons
- [Level 3: Transitive Mechanics and Cost Curves](https://gamebalanceconcepts.wordpress.com/2010/07/21/level-3-transitive-mechanics-and-cost-curves/) — Explanation of cost curves
- [Game Balance (Schreiber & Romero, CRC Press, 2021)](https://www.routledge.com/Game-Balance/Schreiber-Romero/p/book/9781498799577) — Comprehensive guide including spreadsheet techniques
- [Slay the Spire: Metrics Driven Design and Balance (GDC Vault, 2019)](https://www.gdcvault.com/play/1025731/-Slay-the-Spire-Metrics) — Talk on balancing using play data
- [How Slay the Spire's devs use data to balance their roguelike deck-builder (Game Developer)](https://www.gamedeveloper.com/design/how-i-slay-the-spire-i-s-devs-use-data-to-balance-their-roguelike-deck-builder) — Article covering the above approach
- [Machinations](https://machinations.io/) — Browser tool for simulating game economy flows with diagrams
- [MDA: A Formal Approach to Game Design and Game Research (PDF)](https://users.cs.northwestern.edu/~hunicke/MDA.pdf) — Includes examples of probability models for dice
