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
