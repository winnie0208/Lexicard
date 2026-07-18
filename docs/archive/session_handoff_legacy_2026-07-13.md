# LexiCard Codex 接續討論交接文件

## 1. 文件用途

本文件整理先前 Codex session 中針對 LexiCard 的產品討論結果，供目前專案資料夾或後續新 thread 接續規劃、設計或開發使用。

本專案已由舊有輸出資料夾轉移至目前資料夾根目錄。後續閱讀與引用文件時，請以目前資料夾根目錄中的檔案為準，不要再假設存在 `outputs/` 子資料夾。

專案已進入開發階段。實際程式碼（Vite + React + TS scaffold）統一放在 `Prototype/` 資料夾，開發依 `MVP_Task_Breakdown.md` 逐 Phase 進行，細節見第 9 節。`D:\AI Case\Lexicard` 本身已是獨立 git repo（與上一層 `D:\AI Case` 的 monorepo 無關），並 push 至 `https://github.com/winnie0208/Lexicard.git`（`main` branch）。

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

Card 代表單字本體，例如 `book`，且**只代表單一詞性**（見下方 2026-07-06 決策更新）。

主要欄位：

- `id`
- `word`
- `normalizedWord`
- `partOfSpeech`（2026-07-06 起改列於 Card；單字詳情頁僅顯示、不可編輯，見下方決策更新）
- `phonetic`（單字詳情頁僅顯示、不可編輯）
- `pronunciationAccent`
- `isStarred`
- `repeatCount`
- `errorCount`
- `familiarityScore`
- `createdAt`
- `updatedAt`

Card **不再有** `note` 欄位（2026-07-06 起移到 Sense，見下方）。

### Sense

Sense 代表同一單字（同一詞性）的某個意思、用法或語境。

主要欄位：

- `id`
- `cardId`
- `chineseMeaning`
- `usageContext`
- `exampleSentence`
- `exampleSentenceTranslation`
- `note`（2026-07-06 起改列於 Sense，非 Card；選填，可事後編輯）
- `isPrimary`
- `createdAt`
- `updatedAt`

重要決策（**2026-07-06 更新，取代下方舊決策**）：

- 詞性與音標改列於 Card（單一詞性、單一發音），不再屬於 Sense；中文意思、使用情境、例句、例句中文翻譯、備註仍屬於 Sense（可有多個 sense）。
- 同一單字文字若有不同詞性用法（例如 book 可作名詞「書」與動詞「預訂」），需拆成兩張不同的 Card（`normalizedWord` 相同、`partOfSpeech` 不同），並以 Relation 的「詞性變化」（`partOfSpeechVariant`）類型互相關聯。同一詞性下的多個意思（例如 bank 的「銀行」「河岸」皆為名詞）仍是同一張 Card 下的多個 sense。
- 單字詳情頁的 `partOfSpeech`／`phonetic` 為唯讀顯示，**不提供編輯 UI**（由建立時的 AI 生成或手寫辨識結果決定）。備註（`note`）改為 Sense 層級欄位，每個 sense 各自有獨立備註，不再是 Card 層級的單一備註。
- 建立 sense 時，`chineseMeaning`／`usageContext`／`exampleSentence`／`exampleSentenceTranslation` 皆為必填，需在建立當下完整填寫，不採事後補上的方式；`note` 為選填。
- PRD 3.2 節「重複判斷」規則同時比對 `normalizedWord` 與 `partOfSpeech`，已於 2026-07-08 在 `AddWordPage.tsx`（Phase 5 非 AI 部分）正式實作完成，不再是待辦事項（詳見下方第 9 節 Phase 5 條目）。
- **待辦提醒**：Phase 6 的 AI 討論若要「加入備註」，目標是使用者指定的某個 sense，而非 Card。
- ~~詞性與中文意思屬於 Sense，不屬於 Card~~（舊決策，已被上方 2026-07-06 更新推翻）。
- Sense 初始由 AI 產生。
- 使用者可事後手動編輯中文意思、使用情境、例句、例句中文翻譯與備註。
- 使用者可新增 3 個以上 sense。
- 同一 Card 的 sense 中文意思重複或語意相近時，系統提醒但不阻擋保存。

### Relation

Relation 代表兩張字卡之間的關聯。

