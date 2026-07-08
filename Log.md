# LexiCard 專案迭代紀錄

## 紀錄規則

- 後續任何大幅度迭代都必須記錄在本檔案 `Log.md`。
- 紀錄範圍包含 PRD 修改、產品決策、功能開發、技術選型、資料模型調整、AI prompt 調整、重要 bug 修正與未完成事項。
- 每次紀錄請附上日期、修改摘要、影響範圍、目前進度與下一步，方便換工具或開新 thread 時快速接續。
- 小幅文字修正可合併到最近一次相關紀錄；會影響產品理解或開發方向的變更應獨立新增一節。

## 2026-07-03

### 專案管理規則

- 專案已統一以 `Log.md` 作為唯一迭代紀錄檔。
- 後續 PRD 修改或功能開發時，需同步在 `Log.md` 補上變更紀錄。
- 紀錄目的為協助換工具、換 thread 或重新接手時快速理解目前任務、進度與決策脈絡。
- 已在 `AGENTS.md` 補充新 session 啟動規則：每次開啟新 session 需自動讀取專案啟動腳本或 agent notes、`Log.md` 與 `LexiCard_PRD.md`，必要時同步讀取 `session_handoff.md`。
- 已建立開發 session 切分規則：PRD 中的開發 phase 需再拆成較小任務，每一任務以一個 focused session 進行，並在有實質進展時記錄任務邊界、輸出、狀態與下一步。
- 已建立測試流程規則：每次功能開發需搭配該功能的人為單元測試，並在 `Log.md` 記錄測試範圍、結果、剩餘風險或後續事項。
- 已建立 `session_handoff.md` 定期維護規則：長 session、重要里程碑、PRD 或實作大幅變更、下一步或 blocker 改變、上下文或額度接近不足時，需更新交接摘要，避免突然中斷後難以轉交其他工具或 session。

### 產品結構

- 工具名稱定為 LexiCard。
- 產品形式定為 PWA，以避免 App Store 審核。
- 主要使用情境定為 iPad 建立與管理、手機快速學習。
- 首頁定為單字卡庫。
- 導覽列定為單字庫 / 新增單字 / 快速學習。
- Dashboard 移出 MVP。
- CSV 匯出入口放在單字卡庫右上角更多選單。

### 單字卡庫

- 單字卡庫列表顯示單字、熟悉度圖示、星號。
- 詞性只顯示於 sense 中。
- 熟悉度以書本圖示呈現：
  - 一本書：陌生
  - 兩本書：一般
  - 三本書：熟悉
- 單字庫無字卡時顯示簡短引導與新增單字入口。
- 搜尋範圍包含 `word`、`normalizedWord`、sense 中文意思。
- 排序包含最近新增、熟悉度由低到高、熟悉度由高到低、A-Z。

### 新增單字

- 新增單字頁採自由工作區形式。
- iPad 新增方式為手寫 / 文字輸入 + AI。
- 手機新增方式為文字輸入 + AI。
- 手寫輸入使用 iPadOS Scribble 轉文字，LexiCard 負責轉換後文字的候選判定、拼字修正與重複檢查。
- 手寫候選字列表只在需要時顯示。
- `WordCandidate` 定義為 transient / session-only，不進資料庫。
- 建立前以 `normalizedWord` 判斷重複。

### Sense 與重複新增

- Card 定義為單字本體。
- Sense 定義為同一單字的不同意思、詞性、用法或語境。
- 新字卡由 AI 產生 1-3 個 sense。
- 使用者可事後新增 3 個以上 sense。
- 詞性、中文意思、使用情境、例句、例句中文翻譯皆可手動編輯。
- 使用者嘗試建立已存在單字時，`repeatCount +1`。
- 單純重複新增已存在單字時，`familiarityScore -15`。
- 重複新增但本次語境為新 sense 時，使用者確認新增 sense 後 `familiarityScore -5`。
- 熟悉度在 MVP 維持 Card 層級，不針對單一 sense 計算。
- sense 中文意思重複或語意相近時顯示提醒，由使用者決定是否保存。

### 單字詳情

- 單字詳情顯示單字、音標、發音、熟悉度圖示、星號、備註、sense、關聯單字、內嵌 AI 對話框。
- 單字詳情中的 AI 討論不跳回新增單字頁。
- AI 對話框帶入目前字卡、sense、備註與關聯脈絡。
- AI 回覆可由使用者手動加入備註、建立新字卡或建立關聯。
- AI 對話為當前 session 暫存。
- 使用者離開頁面、重新整理頁面或重新開啟 App 後，未保存的 AI 對話內容會清空。

### 關聯

- 關聯類型包含延伸單字、易混淆單字、相似意思、詞性變化。
- 關聯來源分為 AI 關聯與手動關聯。
- MVP 支援手動建立關聯。
- Relation 匯出不列入 MVP。

### 快速學習

- 快速學習採 4 選 1 選項題，不採傳統正反面翻卡。
- 題型包含單字英翻中、例句情境英翻中。
- 單字英翻中時，該 Card 所有 sense 的中文意思皆視為正確答案。
- 例句情境英翻中時，正確答案為該例句對應 sense 的中文意思。
- 每題包含 1 個正確答案與 3 個 AI 生成干擾選項。
- AI 干擾選項需避開目前 Card 的所有 sense 中文意思。
- AI 干擾選項需避免與正確答案語意過於接近。
- AI 無法產生足夠干擾選項時，該題跳過並產生下一題。
- 被跳過題目不更新 `errorCount`、`repeatCount`、`familiarityScore`。
- 答對時 `familiarityScore +10`，顯示短暫正確回饋後進入下一題。
- 答錯時 `errorCount +1`、`familiarityScore -15`，顯示錯誤通知與正確答案後接續下一題。
- 快速學習完成後顯示本次題數與答對數。
- 熟悉度低優先採加權隨機：
  - 陌生：權重 5
  - 一般：權重 3
  - 熟悉：權重 1

### AI 功能與錯誤狀態

- AI 功能包含主要單字辨識、字卡內容生成、sense 生成、音標生成、例句生成、延伸字建議、易混淆字建議、關聯說明生成、快速學習干擾選項生成。
- AI 可以建議字卡與關聯，但建立前需經使用者確認。
- AI 回覆需由使用者手動選擇保存方式。
- AI 生成失敗時顯示錯誤提示與重試操作。
- 網路或連線失敗時顯示連線錯誤提示與重試操作。
- AI 生成失敗與連線失敗時保留使用者已輸入內容。
- 候選字信心過低時，顯示候選字列表或提示使用者修正文字。

### CSV 匯出

- MVP 匯出格式定為 CSV。
- CSV 使用 UTF-8 with BOM。
- CSV 採一個 sense 一列。
- 同一張 Card 有多個 sense 時，CSV 中會產生多列。
- Card 層級欄位在每個 sense 列重複顯示。
- Sense 層級欄位依每個 sense 顯示。
- 多列呈現代表多義項攤平，不代表字卡被重複建立。

### MVP 範圍外

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
- Relation 匯出

### 技術選型：前端架構與 AI 串接

- 修改摘要：完成 MVP 技術選型評估，以「無成本／低成本、個人測試用」為原則決定前端架構、本地儲存、手寫、發音、CSV 匯出與 AI 串接方案。
- 影響範圍：整體技術架構、套件清單、AI 串接方式，已同步補充至 `LexiCard_PRD.md` 第 9 章。
- 決策內容：
  - 前端框架採 Vite + React + TypeScript，搭配 `vite-plugin-pwa` 提供 PWA 能力、Tailwind CSS 處理樣式與 RWD。全部為開源免費套件，無需後端伺服器。
  - 本地資料儲存採 IndexedDB，透過 `dexie` 封裝，單人使用情境下不需雲端資料庫。
  - 手寫輸入直接依賴 iPadOS Scribble（OS 層級轉文字），不需額外手寫辨識套件。
  - 發音播放採瀏覽器內建 Web Speech API（`speechSynthesis`），MVP 僅美式口音，無需額外語音服務費用。
  - CSV 匯出採手刻 UTF-8 with BOM 字串或 `papaparse`。
  - 部署託管採 Vercel 免費 Hobby 方案，含免費 Serverless/Edge Function，用於代理 AI API Key，避免 Key 暴露於前端。
  - AI 串接曾評估 OpenAI API（pay-as-you-go，需另開 API 帳號與付款方式，與 ChatGPT Plus 訂閱完全獨立、無法共用額度），最終決定**先採用 Google Gemini API 免費層**（無需信用卡），預設模型為 `gemini-2.5-flash`（字卡生成、sense 拆分、AI 討論）與 `gemini-2.5-flash-lite`（快速學習干擾選項生成），SDK 使用官方新版 `@google/genai`（取代已棄用的 `@google/generative-ai`）。
  - AI 呼叫封裝為抽象層介面（`generateSense`、`generateDistractors`、`chatDiscuss` 等），底層 adapter 可替換供應商，保留未來視需求切換至 OpenAI 或其他 API 的彈性。
- 已知限制／風險：
  - Gemini 免費層依模型有 RPM／每日請求數限制（5–15 RPM，100–1,000 次/日），快速學習單輪多題建議批次預生成，避免瞬間超過 RPM 上限。
  - Gemini 免費層 prompt／回覆可能被 Google 用於模型改善，資料保護等級低於付費層，使用者已知悉並接受（個人單字學習資料，敏感度不高）。
  - Gemini 2.0 Flash 已於 2026/3/3 棄用（2026/9/24 關閉），選型統一採 2.5 系列。
- 目前進度：技術選型評估完成並定案，尚未開始專案 scaffold 與程式實作。
- 下一步：專案初始化（Vite scaffold）、Dexie 資料模型建立、AI adapter 介面設計與 Gemini 串接雛型。

### Phase 0　專案初始化（開發階段開始，依 MVP_Task_Breakdown.md 逐 Phase 進行）

