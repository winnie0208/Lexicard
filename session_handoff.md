# LexiCard Codex 接續討論交接文件

## 1. 文件用途

本文件整理先前 Codex session 中針對 LexiCard 的產品討論結果，供目前專案資料夾或後續新 thread 接續規劃、設計或開發使用。

本專案已由舊有輸出資料夾轉移至目前資料夾根目錄。後續閱讀與引用文件時，請以目前資料夾根目錄中的檔案為準，不要再假設存在 `outputs/` 子資料夾。

專案已進入開發階段。實際程式碼（Vite + React + TS scaffold）統一放在 `Prototype/` 資料夾，開發依 `MVP_Task_Breakdown.md` 逐 Phase 進行，細節見第 9 節。

維護規則：本文件應保持為精簡且可交接的最新摘要。長 session、重要里程碑、PRD 或實作大幅變更、下一步或 blocker 改變、上下文或額度接近不足時，需優先更新本文件，避免突然中斷後難以交付至其他工具或 session。

目前核心文件：

- `LexiCard_PRD.md`：目前最新版 PRD，採結果式規格描述。
- `Log.md`：專案唯一迭代紀錄檔，包含先前討論的變更紀錄、決策歷程、後續 PRD 修改與功能開發進度。
- `session_handoff.md`：本交接文件。

## 2. 產品定位

LexiCard 是一個以 iPad 建立單字卡、手機快速複習為主要情境的 AI 英文單字卡 PWA。

主要目的：

- 快速記錄英文單字。
- 透過 AI 生成單字卡內容。
- 將同一單字的不同意思整理成多個 sense。
- 用 AI 討論單字、延伸單字與建立關聯。
- 透過 4 選 1 快速學習追蹤熟悉度。
- 用 CSV 匯出備份或檢視資料。

產品名稱：

- LexiCard

產品形式：

- PWA
- 個人使用與測試
- 不經 App Store 審核

主要裝置：

- iPad：手寫、新增、整理、AI 討論
- 手機：文字輸入 + AI 新增、查看字卡、快速學習

## 3. MVP 核心架構

MVP 畫面：

- 單字卡庫
- 新增單字
- 單字詳情
- 快速學習
- CSV 匯出

導覽列：

- 單字庫
- 新增單字
- 快速學習

首頁：

- 單字卡庫

MVP 範圍外：

- Dashboard
- Google Sheets 同步
- Anki CSV
- JSON 匯出
- AI 學習分析
- 發音評分
- 多人帳號
- 完整 AI 對話歷史保存
- 關聯圖譜視覺化
- 口音切換
- 卡片合併
- relation 匯出

## 4. 核心資料模型

### Card

Card 代表單字本體，例如 `book`。

主要欄位：

- `id`
- `word`
- `normalizedWord`
- `phonetic`
- `pronunciationAccent`
- `note`
- `isStarred`
- `repeatCount`
- `errorCount`
- `familiarityScore`
- `createdAt`
- `updatedAt`

### Sense

Sense 代表同一單字的某個意思、詞性、用法或語境。

主要欄位：

- `id`
- `cardId`
- `partOfSpeech`
- `chineseMeaning`
- `usageContext`
- `exampleSentence`
- `exampleSentenceTranslation`
- `isPrimary`
- `createdAt`
- `updatedAt`

重要決策：

- 詞性與中文意思屬於 Sense，不屬於 Card。
- Sense 初始由 AI 產生。
- 使用者可事後手動編輯詞性、中文意思、使用情境、例句與例句中文翻譯。
- 使用者可新增 3 個以上 sense。
- 同一 Card 的 sense 中文意思重複或語意相近時，系統提醒但不阻擋保存。

### Relation

Relation 代表兩張字卡之間的關聯。

關聯類型：

- 延伸單字
- 易混淆單字
- 相似意思
- 詞性變化

關聯來源：

- AI 關聯
- 手動關聯

### WordCandidate