關聯類型（**2026-07-08 更新**：移除「延伸單字」，其餘三類補上明確定義）：

- 易混淆單字：拼字或發音相近、容易混淆使用情境的單字（例：affect/effect、desert/dessert）。
- 相似意思：中文意思相近或相同的不同英文單字（同義詞，例：happy/glad）。
- 詞性變化：同一單字文字、不同詞性所拆分出的 Card 之間的連結（例：book(n)/book(v)）。

關聯來源：

- AI 關聯
- 手動關聯

**2026-07-08 已實作完成**：`Relation` 現在會記錄具體的 `sourceSenseId`／`targetSenseId`（皆必填），關聯連結的是兩張卡各自「特定」的 sense，而非整張卡查詢對方主要意思。`senseRepository.deleteSense` 會級聯刪除引用該 sense 的 relation；`useCardDetail.ts` 的 `RelationWithCard` 改為 `otherSense: Sense | undefined`（精準解析對方那一個 sense，取代先前的 `otherSenses: Sense[]` 全部列出）；`devSeed.ts` 的 `SeedRelation` 支援 `sourceSenseIndex`/`targetSenseIndex`（預設 0＝主要 sense）指定要連到哪個具體 sense。詳見 `Log.md`「Relation 依 sense 配對正式實作完成...」條目。

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

- **Phase 0　專案初始化：已完成**（詳見 `Log.md` 2026-07-03 Phase 0 條目）。
  - Vite + React 19 + TS scaffold，ESLint（flat config）+ Prettier（取代新版 Vite 預設的 oxlint），Tailwind CSS 4，`vite-plugin-pwa`（manifest + 佔位圖示，正式圖示留 Phase 9），`react-router` 三頁路由（`/`、`/add`、`/study`）+ 底部導覽列。
  - 資料夾結構：`src/pages`、`src/components`、`src/lib`、`src/types`、`src/hooks`、`scripts/`（開發輔助腳本，如 `generate-pwa-icons.cjs`）。
  - Task 5（GitHub repo／Vercel 專案連結）：GitHub repo 已完成。因原本 Git repo 根目錄在上一層 `D:\AI Case`（與其他專案共用），已在 `D:\AI Case\Lexicard` 底下另建獨立 git repo，push 至 `https://github.com/winnie0208/Lexicard.git`（`main` branch，已設定 `origin` 追蹤）。Vercel 專案連結尚未設定，此機器無 `vercel` CLI，留待使用者或後續 session 處理。
- **Phase 1　資料層：已完成**（詳見 `Log.md` Phase 1 條目）。
  - `src/types/`（`Card`/`Sense`/`Relation`/`WordCandidate`）、`src/lib/db.ts`（Dexie schema，`cards` 以 `normalizedWord` 建索引）、`src/lib/repositories/`（Card/Sense/Relation CRUD，`deleteCard` 會級聯刪除其 sense 與 relation）、`src/lib/normalizeWord.ts`、`src/lib/familiarity.ts`（clamp、三段分級、`FAMILIARITY_SCORE_DELTA` 供後續 Phase 引用）。
  - 開發假資料：`src/lib/devSeed.ts`（`seedDevData()`/`clearAllData()`）。**2026-07-08 多輪重新設計**：目前為 **36 張字卡、23 筆 relation**（`SEED_CARDS`/`SEED_RELATIONS` 資料陣列 + 迴圈建立），刻意涵蓋「詞義數（1 個／多個）× 關聯單字數（0／1／多個，且多個時類型需不同）」的所有組合，並包含一組 5 個 sense、5 筆不同類型關聯的示範（`set(n.)`）。`SeedRelation` 支援可選的 `sourceSenseIndex`/`targetSenseIndex`（預設 0＝主要 sense），讓假資料能指向正確的具體 sense（見下方 Relation 條目）。dev 模式下除了瀏覽器 console 的 `lexicardDevSeed.seedDevData()`，也已在畫面上加了 `DevSeedPanel`（見 Phase 2 條目，且可收合成右上角小按鈕），因為 iPad Safari 沒有方便的 console 可用。
  - id 產生統一使用 `src/lib/generateId.ts` 的 `generateId()`（手刻 UUID v4，基於 `crypto.getRandomValues()`），**不要改回 `crypto.randomUUID()`**——該 API 需要安全情境（HTTPS 或 localhost），iPad 透過區網 HTTP 測試時會直接拋例外，是 2026-07-03 抓到的實際 bug（詳見 `Log.md`「Bug fix：iPad 實機測試」條目）。
  - 已用暫裝 `fake-indexeddb`／`vite-node` 跑過 repository、查詢邏輯與 `generateId()` 的一次性 smoke test，驗證後已移除暫裝套件，不留在正式相依套件中。
