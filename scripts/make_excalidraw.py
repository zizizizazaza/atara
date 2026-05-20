#!/usr/bin/env python3
"""Generate an Excalidraw .excalidraw file describing Atara's P2P Lightning flow."""
import json, random, time, os

random.seed(42)
now = int(time.time() * 1000)

elements = []
_idx = 0
def nid():
    global _idx
    _idx += 1
    return f"el{_idx:04d}"

def base(t, x, y, w, h, **kw):
    e = {
        "id": nid(),
        "type": t,
        "x": x, "y": y, "width": w, "height": h,
        "angle": 0,
        "strokeColor": kw.get("strokeColor", "#1e1e1e"),
        "backgroundColor": kw.get("backgroundColor", "transparent"),
        "fillStyle": kw.get("fillStyle", "solid"),
        "strokeWidth": kw.get("strokeWidth", 2),
        "strokeStyle": kw.get("strokeStyle", "solid"),
        "roughness": kw.get("roughness", 1),
        "opacity": kw.get("opacity", 100),
        "groupIds": kw.get("groupIds", []),
        "frameId": None,
        "index": f"a{_idx}",
        "roundness": kw.get("roundness"),
        "seed": random.randint(1, 2**31),
        "version": 1,
        "versionNonce": random.randint(1, 2**31),
        "isDeleted": False,
        "boundElements": kw.get("boundElements"),
        "updated": now,
        "link": None,
        "locked": False,
    }
    return e

def rect(x, y, w, h, **kw):
    e = base("rectangle", x, y, w, h, roundness={"type": 3}, **kw)
    return e

def diamond(x, y, w, h, **kw):
    return base("diamond", x, y, w, h, roundness={"type": 2}, **kw)

def text(x, y, t, size=20, color="#1e1e1e", family=5, align="center", w=None, h=None, container=None):
    # family 5 = Excalifont (default hand-drawn in newer versions)
    if w is None:
        w = max(60, int(len(t) * size * 0.55))
    if h is None:
        h = int(size * 1.25)
    e = base("text", x, y, w, h, strokeColor=color)
    e.update({
        "text": t,
        "fontSize": size,
        "fontFamily": family,
        "textAlign": align,
        "verticalAlign": "top",
        "baseline": int(size * 0.9),
        "containerId": container,
        "originalText": t,
        "lineHeight": 1.25,
        "autoResize": True,
    })
    return e

def arrow(x1, y1, x2, y2, dashed=False, color="#1e1e1e", end=True, start=False):
    w = abs(x2 - x1); h = abs(y2 - y1)
    e = base("arrow", min(x1, x2), min(y1, y2), w, h,
             strokeColor=color,
             strokeStyle="dashed" if dashed else "solid")
    e.update({
        "points": [[x1 - min(x1, x2), y1 - min(y1, y2)], [x2 - min(x1, x2), y2 - min(y1, y2)]],
        "lastCommittedPoint": None,
        "startBinding": None,
        "endBinding": None,
        "startArrowhead": "arrow" if start else None,
        "endArrowhead": "arrow" if end else None,
        "elbowed": False,
    })
    return e

def line(x1, y1, x2, y2, dashed=True, color="#868e96"):
    w = abs(x2 - x1); h = abs(y2 - y1)
    e = base("line", min(x1, x2), min(y1, y2), w, h,
             strokeColor=color,
             strokeStyle="dashed" if dashed else "solid",
             strokeWidth=1)
    e.update({
        "points": [[x1 - min(x1, x2), y1 - min(y1, y2)], [x2 - min(x1, x2), y2 - min(y1, y2)]],
        "lastCommittedPoint": None,
        "startBinding": None, "endBinding": None,
        "startArrowhead": None, "endArrowhead": None,
        "elbowed": False,
    })
    return e

# ---- canvas ----
LA, LC, LB = 220, 720, 1220   # lane center x for Alice / Coordinator / Bob

# Title
elements.append(text(720 - 280, 40, "Atara · P2P 闪电零费率通道", size=32, w=560, align="center"))
elements.append(text(720 - 320, 90, "基于 Robosats hold-invoice 模型 · 平台不接触法币 · 非托管", size=18, color="#5f6368", w=640, align="center"))