WordCandidate 是手寫或輸入判定過程中的暫存資料。

重要決策：

- transient / session-only
- 不進資料庫

## 5. 重要產品規則

### 新增單字

iPad：

- 手寫 / 文字輸入 + AI
- 手寫使用 iPadOS Scribble 轉文字
- LexiCard 處理轉換後文字的候選判定、拼字修正與重複檢查

手機：

- 文字輸入 + AI

重複判斷：

- 使用 `normalizedWord`
- MVP 規則為 trim + lowercase

重複新增：

- 使用者主動嘗試建立已存在單字時，`repeatCount +1`
- 單純重複新增已存在單字：`familiarityScore -15`
- 重複新增但本次語境代表新 sense：使用者確認新增 sense 後 `familiarityScore -5`
- 熟悉度維持 Card 層級，不針對單一 sense 計算

### 熟悉度

初始分數：

- 新字卡 `familiarityScore = 50`

分數變化：

- 快速學習答對：+10
- 快速學習答錯：-15，且 `errorCount +1`
- 單純重複新增已存在單字：-15，且 `repeatCount +1`
- 重複新增但新增為新 sense：-5，且 `repeatCount +1`

熟悉度圖示：

- 0-39：陌生，一本書
- 40-69：一般，兩本書
- 70-100：熟悉，三本書

### 快速學習

題型：

- 單字英翻中
- 例句情境英翻中

題目形式：

- 標準 4 選 1
- 1 個正確答案
- 3 個 AI 生成干擾選項

答案規則：

- 單字英翻中：該 Card 所有 sense 中文意思皆為正確答案
- 例句情境英翻中：正確答案為該例句對應 sense 的中文意思

干擾選項：

- 由 AI 生成
- 不侷限於既有字卡庫
- 避開目前 Card 所有 sense 中文意思
- 避免與正確答案語意過於接近

選項不足：

- AI 無法產生足夠干擾選項時，跳過該題並產生下一題
- 被跳過題目不更新 `errorCount`、`repeatCount`、`familiarityScore`

熟悉度低優先：

- 採加權隨機
- 陌生權重 5
- 一般權重 3
- 熟悉權重 1

### AI 討論

AI 對話出現位置：

- 新增單字頁
- 單字詳情頁

保存規則：

- AI 對話為當前 session 暫存
- 使用者離開頁面、重新整理頁面或重新開啟 App 後，未保存內容清空
- 使用者可手動將 AI 回覆加入備註、建立新字卡或建立關聯
- MVP 不保存完整 AI 對話歷史

### CSV 匯出

位置：

- 單字卡庫右上角更多選單

格式：

- CSV
- UTF-8 with BOM
- 一個 sense 一列

攤平規則：

- 同一張 Card 有多個 sense 時，CSV 產生多列
- Card 層級欄位於每列重複顯示
- Sense 層級欄位依該 sense 顯示
- 多列不代表字卡重複建立

## 6. 錯誤狀態

AI 生成失敗：

- 顯示「AI 暫時無法產生內容，請稍後重試。」
- 提供重試
- 保留使用者已輸入內容

網路或連線失敗：

- 顯示「目前無法連線，請確認網路後重試。」
- 提供重試
- 保留使用者已輸入內容

候選字信心過低：

- 顯示候選字列表或提示使用者修正文字
- 無可靠候選字時顯示「無法判定單字，請修改輸入」
- 使用者可手動修改輸入後重新判定

## 7. 後續可接續討論方向

後續任何大幅度迭代，包含 PRD 修改、功能開發、技術選型、資料模型調整、AI prompt 調整或重要 bug 修正，都必須同步記錄在 `Log.md`。紀錄需包含日期、修改摘要、影響範圍、目前進度與下一步，方便換工具或開新 thread 時快速接續。

