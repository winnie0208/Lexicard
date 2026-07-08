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
- **待辦提醒**：PRD 3.2 節「重複判斷」規則已相應更新為同時比對 `normalizedWord` 與 `partOfSpeech`，但實際重複判斷邏輯要到 Phase 5（新增單字）才會實作——設計該功能時務必記得比對範圍已擴大，不能只看 `normalizedWord`。
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

下一步：等待使用者確認 Phase 3 功能與畫面細節無誤後（詞義/關聯單字橫向捲動列表、刪除詞義/關聯/單字流程、三點選單、header 兩欄排版與建立時間顯示），進入 Phase 4（AI Adapter 層與 Gemini 串接）。此 Phase 需要使用者提供/設定 Google Gemini API Key（透過 Vercel 環境變數），屆時需協助完成 Vercel 專案連結（Phase 0 遺留待辦）。Relation `sourceSenseId`/`targetSenseId` 的實作計畫已於 2026-07-08 完成，不再是待辦事項。
