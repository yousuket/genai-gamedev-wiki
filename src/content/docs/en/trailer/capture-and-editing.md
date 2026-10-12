---
title: Screen Capture and Editing Tools
description: Tools for recording game footage for trailers, how to create a capture build with UI hidden and debug camera, resolution and framerate considerations, and choosing an editing tool.
sidebar:
  order: 2
lastUpdated: 2026-09-29
---

## Overview

The quality of a trailer depends far more on **the quality of the recorded footage** than on editing technique. This article covers the following topics.

- How to choose tools for recording game footage
- How to create a "capture build" to make recording easier
- Resolution and framerate considerations
- Free editing tools and export settings

Understanding the structure of your trailer becomes easier if you read [Trailer Structure](/en/trailer/structure/) first.

## Workflow overview

1. Create a list of scenes you want to show (shot list)
2. Record each scene multiple times using the capture build
3. Arrange clips in editing software and sync music and sound effects
4. Export with settings for each platform

"Planning which scenes to show and practicing before shooting" is faster in the end than "recording while playing and looking for good moments" ([Derek Lieu: 10 Common Indie Game Trailer Mistakes](https://www.derek-lieu.com/blog/2020/9/14/10-common-indie-game-trailer-mistakes-and-how-to-fix-them)).

## Recording tools

### General recording tools

| Tool | Supported OS | Features |
|---|---|---|
| [OBS Studio](https://obsproject.com/) | Windows / macOS / Linux | Free and open source. High flexibility in settings. Latest stable is 32.2.2 (August 14, 2026, [GitHub Releases](https://github.com/obsproject/obs-studio/releases)); 33.0 is in beta (as of September 2026) |
| [NVIDIA App](https://www.nvidia.com/en-us/software/nvidia-app/) (ShadowPlay) | Windows (NVIDIA GPU) | Instant Replay feature lets you save gameplay from just before a moment you want. Official site states support for 4K HDR 120fps recording (as of September 2026) |
| [Xbox Game Bar](https://support.xbox.com/en-US/help/friends-social-activity/share-socialize/record-game-clips-game-bar-windows-10) | Windows | Built into OS. Press `Win + Alt + R` to start or stop recording |
| [macOS Screenshot App](https://support.apple.com/en-us/102618) | macOS | Built into OS. Press `Shift + Command + 5` to open the recording toolbar |

Instant Replay is useful for capturing moments of unexpected success. For carefully planned shots, OBS is more straightforward to use.

### OBS configuration tips

According to OBS's official [Audio/Video Formats Guide](https://obsproject.com/kb/audio-video-formats-guide) (as of September 2026), note the following.

- **Container format**: Standard MP4 / MOV is not recommended for direct recording because interrupted writes may not recover. Use the default MKV or Hybrid MP4 / Fragmented MP4 instead. MKV can be converted to MP4 after recording via "remux."
- **Encoder**: For local recording, choose the best available hardware encoder you can use (AV1 > HEVC > H.264 in order).
- **Bitrate**: Set it higher than for streaming because editing reduces quality.

### Recording features built into engines

Using the engine's recording feature can produce frame-perfect footage even in demanding scenes.

| Engine | Feature | Details |
|---|---|---|
| Godot | [Movie Maker Mode](https://docs.godotengine.org/en/stable/tutorials/animation/creating_movies.html) | Non-real-time output at fixed FPS ensures no frame drops regardless of PC performance. Can run from command line with `--write-movie` and `--fixed-fps` |
| Unity | [Unity Recorder](https://docs.unity3d.com/Packages/com.unity.recorder@5.1/manual/index.html) | Records video, image sequences, and audio. **Works only in Editor Play mode**; cannot be used in built games |
| Unreal Engine | [Take Recorder](https://dev.epicgames.com/documentation/en-us/unreal-engine/record-gameplay-in-unreal-engine) / [Movie Render Queue](https://dev.epicgames.com/documentation/en-us/unreal-engine/rendering-high-quality-frames-with-movie-render-queue-in-unreal-engine) | Record gameplay and edit in Sequencer, then export at high quality |

## Creating a capture build

A capture build is a development build with features added to make recording easier. For engineers, this is one of the highest-impact investments.

### Features to include

| Feature | Purpose |
|---|---|
| HUD / UI toggle | Record both with and without HUD |
| Debug camera (free camera) | Move the camera independently of the player to capture wide and close-up shots |
| Time speed adjustment and pause | Slow motion and freeze-frames at critical moments |
| Cheats (invincibility, spawn enemies, stage skip) | Quickly reproduce the scenes you want to show |
| Fixed random seed | Replay the same sequence multiple times |
| Hide debug display and mouse cursor | Avoid unwanted on-screen elements |
| Resolution presets (including portrait) | Shoot portrait versions separately for [Short videos on social media](/en/trailer/social-shorts/) |

### Example implementation (Godot 4)

A minimal example registered as an autoload (persistent script).

```gdscript
# capture_tools.gd — Register this in Project Settings > Autoload
extends Node

func _ready() -> void:
    # This node receives input even when the game is paused
    process_mode = Node.PROCESS_MODE_ALWAYS

func _unhandled_input(event: InputEvent) -> void:
    if not OS.is_debug_build():
        return  # Disabled in release builds
    if event is InputEventKey and event.pressed and not event.echo:
        match event.keycode:
            KEY_F1:  # Toggle visibility of nodes in the "hud" group
                for node in get_tree().get_nodes_in_group("hud"):
                    node.visible = not node.visible
            KEY_F2:  # Slow motion
                Engine.time_scale = 0.25 if Engine.time_scale == 1.0 else 1.0
            KEY_F3:  # Pause
                get_tree().paused = not get_tree().paused
            KEY_F4:  # Toggle mouse cursor visibility
                if Input.mouse_mode == Input.MOUSE_MODE_HIDDEN:
                    Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
                else:
                    Input.mouse_mode = Input.MOUSE_MODE_HIDDEN
```

In Unity, the equivalent approach is to wrap similar code in `#if UNITY_EDITOR || DEVELOPMENT_BUILD` and change speed using `Time.timeScale`.

:::caution
Make sure capture features do not remain in release builds. Either branch on build type as in the example above, or set up a dedicated build configuration.
:::

## Resolution and framerate

| Item | Target | Why |
|---|---|---|
| Recording resolution | Same as final output or higher | Recording in 4K gives you room to zoom or crop when outputting 1080p |
| Recording framerate | 60fps | Steam supports 30fps and 60fps ([Steamworks](https://partner.steamgames.com/doc/store/trailer)). Shooting at 60fps works for both |
| Steam output | 1920×1080, 16:9 | Maximum resolution recommended by Steamworks (as of September 2026) |
| Portrait video | 1080×1920, 9:16 | For short-form videos |

Mixed framerates between clips make motion look stuttery. Derek Lieu's [Quality Control Checklist for Game Trailers](https://www.derek-lieu.com/blog/2022/7/11/quality-control-check-list-for-game-trailers) lists this as a check point. For demanding scenes, use non-real-time output like Godot Movie Maker to ensure smooth playback.

## Editing tools

| Tool | Price | Supported OS | Features |
|---|---|---|---|
| [DaVinci Resolve](https://www.blackmagicdesign.com/products/davinciresolve) | Free version / Studio $295 | Windows / macOS / Linux | Latest is 21. Free version: 8-bit, up to 60fps, up to Ultra HD (3840×2160). Studio: AI features (DaVinci Neural Engine), 120fps, and higher than 4K (as of September 2026) |
| [Kdenlive](https://kdenlive.org/) | Free and open source | Linux / Windows / macOS / BSD | Latest is 26.08.1 (September 11, 2026) |
| [Shotcut](https://shotcut.org/) | Free and open source | Windows / macOS / Linux | Latest is 26.9 (as of September 2026). Lightweight performance |
| [CapCut](https://www.capcut.com/) | Free / paid plans | Windows / macOS / Mobile | Many templates; designed for short-form video. Review the terms of service (see below) |

If you are unsure which to choose, try a free tool first to make one trailer, then switch if you find something lacking. DaVinci Resolve is feature-rich but has a steep learning curve.

:::caution[CapCut Terms of Service]
CapCut's Terms of Service (updated April 15, 2026) include a clause granting CapCut a non-exclusive, royalty-free, perpetual, worldwide license to use content you upload ([CapCut Terms of Service](https://www.capcut.com/clause/terms-of-service)). How to think about tool terms is covered in [Commercial Use of AI Tools](/en/legal/tool-terms/).
:::

### Export settings (for Steam)

Steamworks recommendations are as follows ([Steamworks: Trailers](https://partner.steamgames.com/doc/store/trailer), as of September 2026).

- Container: .mp4 / .mov / .wmv
- Video: H.264 recommended, at least 5,000 kbps
- Audio: AAC recommended, 44.1 kHz or 48 kHz (converted to stereo)
- For Adobe Media Encoder, a preset of "H.264 Video (20Mbps) + AAC Stereo Audio (192kbps)" is provided

For details, see [Steam Trailer Requirements](/en/trailer/steam-trailer/).

## How to use AI

- **Implementing capture features**: Debug cameras and cheat commands are boilerplate code, making them well-suited to AI coding tools.
- **Creating ffmpeg commands**: Having an LLM write commands speeds up conversion work.

```sh
# Convert MKV to MP4 without re-encoding (remux)
ffmpeg -i input.mkv -c copy output.mp4

# Crop the center 16:9 region and scale to 1080x1920 portrait
ffmpeg -i input.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:a copy vertical.mp4
```

- **AI features in editing software**: Transcription, subtitle generation, and noise reduction save editing time. When using features that generate or modify footage, be careful that the video matches the actual gameplay ([Where AI Video Generation Fits](/en/trailer/ai-video/)).

## Latest updates

<!-- AUTO-UPDATE:START -->
- **2026-09-29**: Initial version.
<!-- AUTO-UPDATE:END -->

## References

- [OBS Studio](https://obsproject.com/) — Free recording and streaming software
- [OBS Audio/Video Formats Guide](https://obsproject.com/kb/audio-video-formats-guide) — How to choose container formats and encoders
- [OBS Studio Releases (GitHub)](https://github.com/obsproject/obs-studio/releases) — Version history
- [NVIDIA App](https://www.nvidia.com/en-us/software/nvidia-app/) — ShadowPlay recording features
- [Godot: Creating movies](https://docs.godotengine.org/en/stable/tutorials/animation/creating_movies.html) — Official documentation for Movie Maker mode
- [Unity Recorder](https://docs.unity3d.com/Packages/com.unity.recorder@5.1/manual/index.html) — Recording package for Unity
- [Record Gameplay in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/record-gameplay-in-unreal-engine) — How to use Take Recorder
- [DaVinci Resolve](https://www.blackmagicdesign.com/products/davinciresolve) — Free and paid versions
- [Kdenlive](https://kdenlive.org/) / [Shotcut](https://shotcut.org/) — Open source editing software
- [Trailers (Steamworks Documentation)](https://partner.steamgames.com/doc/store/trailer) — Export specifications for Steam
