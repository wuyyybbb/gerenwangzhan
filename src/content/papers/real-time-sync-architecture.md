---
title_en: "Real-time Collaborative Editing: CRDT vs OT Architecture Patterns"
title_zh: "实时协作编辑：CRDT 与 OT 架构模式对比"
date: 2024-09-20
type: paper
tags: ["Distributed Systems", "Real-time Sync", "Architecture"]
status: published
venue: "Tech Blog"
authors: ["Your Name"]
summary: "深入分析 CRDT 和 OT 两种协作编辑架构的权衡，提出混合方案：文本用 CRDT，元数据用服务器权威。"
author: "吴叶贝 (Wu Yebei)"
topic: "分布式系统 / 实时协作 / 架构设计"
audience: "系统架构师 / 后端工程师 / 协作工具开发者"
tools: "CRDT / OT / Yjs / Automerge"
updated: "2024-09"
---

## 引言

实时协作编辑看似简单——快速发送数据即可。但真正的挑战在于：当多人同时编辑时保持一致性，优雅处理网络故障，以及在不丢失用户意图的情况下解决冲突。

## 三种主流方案

### 1. Operational Transformation (OT)

**原理**：将编辑操作转换为可在不同文档状态下应用的形式。

**优点**：
- 实战验证（Google Docs 采用）
- 可预测的冲突解决
- 中央化协调简化逻辑

**缺点**：
- 算法设计复杂，容易出错
- 需要中央服务器协调
- 离线支持困难

### 2. Conflict-free Replicated Data Types (CRDT)

**原理**：数据结构本身保证最终一致性，无需中央协调。

**优点**：
- 去中心化架构
- 天然离线支持
- 数学上可证明的一致性

**缺点**：
- 冲突解决可能产生意外结果
- 内存占用较大（需保存元数据）
- 某些操作（如富文本格式）实现复杂

### 3. 服务器权威模式

**原理**：所有编辑通过服务器，服务器决定最终状态。

**优点**：
- 实现简单
- 强一致性保证
- 易于审计和权限控制

**缺点**：
- 增加延迟
- 单点故障
- 难以扩展

## 混合架构方案

在我的项目中，我采用了混合方案：

```
文本内容：CRDT (Automerge)
文档结构和权限：服务器权威
用户在线状态：临时数据（ephemeral）
```

### 为什么混合？

不是所有数据都需要相同的一致性模型：

- **文本**：可以最终一致。用户期待合并，CRDT 自动处理。
- **权限**：必须立即一致。安全相关，不能"最终"正确。
- **在线状态**：可以是临时的。几秒延迟无关紧要。

将同步策略与数据类型匹配，极大简化架构。

## 技术实现

### CRDT 层：Automerge

```typescript
import * as Automerge from '@automerge/automerge'

// 初始化文档
let doc = Automerge.init()

// 用户 A 编辑
doc = Automerge.change(doc, doc => {
  doc.text = "Hello"
})

// 用户 B 同时编辑（基于旧状态）
let doc2 = Automerge.change(doc, doc => {
  doc.text = "Hi there"
})

// 合并——自动解决冲突
doc = Automerge.merge(doc, doc2)
// 结果可预测，无需手动解决
```

### 服务器层：权限和元数据

```typescript
// 服务器端验证
router.post('/document/:id/permission', async (req, res) => {
  const { userId, permission } = req.body

  // 服务器是权限的唯一真相来源
  const hasAccess = await checkPermission(userId, req.params.id)

  if (!hasAccess) {
    return res.status(403).json({ error: 'No permission' })
  }

  // 更新权限立即生效，无"最终一致性"
  await updatePermission(req.params.id, userId, permission)
  res.json({ success: true })
})
```

## 性能优化

### 1. 增量同步

不发送整个文档，只发送变更（changes）：

```typescript
// 只发送自上次同步以来的变更
const changes = Automerge.getChanges(lastSyncedDoc, currentDoc)
socket.emit('sync', changes) // 几 KB 而非几 MB
```

### 2. 压缩历史

定期压缩 CRDT 历史以防内存膨胀：

```typescript
// 每 100 次变更保存快照
if (changeCount % 100 === 0) {
  doc = Automerge.save(doc)
  doc = Automerge.load(doc) // 清理内部历史
}
```

### 3. 差异化处理

- **活跃编辑**：WebSocket 实时同步（< 100ms）
- **在线但不编辑**：每 5 秒轮询
- **离线**：重连后批量同步

## 未解决的挑战

### 1. 同步状态可见性

如何向用户展示同步状态而不让其不知所措？
- 显示"正在同步"图标？何时显示？
- 冲突如何可视化？
- 如何让用户理解"最终一致性"？

### 2. 大文档性能

CRDT 在大文档（>10MB）时性能下降。考虑方案：
- 文档分片（按章节）
- 懒加载（只同步可见部分）
- 混合模式（热数据 CRDT，冷数据 OT）

### 3. 富文本格式冲突

当用户 A 加粗文本，用户 B 同时删除相同文本时会发生什么？
- CRDT 可能保留格式信息但删除内容
- 需要语义级冲突解决

## 测试策略

协作边界情况难以系统测试。我的方法：

```typescript
// 模拟并发编辑的属性测试
test('concurrent edits converge', () => {
  const scenarios = generateRandomEditSequences(100)

  scenarios.forEach(scenario => {
    const finalStates = applyEditsInParallel(scenario)

    // 所有副本必须收敛到相同状态
    expect(allEqual(finalStates)).toBe(true)
  })
})
```

使用 property-based testing 生成随机编辑序列，验证收敛性。

## 经验教训

1. **不存在银弹**：CRDT、OT、服务器权威各有适用场景
2. **匹配数据类型**：为不同数据选择不同一致性模型
3. **透明度重要**：让用户看到同步状态，即使不完美
4. **尽早测试冲突**：边界情况会在生产环境出现

## 结论

实时协作编辑需要仔细权衡一致性、延迟和复杂度。混合架构——为不同数据类型使用不同同步策略——提供了实用的中间地带。

关键不是选择"最好"的技术，而是理解每种方法的权衡，并将其与应用需求匹配。