資訊架構、UI wireframe、技術選型、AI prompt 設計方向已於先前 session 討論並定案（詳見 `LexiCard_PRD.md`），目前已進入依 `MVP_Task_Breakdown.md` 的實作階段，見第 9 節目前進度。

## 8. Codex 接續提示建議

可在目前專案或新的 Codex thread 中使用以下提示：

```text
我正在規劃 LexiCard，一個 iPad 手寫 + AI 英文單字卡 PWA。請先閱讀目前專案根目錄中的 LexiCard_PRD.md、Log.md、session_handoff.md，理解目前 PRD、迭代紀錄與先前 session 的產品決策。後續任何大幅度 PRD 修改或功能開發，都請同步記錄在 Log.md。接下來請協助我依照 PRD 進行後續規劃 / 設計 / 開發，不要重新推翻已定義的產品規則，除非我明確要求重新討論。
```

## 9. 目前開發進度（依 MVP_Task_Breakdown.md）

開發規則：

- 開發依 `MVP_Task_Breakdown.md` 的 Phase 順序逐一進行，程式碼與開發腳本、素材統一放在 `Prototype/` 資料夾（Vite + React + TS 專案，`npm run dev` / `npm run build` / `npm run lint` 於 `Prototype/` 目錄下執行）。
- 確認節奏：**每個 Phase 完成後才回報並等待使用者確認**，確認後才進入下一個 Phase（使用者於 2026-07-03 明確選定此節奏，而非逐一小項確認）。

目前狀態：

- **Phase 0　專案初始化：已完成**（Task 5 GitHub repo／Vercel 專案連結由使用者自行處理，尚未設定；詳見 `Log.md` 2026-07-03 Phase 0 條目）。
  - Vite + React 19 + TS scaffold，ESLint（flat config）+ Prettier（取代新版 Vite 預設的 oxlint），Tailwind CSS 4，`vite-plugin-pwa`（manifest + 佔位圖示，正式圖示留 Phase 9），`react-router` 三頁路由（`/`、`/add`、`/study`）+ 底部導覽列。
  - 資料夾結構：`src/pages`、`src/components`、`src/lib`、`src/types`、`src/hooks`、`scripts/`（開發輔助腳本，如 `generate-pwa-icons.cjs`）。
  - 已知待辦：GitHub repo 建立、Vercel 專案連結（此機器無 `gh` / `vercel` CLI；且 Git repo 根目錄為 `D:\AI Case`，與其他專案共用，尚未設 remote，是否另建獨立 repo 屬使用者決策）。
- **Phase 1　資料層：已完成**（詳見 `Log.md` Phase 1 條目）。
  - `src/types/`（`Card`/`Sense`/`Relation`/`WordCandidate`）、`src/lib/db.ts`（Dexie schema，`cards` 以 `normalizedWord` 建索引）、`src/lib/repositories/`（Card/Sense/Relation CRUD，`deleteCard` 會級聯刪除其 sense 與 relation）、`src/lib/normalizeWord.ts`、`src/lib/familiarity.ts`（clamp、三段分級、`FAMILIARITY_SCORE_DELTA` 供後續 Phase 引用）。
  - 開發假資料：`src/lib/devSeed.ts`，dev 模式下於瀏覽器 console 執行 `lexicardDevSeed.seedDevData()` 可灌入 5 張假字卡（book/bank/run/novel/light）供 Phase 2/3 UI 開發測試。
  - 已用暫裝 `fake-indexeddb` + `vite-node` 跑過 16 項 repository/工具函式 smoke test 全數通過，驗證後已移除暫裝套件，不留在正式相依套件中。
- **Phase 2　單字卡庫（不含 AI、不含匯出）：尚未開始**，為下一步。內容：列表頁（總數／熟悉度圖示／星號）、搜尋（word/normalizedWord/sense 中文意思）、篩選＋排序、三種空狀態、更多選單殼子（CSV 匯出項目先放，功能留到 Phase 8）。

下一步：等待使用者確認 Phase 1 後開始 Phase 2。