- 修改摘要：完成 Phase 0 全部 5 項任務。專案程式碼統一放在 `Prototype/` 資料夾（獨立於文件根目錄），採 Vite + React 19 + TypeScript scaffold。
- 影響範圍：新增 `Prototype/` 專案目錄與其下全部程式檔案；不影響既有文件。
- 完成項目：
  1. Vite + React + TS scaffold；套件管理器改用 npm；`package.json` name 設為 `lexicard`。
  2. ESLint（flat config，`typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh`）與 Prettier 設定完成，取代 Vite 新版預設的 oxlint（PRD/任務書指定 ESLint/Prettier）。資料夾結構：`src/pages`、`src/components`、`src/lib`、`src/types`、`src/hooks`、`scripts/`（開發輔助腳本）。
  3. Tailwind CSS 4 透過 `@tailwindcss/vite` 官方 Vite plugin 整合，`src/index.css` 僅 `@import 'tailwindcss'`。
  4. `vite-plugin-pwa` 設定完成：manifest（name/short_name/theme_color 等）、`public/pwa-192x192.png`、`public/pwa-512x512.png`（暫用 `scripts/generate-pwa-icons.cjs` 產生的純色佔位圖示，正式圖示留待 Phase 9 補上）、`apple-touch-icon.png`、`index.html` 補上 PWA 相關 meta tag（theme-color、apple-mobile-web-app-capable 等）。`npm run build` 已驗證可正確產出 `dist/sw.js`、`dist/manifest.webmanifest`。
  5. `react-router`（v7，`BrowserRouter`）建立三條路由：`/`（單字卡庫）、`/add`（新增單字）、`/study`（快速學習），對應 `src/pages/CardLibraryPage.tsx`、`AddWordPage.tsx`、`QuickStudyPage.tsx`，皆為空頁面 + 標題；`src/components/NavBar.tsx` 為底部導覽列（貼合 iPad/手機主要使用情境），以 `NavLink` 高亮當前路由。
- 驗證：`npm run build`、`npm run lint`、`npx prettier --check .` 皆通過；`npm run dev` 啟動後以 curl 確認 `/`、`/add`、`/study` 三條路由皆可正常回應。
- 未完成／待使用者處理：GitHub repo 建立與 Vercel 專案連結（Task 5）。此機器未安裝 `gh` / `vercel` CLI，且目前 Git repo 根目錄為 `D:\AI Case`（工作區上一層，與其他專案共用同一個 repo，尚未設定任何 remote），是否要為 LexiCard 另建獨立 repo 或沿用工作區 repo 屬於使用者決策，故此項留給使用者自行處理，未來如需協助設定 `vercel.json` 或部署細節可再接續。
- 目前進度：Phase 0 其餘 4 項任務完成，等待使用者確認後進入 Phase 1（資料層）。
- 下一步：Phase 1 — TypeScript 型別定義（`Card`/`Sense`/`Relation`/`WordCandidate`）、Dexie schema、repository 層、`normalizedWord` 工具、熟悉度計算工具、開發假資料 seed script。

### Phase 1　資料層

- 修改摘要：完成 Phase 1 全部 6 項任務，依 `LexiCard_PRD.md` 第 4、5 章的資料模型與熟悉度規則實作型別、Dexie schema、repository CRUD 與工具函式。
- 影響範圍：新增 `Prototype/src/types/`（`card.ts`、`sense.ts`、`relation.ts`、`wordCandidate.ts`）、`Prototype/src/lib/db.ts`、`Prototype/src/lib/normalizeWord.ts`、`Prototype/src/lib/familiarity.ts`、`Prototype/src/lib/repositories/`（`cardRepository.ts`、`senseRepository.ts`、`relationRepository.ts`）、`Prototype/src/lib/devSeed.ts`；`main.tsx` 於 dev 模式動態載入 `devSeed`。
- 技術決策：
  - `Relation` 型別在 PRD 欄位表之外額外加上 `id`（Dexie 主鍵、供單筆刪除）與 `createdAt`，屬實作層級必要補充，非產品規則變更。
  - `relationType` 內部採英文列舉值（`extension`/`confusable`/`similarMeaning`/`partOfSpeechVariant`），另提供 `RELATION_TYPE_LABEL` 對照表輸出 PRD 定義的中文顯示文字（延伸單字／易混淆單字／相似意思／詞性變化）。熟悉度分級比照辦理（`FamiliarityLevel` 英文 key + `FAMILIARITY_LEVEL_LABEL` 中文對照）。
  - `familiarity.ts` 除 clamp／分級外，一併定義 `FAMILIARITY_SCORE_DELTA`（答對 +10／答錯 -15／重複既有 sense -15／重複新 sense -5）常數，供 Phase 5、7 直接引用，避免魔術數字重複。
  - `cardRepository.deleteCard` 以 Dexie transaction 串連刪除該 Card 的所有 sense 與 relation（含以該卡為 target 的 relation），避免刪除字卡後留下孤兒資料；PRD 未明訂此細節，屬資料完整性的必要實作決策。
  - `id` 一律採 `crypto.randomUUID()` 產生。
  - 開發假資料 seed（`devSeed.ts`）為瀏覽器端 IndexedDB 操作，非 Node CLI script：dev 模式下會掛在 `window.lexicardDevSeed`，於瀏覽器 devtools console 執行 `lexicardDevSeed.seedDevData()` 即可清空並灌入 5 張假字卡（book/bank/run/novel/light，含 sense、1 筆 relation、不同熟悉度與星號狀態），`clearAllData()` 可單獨清空。
- 驗證：`npm run build`（`tsc -b` 型別檢查通過）、`npm run lint`、`prettier --check .` 皆通過。另以暫時安裝的 `fake-indexeddb` + `vite-node` 撰寫一次性 smoke test（16 項斷言：normalizeWord、預設熟悉度 50、依 normalizedWord 查詢、sense 新增與 setPrimarySense 互斥、relation 雙向查詢、clamp 上下界、三段熟悉度分級邊界 39/40/69/70、刪除字卡的 sense/relation 級聯刪除）全數通過後，已移除該 smoke test 檔案與暫裝套件，不留在正式相依套件中。
- 目前進度：Phase 1 全部完成，等待使用者確認後進入 Phase 2（單字卡庫，不含 AI、不含匯出）。
- 下一步：Phase 2 — 列表頁（總數／列表／熟悉度圖示／星號）、搜尋（word/normalizedWord/sense 中文意思）、篩選＋排序、三種空狀態、更多選單殼子（CSV 匯出項目先放）。

### Phase 2　單字卡庫（不含 AI、不含匯出）

- 修改摘要：完成 Phase 2 全部 5 項任務，`CardLibraryPage` 從骨架頁面實作為可搜尋／篩選／排序的字卡列表，資料來源改為 Dexie 即時查詢。
- 影響範圍：新增 `Prototype/src/hooks/useCardLibrary.ts`（`dexie-react-hooks` 的 `useLiveQuery` 包裝，回傳 cards 與依 cardId 分組的 senses）、`Prototype/src/lib/cardLibraryQuery.ts`（純函式 `filterAndSortCards`，處理搜尋／篩選／排序邏輯）、`Prototype/src/components/FamiliarityIcon.tsx`、`Prototype/src/components/EmptyState.tsx`、`Prototype/src/components/LibraryMoreMenu.tsx`（⋯ 選單殼子，CSV 項目 disabled）；改寫 `Prototype/src/pages/CardLibraryPage.tsx`。新增相依套件 `dexie-react-hooks`。
- 技術決策：
  - 搜尋比對：`word`/`normalizedWord` 走 `normalizeWord`（trim+lowercase）子字串比對；sense 中文意思走 `trim` 後子字串比對（不做大小寫轉換，中文無此需求）。
  - 空狀態優先順序：先看整體字卡數是否為 0（無字卡）→ 再看有搜尋字串且結果為空（搜尋無結果）→ 再看星號篩選中且結果為空（星號篩選無結果），三者互斥判斷，避免搜尋+星號同時為空時訊息衝突。
  - 列表項目（單字／熟悉度圖示／星號）在 Phase 2 為純顯示，不可點擊、星號不可從列表切換 —— 對應 PRD 3.3 節「星號（可編輯）」是單字詳情頁（Phase 3）的能力，Phase 2 只負責列表呈現，避免提前跨 Phase 邊界。單字列也尚未串連到詳情頁導覽，因為 Phase 3 的詳情頁還不存在。
  - 總單字數（header 顯示）固定顯示 `cards.length`（不受目前搜尋／篩選影響），符合 PRD「總單字數」為字卡庫整體指標的定義。
- 驗證：`npm run build`（`tsc -b` 型別檢查）、`npm run lint`、`prettier --check .` 皆通過。另以暫裝 `vite-node` 對 `filterAndSortCards` 撰寫 8 項一次性 smoke test（依單字子字串搜尋、依 sense 中文意思搜尋、無結果、星號篩選、四種排序）全數通過後移除暫裝套件。因目前環境無瀏覽器自動化工具，UI 實際渲染與互動（灌測試資料、搜尋/篩選/排序切換、三種空狀態畫面）已請使用者於瀏覽器手動確認，尚待使用者回報結果。
- 目前進度：Phase 2 程式碼與建置驗證完成，等待使用者瀏覽器手動測試回饋與確認後進入 Phase 3（單字詳情，純手動 CRUD）。
- 下一步：Phase 3 — 基本資訊顯示與編輯（單字、音標、熟悉度圖示、星號、備註）、發音播放（Web Speech API）、Sense 列表與手動 CRUD、Sense 中文意思重複提醒（文字相同版本）、Relation 顯示與手動建立/刪除。

### Bug fix：iPad 實機測試（非 HTTPS 區網）下灌測試資料無反應

