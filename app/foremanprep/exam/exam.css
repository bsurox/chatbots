/* FILE: app/foremanprep/exam/exam.css */
/* Exam simulator styles v4. The flagged marker in the jump grid is
   now a small orange flag glyph instead of a dot - obvious at a
   glance. v3: back pill top-left of every screen, plus a confirm
   modal so nobody quits a live test by accident.
   fe- prefix, rides the fp- canvas. */

.fe-wrap { max-width: 640px; margin: 0 auto; padding: calc(env(safe-area-inset-top) + 12px) 18px calc(env(safe-area-inset-bottom) + 40px); }

.fe-bar { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; margin-bottom: 14px; background: #0a0a0a; border-bottom: 1px solid #1e1e1e; }
.fe-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.fe-back { display: inline-flex; align-items: center; gap: 6px; background: #161616; border: 1px solid #333; border-radius: 999px; color: #ddd; font-size: 13px; font-weight: 700; padding: 6px 14px 6px 10px; cursor: pointer; text-decoration: none; }
.fe-back::before { content: ""; width: 7px; height: 7px; border-left: 2px solid #ddd; border-bottom: 2px solid #ddd; transform: rotate(45deg); display: inline-block; }
.fe-clock { font-size: 14px; font-weight: 800; color: #fff; font-variant-numeric: tabular-nums; }
.fe-clock.low { color: #f87171; }
.fe-count { font-size: 12.5px; color: #888; }
.fe-title { font-size: 22px; font-weight: 800; color: #fff; margin: 0 0 6px; }
.fe-lead { font-size: 13.5px; color: #999; line-height: 1.55; margin: 0 0 16px; }
.fe-badge { display: inline-block; font-size: 11.5px; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase; color: var(--fp); background: var(--fp-soft); border: 1px solid rgba(249, 115, 22, 0.4); border-radius: 999px; padding: 4px 10px; margin-bottom: 12px; }
.fe-q { font-size: 17.5px; font-weight: 700; color: #fff; line-height: 1.45; margin: 0 0 14px; }
.fe-choices { display: grid; gap: 9px; margin-bottom: 16px; }
.fe-choice { background: #111; border: 1px solid #2c2c2c; border-radius: 12px; color: #ddd; font-size: 14.5px; line-height: 1.4; padding: 12px 14px; text-align: left; cursor: pointer; }
.fe-choice:hover { border-color: #444; }
.fe-choice.picked { background: rgba(249, 115, 22, 0.13); border-color: var(--fp); color: #ffd9bd; }
.fe-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 18px; }
.fe-flag { font-size: 13px; font-weight: 700; padding: 7px 13px; border-radius: 999px; cursor: pointer; background: transparent; border: 1px solid #444; color: #aaa; }
.fe-flag.on { background: rgba(249, 115, 22, 0.15); border-color: var(--fp); color: var(--fp); }
.fe-nav { display: flex; gap: 8px; }
.fe-nav button { background: #161616; border: 1px solid #333; border-radius: 10px; color: #ddd; font-size: 13px; font-weight: 700; padding: 8px 14px; cursor: pointer; }
.fe-nav button:disabled { opacity: 0.4; cursor: default; }
.fe-review { width: 100%; background: #fff; border: none; border-radius: 12px; color: #000; font-size: 15px; font-weight: 800; padding: 13px 0; cursor: pointer; }
.fe-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px; margin-bottom: 12px; }
.fe-cell { position: relative; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; background: #111; border: 1px solid #2c2c2c; border-radius: 8px; color: #999; font-size: 12.5px; font-weight: 700; cursor: pointer; }
.fe-cell.answered { background: #1d1d1d; border-color: #4a4a4a; color: #fff; }
.fe-cell.flagged::after { content: "\2691"; position: absolute; top: 1px; right: 3px; font-size: 11px; line-height: 1; color: var(--fp); }
.fe-legend { display: flex; gap: 16px; font-size: 12px; color: #777; margin-bottom: 16px; }
.fe-warn { font-size: 13px; color: #fbbf24; line-height: 1.5; margin: 0 0 12px; }
.fe-submit { width: 100%; background: var(--fp); border: none; border-radius: 12px; color: #000; font-size: 15px; font-weight: 800; padding: 13px 0; cursor: pointer; margin-bottom: 9px; }
.fe-submit:hover { filter: brightness(1.07); }
.fe-ghost { width: 100%; background: transparent; border: 1px solid #333; border-radius: 12px; color: #bbb; font-size: 14px; font-weight: 700; padding: 12px 0; cursor: pointer; }
.fe-scorewrap { text-align: center; padding-top: 24px; }
.fe-band { font-size: 13px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; margin-bottom: 8px; }
.fe-band.pass { color: #4ade80; }
.fe-band.fail { color: #f87171; }
.fe-score { font-size: 44px; font-weight: 800; color: #fff; margin: 0 0 4px; }
.fe-sub { font-size: 14px; color: #999; line-height: 1.55; margin: 0 0 20px; }
.fe-doms { text-align: left; display: grid; gap: 8px; margin-bottom: 20px; }
.fe-dom { background: #111; border: 1px solid #262626; border-radius: 10px; padding: 10px 12px; }
.fe-domrow { display: flex; justify-content: space-between; font-size: 13px; color: #ccc; margin-bottom: 6px; }
.fe-dombar { height: 5px; background: #222; border-radius: 99px; overflow: hidden; }
.fe-domfill { height: 100%; background: var(--fp); border-radius: 99px; }
.fe-saved { font-size: 12.5px; color: #4ade80; margin: 0 0 10px; }

.fe-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.72); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 24px; }
.fe-modal { background: #141414; border: 1px solid #333; border-radius: 14px; max-width: 380px; width: 100%; padding: 20px; }
.fe-mtitle { font-size: 16.5px; font-weight: 800; color: #fff; margin: 0 0 8px; }
.fe-mtext { font-size: 13.5px; color: #aaa; line-height: 1.55; margin: 0 0 16px; }
.fe-macts { display: flex; gap: 9px; }
.fe-mcancel { flex: 1; background: #161616; border: 1px solid #333; border-radius: 10px; color: #ddd; font-size: 13.5px; font-weight: 700; padding: 10px 0; cursor: pointer; }
.fe-myes { flex: 1; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.6); border-radius: 10px; color: #f87171; font-size: 13.5px; font-weight: 700; padding: 10px 0; cursor: pointer; }

/* ============================================================
   END OF FILE - app/foremanprep/exam/exam.css (v4 - flag glyph)
   If you can see this comment, the paste was not truncated.
   ============================================================ */