- **Phase 2　單字卡庫（不含 AI、不含匯出）：功能與視覺皆已完成，等待使用者最終確認**（詳見 `Log.md` Phase 2 條目與其後的視覺設計條目）。
  - `CardLibraryPage` 含列表、搜尋（word/normalizedWord/sense 中文意思）、篩選＋排序、三種空狀態（無字卡／星號篩選無結果／搜尋無結果，依此優先序判斷）、匯出按鈕（`LibraryMoreMenu`，CSV 邏輯留到 Phase 8）。
  - 資料來源用 `dexie-react-hooks` 的 `useLiveQuery`（`src/hooks/useCardLibrary.ts`），列表隨資料庫變化即時更新。
  - **列表項目星號可直接點擊切換**（Phase 2 追加，非原始任務範圍但使用者已要求並實作）；列表項目也顯示詞性與發音播放按鈕（2026-07-06 追加）；卡片點擊會導向 `/cards/:id`（`CardDetailPage.tsx`）。
  - 視覺設計：色彩／字體維持暖紙色＋赭紅 `accent`＋Fraunces/Work Sans/IBM Plex Mono（`src/index.css` 的 `@theme`），但已刻意降低與 Claude 品牌識別的相似度（拿掉斜體大標、紙張顆粒紋理、硬邊位移陰影），改走圓潤／block 風格（大量 `rounded-card`/`rounded-full`、色塊卡片取代線條分隔）。熟悉度改用抽象雪花／花瓣圖示（`SnowflakeIcon`，8px）。**全站可互動元件最小觸控尺寸 44×44px**，Phase 3 起新畫面應延續。
  - 排序下拉選單改用自製 `src/components/SelectMenu.tsx`（不要用原生 `<select>`——其選項面板是瀏覽器原生繪製，CSS 無法改外框/圓角，且 iOS 會忽略自訂高度）。
  - 圖示統一放 `src/components/icons.tsx`，手刻 SVG；需要填色/外框切換的圖示用 `filled?: boolean` prop（`BookIcon`/`QuillIcon`/`BoltIcon`/`StarIcon`）。
  - 因環境無瀏覽器自動化工具，所有視覺與互動確認皆由使用者於桌機/iPad/iPhone 實機截圖回饋後迭代完成。