- 修改摘要：使用者以 iPad Safari 透過區網 IP（非 HTTPS、非 localhost）測試時，點擊「灌入測試資料」沒有任何反應。根因為 `crypto.randomUUID()` 是僅限安全情境（HTTPS 或 localhost）才可用的 API，在區網 HTTP 情境下呼叫會拋出例外；而 `DevSeedPanel` 原本的錯誤處理只有 `try/finally`、沒有 `catch`，例外被吞掉、UI 沒有任何提示，看起來像「沒有反應」。
- 影響範圍：新增 `Prototype/src/lib/generateId.ts`（以 `crypto.getRandomValues()` 手刻 UUID v4，此 API 不受安全情境限制），取代 `cardRepository.ts`／`senseRepository.ts`／`relationRepository.ts` 三處的 `crypto.randomUUID()`。另外強化 `DevSeedPanel.tsx`：改為 `try/catch/finally` 並將錯誤訊息顯示在畫面上（不只是 console），且從 `fixed` 浮動定位改為一般文件流（page 頂部橫幅），避免未來與底部導覽列的定位／疊層問題。
- 技術決策：由於 PRD 明確要求 iPad 為主要建立/整理情境、且 iPad 手寫測試（Phase 5 任務 7）之後也會在區網 HTTP 環境下進行，`generateId()` 取代 `crypto.randomUUID()` 是必要的相容性修正，非單純測試工具修補；未來所有需要產生 id 的地方應統一使用 `generateId()`。
- 驗證：`npm run build`／`lint`／`prettier --check` 皆通過；另以暫裝 `vite-node` 驗證 `generateId()` 產生合法 UUID v4 格式且 1000 次呼叫無碰撞，驗證後移除暫裝套件。
- 目前進度：修正已套用，等待使用者於 iPad 重新測試「灌入測試資料」按鈕確認可正常運作。
- 下一步：使用者確認 iPad 測試通過、Phase 2 沒有其他問題後進入 Phase 3。

### 視覺設計：建立「口袋辭書」視覺語言（套用於現有畫面）

- 修改摘要：應使用者要求（`/frontend-design`），為目前已完成的畫面（單字卡庫列表頁、底部導覽列）建立整體視覺語言，取代原本偏通用的「白底 + 紫色」風格，之後 Phase 3 起的新畫面直接沿用這套語言。
- 設計方向：「口袋辭書／田野筆記」風格——暖色紙張底色、編輯感襯線字型呈現單字（辭典詞條感）、等寬字型呈現音標/計數等中繼資訊、辭典頁般的虛線分隔與詞條編號、書籤緞帶取代通用星號圖示、書脊長條取代通用書本 emoji 呈現熟悉度。
- 影響範圍：
  - `Prototype/src/index.css`：Tailwind v4 `@theme` 定義色彩／字體 tokens（`--color-paper`／`--color-ink`／`--color-accent` 等、`--font-display`／`--font-body`／`--font-mono`），加入細緻紙張顆粒紋理（SVG feTurbulence data URI）、進場動畫 keyframe。
  - `Prototype/index.html`：改用 Google Fonts（Fraunces 襯線展示字體、Work Sans 內文、IBM Plex Mono 等寬），`theme-color` meta 改為新主色 `#b3431f`。
  - 新增 `Prototype/src/components/icons.tsx`：手刻 SVG 圖示（書本／羽毛筆／閃電／放大鏡／緞帶／羽毛），不依賴圖示套件。
  - 改寫 `NavBar.tsx`（辭典分頁式導覽，含自訂圖示與細緻上緣底線動畫）、`FamiliarityIcon.tsx`（書脊長條取代 emoji）、`EmptyState.tsx`、`LibraryMoreMenu.tsx`（硬邊位移陰影取代模糊陰影）、`CardLibraryPage.tsx`（辭典詞條式列表：詞條編號、緞帶星號、進場動畫）。
  - `vite.config.ts` manifest 與 `scripts/generate-pwa-icons.cjs` 佔位圖示同步改用新主色／底色。
- 驗證：`npm run build`／`lint`／`prettier --check` 皆通過。因環境無瀏覽器自動化工具，視覺呈現待使用者於 iPad／瀏覽器實際確認，目前僅完成程式碼與建置驗證。
- 目前進度：視覺設計套用完成，等待使用者實機確認觀感；不影響 Phase 2 功能邏輯（搜尋/篩選/排序/空狀態行為不變）。
- 下一步：使用者確認視覺方向後，Phase 3（單字詳情）起的新畫面直接沿用此語言（`font-display`/`font-mono`/`--color-accent` 等 tokens、緞帶星號、書脊熟悉度、辭典分隔線風格）。

### 視覺設計調整：降低 Claude 風格特徵、改走圓潤 block 風，及多輪 UI 細節修正

- 修改摘要：上一則「口袋辭書」視覺方向經使用者實機檢視後，判斷暖紙色＋赭紅＋襯線斜體＋紙張顆粒紋理的組合視覺上太接近 Claude 官方品牌識別（oat 底色＋terracotta 主色＋襯線大標）。使用者明確指示：**色彩與字體（暖紙色/赭紅 `--color-accent`/Fraunces/Work Sans/IBM Plex Mono）保留**，但整體設計要降低 Claude 特徵、增加圓潤／柔和感。此後再經多輪畫面截圖回饋，逐步微調至目前狀態。
- 降低 Claude 特徵的具體作法：拿掉斜體大標（標題改 bold 不用 italic）、拿掉紙張顆粒紋理（`body::before` feTurbulence 已移除）、拿掉更多選單的硬邊位移陰影（改回柔和 `shadow-lg`）、大幅增加圓角（`rounded-card`／`rounded-full`）、改用色塊卡片（`bg-surface` + `shadow-sm`）取代線條分隔，降低「編輯感雜誌排版」既視感。
- 6 大項畫面調整（依使用者原始需求分組）：
  1. **Header**：移除「Lexicon」小標；標題改 bold 無斜體；字卡總數改為「共 N 字」純文字（後又移到標題右側、以 baseline 對齊同一行）、無外框；更多選單從「⋯ 開啟選單」改為單一圓形匯出圖示按鈕（`LibraryMoreMenu.tsx`），點擊直接顯示「CSV 匯出功能將於後續版本提供」提示（實際匯出邏輯仍留待 Phase 8，此處只調整互動模式）；header 下方底線移除。
  2. **搜尋/篩選/排序**：搜尋框改全外框圓角、placeholder 改「搜尋」；篩選（全部/星號）與排序改為底色圓角 chip；「星號」篩選按鈕加上實心星星圖示。
  3. **空狀態**：CTA 按鈕改圓角；「無字卡」狀態文案改為「建立你的第一張單字卡」、移除說明文字、上方改用手繪插畫 PNG（`src/assets/empty-library.png`，暫裝 `sharp` rasterize 產生，驗證後移除套件）；此狀態 CTA 按鈕另外指定黑色（`bg-ink`，透過 `EmptyState` 新增的 `actionVariant` prop 控制），其餘兩種空狀態維持 `accent` 色。
  4. **卡片列表**：每個單字改為獨立卡片區塊（`rounded-card bg-surface shadow-sm`），點擊會導向 `/cards/:id`（新增 `CardDetailPage.tsx` 最簡 stub 頁面 + 路由，完整詳情頁功能留待 Phase 3）；星星圖示可直接點擊切換 `isStarred`（`stopPropagation` 避免誤觸卡片導航）；熟悉度圖示不再用書本堆疊，改用抽象雪花／花瓣圖示（`SnowflakeIcon`，6 瓣、實心，依熟悉度分級決定填色數量，尺寸最終定為 8px）。
  5. **整體風格**：大幅增加圓角、字體與互動範圍加大；後續使用者再要求全站可互動元件（按鈕、選單、星星切換、空狀態 CTA、詳情頁返回連結）統一至少 44×44px 觸控尺寸（Apple HIG 建議值），已逐一調整 `LibraryMoreMenu`／篩選按鈕／`SelectMenu`／星星切換按鈕／`EmptyState` 按鈕／`CardDetailPage` 返回連結。
  6. **假資料**：`devSeed.ts` 由 5 張擴充為 25 張（新增 20 個單字，含隨機化熟悉度/星號），供捲動行為測試。
- 導覽列另外經多輪來回調整：一度改為「圖示 + 底色圓角 block」設計，使用者要求恢復成原本純文字＋底線分頁的舊設計（字級沿用新設定），隨後又要求加回圖示、拿掉底線指示（改用文字/圖示變色標示當前頁）、圖示放大＋文字縮小、current 狀態圖示改為 filled（`BookIcon`/`QuillIcon`/`BoltIcon` 新增 `filled` prop）。「新增單字」原本的羽毛筆圖示形狀不清楚，改用矩形+三角形組成、可辨識的鉛筆圖示；匯出圖示箭頭方向從往上修正為往下。導覽列另外改為 `position: fixed` 固定於螢幕底部（含 `env(safe-area-inset-bottom)`），`<main>` 補上對應 `padding-bottom`，捲動時不會被內容推走；修正過程中一度因 `min-h-[76px]` 與實際內容自然高度（72px）不一致，導致畫面有多餘留白，已移除該 `min-h` 並修正 `<main>` 的 padding 對應值。
- 其他個別修正：
  - 排序下拉選單原本用原生 `<select>`，其選項彈出面板為瀏覽器/系統原生繪製，CSS 無法改外框顏色或圓角；已改為自製 `SelectMenu.tsx`（按鈕 + 自訂 `<ul role="listbox">` 面板），桌機與 iPad/iPhone 皆為統一自訂樣式。此為新增的可複用元件，未來若有其他下拉選單需求應優先重用此元件，而非直接用原生 `<select>`。
  - 原生 `<select>` 在 iOS 會套用系統控制項外觀（自帶內距與箭頭），會忽略 Tailwind 的高度設定，是本次修正 sorting 按鈕高度不一致的根因；改用自製元件後此問題不再存在。
