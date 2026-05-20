#!/usr/bin/env python3
"""Atara P2P channel flow — architecture-style PNG, Excalidraw-ish sketch look."""
import matplotlib.pyplot as plt
import matplotlib.patches as mp
from matplotlib import rcParams

plt.xkcd(scale=0.6, length=80, randomness=2)
rcParams["font.family"] = ["PingFang SC", "Hiragino Sans", "Arial"]
rcParams["axes.unicode_minus"] = False

fig, ax = plt.subplots(figsize=(17, 10), dpi=150)
ax.set_xlim(0, 100)
ax.set_ylim(0, 60)
ax.axis("off")

# colors
ATARA = "#fff4d6"
ATARA_EDGE = "#e8a838"
OUTSIDE = "#eef2f7"
OUTSIDE_EDGE = "#8a94a6"
ACCENT = "#2f6feb"
OFF = "#c92a2a"

def box(x, y, w, h, label, sub=None, face=ATARA, edge=ATARA_EDGE, lw=2.2, fs_label=13, fs_sub=10.5):
    ax.add_patch(mp.FancyBboxPatch(
        (x, y), w, h,
        boxstyle="round,pad=0.25,rounding_size=0.9",
        linewidth=lw, edgecolor=edge, facecolor=face))
    ax.text(x + w/2, y + h - 1.6, label, ha="center", va="top",
            fontsize=fs_label, fontweight="bold")
    if sub:
        ax.text(x + w/2, y + h/2 - 1.2, sub, ha="center", va="center",
                fontsize=fs_sub, color="#444")

def arrow(x1, y1, x2, y2, color="#222", lw=2, ls="-"):
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="-|>", lw=lw, color=color,
                                linestyle=ls, shrinkA=4, shrinkB=4,
                                mutation_scale=18))

# ---- title ----
ax.text(50, 57, "Atara P2P 通道 · 我们参与的环节",
        ha="center", va="center", fontsize=22, fontweight="bold")
ax.text(50, 54, "黄色 = Atara 平台内部　·　灰色 = 平台之外（用户 / 协议 / 银行）",
        ha="center", va="center", fontsize=12, color="#555")

# ---- big Atara container ----
ax.add_patch(mp.FancyBboxPatch(
    (3, 22), 94, 26,
    boxstyle="round,pad=0.4,rounding_size=1.2",
    linewidth=2.5, edgecolor=ATARA_EDGE, facecolor="#fffaf0", alpha=0.55))
ax.text(6, 46.5, "Atara 平台", fontsize=15, fontweight="bold", color="#7a5400")
ax.text(6, 44.4, "不碰法币  ·  不托管 sats  ·  只在协议层做撮合与触发", fontsize=10.5, color="#7a5400")

# ---- five pipeline steps inside Atara ----
steps = [
    ("① 撮合",
     "Order book\n配对买卖双方\n按地区/法币过滤"),
    ("② 押金 (hold invoice)",
     "卖家锁 100% escrow\n双方各锁 3% bond\nAtara 只持 hash"),
    ("③ 私聊频道",
     "端到端加密\n双方协商法币细节\nAtara 读不到内容"),
    ("④ 触发释放",
     "卖家确认收款\nAtara 公布 preimage\nsats 经 Lightning 流转"),
    ("⑤ 异常仲裁",
     "24h SLA 团队仲裁\nbond slashing 自融资\n判错方押金销毁"),
]

x0, y0, bw, bh, gap = 6, 26, 16, 14, 2.5
for i, (label, sub) in enumerate(steps):
    bx = x0 + i * (bw + gap)
    box(bx, y0, bw, bh, label, sub, fs_label=12, fs_sub=9.5)
    if i < len(steps) - 1:
        ax.annotate("", xy=(bx + bw + gap - 0.2, y0 + bh/2),
                    xytext=(bx + bw + 0.2, y0 + bh/2),
                    arrowprops=dict(arrowstyle="-|>", lw=2.2, color="#7a5400",
                                    mutation_scale=18))

# ---- outside actors (bottom row) ----
outs = [
    (6,  "卖家 / 买家",        "自带 Lightning 钱包\n(Phoenix · Mutiny · LNbits)"),
    (28, "Lightning 网络",     "协议层路由\nrouting 费 < 1 sat"),
    (50, "法币 rail",          "Pix · Zelle · UPI · SEPA Instant\n银行直转 · 平台之外", "#ffe3e3", OFF),
    (72, "争议证据",            "聊天记录 · 银行流水\n由双方提交给仲裁"),
]
oy, ow, oh = 6, 18, 11
for item in outs:
    if len(item) == 5:
        ox, l, s, face, edge = item
    else:
        ox, l, s = item[0], item[1], item[2]
        face, edge = OUTSIDE, OUTSIDE_EDGE
    box(ox, oy, ow, oh, l, s, face=face, edge=edge, fs_label=12, fs_sub=9.5)

# B2B revenue box top-right outside Atara block (revenue source)
box(78, 49, 19, 7, "B2B Agent API",
    "C 端零费的补贴来源\n按调用 / 按额度抽点",
    face="#e7f5ff", edge="#1c7ed6", fs_label=12, fs_sub=9.2)
arrow(87, 49, 87, 48.2, color="#1c7ed6")
ax.text(88.5, 48.4, "收入补贴运营", fontsize=9.5, color="#1c7ed6")

# ---- connect outside <-> Atara pipeline ----
# Users -> step 1
arrow(15, 17, 14, 26, color="#555")
# Lightning <-> step 4 (settlement)
arrow(37, 17, 72, 26, color="#2f9e44", ls="--")
# Fiat rail <-> step 3 (private chat is where they coordinate)
arrow(59, 17, 48, 26, color=OFF, ls="--")
ax.text(54.8, 21.5, "法币转账\n绕过 Atara", fontsize=10, color=OFF,
        ha="center", style="italic")
# Disputes -> step 5
arrow(81, 17, 88, 26, color="#555")

# ---- key annotation ----
ax.text(50, 2.6,
        "核心：Atara 只在「协议触发」层面参与 — hold-invoice 让我们物理上拿不走钱，法币完全在平台之外",
        ha="center", fontsize=11.5, color="#222", style="italic")

plt.tight_layout()
out = "/Users/zzz/antigravity项目/atara/atara_channel_flow.png"
plt.savefig(out, dpi=150, bbox_inches="tight", facecolor="white")
print(out)