- **Phase 3　單字詳情（純手動 CRUD，不含 AI）：功能已完成，等待使用者實機確認**（詳見 `Log.md` Phase 3 條目、其後兩則資料模型調整條目、「大量畫面細節微調」條目、以及最後一則「Relation 依 sense 配對正式實作完成...」條目）。
  - `CardDetailPage.tsx`：header 顯示單字／詞性（唯讀，圓角小標籤）／音標（唯讀）／星號切換（左側）／發音播放（右側，`SpeechSynthesisUtterance` + `en-US`）；熟悉度（`showLabel` 顯示「陌生/一般/熟悉」文字）在單字區塊最下方；頁面最下方新增「刪除單字」按鈕（`ConfirmDialog` 確認，刪除後導回單字庫）。`SenseSection.tsx`／`RelationSection.tsx` 目前皆改為**橫向捲動卡片列**（詳見下方獨立條目），不再是垂直堆疊。
  - 新增 `src/hooks/useCardDetail.ts`：即時查詢單一 Card、其 senses、以及 relations（`RelationWithCard.otherSense` 現在是精準對應到具體 sense 的單一物件，不是對方全部 sense）。
  - **重要慣例**：
    - 依 id 重置本地 state（如切換卡片要重置表單欄位）一律用 `key={xxx.id}` 讓元件重新掛載，不要用 `useEffect` + `setState`——新版 `eslint-plugin-react-hooks`（`react-hooks/set-state-in-effect`）會擋下後者。
    - 卡片內的次要操作（編輯/刪除）統一改用共用元件 `src/components/CardActionsMenu.tsx`（右上角單一「⋮」選單按鈕，取代先前的雙圖示按鈕），選單面板用 React Portal 渲染到 `document.body`（見下方橫向捲動條目的「重要 bug」說明）；新增類按鈕（新增詞義/新增關聯）維持純圖示圓形按鈕，不帶文字。
    - 表單欄位若同時有「新增」與「編輯」兩個實例可能同時掛載，`label`/`input` 的 `id` 務必加唯一後綴（例如 `-${initialSense?.id ?? 'new'}`），避免 `htmlFor` 對應到錯誤元件。
    - 必填欄位皆為空時應 `disabled` 送出按鈕，並在 submit handler 內再做一次防呆檢查。
    - 表單輸入框底色統一 `bg-stone-100`（暖色調灰階）；label 統一用共用元件 `src/components/LabeledInput.tsx`（label 在輸入框**外側**上方，11px/medium/`tracking-wide`/`text-ink-soft/80`，輸入框 `min-h-[44px]`）。
    - 刪除類操作（詞義／關聯／整張單字）統一用共用元件 `src/components/ConfirmDialog.tsx`（自設計彈窗，取代原生 `window.confirm`），標題帶入識別內容、說明統一「刪除後無法恢復」，有受影響項目時列出清單。
    - **本 session 發現的坑**：連續多次針對同一檔案做小幅調整時，偶爾會出現「先前一次 Edit 的結果稍後消失、內容回退」的狀況（原因未查證，猜測跟編輯器/其他程序的存檔行為有關）。之後若遇到使用者說「怎麼跟我說的不一樣/沒改到」，優先懷疑是這個問題，**每次結構性 Edit 後都用 Read 重新確認磁碟內容再回報完成**（2026-07-08 又踩到一次，SenseSection.tsx 一次還原編輯回退未生效，靠重新 Read 才發現）。
    - **CSS 排查慣例**：若發現「兩個 class 完全相同的 inline/span 元素渲染尺寸卻不一致」，優先檢查兩者是否分別位於 flex 容器（會被 blockify 成區塊層級）與普通 block 容器（維持真正 inline，DevTools 可能顯示 `auto×auto`），而非優先懷疑 line-height/padding 設錯——2026-07-08 排查關聯類型 tag 與詞義卡片「始」tag 高度不一致時，根因正是這個 flex-item blockify 差異，而非最初懷疑的 line-height 或文字換行。
  - Sense 相關細節：原始意思標籤最終文案為「始」（單字，14px，無圖示，位置改到中文意思右側同排）；「設為原始意思」是編輯表單內的核取方塊（非卡片上的獨立按鈕），儲存時呼叫 `setPrimarySense` 確保同卡互斥；顯示時 sense 一律原始意思排最前（`sortedSenses`）；備註顯示為低調樣式（`#備註內容`、上方虛線、無底色框）；「詞義」「關聯單字」標題右側都顯示數量「(N)」。