- 技術決策／慣例（供後續 Phase 沿用）：
  - 圖示統一放在 `src/components/icons.tsx`，手刻 SVG、不依賴圖示套件；需要「填色/外框」兩種狀態的圖示（`BookIcon`/`QuillIcon`/`BoltIcon`/`StarIcon`）透過 `filled?: boolean` prop 切換，而非另建新圖示。
  - 需要視覺驗證的手刻圖形（icon 形狀、插畫），已建立「暫裝 `sharp` → rasterize 成 PNG → 用 Read 工具檢視 → 驗證後移除套件」的一次性驗證流程，非正式相依套件。
  - 全站互動元件（按鈕、可點擊圖示、連結型 CTA）最小觸控尺寸為 44×44px，之後新畫面（Phase 3 起）應延續此規範。
  - `CardDetailPage.tsx`（`/cards/:id`）目前為 Phase 3 的最簡 stub，Phase 3 開發時應在此檔案基礎上擴充，而非另開新檔。
- 驗證：每一輪修改皆執行 `npm run build`／`npm run lint`／`prettier --check .`，全數通過；因環境無瀏覽器自動化工具，所有視覺與互動確認皆由使用者於桌機/iPad/iPhone 實機截圖回饋後迭代。
- 目前進度：視覺設計與多輪細節修正皆已套用並通過建置驗證，Phase 2 功能邏輯未變。
- 下一步：等待使用者確認目前視覺與觸控體驗無誤後，正式進入 Phase 3（單字詳情，以 `CardDetailPage.tsx` stub 為基礎擴充：音標播放、sense 手動 CRUD、sense 中文意思重複提醒、關聯顯示與手動建立/刪除）。

### 視覺微調（續）：空狀態改虛線框、Dev 工具收合、下拉選單白邊修正

- 修改摘要：延續上一則視覺調整，再處理三項使用者截圖回饋的細節問題。
- 內容：
  1. `EmptyState.tsx` 外層區塊從實心白底（`bg-surface`）改為虛線外框（`border-2 border-dashed border-rule`，無底色），套用於三種空狀態卡片。
  2. `DevSeedPanel.tsx` 新增顯示／隱藏功能：點擊橫幅上的「隱藏 ✕」會收合成右上角一個小圓形浮動按鈕（不佔版面、不擋內容），再次點擊可展開回完整工具列；顯示狀態存在 `localStorage`（key: `lexicard-dev-panel-visible`），重新整理頁面會記住上次設定。目的是讓使用者能隨時切換掉 Dev 工具、確認實際畫面呈現。
  3. `SelectMenu.tsx` 下拉面板的 `<ul>` 拿掉 `py-1` 內距——原本因為面板本身的 padding，導致選項底色（尤其選中項目的 `accent-soft` 底色）沒有貼齊面板圓角，上下露出白色間隙；拿掉 padding 後，靠 `<ul>` 既有的 `overflow-hidden rounded-2xl` 讓首尾選項的底色自然貼合圓角。
- 驗證：`npm run build`／`lint`／`prettier --check .` 皆通過；因無瀏覽器自動化工具，畫面確認仍由使用者截圖回饋。
- 目前進度：三項細節修正皆已套用，等待使用者確認。Phase 2 視覺與功能修正暫告一段落，下一步同上，等待使用者確認後進入 Phase 3。

### Phase 3　單字詳情（純手動 CRUD，不含 AI）

- 修改摘要：完成 Phase 3 全部 5 項任務，`CardDetailPage.tsx` 從 Phase 2 留下的最簡 stub 擴充為完整的單字詳情頁，延續既有視覺語言（暖紙色/赭紅/圓潤 block 風、44px 觸控規範）。
- 影響範圍：
  - 新增 `Prototype/src/hooks/useCardDetail.ts`：以 `useLiveQuery` 即時查詢單一 Card、其 Sense 列表，以及 Relation 列表（並解析出「對方字卡」，不論目前字卡是 `sourceCardId` 或 `targetCardId`）。
  - 新增 `Prototype/src/components/SenseSection.tsx`：Sense 列表顯示（詞性／中文意思／使用情境／例句／例句中文翻譯／主要標記）+ 新增／編輯／刪除／設為主要；內含 `SenseForm` 子元件處理表單與中文意思重複比對。
  - 新增 `Prototype/src/components/RelationSection.tsx`：關聯列表顯示（對方單字／關聯類型／來源／說明）+ 手動新增（輸入已存在單字 → `findCardByNormalizedWord` 查找 → 選擇關聯類型 → 選填說明）／刪除；關聯類型選單重用 Phase 2 建立的 `SelectMenu.tsx`。
  - 改寫 `Prototype/src/pages/CardDetailPage.tsx`：基本資訊（單字、音標、熟悉度圖示、可切換星號）、發音播放按鈕、備註編輯（`NoteEditor` 子元件）、掛載 `SenseSection`／`RelationSection`。
  - `Prototype/src/components/icons.tsx` 新增 `SpeakerIcon`（發音播放）、`PlusIcon`（新增）、`TrashIcon`（刪除）、`CheckIcon`（主要 sense 標記）。
- 技術決策：
  - 發音播放採瀏覽器內建 `SpeechSynthesisUtterance`，`lang = 'en-US'`（PRD 指定美式口音），播放前呼叫 `speechSynthesis.cancel()` 避免連續點擊時多個語音疊加；呼叫前檢查 `'speechSynthesis' in window`，避免不支援的瀏覽器噴錯。
  - 備註編輯欄位（`NoteEditor`）以 `key={card.id}` 掛在父層 `CardDetailPage`，讓切換不同字卡時透過 React 重新掛載元件、自然重置本地 `note` 狀態，取代原本用 `useEffect` + `setState` 同步的寫法——因為新版 `eslint-plugin-react-hooks`（`react-hooks/set-state-in-effect`）會擋掉「effect 內直接呼叫 setState 同步 prop」的寫法，改用 key-based remount 是 React 官方建議的慣用手法，之後若有類似「依 id 重置本地狀態」的需求應優先採用此模式，而非用 effect。
  - Sense 中文意思重複提醒採兩階段送出：第一次送出若偵測到與同張卡其他 sense 文字完全相同（trim 後比對），不會直接送出，而是顯示 PRD 指定文案「此中文意思已存在，是否仍要保存？」，按鈕文字變成「仍要保存」；使用者再次按下才真的送出。修改中文意思欄位會重置這個待確認狀態。語意相近的 AI 判斷版本留待 Phase 6。
  - 新增第一個 sense 時自動將其設為主要（`isPrimary: otherSenses.length === 0`）——PRD 未明訂此細節，但為避免「卡片有 sense 卻沒有主要 sense」的空狀態，此為必要的實作決策；之後新增的 sense 預設非主要，需手動「設為主要」切換。
  - 刪除 sense／刪除關聯採原生 `window.confirm(...)` 二次確認，而非另建自訂確認 UI元件——這類單純「是否要刪除」的阻斷式確認，原生對話框足夠清楚且不需額外狀態管理；與 sense 中文意思重複提醒（PRD 指定確切文案、且非阻斷式）刻意採不同模式。
  - 新增關聯時以 `findCardByNormalizedWord` 依使用者輸入的單字查找目標字卡，並檔下三種錯誤情況：查無此字、與自己建立關聯、與同一張卡已有相同類型的關聯重複建立。
- 驗證：`npm run build`（`tsc -b`）、`npm run lint`、`prettier --check .` 皆通過。過程中 `npm run lint` 抓到一個真實問題（`react-hooks/set-state-in-effect` 規則擋下 `CardDetailPage` 原本用 `useEffect` 同步備註欄位的寫法），已如上改為 key-based remount 修正，而非直接關閉規則。因環境無瀏覽器自動化工具，UI 實際渲染與互動（發音播放、sense/relation 的新增編輯刪除流程、重複提醒二階段確認）待使用者於瀏覽器/iPad 實機測試確認。
- 目前進度：Phase 3 程式碼與建置驗證完成，等待使用者實機測試回饋與確認後進入 Phase 4（AI Adapter 層與 Gemini 串接）。
- 下一步：Phase 4 — AI 呼叫抽象介面設計（`identifyMainWord`/`generateCardContent`/`generateSense`/`generateDistractors`/`chatDiscuss`）、Vercel Serverless/Edge Function 代理、Gemini adapter 實作、共用錯誤處理與輸入保留邏輯。此 Phase 需要使用者提供或設定 Google Gemini API Key（透過 Vercel 環境變數），屆時需請使用者協助完成 Vercel 專案連結（Phase 0 遺留待辦）與金鑰設定。

### 資料模型調整：詞性與音標改為 Card 層級屬性（單一詞性／單一發音，多個 sense／多個 relation）

- 修改摘要：使用者要求調整資料結構——每張單字卡（Card）應只有單一詞性與單一發音，可有多個 sense 與多個 relation；`partOfSpeech` 因此從 `Sense` 移到 `Card`。此為**推翻先前記錄的產品決策**（2026-07-03「Sense 與重複新增」一節曾記載「詞性只顯示於 sense 中」），為使用者本次明確要求的變更。
- 語意影響（已與使用者確認）：一張 Card 只能有一種詞性，代表同一單字文字若有不同詞性用法（例如 book 可作名詞「書」與動詞「預訂」），現在必須拆成兩張不同的 Card（`normalizedWord` 相同、`partOfSpeech` 不同），並以既有的 Relation 類型「詞性變化」（`partOfSpeechVariant`）互相關聯——使用者確認採此方案。同一詞性下的多個意思（例如 bank 的「銀行」「河岸」皆為名詞）則仍是同一張 Card 下的多個 sense，此情境不受影響。
- 影響範圍：
  - `Prototype/src/types/card.ts`：新增 `partOfSpeech: string` 欄位。
  - `Prototype/src/types/sense.ts`：移除 `partOfSpeech` 欄位。
  - `Prototype/src/lib/repositories/cardRepository.ts`：`CreateCardInput` 新增 `partOfSpeech?: string`（預設空字串，與 `phonetic`/`note` 一致）。
  - `Prototype/src/lib/repositories/senseRepository.ts`：`CreateSenseInput` 移除 `partOfSpeech`（必填）欄位。
  - `Prototype/src/components/SenseSection.tsx`：移除 sense 表單與顯示中的詞性欄位／文字。
  - `Prototype/src/pages/CardDetailPage.tsx`：header 新增詞性顯示（單字旁的小圓角標籤）；原本的 `NoteEditor` 擴充為 `CardInfoEditor`，一次管理詞性／音標／備註三個 Card 層級欄位的手動編輯與儲存（沿用 Phase 3 建立的 key-based remount 模式）。
  - `Prototype/src/lib/devSeed.ts`：重寫假資料。book、novel、light 各自拆成「詞性 A」「詞性 B」兩張 Card（book n./v.、novel adj./n.、light n./adj.），並各補上一筆 `partOfSpeechVariant` 關聯示範新規則；bank 維持單一 Card 兩個 sense（示範「同詞性多意思」情境不受影響）；假資料卡片數從 25 張增為 28 張。
  - `LexiCard_PRD.md`：同步更新第 3.3 節（單字詳情畫面資訊、sense 顯示內容/操作）、第 3.2 節（重複判斷改為同時比對 `normalizedWord` 與 `partOfSpeech`）、第 4 章 Data Model（Card/Sense 欄位表）、第 8 章驗收標準相關敘述。