# Lane headers (rounded boxes)
def lane_header(cx, title, subtitle, fill):
    w = 240; h = 80
    elements.append(rect(cx - w//2, 150, w, h, backgroundColor=fill, fillStyle="hachure", strokeWidth=2))
    elements.append(text(cx - w//2, 165, title, size=22, w=w, align="center"))
    elements.append(text(cx - w//2, 198, subtitle, size=14, color="#5f6368", w=w, align="center"))

lane_header(LA, "Alice", "卖家 · 持有 BTC", "#ffec99")
lane_header(LC, "Coordinator", "协调者 · 开源节点", "#d0bfff")
lane_header(LB, "Bob", "买家 · 持有法币", "#a5d8ff")

# Lifelines
for cx in (LA, LC, LB):
    elements.append(line(cx, 235, cx, 1280, dashed=True))

# Step helper: arrow with floating label
def step(y, src, dst, label, dashed=False, color="#1e1e1e", note=None, note_color="#5f6368"):
    # arrow
    x1 = src + (35 if dst > src else -35)
    x2 = dst + (-35 if dst > src else 35)
    elements.append(arrow(x1, y, x2, y, dashed=dashed, color=color))
    mid = (src + dst) // 2
    # label box (subtle background)
    w = max(280, int(len(label) * 11))
    elements.append(rect(mid - w//2, y - 32, w, 26,
                         backgroundColor="#ffffff", fillStyle="solid",
                         strokeColor="#1e1e1e", strokeWidth=1))
    elements.append(text(mid - w//2, y - 28, label, size=15, w=w, align="center"))
    if note:
        elements.append(text(mid - 200, y + 8, note, size=13, color=note_color, w=400, align="center"))

# ---- steps ----
y = 290
step(y, LA, LC, "① 挂单 · 锁 3% maker bond  (hold invoice)",
     note="bond 被冻结但未兑现 — 协调者只持 hash"); y += 90

step(y, LB, LC, "② 接单 · 锁 3% taker bond",
     note="双方都付出经济代价 → 防钓鱼"); y += 90

# coordinator notifies both — two arrows
elements.append(arrow(LC - 35, y, LA + 35, y, color="#7950f2"))
elements.append(arrow(LC + 35, y, LB - 35, y, color="#7950f2"))
elements.append(rect(LC - 130, y - 32, 260, 26, backgroundColor="#ffffff", fillStyle="solid", strokeColor="#7950f2", strokeWidth=1))
elements.append(text(LC - 130, y - 28, "③ 配对成功 · 通知双方", size=15, w=260, align="center", color="#5f3dc4"))
y += 90

step(y, LA, LC, "④ 锁 100% 交易额  trade escrow  (hold invoice)",
     note="sats 冻结在 Lightning 通道，仍属 Alice"); y += 90

# Step 5: private chat between Alice and Bob, passing through coordinator visually
elements.append(arrow(LA + 35, y, LB - 35, y, dashed=True, color="#0c8599", start=True))
elements.append(rect((LA + LB)//2 - 170, y - 32, 340, 26, backgroundColor="#ffffff", fillStyle="solid", strokeColor="#0c8599", strokeWidth=1))
elements.append(text((LA + LB)//2 - 170, y - 28, "⑤ 私聊频道 · 协商法币转账细节", size=15, w=340, align="center", color="#0b7285"))
elements.append(text((LA + LB)//2 - 200, y + 8, "端到端加密 · 协调者读不到内容", size=13, color="#5f6368", w=400, align="center"))
y += 100

# Step 6: off-platform fiat transfer — big highlighted band
band_y = y - 20
elements.append(rect(LA - 60, band_y, (LB - LA) + 120, 90,
                     backgroundColor="#ffe3e3", fillStyle="hachure",
                     strokeColor="#c92a2a", strokeWidth=2, strokeStyle="dashed"))
elements.append(text(LA - 60, band_y + 6, "⑥ 法币转账 · 完全在平台之外", size=16, color="#c92a2a", w=(LB - LA) + 120, align="center"))
elements.append(arrow(LB - 35, band_y + 50, LA + 35, band_y + 50, color="#c92a2a"))
elements.append(text(LA - 60, band_y + 60, "Pix · Zelle · UPI · SEPA Instant  →  本地银行通道自身免费", size=14, color="#862e2e", w=(LB - LA) + 120, align="center"))
y = band_y + 120

step(y, LA, LC, "⑦ Alice 确认 fiat received",
     note="她已经收到法币 → 触发释放"); y += 90

step(y, LC, LB, "⑧ 释放 trade escrow  →  sats 经 Lightning 到 Bob",
     color="#2f9e44",
     note="Lightning routing 费 < 1 sat · 秒级到账"); y += 90

# Step 9: release bonds to both
elements.append(arrow(LC - 35, y, LA + 35, y, color="#2f9e44"))
elements.append(arrow(LC + 35, y, LB - 35, y, color="#2f9e44"))
elements.append(rect(LC - 130, y - 32, 260, 26, backgroundColor="#ffffff", fillStyle="solid", strokeColor="#2f9e44", strokeWidth=1))
elements.append(text(LC - 130, y - 28, "⑨ 双方 bond 解锁返还", size=15, w=260, align="center", color="#2b8a3e"))
y += 90

# ---- bottom legend ----
ly = y + 30
elements.append(rect(LA - 60, ly, (LB - LA) + 120, 140,
                     backgroundColor="#f8f9fa", fillStyle="solid",
                     strokeColor="#1e1e1e", strokeWidth=1, strokeStyle="solid"))
elements.append(text(LA - 40, ly + 14, "成本拆解  ·  一笔 100 美元等值交易", size=18, w=(LB - LA) + 80, align="center"))
elements.append(text(LA - 40, ly + 48, "平台费  $0", size=16, color="#2f9e44", w=300, align="center"))
elements.append(text(LA + 260, ly + 48, "Lightning routing  ≈ $0.01", size=16, color="#1971c2", w=360, align="center"))
elements.append(text(LB - 80, ly + 48, "法币 rail  $0", size=16, color="#2f9e44", w=260, align="center"))
elements.append(text(LA - 40, ly + 86, "→ 真零费率的三个支点：开源协调者 · hold-invoice 非托管 · 只接零成本 rail", size=14, color="#495057", w=(LB - LA) + 80, align="center"))
elements.append(text(LA - 40, ly + 110, "争议时：bond slashing 自融资仲裁 · 平台始终拿不走用户的钱", size=13, color="#868e96", w=(LB - LA) + 80, align="center"))

# ---- side annotation: hold invoice explainer ----
nx, ny = 1500, 290
elements.append(rect(nx, ny, 280, 200, backgroundColor="#fff9db", fillStyle="hachure", strokeColor="#e67700", strokeWidth=2))
elements.append(text(nx + 12, ny + 12, "Hold Invoice 是什么？", size=18, w=256))
elements.append(text(nx + 12, ny + 44, "Lightning 协议原生功能：", size=14, color="#5f6368", w=256, align="left"))
elements.append(text(nx + 12, ny + 68, "• 收款方先给 hash，不给 preimage", size=13, w=256, align="left"))
elements.append(text(nx + 12, ny + 90, "• 付款方按 hash 锁定 sats", size=13, w=256, align="left"))
elements.append(text(nx + 12, ny + 112, "• 钱被冻结，但无人能拿走", size=13, w=256, align="left"))
elements.append(text(nx + 12, ny + 134, "• 公布 preimage → 划转", size=13, w=256, align="left"))
elements.append(text(nx + 12, ny + 156, "• 超时 → 自动返还", size=13, w=256, align="left"))
elements.append(text(nx + 12, ny + 178, "→ 协调者只持 hash，物理上拿不走钱", size=12, color="#c92a2a", w=256, align="left"))

doc = {
    "type": "excalidraw",
    "version": 2,
    "source": "https://excalidraw.com",
    "elements": elements,
    "appState": {
        "gridSize": 20,
        "gridStep": 5,
        "gridModeEnabled": False,
        "viewBackgroundColor": "#ffffff",
    },
    "files": {},
}

out = os.path.join(os.path.dirname(__file__), "..", "atara_p2p_flow.excalidraw")
out = os.path.abspath(out)
with open(out, "w") as f:
    json.dump(doc, f, ensure_ascii=False, indent=2)
print(out)