- **2026-07-06 資料模型調整（兩輪）**：(1) `partOfSpeech`（詞性）已從 Sense 移到 Card（單一詞性／單一發音，多個 sense／多個 relation），Phase 5 重複判斷需同時比對 `normalizedWord`＋`partOfSpeech`；(2) `note`（備註）已從 Card 移到 Sense（每個 sense 各自的備註），Card 層級的詞性／音標改為唯讀不可編輯，sense 的中文意思/使用情境/例句/例句翻譯改為建立時必填。細節見上方第 4 節「核心資料模型」與 `Log.md` 對應條目。
- **2026-07-08 關聯單字調整**：移除 `extension`（延伸單字）relationType，PRD 補上其餘三類（易混淆單字／相似意思／詞性變化）的明確定義與範例；`Relation` 改記錄具體 `sourceSenseId`/`targetSenseId` 已**正式實作完成**（不再是暫停狀態，見上方第 4 節「Relation」）；假資料擴充為 36 張卡／23 筆 relation。
- **2026-07-08 詞義／關聯單字列表改為橫向捲動卡片列**：兩份列表改為固定寬度卡片（`w-72`）+ `overflow-x-auto` + `snap-x snap-mandatory`，仿手機常見的橫滑卡片 UX；新增三個桌機互動支援 hook（`src/hooks/useSnapAlign.ts` 捲動後 JS 主動校正對齊、`src/hooks/useHorizontalWheelScroll.ts` 讓滑鼠滾輪可橫向捲動、`src/hooks/useDragToScroll.ts` 滑鼠拖曳捲動）。**兩個重要 bug 與慣例，後續有類似需求務必留意**：
  1. 這三個 hook 呼叫時務必傳入「列表何時從空變有資料」的依賴（例如 `[relationsWithCards.length]`）——因為 ref 物件本身不會觸發 `useEffect` 重跑，若元件掛載當下資料還沒非同步載入完成（`useLiveQuery` 初次回傳空陣列），条件渲染的容器還不存在，`containerRef.current` 會是 `null` 且永遠抓不到，監聽器就永遠沒掛上。
  2. 任何跳出卡片範圍的浮動 UI（下拉選單、提示框）如果卡片本身在 `overflow-x-auto` 的捲動容器裡，**不能靠一般 `absolute` 定位**——CSS 規範規定 `overflow-x` 非 `visible` 時 `overflow-y` 也會被迫非 `visible`，會被裁掉。必須用 React Portal 渲染到 `document.body`、改用 `position: fixed` + `getBoundingClientRect()` 算座標才能脫離裁切範圍（`CardActionsMenu.tsx` 已採此做法）。
  詳見 `Log.md`「Relation 依 sense 配對正式實作完成...」條目的完整記錄。