- 已知待辦（留給 Phase 5 處理，非本次變更範圍）：PRD 3.2 節「重複判斷」規則現已註明需同時比對 `normalizedWord` 與 `partOfSpeech`，但實際的重複判斷程式邏輯要到 Phase 5（新增單字）才會實作，屆時需依此新規則設計，而非只用 `normalizedWord`。目前 `findCardByNormalizedWord`（`cardRepository.ts`）維持只用單字文字查詢，供 Phase 3 關聯建立功能使用，尚未涉及 Phase 5 的重複判斷情境。
- 驗證：`npm run build`（`tsc -b` 型別檢查，會抓出所有殘留的 `sense.partOfSpeech` 參照）、`npm run lint`、`prettier --check .` 皆通過。因環境無瀏覽器自動化工具，實際畫面（單字詳情頁詞性/音標編輯、假資料中 book/novel/light 拆分後的關聯顯示）待使用者實機確認；提醒使用者測試前需重新執行「灌入測試資料」清空舊資料，因舊的 IndexedDB 資料仍是舊欄位結構。
- 目前進度：資料模型調整與相關文件、假資料、UI 皆已同步完成，等待使用者確認。
- 下一步：使用者確認無誤後，依原計畫進入 Phase 4（AI Adapter 層與 Gemini 串接）；Phase 5 設計新增單字的重複判斷邏輯時，需記得比對範圍已擴大為 `normalizedWord` + `partOfSpeech`。

### 資料模型調整（續）：備註改為 Sense 層級、詞性/音標改為唯讀、sense 例句等欄位建立時必填、單字庫列表補齊發音與詞性

- 修改摘要：緊接上一則資料模型調整，使用者再提出三項要求：(1) 單字庫列表的字卡也要顯示發音與詞性；(2) 建立 sense 時，例句、例句中文翻譯、使用情境應與中文意思一樣是建立當下就要填的必填欄位，不是事後才補；(3) 單字詳情頁的 Card 層級詞性、音標應改為不可編輯（唯讀），備註則應該搬到各個 sense 底下（而非 Card 層級的單一備註）。
- 影響範圍：
  - `Prototype/src/types/card.ts`：移除 `note` 欄位。
  - `Prototype/src/types/sense.ts`：新增 `note: string` 欄位。
  - `Prototype/src/lib/repositories/cardRepository.ts`：`CreateCardInput` 移除 `note`；`createCard` 不再寫入 `note`。
  - `Prototype/src/lib/repositories/senseRepository.ts`：`CreateSenseInput` 的 `usageContext`／`exampleSentence`／`exampleSentenceTranslation` 從選填改為必填，新增選填的 `note`。
  - `Prototype/src/components/SenseSection.tsx`：sense 表單三個內容欄位改為 `required`，移除「（選填）」字樣；新增備註欄位（選填）；sense 顯示區塊新增備註顯示（有內容才顯示）。
  - `Prototype/src/pages/CardDetailPage.tsx`：移除上一輪新增的 `CardInfoEditor`（詞性/音標/備註可編輯區塊），詞性與音標改回僅在 header 顯示、不可編輯；備註欄位整個移除（改到 sense 層級）。
  - `Prototype/src/pages/CardLibraryPage.tsx`：列表項目新增詞性文字（單字旁）與發音播放按鈕（沿用 `handleToggleStar` 的 `preventDefault`/`stopPropagation` 模式避免誤觸卡片導覽）。
  - `Prototype/src/lib/devSeed.ts`：8 張主要字卡的 sense 補上 `usageContext`；20 張 bulk 字卡的 `bulkWords` 陣列擴充為含 `usageContext`/`exampleSentence`/`exampleSentenceTranslation`，`createSense` 呼叫同步補齊，型別編譯即可抓出遺漏欄位。
  - `LexiCard_PRD.md`：同步更新 3.1 節（字卡列表顯示新增詞性/發音播放）、3.3 節（詞性/音標改唯讀；sense 顯示內容新增備註；sense 建立必填規則；sense 操作新增「編輯備註」）、3.3 節 AI 討論（備註改指向「sense 的備註」）、第 4 章 Data Model（Card 移除 `note`，Sense 新增 `note`，並註明四個內容欄位建立時必填）、第 8 章驗收標準對應敘述。
- 驗證：`npm run build`（`tsc -b`，型別變更會強制所有 `createSense` 呼叫端點補齊必填欄位，本次確實在編譯階段抓出 devSeed.ts 的遺漏欄位）、`npm run lint`、`prettier --check .` 皆通過。因環境無瀏覽器自動化工具，實際畫面待使用者實機確認；同樣提醒需重新「灌入測試資料」清空舊結構的 IndexedDB 資料。
- 目前進度：本輪三項調整皆已完成並同步至程式碼、假資料、PRD／Log／session_handoff，等待使用者確認。
- 下一步：使用者確認後依原計畫進入 Phase 4；Phase 5／6 涉及 AI 討論寫入備註的功能，需記得備註目標是「指定的 sense」而非 Card。

### 假資料重新設計：以 book 為範本，讓每張字卡的單字詳情都有完整資料

- 修改摘要：使用者指出先前的假資料不夠完整——20 張「bulk」填充字卡雖有基本 sense 內容，但完全沒有 relation，單字詳情頁的關聯區塊會是空的，跟 book/novel/light 那組示範資料不對等。要求「參考 book」重新設計，讓每個單字的詳情頁都有完整資料。
- 內容：捨棄原本「8 張精心設計 + 20 張填充」的做法，改為 16 張全部等級精心設計的字卡，全部改用資料陣列（`SEED_CARDS`/`SEED_RELATIONS`）+ 迴圈建立，而非逐張手動呼叫 `createCard`/`createSense`/`createRelation`，方便未來調整。16 張字卡分別是：book(n./v.)、look(v.)、novel(adj./n.)、light(n./adj.)、bright(adj.)、heavy(adj.)、bank(n.，2 個 sense)、money(n.)、run(v.)、walk(v.)、marathon(n.)、fresh(adj.)、original(adj.)，彼此以 12 筆 relation（涵蓋延伸單字／易混淆單字／相似意思／詞性變化四種類型，manual／ai 來源皆有）交織成一個關聯網路。
- 完整性保證：每張字卡都同時具備「完整基本資訊（word/partOfSpeech/phonetic）」「至少一個內容完整的 sense（中文意思/使用情境/例句/例句翻譯皆非空、備註大多有填寫）」「至少一筆 relation」三項，不再有像先前 bulk 資料那樣關聯區塊空白的字卡。
- 驗證：以暫裝的 `fake-indexeddb` + `vite-node` 撰寫一次性 smoke test，對灌入後的全部 16 張卡逐一檢查「至少 1 個 sense」「sense 四個必填欄位皆非空」「有主要 sense」「至少 1 筆 relation」「phonetic／partOfSpeech 非空」，共 90+ 項斷言全數通過，驗證後移除暫裝套件。另外 `npm run build`／`lint`／`prettier --check .` 皆通過。
- 目前進度：假資料重新設計完成，等待使用者實機確認單字詳情頁每張卡是否都顯示完整內容。
- 下一步：使用者確認無誤後依原計畫進入 Phase 4。

### 大量畫面細節微調：單字庫列表、單字詳情 header、Sense 卡片與表單

- 修改摘要：使用者針對截圖逐項提出大量細部排版／間距／字級／顏色調整（單字庫列表、單字詳情 header、Sense 卡片顯示與編輯表單、Relation 區塊），本節彙整最終結果與過程中確立的慣例，不逐條列出每一次 px 調整。
- **`CardLibraryPage.tsx` 列表項目**最終排版（由左至右、由上至下）：星號（可點擊切換）→ 單字＋音標＋詞性徽章（同一行，`gap-2`）→ 熟悉度（第二行，與單字對齊）；發音播放按鈕固定在卡片最右側。星號／發音圖示皆統一 20×20（`h-5 w-5`）；詞性徽章改用圓角底色小標籤（`rounded-full bg-paper-deep`），與單字詳情頁 header 的詞性標籤樣式一致。
- **`CardDetailPage.tsx` header** 最終排版：星號（左，`h-11 w-11`，`active:bg-paper-deep`，無常駐底色）＋單字＋詞性徽章＋音標，一起在 `items-start gap-1.5` 的區塊內；發音播放按鈕獨立在右側（`h-11 w-11`，僅 hover 底色，不加常駐背景色）；熟悉度（含 `showLabel`，顯示「陌生/一般/熟悉」文字）移入單字/音標所在的區塊最下方，與單字自然左對齊，不再需要手動 padding 補償。外層卡片區塊最終為 `py-5 pr-5 pl-3 shadow-sm`。星號／發音圖示統一 24×24（`h-6 w-6`）。
  - `FamiliarityIcon` 新增 `showLabel?: boolean` prop（預設 `false`，不影響單字庫列表），只有詳情頁傳入 `showLabel` 開啟文字顯示。
