#!/usr/bin/env python3
"""Generic Lightning Network — nodes, channels and payment flow. Excalidraw-ish sketch."""
import matplotlib.pyplot as plt
import matplotlib.patches as mp
from matplotlib import rcParams

plt.xkcd(scale=0.6, length=80, randomness=2)
rcParams["font.family"] = ["PingFang SC", "Hiragino Sans", "Arial"]
rcParams["axes.unicode_minus"] = False

fig, ax = plt.subplots(figsize=(17, 11), dpi=150)
ax.set_xlim(0, 100)
ax.set_ylim(0, 68)
ax.axis("off")

NODE = "#fff4d6"
NODE_EDGE = "#e8a838"
L1 = "#eaf3ff"
L1_EDGE = "#1c7ed6"
L2 = "#fff9e8"
HTLC = "#c92a2a"
GOSSIP = "#888"

def node(x, y, r, label, sub=None, face=NODE, edge=NODE_EDGE):
    ax.add_patch(mp.Circle((x, y), r, facecolor=face, edgecolor=edge, linewidth=2.4))
    ax.text(x, y + 0.6, label, ha="center", va="center", fontsize=13, fontweight="bold")
    if sub:
        ax.text(x, y - 1.8, sub, ha="center", va="center", fontsize=9.5, color="#444")

def box(x, y, w, h, label, sub=None, face=L2, edge=NODE_EDGE, lw=2.2,
        fs_label=12, fs_sub=10):
    ax.add_patch(mp.FancyBboxPatch(
        (x, y), w, h,
        boxstyle="round,pad=0.25,rounding_size=0.9",
        linewidth=lw, edgecolor=edge, facecolor=face))
    ax.text(x + w/2, y + h - 1.4, label, ha="center", va="top",
            fontsize=fs_label, fontweight="bold")
    if sub:
        ax.text(x + w/2, y + h/2 - 1.4, sub, ha="center", va="center",
                fontsize=fs_sub, color="#444")

def arrow(x1, y1, x2, y2, color="#222", lw=2, ls="-", style="-|>"):
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle=style, lw=lw, color=color,
                                linestyle=ls, shrinkA=6, shrinkB=6,
                                mutation_scale=18))

# ---- title ----
ax.text(50, 65, "Lightning Network · P2P 通用架构与支付流程",
        ha="center", va="center", fontsize=22, fontweight="bold")
ax.text(50, 62, "L1 锚定 + L2 离链通道 + HTLC 多跳路由",
        ha="center", va="center", fontsize=12, color="#555")

# =============== L2: Lightning layer ===============
ax.add_patch(mp.FancyBboxPatch(
    (3, 24), 94, 32,
    boxstyle="round,pad=0.4,rounding_size=1.2",
    linewidth=2.5, edgecolor=NODE_EDGE, facecolor="#fffdf5", alpha=0.55))
ax.text(6, 54, "L2 · Lightning（离链）", fontsize=14, fontweight="bold", color="#7a5400")
ax.text(6, 52, "签名更新通道余额 · 毫秒确认 · 几乎零手续费",
        fontsize=10.5, color="#7a5400")

# four nodes left to right
positions = [
    (15, 38, "Alice",  "付款方\n移动钱包"),
    (38, 42, "Bob",    "路由节点\n大容量·在线"),
    (62, 34, "Carol",  "路由节点\n收费 < 1 sat"),
    (85, 40, "Dave",   "收款方\n商户钱包"),
]
for x, y, l, s in positions:
    node(x, y, 4.2, l, s)

# channels between them (lines with capacity labels)
def channel(x1, y1, x2, y2, cap, bal):
    ax.plot([x1, x2], [y1, y2], color="#7a5400", lw=2.4, solid_capstyle="round")
    mx, my = (x1 + x2)/2, (y1 + y2)/2
    ax.text(mx, my + 1.6, f"channel · {cap}", ha="center", fontsize=9.5,
            color="#7a5400", fontweight="bold")
    ax.text(mx, my - 1.6, bal, ha="center", fontsize=9, color="#888",
            style="italic")