- **2026-07-08 UI 細節微調（續）**：返回連結（單字詳情頁「← 單字庫」）改用 `ChevronLeftIcon`（20×20px）取代文字「←」，hover 最終定案為僅 `hover:text-accent`（曾試過 `hover:bg-accent/50` 底色，使用者要求改回純變色、不要底色）；全站圓形 icon 按鈕（`CardActionsMenu` 三點選單、單字庫/詳情頁發音按鈕）hover 底色統一改為 `hover:bg-stone-100`，發音按鈕另加 `hover:text-accent`；詞義卡片例句字級改 18px（`text-lg`）、行高 `leading-tight`、中文翻譯顏色改 `text-ink`；關聯單字表單「說明」欄位標籤改為「備註」；關聯類型 tag 字級改 14px 並修正與詞義卡片「始」tag 的高度不一致問題（根因是 flex-item blockify 差異，詳見上方「重要慣例」與 `Log.md` 對應條目）。
- **2026-07-08 單字詳情頁 header 加入建立時間、內部結構改為左右兩欄**：`CardDetailPage.tsx` header 新增「建立於 YYYY/M/D」（`card.createdAt`），與熟悉度同排、靠右對齊（與發音按鈕齊右）。header 內部結構依使用者手繪線稿重排為左右兩欄：左欄星號按鈕（`items-start` 頂部對齊）、右欄（`flex-1`）由上而下為「單字＋詞性＋發音按鈕」排、音標、「熟悉度＋建立時間」排；執行前已用 `AskUserQuestion` 確認線稿藍框僅為結構分欄（不加實際可見邊框）、音標與熟悉度之間也不加實際分隔線。詞性標籤與單字同排，對齊方式定案為 `items-baseline`（`items-end` 會讓詞性視覺偏低）+ `mb-1` 微調。
- **Phase 5　新增單字：僅非 AI 部分已完成（含三區塊佈局＋模擬 AI 對話），Phase 4 刻意跳過先做**（詳見 `Log.md`「Phase 5　新增單字（僅非 AI 部分，Phase 4 暫緩、跳過先做）＋畫布/AI討論/已新增單字三區塊佈局」條目）。使用者明確要求先跳過尚未開始的 Phase 4（AI Adapter），直接做 Phase 5；由於 Phase 5 多項任務（AI 辨識主要單字、AI 生成字卡內容預覽、AI 討論區真正串接、AI 延伸單字建議、iPad Scribble 手寫實機測試）直接依賴 Phase 4，皆**尚未實作**，僅完成非 AI 部分＋介面骨架：
  - `Prototype/src/lib/repositories/cardRepository.ts` 新增 `findCardsByNormalizedWord(word): Promise<Card[]>`（回傳所有同 `normalizedWord` 的字卡，供詞性比對用；與只回傳第一筆、忽略詞性的既有 `findCardByNormalizedWord` 並存，後者仍供 `RelationSection.tsx` 使用，不要合併或移除）。
  - `Prototype/src/pages/AddWordPage.tsx` **最終定案為左右兩欄佈局**（`max-w-5xl`、`grid grid-cols-[2fr_3fr]`，右欄比例偏大）：左欄 `AiDiscussionPanel.tsx`（AI 討論，內嵌生成預覽），右欄由上而下為 `RecentlyAddedWords.tsx`（已建立單字卡列表）+ 畫布卡片（大型 `<textarea>`，非 `<canvas>`，因 iPadOS Scribble 只認得真正的文字輸入元素，視覺做成白紙畫布，供手寫/輸入單字＋詞性/音標欄位）。（曾先做過直向四區塊堆疊版本，後依使用者要求改為此左右兩欄版本，取代之。）
  - `AiDiscussionPanel.tsx` 改吃 11 個 props（5 個內容欄位 value/onChange、`isRequiredFilled`、`pendingNewSenseConfirm`），把原本獨立的「AI 生成預覽」表單（中文意思/使用情境/例句/例句翻譯/備註 + 送出按鈕）**直接嵌入對話氣泡串的最後一則**（`bg-paper-deep` 圓角卡、靠左對齊寬度 92%，內含小標題「AI 生成預覽」+ 說明文字 + 5 個 `LabeledInput` + 確認提示 + `type="submit"` 送出按鈕），視覺上像是 AI 對話的延伸，而非分開的表單區塊；`AddWordPage` 仍維持單一個 `<form onSubmit>` 包住整個兩欄 grid，送出按鈕雖然渲染在 `AiDiscussionPanel` 內部但仍是同一個 form 的後代，`handleSubmit` 三分支重複判斷邏輯完全不變。前 4 則對話仍是硬編碼 `MOCK_MESSAGES`（模擬資料，非真的在跟 AI 對話）。
  - **重要**：`AddWordPage.tsx` 完全沒有 AI 辨識/生成邏輯，AI 討論區塊也只是模擬資料——這些留到 Phase 4 完成後直接在既有元件基礎上擴充（換成真實 API 呼叫），不要另開新檔或誤以為 Phase 5 已全部完成。
  - 實作前用 `EnterPlanMode` 規劃兩次（第一次非 AI 邏輯設計、第二次三/四區塊直向佈局設計），左右兩欄的最終版則是後續單獨一輪 `AskUserQuestion` 確認整合方式後直接調整（範圍相對明確，未再走完整 plan mode）。
  - **重要教訓**：本輪過程中 `AddWordPage.tsx`／`cardRepository.ts` 的新函式與對應 Log/session_handoff 記錄，在寫入磁碟後一度整批消失、回退成更早版本。已用 `git reflog` 確認排除是 git commit/reset 造成（這個 repo 只有 3 個 commit，reflog 沒有任何 reset 紀錄），純屬本專案已知的「編輯偶爾靜默回退」問題，**不是** git 造成的——之後遇到類似狀況不要往 git 操作方向排查，優先重新 Read 確認磁碟實際內容。
  - `RecentlyAddedWords.tsx` 後續改為橫向捲動卡片列（外層色塊容器 `bg-paper-deep`，卡片 `w-40 bg-surface`），沿用 Phase 3 詞義/關聯單字列表已驗證過的 `useSnapAlign`／`useHorizontalWheelScroll`／`useDragToScroll` 三個 hook（deps 皆傳 `[cards?.length ?? 0]`，避免 `useLiveQuery` 非同步載入完成前 effect 抓不到 DOM 的既知 bug）。
  - **以平板/電腦為設計目標，改為固定高度雙欄、內容各自捲動**：頁面標題「新增單字」已移除；左欄最小寬度 320px，兩欄比例最終定案 1:3（曾試過 2:3）；`AiDiscussionPanel.tsx` 為 `flex h-full min-h-0 flex-col` 三段式（標題 `shrink-0` 固定頂部、訊息串含內嵌生成預覽 `flex-1 min-h-0 overflow-y-auto` 垂直捲動、輸入框/送出按鈕 `shrink-0` 固定底部），類似一般聊天 App 版面；右欄（已建立單字卡列表 `shrink-0` 在上、畫布卡片 `flex-1` 在下）改為 flex 直向排列，畫布 textarea 本身也是 `flex-1` 撐滿卡片扣除列表後的剩餘高度。`AddWordPage.tsx` 根 `<div>` 與內層 `<form>` 皆改用 `h-full` 逐層繼承高度（曾用估算值 `h-[calc(100svh-9.5rem)]`，已捨棄改回 `h-full`），根 `<div>` 底部留白由 `pb-10` 縮小為 `pb-4`（原本的 40px 是沿用會捲動頁面的留白慣例，固定高度版面不需要）；容器本身移除 `max-w-5xl` 限寬，改為 `w-full` 撐滿視窗寬度。
  - **重要技術教訓（flex 撐高陷阱，已在多層踩過，務必記住）**：flex item 預設 `min-height: auto`，會依內容自然高度撐開、蓋掉 `flex-1`/`h-full` 想要的固定高度限制，導致該撐滿的容器實際被內容撐得更高，逼得上層（甚至整個網頁）需要多一層捲動，而不是只有內部欄位捲動。**這個陷阱不只發生在 `AddWordPage` 內部元件，最外層 `App.tsx` 的 `<main className="flex-1 ...">` 也需要補上 `min-h-0`**（原本漏掉，導致 iPad 實機測試時整頁仍需要往下捲，截圖確認過才發現）——`main` 補 `min-h-0` 不影響單字庫/單字詳情頁等原本就需要正常整頁捲動的頁面（`min-h-0` 只移除下限，不裁切內容、不設上限）。之後任何頁面只要用 `h-full`/`flex-1` 做固定高度＋內部捲動的版面，從最外層的 `<main>` 一路到最內層的捲動容器，每一層 flex/grid 子項都要記得加 `min-h-0`，否則只要其中一層漏掉，整條高度鏈就會失效。
  - **2026-07-09 高度修正續篇**：使用者截圖指出左右欄底部仍被底部導覽列遮住。新的根因是 `main` 仍是整個 `100svh`，只靠 `pb-[72px+safe-area]` 預留 fixed nav；`AddWordPage` 的 `h-full` 仍會繼承到未扣 nav 的高度。已改為在 `src/index.css` 定義 `--lexicard-nav-height: 72px` 與 `--lexicard-main-height: calc(100svh - var(--lexicard-nav-height) - env(safe-area-inset-bottom))`，`App.tsx` 根容器使用 `h-svh overflow-hidden`，`main` 使用 `h-[var(--lexicard-main-height)] flex-none overflow-y-auto`，`NavBar.tsx` 使用同一 nav 高度變數，`AddWordPage.tsx` 根 `<div>` 與 `<form>` 補 `min-h-0`。`npm.cmd run build`／`npm.cmd run lint` 通過，`/add` 回應 200；環境沒有可用 in-app browser，因此仍待使用者實機確認。如果仍遮擋，下一步檢查實際 nav 高度是否超過 72px。
  - **2026-07-09 寬度修正續篇**：使用者接著回報寬度也會被遮住，瀏覽器縮窄時元件應跟著縮放。根因是 grid track 與 flex/grid 子項預設 `min-width: auto`，尤其右欄「已新增單字」橫向卡片列會透過 min-content 把整個 grid 撐寬。已將 `AddWordPage.tsx` grid 改為 `grid-cols-[minmax(clamp(260px,25vw,320px),1fr)_minmax(0,3fr)]`，讓左欄可從 320px 收縮到 260px、右欄可真正縮；`AddWordPage` 多層 wrapper、`AiDiscussionPanel`、`RecentlyAddedWords` 皆補 `min-w-0`，AI 氣泡加 `break-words`，`RecentlyAddedWords` 外層補 `overflow-hidden`，`App.tsx` main 改為 `overflow-x-hidden overflow-y-auto`。`npm.cmd run build`／`npm.cmd run lint` 通過，`/add` 回應 200；仍待使用者實機確認。
  - **2026-07-09 手寫區欄位調整**：使用者要求移除手寫區兩個「單字」標題文字，移除詞性/音標手動欄位；詞性/音標應由手寫單字自動辨識/生成，若同一單字有多個詞性則提供選項。已在 `AddWordPage.tsx` 移除可見 `<h2>單字</h2>`、textarea label、詞性與音標 `LabeledInput`，保留 textarea `aria-label`。新增 `useLiveQuery` 依目前 word 查詢既有同 normalizedWord 字卡，推導 `partOfSpeechOptions`；若只有一個詞性自動採用，若多個詞性則顯示 44px 高的詞性選項按鈕且未選前不允許送出。提交時也重新查詢並防呆。注意：Phase 4 AI Adapter 尚未完成，所以全新單字目前仍無真正 AI 詞性/音標生成，會先以空值建立；Phase 4 接上後需在這裡補真實生成。
  - **2026-07-09 AI 討論區標題移除**：使用者要求移除 AI 討論區上方標題。已在 `AiDiscussionPanel.tsx` 移除 `<h2>AI 討論</h2>` 與訊息串 `mt-3`，對話內容現在從面板頂部開始。`npm.cmd run build`／`npm.cmd run lint` 通過。
  - **2026-07-09 AI 討論區 scrollbar 調整**：使用者要求 AI 討論區 scrollbar 靠近右側邊緣且低調。已在 `AiDiscussionPanel.tsx` 對話串捲動容器加 `-mr-3 pr-3 scrollbar-subtle`，並在 `index.css` 新增 `.scrollbar-subtle`（thin scrollbar、透明 track、低透明度 thumb，hover 才稍微加深）。`npm.cmd run build`／`npm.cmd run lint` 通過。
  - **2026-07-09 AI 討論輸入欄自動增高**：使用者要求 AI 討論區下方輸入欄參考 ChatGPT，多行時自動增高，最多三行，超過三行後欄內 scroll。已在 `AiDiscussionPanel.tsx` 將底部 `input` 改為 `textarea`，新增 `chatDraft`、`chatInputRef` 與 `useLayoutEffect` 依 `scrollHeight` 調整高度；textarea 使用 `rows={1}`、`min-h-[44px]`、`max-h-[calc(1.25rem*3+1rem)]`、`resize-none`、`scrollbar-subtle`。送出按鈕仍 disabled，因 Phase 4 AI 對話尚未串接；目前只提供本地草稿輸入。`npm.cmd run build`／`npm.cmd run lint` 通過。
  - **2026-07-09 AI 討論輸入欄送出 icon**：使用者要求底部輸入欄右側原本的 X 按鈕改成 SEND 按鈕，且以 icon 呈現。已在 `icons.tsx` 新增 `SendIcon`，並在 `AiDiscussionPanel.tsx` 將旋轉的 `PlusIcon` 換成 `SendIcon`，`aria-label` 改為「送出 AI 討論訊息」。因 Phase 4 AI 對話尚未串接，按鈕仍 disabled；`npm.cmd run build`／`npm.cmd run lint` 通過。