- **`SenseSection.tsx`** 大幅重做：
  - 詞義卡片內編輯／刪除操作從文字按鈕改為卡片右上角純圖示按鈕（編輯重用 `QuillIcon`、刪除用 `TrashIcon`，皆 20×20，`h-11 w-11` 觸控區）；「設為主要」文字按鈕整個移除，改到編輯表單內以核取方塊「設為原始意思」（`wantsPrimary` state）呈現，儲存時呼叫 `setPrimarySense` 確保同卡其餘 sense 互斥取消。
  - 原主要標籤（先後改名「主要」→「【原】」→「原」→「始」，最終文案為單字「始」）目前顯示位置在使用情境那一行左側（而非緊貼詞義），字級 `text-sm`（14px），已移除圖示，僅文字。
  - 詞義文字改 `text-xl`，該行改 `items-center`（與右側編輯/刪除圖示垂直置中）；例句改 `text-base font-semibold`；例句翻譯改 `text-base`。
  - 備註顯示改為低調樣式：移除底色框，改上方虛線分隔（`border-t border-dashed border-rule`）+ `#備註內容` 前綴 + 較淡文字色（`text-ink-soft/70`）。
  - 新增詞義／新增關聯按鈕（`RelationSection.tsx` 同步）皆改為純圓形圖示按鈕（`PlusIcon`），拿掉文字。
  - 編輯表單（`SenseForm`）每個欄位左側加上固定寬度 label（`詞義`/`使用情境`/`例句`/`例句翻譯`/`備註`，`w-20 shrink-0`），並移除原本文字放在欄位內的 placeholder 說明；必填四欄位 placeholder 改顯示「必填」，備註 placeholder 顯示「選填」（label 本身拿掉「（選填）」字樣）。四個必填欄位任一為空時，「儲存」按鈕 `disabled`（`handleSubmit` 內也做防呆二次檢查，防止 Enter 鍵略過 disabled 狀態送出）。
  - 為避免「新增」與「編輯」表單同時掛載時 `label`/`input` 的 `id` 重複（`htmlFor` 對應錯誤元件），所有欄位 id 皆加上 `-${formInstanceId}` 後綴（`formInstanceId = initialSense?.id ?? 'new'`）。
  - 輸入框圓角縮小（`rounded-2xl` → `rounded-lg`），寬度由「有 `w-full` 但缺 `flex-1` 導致實際未撐滿」修正為 `min-w-0 flex-1`；底色最終定為 `bg-stone-100`（Tailwind 內建暖色調灰階，比純灰 `gray-100` 更貼合整體暖色系）——與頁面 `bg-paper`／卡片 `bg-surface` 明確區隔。
  - Sense 列表顯示前先排序（`sortedSenses`），原始意思（`isPrimary`）一律排在最上面。
  - 「詞義」與「關聯單字」兩個區塊標題右側都加上目前數量「(N)」（`senses.length`／`relationsWithCards.length`）。
- **`RelationSection.tsx`**：新增關聯按鈕、輸入框底色同步比照上述調整。
- **本輪過程中的重要提醒**：多次發現先前一則 Edit 的結果在後續某個時間點消失、檔案內容回退到更早版本（`SenseSection.tsx`、`CardDetailPage.tsx` 皆發生過），懷疑與編輯器/其他程序的存檔行為有關；具體原因未查証，但已建立因應習慣——**重要結構性改動的 Edit 之後，一律用 Read 工具重新讀取該段落確認磁碟內容，再進行 build/lint/format**，本輪後續每一次調整都採此流程並在回報中註明「已確認落地」。之後接手的 session 也建議延續此習慣，尤其是連續多次針對同一檔案的小幅調整時。
- 驗證：每一輪調整皆執行 `npm run build`／`npm run lint`／`prettier --check .` 並全數通過；因環境無瀏覽器自動化工具，畫面確認皆由使用者截圖逐項回饋後迭代完成。
- 目前進度：以上細節調整皆已完成並確認落地，Phase 3 功能邏輯未變。
- 下一步：等待使用者確認整體單字詳情頁／單字庫列表畫面無誤後，進入 Phase 4（AI Adapter 層與 Gemini 串接）。

### 關聯單字：移除「延伸單字」類型、PRD 補充其餘三類定義；Relation 依 sense 配對規劃中（設計討論已定案，實作尚未開始）

- 修改摘要：使用者先前指出，關聯單字目前顯示只查詢對方卡片的「原始意思」不正確——關聯應是「單字/sense 為單位」配對（例如 book(n)書籍對 novel(n)小說），因此需要讓 `Relation` 直接記錄具體的來源/目標 sense，而非只連結兩張 Card。使用者接著要求先暫停該實作，優先把「關聯單字之類型」定義清楚，因此本節先完成類型定義調整，sense 配對的 schema 改動仍待後續進行。
- 關聯類型調整：
  - 移除 `extension`（延伸單字）：使用者確認此類型不需要。修改 `Prototype/src/types/relation.ts`（`RelationType` 移除 `'extension'`、`RELATION_TYPE_LABEL` 移除對應項）、`Prototype/src/components/RelationSection.tsx`（下拉選單選項與新增表單預設值改為 `'confusable'`）、`Prototype/src/lib/devSeed.ts`（原本使用 `extension` 的假資料關聯移除或改用其他類型的情境設計）。
  - `LexiCard_PRD.md` 同步更新：總覽段落、3.2 節「AI 討論延伸」列點、3.3 節「關聯類型」清單、第 4 章 Relation 資料表、AI 功能清單，皆移除「延伸單字」相關文字。
  - PRD 3.3 節「關聯類型」補上其餘三類的明確定義與範例（先前只有名稱、無判斷標準）：**易混淆單字**（拼字或發音相近，例：affect/effect、desert/dessert）、**相似意思**（中文意思相近或相同的同義詞，例：happy/glad）、**詞性變化**（同一單字文字、不同詞性拆分出的 Card 之間的連結，例：book(n)/book(v)）。
  - 順帶修正一處先前回報「已完成」但實際未落地的變更：關聯卡片單字字級（18→20px）先前疑似受本 session 已知的 Edit 回退問題影響、實際仍是 `text-lg`，本次已重新套用為 `text-xl` 並用 Read 工具確認落地。
- Relation 依 sense 配對：已用 `AskUserQuestion` 與使用者確認方向為「Relation 改記錄具體 `sourceSenseId`/`targetSenseId`」（而非只顯示對方全部 sense），並列出 9 步實作計畫（型別調整→Dexie schema v2→repository＋級聯刪除→`useCardDetail.ts` 依實際 sense 配對解析語意→`RelationSection.tsx` 新增來源/目標 sense 選擇器→`CardDetailPage.tsx` 傳遞 senses→`devSeed.ts` 更新 relation 的 sense 配對→建置驗證→PRD/Log/session_handoff 更新）。**使用者要求先暫停，此計畫尚未開始任何程式碼變更**，待使用者結束類型定義討論後再行接續。
- 假資料重新設計（第二輪，取代前一則「假資料重新設計」條目中 2026-07-06 的 16 張版本）：
  - 使用者要求假資料需涵蓋「詞義數（1 個／多個）× 關聯單字數（0／1／多個，且多個時類型需不同）」的所有組合，且至少 20 個單字。
  - 重新設計為 26 張卡（book(n./v.)、look、novel(adj./n.)、fresh、original、bank、bench、money、run(v./n.)、walk、marathon、light(n./adj.)、bright、heavy、quiet、quite、happy、glad、letter、ladder、mail、spring 等）、15 筆 relation，逐一標註每張卡屬於哪種「詞義數×關聯數」組合（`devSeed.ts` 內以行註解標示），三種 relation type（易混淆單字／相似意思／詞性變化）皆有出現，且多張卡片示範同一張卡掛多筆不同類型關聯。
  - 使用者接著要求再補一組「3 個詞義、3 個關聯」的示範：新增 `watch(v.)`（3 個 sense：觀看／注意當心／照看看顧）+ `watch(n.)`／`wash(v.)`／`see(v.)` 三張關聯卡（依序示範詞性變化／易混淆單字／相似意思），資料集最終為 **30 張卡、18 筆 relation**。
  - 驗證：`npm run build`／`lint`／`prettier --check .` 皆通過；另寫一次性 node script 交叉比對全部 relation 的 `source`/`target` key 均對應到實際存在的卡片 `key`（避免打字錯誤造成執行期 `cardIdByKey.get(...)` 回傳 `undefined`、被既有的非空斷言 `!` 隱藏成潛在 bug）。
- 目前進度：關聯類型定義（移除延伸單字、其餘三類補上定義）與假資料重新設計皆已完成並驗證落地；Relation 依 sense 配對的 schema 變更仍暫停中。
- 下一步：等待使用者指示是否／何時繼續 Relation `sourceSenseId`/`targetSenseId` 的 9 步實作計畫；開始實作時記得同步更新 `useCardDetail.ts`、`RelationSection.tsx`、`devSeed.ts` 的關聯顯示與新增流程，並在完成後回頭更新 PRD 對應段落。

### Relation 依 sense 配對正式實作完成；關聯單字/詞義卡片大幅重做；共用 UI 元件抽出；詞義/關聯列表改為橫向捲動卡片列

- 修改摘要：上一則暫停的「Relation 改記錄具體 sense」計畫已正式實作完成，並接續大量針對關聯單字卡片、詞義卡片顯示與互動的細部調整，過程中新增數個共用元件與 hook，最後把詞義／關聯單字列表從垂直堆疊改為手機常見的橫向捲動卡片列。內容龐雜，以下依主題整理，不逐條列出每次 px 調整。