channel(15, 38, 38, 42, "0.05 BTC", "Alice 0.03 ↔ Bob 0.02")
channel(38, 42, 62, 34, "0.10 BTC", "Bob 0.06 ↔ Carol 0.04")
channel(62, 34, 85, 40, "0.08 BTC", "Carol 0.05 ↔ Dave 0.03")

# HTLC payment flow arrows above
ax.text(50, 49.5, "支付路径：Alice → Bob → Carol → Dave  （HTLC 锁定 · preimage 解锁）",
        ha="center", fontsize=11, color=HTLC, fontweight="bold")
for (x1, y1, x2, y2) in [(19, 39.5, 34, 43.2), (42, 42.8, 58, 35), (66, 34.8, 81, 39)]:
    arrow(x1, y1, x2, y2, color=HTLC, lw=2.2, ls="--")

# gossip cloud above nodes
ax.add_patch(mp.FancyBboxPatch(
    (40, 56.5), 22, 4, boxstyle="round,pad=0.2,rounding_size=0.8",
    linewidth=1.6, edgecolor=GOSSIP, facecolor="#f3f4f6", linestyle="--"))
ax.text(51, 58.5, "Gossip 网络（通道公告 · 费率广播）",
        ha="center", va="center", fontsize=10, color=GOSSIP)
for x in [46, 51, 56]:
    arrow(x, 56.4, x, 47, color=GOSSIP, lw=1.2, ls=":", style="-")

# watchtower (optional component)
box(2, 38, 9, 6, "Watchtower", "代为监控\n防对手作弊",
    face="#f3f0ff", edge="#7048e8", fs_label=10.5, fs_sub=8.5)
arrow(11, 41, 11.5, 39.5, color="#7048e8", lw=1.3, ls=":")

# =============== L1: Bitcoin ===============
ax.add_patch(mp.FancyBboxPatch(
    (3, 4), 94, 16,
    boxstyle="round,pad=0.4,rounding_size=1.2",
    linewidth=2.5, edgecolor=L1_EDGE, facecolor=L1, alpha=0.6))
ax.text(6, 18, "L1 · Bitcoin 主链（锚定）",
        fontsize=14, fontweight="bold", color="#0b4d8f")
ax.text(6, 16, "10 分钟出块 · 高手续费 · 只承担「开 / 关 / 仲裁」三件事",
        fontsize=10.5, color="#0b4d8f")

box(10, 6, 22, 8, "① 开通道",
    "2-of-2 多签 funding tx\n上链后通道生效",
    face="#fff", edge=L1_EDGE, fs_label=11, fs_sub=9.5)
box(39, 6, 22, 8, "② 关通道（合作）",
    "双方签最新余额\n各自拿回 sats",
    face="#fff", edge=L1_EDGE, fs_label=11, fs_sub=9.5)
box(68, 6, 22, 8, "③ 强制关闭（争议）",
    "提交最新 commitment\nwatchtower 可挑战",
    face="#fff", edge=L1_EDGE, fs_label=11, fs_sub=9.5)

# arrows L2 <-> L1
arrow(21, 24, 21, 14, color=L1_EDGE, lw=1.8, ls="--")
arrow(50, 24, 50, 14, color=L1_EDGE, lw=1.8, ls="--")
arrow(79, 24, 79, 14, color=L1_EDGE, lw=1.8, ls="--")
ax.text(21, 22.6, "funding", fontsize=9, color=L1_EDGE, ha="center")
ax.text(50, 22.6, "settle",  fontsize=9, color=L1_EDGE, ha="center")
ax.text(79, 22.6, "broadcast", fontsize=9, color=L1_EDGE, ha="center")

# ---- footnote / legend ----
ax.text(50, 1.6,
        "节点要素：付款方 · 路由节点（多通道、在线）· 收款方 · Watchtower（可选）　|　"
        "三件大事：开通道 · 多跳支付 · 关通道",
        ha="center", fontsize=10.5, color="#222", style="italic")

plt.tight_layout()
png = "/Users/zzz/antigravity项目/atara/lightning_p2p_generic.png"
pdf = "/Users/zzz/antigravity项目/atara/lightning_p2p_generic.pdf"
plt.savefig(png, dpi=150, bbox_inches="tight", facecolor="white")
plt.savefig(pdf, bbox_inches="tight", facecolor="white")
print(png)
print(pdf)