下一步：等待使用者於 `npm run dev` 手動測試 Phase 5 左右兩欄佈局，優先確認新增單字頁底部與左右邊界是否都不再被導覽列或瀏覽器可視區域遮住；再測 AI 討論區標題已移除、scrollbar 位置與低調程度、AI 討論輸入欄 1 至 3 行自動增高與三行以上欄內 scroll、右側按鈕已改為送出 icon、手寫區已移除標題/詞性/音標欄位、多詞性既有單字會出現詞性選項、畫布輸入、AI 討論串內嵌生成預覽的重複判斷三分支、已建立單字卡列表移到右上方並回報結果。若仍有水平遮擋，下一輪用 DevTools 找 `scrollWidth > clientWidth` 的元素，優先檢查未補 `min-w-0` 的 grid/flex 子項或固定寬度元件。確認無誤後，回頭處理 Phase 4（AI Adapter 層與 Gemini 串接，此 Phase 需要使用者提供/設定 Google Gemini API Key，透過 Vercel 環境變數，屆時需協助完成 Vercel 專案連結——Phase 0 遺留待辦），Phase 4 完成後再回來為 Phase 5 補上 AI 依賴的部分（辨識主要單字、AI 生成內容預覽、AI 討論區真正串接、AI 延伸單字建議、AI 詞性/音標生成、iPad Scribble 手寫實機測試）。Relation `sourceSenseId`/`targetSenseId` 的實作計畫已於 2026-07-08 完成，不再是待辦事項。