**1. Relation 依 sense 配對（schema 變更）**：
- `Prototype/src/types/relation.ts`：`Relation` 新增 `sourceSenseId`／`targetSenseId`（皆為必填字串），確立「一筆關聯連結的是兩張卡各自的『特定』sense，而非整張卡」。
- `Prototype/src/lib/repositories/relationRepository.ts`：`CreateRelationInput` 同步新增兩個必填欄位；新增 `getRelationsBySenseId(senseId)`（供刪除詞義時查詢受影響關聯）。
- `Prototype/src/lib/repositories/senseRepository.ts`：`deleteSense` 改為 transaction，級聯刪除所有引用該 sense 的 relation（避免刪詞義後留下指向不存在 sense 的孤兒關聯）。
- `Prototype/src/hooks/useCardDetail.ts`：`RelationWithCard` 的 `otherSenses: Sense[]`（對方全部 sense）改為 `otherSense: Sense | undefined`（依 `sourceSenseId`/`targetSenseId` 精準解析對方「那一個」sense），解決先前使用者指出的「不該查詢對方原始意思，而是要配對到具體 sense」問題。
- `Prototype/src/lib/devSeed.ts`：`seedDevData()` 改為記錄每張卡「依建立順序的 sense id 陣列」（`senseIdsByKey`），`SeedRelation` 新增可選的 `sourceSenseIndex`／`targetSenseIndex`（預設 0＝主要 sense），讓假資料的每筆關聯都能指向正確的具體 sense（例如 `set(n.)` 的「（數學）集合」sense 才連到 `set(v.)` 的詞性變化關聯，而非隨便一個 sense）。

**2. 關聯單字卡片／詞義卡片顯示重做**：
- 單字字級：關聯卡片 24px（`text-2xl`）；對齊方式由 `items-baseline` 改 `items-center`（詞性標籤有上下 padding，用文字基線對齊視覺上會偏低，改置中對齊）。
- 對方 sense 的中文意思：16px semibold、顏色 `ink`（不再是 `ink-soft`），且改為只顯示「配對到的那一個 sense」（拜上述 schema 變更之賜），不再是全部 sense 或誤用的主要 sense。
- 關聯類型／AI 來源：原本分開的「類型 tag」+「．AI 建議／手動建立」文字，合併成單一 tag（例如「相似意思 ‧ AI」），手動建立則不加後綴；且移到「說明」文字下方（原本在說明上方）。
- 排序：關聯單字列表與新增表單的類型下拉選單，統一依「詞性變化 → 相似意思 → 易混淆單字」排序（`RELATION_TYPE_SORT_ORDER`）。
- 編輯模式資訊補齊：詞義卡片與關聯卡片進入編輯模式時，除了可編輯欄位，也會顯示唯讀的基本資訊（單字/詞性/中文意思、關聯類型 tag），不再只剩下光禿禿的表單欄位；為此抽出共用的 `RelationWordRow`／`RelationTypeTag` 子元件供顯示模式與編輯模式共用。
- 詞義卡片：「始」（原始意思）標籤從使用情境那排移到中文意思右側同排；例句（英文）改 `mt-4`、例句翻譯（中文）新增 `mt-2`。

**3. 新增共用 UI 元件**：
- `LabeledInput.tsx`：文字輸入框元件，label 在輸入框**外側**上方（先試過框內上方，使用者確認外側上方才對），label 樣式統一為 11px／medium／`tracking-wide`／`text-ink-soft/80`，輸入框 `min-h-[44px]` 符合觸控規範。套用於詞義編輯表單全部欄位與關聯的「說明」欄位。
- `ConfirmDialog.tsx`：自設計的確認彈窗（半透明遮罩＋卡片內容＋取消/刪除按鈕），取代原生 `window.confirm`，可放自訂內容（例如受影響項目清單）。
- `CardActionsMenu.tsx`：詞義卡片與關聯卡片右上角統一改為單一「⋮」（直向三點，`MoreIcon`）選單按鈕，取代原本的編輯／刪除兩個獨立圖示按鈕；選單面板改用 **React Portal** 直接渲染到 `document.body`（見下方第 4 點的根因說明），並在按鈕位置加上 `-mt-2 -mr-2` 負邊距讓按鈕更貼近卡片右上角。
- 刪除詞義／刪除關聯／刪除整張單字，皆改用 `ConfirmDialog` 呈現：標題帶入識別內容（如「確定要刪除「{中文詞意}」嗎？」／「確定要刪除與「{單字}」的關聯嗎？」），說明文字統一為「刪除後無法恢復」；刪除詞義與刪除單字時，若有受影響的關聯／連結，彈窗內會列出受影響的單字（inline-block 排列、16px semibold、以「、」分隔），背景色統一為 `bg-paper`。
- `CardDetailPage.tsx` 底部新增「刪除單字」按鈕（accent 色框線、非滿版寬度置中、`mt-14` 與上方內容拉開距離），刪除後導回單字庫首頁。

**4. 詞義／關聯單字列表改為橫向捲動卡片列（手機常見的橫滑卡片 UX）**：
- 兩份列表皆改為 `flex overflow-x-auto` + 固定寬度卡片（`w-72`）+ `snap-x snap-mandatory`，取代原本的垂直堆疊；編輯中的卡片會從橫向列表中暫時移除，編輯表單改在下方獨立全寬顯示（多欄位表單不適合塞進窄卡片）。
- 過程中反覆調整才定案的重點（皆已用 Read/build 驗證落地）：
  - 列表寬度／內距：最終採 `-mx-5`（往外突破頁面內容容器的 padding，寬度對齊頁面內容容器含 padding 的完整寬度）+ 容器自身 `px-5`／`scroll-px-5`（20px，視覺內距與捲動吸附內距需同時設定，否則部分瀏覽器捲動吸附計算不會採用一般 `padding`）。
  - 邊緣淡出：最終採用固定 12px 的 `mask-image: linear-gradient(...)`（含 `-webkit-` 前綴），純視覺淡出提示可捲動，不做動態捲動位置偵測（曾嘗試用 `useScrollEdges` 依捲動位置動態調整淡出方向，使用者最終選擇拿掉、只留固定淡出，該 hook 檔案已刪除）。
  - 卡片等高：容器加 `items-stretch`；關聯卡片因為 `<li>` 內還包一層才是實際卡片外觀，額外幫內層加 `h-full` 才能讓卡片背景/陰影確實填滿統一高度。
  - **`useSnapAlign`** hook：捲動停止後（debounce 120ms）主動用 JS 校正，確保最左側卡片的起始邊緣對齊左側 padding；過程中修正一個真實 bug——比較「哪張卡片最近」時沒有把候選位置夾在可捲動範圍內，導致捲到最後一張卡片時，因為其理想對齊位置超出實際可捲動的最大值，被誤判為離倒數第二張卡片更近，畫面被拉回去、蓋住最後一張卡片；桌面滑鼠捲動容易停在精確的最大值上，比手機觸控慣性捲動更容易踩到這個邊界，修法是比較距離前先把每個候選位置都夾在 `[0, 最大可捲動值]` 內。
  - **`useHorizontalWheelScroll`** hook：讓桌機滑鼠滾輪（只有垂直 `deltaY`）也能捲動只有水平方向可捲動的容器（原生瀏覽器不會自動轉換）。
  - **`useDragToScroll`** hook：滑鼠按住拖曳可水平捲動（`cursor-grab`／`cursor-grabbing`）；抓「是否真的拖曳」（超過 3px 位移）避免誤判成一般點擊；拖曳期間暫時關閉該容器的 `scroll-snap-type`（CSS scroll-snap 在拖曳中會不斷把位置拉回最近卡片，跟滑鼠位置打架，造成移動像逐格跳動而非流暢跟手），放開滑鼠才恢復；另外攔截 `dragstart` 事件（因為關聯卡片是 `<Link>`／`<a>`，瀏覽器對連結有原生「拖曳連結」行為會搶走手勢，必須 `preventDefault()`）。
  - **重要 bug 與修法**：`useSnapAlign`／`useHorizontalWheelScroll`／`useDragToScroll` 一開始的 `useEffect` 依賴陣列只有 `[containerRef]`（ref 物件本身永遠不會變），但關聯單字列表的 `<ul>` 是條件渲染（`relationsWithCards.length > 0` 才出現，資料透過 `useLiveQuery` 非同步載入）。若元件第一次掛載時資料還沒讀完，`containerRef.current` 是 `null`，effect 只在掛載時跑一次、之後不會重跑，導致監聽器永遠沒掛上——詞義列表資料剛好載入得夠快沒踩到，關聯單字列表則完全失效（滑鼠拖曳/滾輪/捲動吸附皆無反應）。修法：三個 hook 都新增可選的 `deps` 參數，元件呼叫時傳入列表長度（`[senses.length]`／`[relationsWithCards.length]`），資料載入完成、長度從 0 變有值時 effect 會重新執行並正確抓到已存在的 DOM 元素。
  - **另一個真實 CSS bug 與修法**：`CardActionsMenu` 的下拉選單原本用一般 `absolute` 定位，會被外層 `overflow-x: auto` 的捲動容器裁掉下緣——根據 CSS 規範，只要 `overflow-x` 不是 `visible`，`overflow-y` 也會被迫變成非 `visible`，兩個方向的裁切是綁在一起的，無法讓「這個方向可捲動、另一個方向完全不裁切」同時成立。修法是把選單面板改用 React Portal 渲染到 `document.body`、用 `position: fixed` + 按鈕的 `getBoundingClientRect()` 計算座標，讓選單完全脫離捲動容器的 DOM 樹與裁切範圍；並加上「捲動時自動關閉選單」的保險，避免固定定位的選單跟按鈕位置對不上。

