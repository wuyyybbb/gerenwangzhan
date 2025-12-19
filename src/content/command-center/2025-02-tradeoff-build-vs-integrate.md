---
title_en: "Tradeoff Analysis: Build vs Integrate"
title_zh: "权衡分析：自建 vs 集成"
date: 2025-02-01
type: trade-offs
status: published
tags: ["Engineering", "Tradeoffs", "Technical Debt"]
summary: "Breaking down the hidden costs of 'just use an API' vs 'build it ourselves' - with real numbers from 3 years of decisions."
cover: "/assets/command-center/covers/2025-02.webp"
---

# Tradeoff Analysis: Build vs Integrate

## The Eternal Question

Every product team faces this: should we build a feature from scratch or integrate a third-party service?

The answer is always "it depends" - but let's make "it depends" more concrete.

## Framework: Total Cost of Ownership (3-year view)

| Factor | Build | Integrate |
|--------|-------|-----------|
| **Upfront Cost** | High (2-4 months dev time) | Low (1-2 weeks integration) |
| **Monthly Cost** | Infrastructure only (~$200) | Subscription fee (~$1000-5000) |
| **Maintenance** | Ongoing (20% eng time) | Minimal (updates only) |
| **Customization** | Full control | Limited by API |
| **Vendor Risk** | Zero | Service shutdown, price hikes |
| **Learning Curve** | Steep | Shallow |

## Case Study 1: Email Service

**Decision:** Integrate (SendGrid)

**Why:**
- Email delivery is a solved problem
- Deliverability requires reputation (takes years to build)
- Cost: $50/month at our scale

**Result after 3 years:**
- ✅ Saved ~6 months of engineering time
- ✅ 99.5% delivery rate (better than we could achieve)
- ❌ Vendor lock-in (migration would be painful)
- ❌ Price increased 3x (but still worth it)

**Verdict:** Right call. Would do again.

## Case Study 2: Analytics Dashboard

**Decision:** Build (React + Chart.js)

**Why:**
- Highly custom to our domain
- Need to embed in product
- Third-party analytics tools too generic

**Result after 3 years:**
- ✅ Exact UI/UX we wanted
- ✅ No per-seat licensing fees
- ❌ Took 4 months initial build + 2 months/year maintenance
- ❌ Performance issues at scale (had to rewrite once)

**Verdict:** Right call, but underestimated maintenance.

## Case Study 3: Authentication

**Decision:** Integrate (Auth0) → Build (custom) → Integrate (WorkOS)

**Why the journey:**

1. **Year 1:** Auth0 - fast to market, worked great
2. **Year 2:** Built custom - wanted more control, lower cost
3. **Year 3:** WorkOS - custom auth became time sink, switched back

**Lessons:**
- Auth is **harder than it looks** (2FA, SSO, compliance)
- "We can build better" is usually ego talking
- Vendor costs hurt, but hidden costs hurt more

**Total waste:** ~8 months of engineering time on the detour

**Verdict:** Should have stayed with managed auth. Expensive lesson.

## Decision Matrix

Use this to evaluate build vs integrate:

```
HIGH urgency + LOW differentiation = INTEGRATE
LOW urgency + HIGH differentiation = BUILD
HIGH urgency + HIGH differentiation = INTEGRATE now, BUILD later
LOW urgency + LOW differentiation = QUESTION if you need it at all
```

### What is "differentiation"?

A feature differentiates if:
- Competitors can't easily copy it
- Users choose you specifically for it
- It's core to your value prop

Examples:
- ❌ Email sending: No differentiation (everyone needs email)
- ✅ Custom workflow engine: High differentiation (unique to your product)

## Hidden Costs People Miss

### When Building:

1. **Ongoing maintenance** (bug fixes, security patches)
2. **Scaling challenges** (what works at 100 users breaks at 10,000)
3. **Knowledge concentration** (what if that engineer leaves?)

### When Integrating:

1. **Lock-in costs** (migration later is painful)
2. **Feature gaps** (the 20% you need but they don't support)
3. **Support dependency** (their bugs block your releases)

## My Rules of Thumb

After 3 years of making these decisions:

1. **Integrate for horizontal features** (auth, payments, email)
2. **Build for vertical differentiation** (your unique value prop)
3. **Never build infrastructure** (databases, queues, monitoring)
4. **Always build core business logic** (pricing, workflows, algorithms)

### The "3-Year Test"

Ask: "Will I regret this decision in 3 years?"

- If you built: Will maintenance cost exceed integration cost?
- If you integrated: Will vendor dependency limit growth?

## When the Decision is Unclear

**Use the 80/20 rule:**

- If a third-party service solves 80% of your need: integrate
- If you need to customize 80% of it: build

**Use the "2x engineer time" rule:**

- If integration takes 2 weeks, and build takes 6 weeks: integrate
- If integration takes 2 weeks, and build takes 2 weeks: still integrate (maintenance adds up)

## Conclusion

There's no universal answer. But these principles have saved us from:

- ✅ Building our own CDN (would have been disaster)
- ✅ Integrating a complex workflow engine (would have been limiting)
- ❌ Building our own auth (learned the hard way)

## Worksheet: Evaluate Your Next Decision

| Question | Answer |
|----------|--------|
| Feature name | ___ |
| Time to build | ___ weeks |
| Time to integrate | ___ weeks |
| Is this differentiating? | Yes / No |
| Is this urgent? | Yes / No |
| 3-year maintenance cost | $\___ |
| 3-year vendor cost | $\___ |
| **Decision** | Build / Integrate / Wait |

---

**Published:** February 1, 2025
**Updated:** February 1, 2025
**Status:** Living document (will update as we learn more)
