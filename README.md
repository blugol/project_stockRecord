# 매매 기록

스윙·중장기 주식 매매 수익률을 브라우저에서 보고, 추가·수정하는 페이지입니다.

저장소: https://github.com/blugol/project_stockRecord

## 구성

```
index.html    매매 기록 페이지
api/trades.js 폰·PC 공유용 저장 API
매매.txt      처음 옮긴 메모장 원본
README.md     프로젝트 설명과 작업 원칙
.gitignore    Git에 올리지 않을 파일
```

Vercel에 올린 주소로 열면 됩니다.

## 데이터

- `매매.txt`는 자동으로 바뀌지 않습니다.
- 공유하려면 Vercel에 KV(Redis)를 연결해야 합니다. 연결되면 폰과 PC가 같은 기록을 씁니다.
- 연결 전에는 그 브라우저에만 저장됩니다.

### Vercel KV 연결

1. [Vercel 프로젝트](https://vercel.com/sons-projects-221daffe/project-stock-record-ox8q) → Storage
2. Create Database → KV (Redis / Upstash)
3. 이 프로젝트에 Connect
4. Redeploy

환경 변수 `KV_REST_API_URL`, `KV_REST_API_TOKEN`이 생기면 공유가 됩니다.

주소만 알면 누구나 읽고 고칠 수 있으니, 링크는 본인만 쓰면 됩니다.

## GitHub

이 저장소가 기준입니다. 기능을 만들거나 고치면 **커밋한 뒤 `main`에 푸시**합니다.

```
https://github.com/blugol/project_stockRecord
```

---

# 작업 원칙

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