**5. 假資料集擴充**：
- 延續先前 30 張卡的版本，新增一組「5 個詞義、5 個關聯」的示範單字 `set(n.)`（一套/一組、（電視）裝置、（網球）盤、佈景/場景、（數學）集合），並新增對應的 5 張關聯卡片（`group.n`／`device.n`／`scene.n`／`sit.v`／`set.v`），驗證詞義列表與關聯單字列表在卡片數量較多時的橫向捲動效果。
- 資料集最終為 **36 張卡片、23 筆 relation**。
- 驗證：一次性 node script 交叉比對全部卡片 `key` 唯一、所有 relation 的 `source`/`target` 皆對應到實際存在的卡片，避免打字錯誤造成執行期 `undefined`。
- 目前進度：以上四大項（Relation sense 配對、關聯/詞義卡片顯示重做、共用元件抽出、橫向捲動列表）皆已完成並經過 `npm run build`／`lint`／`prettier --check .` 驗證通過；因環境無瀏覽器自動化工具，實際手感（拖曳流暢度、捲動吸附、選單彈出位置）皆由使用者於桌機/手機實測後迭代確認。
- 下一步：等待使用者確認整體單字詳情頁（詞義/關聯單字橫向列表、刪除流程、三點選單）無誤後，依原計畫進入 Phase 4（AI Adapter 層與 Gemini 串接）。

### 大量 UI 細節微調（續）：返回按鈕圖示化、圓形按鈕 hover 統一、例句排版、關聯類型 tag 對齊修正

- 修改摘要：延續上一則的橫向捲動卡片列調整，本節彙整後續一輪細部視覺修正，主題橫跨單字詳情頁返回連結、全站圓形 icon 按鈕的 hover 樣式、詞義卡片例句排版，以及關聯單字類型 tag 與詞義卡片「始」tag 之間的高度不一致問題排查。
1. **返回連結**（單字詳情頁「← 單字庫」）：`icons.tsx` 新增 `ChevronLeftIcon`（沿用既有 `base` stroke 樣式），取代原本的文字「←」，尺寸 20×20px（`h-5 w-5`），文字維持 14px（`text-sm`）。hover 樣式歷經三次調整：`hover:text-accent`（使用者不喜歡，理由是 `accent` 通常保留給主要動作/選中狀態，用在常態導覽連結太搶眼）→ `hover:bg-accent/50`（底色淡出，使用者仍不滿意，明確要求「只變文字+icon顏色，不需要底色變化」）→ 最終定案為 `hover:text-accent`（移除底色、只保留文字/icon 變色，icon 用 `currentColor` 會跟著文字顏色一起變化）。
2. **全站圓形 icon 按鈕 hover 統一**：`CardActionsMenu.tsx`（詞義/關聯卡片共用的「⋮」選單按鈕）、`CardLibraryPage.tsx`（單字庫列表卡片的發音按鈕）、`CardDetailPage.tsx`（單字詳情頁發音按鈕）三處的 hover 底色統一從 `hover:bg-paper-deep` 改為 `hover:bg-stone-100`；發音按鈕（單字庫列表卡片＋單字詳情頁）另外加上 `hover:text-accent`，讓 hover 時 icon 顏色一併變成 accent。
3. **刪除單字按鈕**：`TrashIcon` 尺寸從 16px（`h-4 w-4`）放大為 20px（`h-5 w-5`）。
4. **詞義卡片例句排版**：例句（英文）字級 16px→18px（`text-lg`）；例句中文翻譯顏色從 `text-ink-soft` 改為 `text-ink`；例句行高原欲手動指定 1.2，因專案沒有對應自訂 line-height token，改用 Tailwind 內建最接近值 `leading-tight`（1.25）取代任意值 `leading-[1.2]`；間距微調：例句 `mt-4`→`mt-2`，例句翻譯 `mt-2`→`mt-1`。
5. **關聯單字「說明」欄位標籤改為「備註」**（`RelationEditForm` 與 `AddRelationForm` 兩處的 `LabeledInput` label）。
6. **關聯類型 tag 字級與行高排查**（技術細節，供後續參考）：字級從 12px（`text-xs`）改為 14px（`text-sm`），與詞義卡片「始」tag 一致。使用者截圖回報兩個 tag 視覺高度不一致（DevTools 顯示 72×20 vs 30×24），排查過程：
   - 先確認兩者 class 完全相同（`px-2 py-0.5 text-sm font-semibold`，無額外 `leading` override），理論上不該有差異；再用 Computed 面板確認兩者 `line-height` 皆為 20px，證實不是 line-height 差異。
   - 真正根因是 **CSS flex item 的 blockify 規則**：「始」tag 的父層是 flex 容器（`flex items-center gap-2`），span 雖然自身規格是 `inline`，但作為 flex 容器的直接子項會被瀏覽器強制 blockify 成區塊層級，因此 DevTools 能算出單一矩形的內容框；關聯類型 tag 的父層原本只是普通 block div（無 flex），span 維持真正的 `inline`，導致 DevTools 顯示 `auto×auto`（無法用單一矩形描述其框），也是視覺高度不一致的根源。曾先嘗試加 `whitespace-nowrap`（懷疑是文字換行造成 `auto`），實測無效，證實換行不是根因。
   - 最終修法：把關聯類型 tag 外層的 `<div className="mt-1.5">` 改為 `<div className="mt-1.5 flex items-center">`，讓它跟「始」tag 一樣被 blockify，結構上對齊；`whitespace-nowrap` 予以保留。待使用者實機確認高度是否已一致。
   - **技術慣例補充**：往後若遇到「兩個看似 class 完全相同的行內元素（inline/span）渲染尺寸卻不一致」的情況，優先檢查兩者是否分別位於 flex 容器內（會被 blockify）與普通 block 容器內（維持 inline），而不是優先懷疑 line-height 或 padding 設定錯誤。
- 驗證：每一項調整皆執行 `npm run build`／`npm run lint`／`npx prettier --check .` 並全數通過，且每次結構性 Edit 後都先用 Read 重新確認磁碟內容再進行驗證。因環境無瀏覽器自動化工具，實際視覺效果（尤其關聯類型 tag 高度是否已對齊、返回連結 hover 觀感）待使用者於瀏覽器/實機確認。
- 目前進度：以上六項調整皆已完成並通過建置驗證，Phase 3 功能邏輯未變。
- 下一步：等待使用者確認關聯類型 tag 與「始」tag 高度是否已一致、返回連結 hover 觀感是否滿意；確認後依原計畫進入 Phase 4（AI Adapter 層與 Gemini 串接）。

### PRD 補漏：Relation 資料表補上 sourceSenseId／targetSenseId

- 修改摘要：使用者詢問本輪修改是否有 PRD 內容需要同步更新，檢查後發現第 4 章「Relation」資料表遺漏了先前已正式實作完成的 `sourceSenseId`／`targetSenseId` 欄位（實作於「Relation 依 sense 配對正式實作完成」條目，當時記錄有註記待實作完成後回頭補 PRD，但一直未補上）。
- 內容：
  - `LexiCard_PRD.md` 第 4 章 Relation 資料表新增 `sourceSenseId`／`targetSenseId` 兩列。
  - 3.3 節「關聯」新增「關聯配對」小節，說明一筆關聯連結的是雙方字卡各自「特定」的 sense，而非整張字卡。
  - 順帶把 `description` 欄位定義文字從「關聯說明」改為「關聯備註」，對應本輪 UI 上該欄位 label 已改名為「備註」。
- 目前進度：PRD 與實作已同步，無其他遺漏項目。
- 下一步：無新增待辦，維持等待使用者確認後進入 Phase 4。

### 單字詳情頁 header 加入建立時間；卡片內部結構改為左右兩欄

- 修改摘要：延續 UI 細節微調，本節處理兩項調整：(1) 關聯類型 tag 上方間距由 `mt-1.5` 改為 `mt-2`；(2) 單字詳情頁 header 加入「建立時間」顯示，並依使用者提供的手繪線稿重新調整 header 內部排版結構。
- **建立時間**：`CardDetailPage.tsx` 新增以 `card.createdAt`（`new Date(...).toLocaleDateString('zh-TW')`）格式化顯示「建立於 YYYY/M/D」，與熟悉度同排、靠右對齊。
- **Header 結構調整**（使用者提供手繪標註線稿，執行前先用 `AskUserQuestion` 確認兩個關鍵疑問：線稿藍框是否要畫出實際可見邊框——確認**不用**，僅為結構分欄；音標與熟悉度/建立時間之間的分隔線是否要真的加線——確認**不用**，僅為標示分組）：
  - 最終結構改為：外層 `flex` 分兩欄——左欄是星號按鈕（獨立、`items-start` 頂部對齊），右欄（`flex-1`）由上而下為「單字＋詞性＋發音按鈕」一排、音標、「熟悉度＋建立時間」一排。移除先前暫時使用的 `ml-[50px]` 手動補償寫法，改用右欄 `flex-1` 讓「單字/發音」排與「熟悉度/建立時間」排的右邊界自然對齊（皆貼齊卡片右側 padding，與發音按鈕齊右）。
  - 詞性標籤定案為與單字同一排（而非獨立成行），對齊方式從 `items-center` 試過 `items-end`（使用者回報視覺上詞性偏低）最終改為 `items-baseline`（依文字基線對齊，視覺更平衡），並加上 `mb-1` 微調垂直位置。
- 驗證：每一項調整皆執行 `npm run build`／`npm run lint`／`npx prettier --check .` 並全數通過，且每次結構性 Edit 後皆先用 Read 重新確認磁碟內容再驗證。因環境無瀏覽器自動化工具，最終視覺效果待使用者於瀏覽器/實機截圖確認。
- 目前進度：header 結構重排與建立時間顯示皆已完成並通過建置驗證，Phase 3 功能邏輯未變。
- 下一步：等待使用者確認 header 最終視覺效果（星號位置、詞性對齊、建立時間排版）無誤後，依原計畫進入 Phase 4（AI Adapter 層與 Gemini 串接）。

## 2026-07-08

### Dev access: allow Cloudflare Tunnel host in Vite

- Summary: Added Vite dev-server `server.allowedHosts` support for `.trycloudflare.com` so the temporary Cloudflare Tunnel URL can open the local Prototype on iPhone/iPad.
- Affected scope: `Prototype/vite.config.ts` dev-only network access.
- Verification: Ran `npm.cmd run build` in `Prototype`; build passed.
- Next steps: Restart the Vite dev server, keep `cloudflared tunnel --url http://127.0.0.1:5173` running, then open the generated `https://*.trycloudflare.com` URL on mobile.
