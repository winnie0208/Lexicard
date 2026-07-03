# LexiCard MVP 開發任務拆解

本文件依 `LexiCard_PRD.md` 拆解 MVP 開發順序，每個 Phase 標註目的與任務項目，供逐一開發、測試與調整使用。開發順序原則：先完成資料層與非 AI 的手動 CRUD 畫面，再建立 AI adapter，最後疊上依賴 AI 的功能。

## Phase 0　專案初始化

**目的**：建立專案骨架與基礎建置環境，讓後續功能開發有可運作的基礎。

任務項目：
1. Vite + React + TS scaffold，設定 ESLint/Prettier、資料夾結構
2. Tailwind CSS 設定
3. `vite-plugin-pwa` 設定（manifest、圖示、基本 service worker）
4. `react-router` 建立三個導覽路由（單字庫 / 新增單字 / 快速學習）空頁面 + 導覽列
5. Vercel 專案連結、GitHub repo 建立

## Phase 1　資料層

**目的**：定義資料模型並建立本地資料庫存取邏輯，作為所有功能的資料基礎。

任務項目：
1. TypeScript 型別定義：`Card`、`Sense`、`Relation`、`WordCandidate`
2. Dexie schema 建立（`db.ts`），indexed by `normalizedWord`
3. Card/Sense/Relation 的 repository 層（CRUD 函式）
4. `normalizedWord` 工具函式（trim + lowercase）
5. 熟悉度計算工具（分數 clamp 0–100、分級判斷：陌生/一般/熟悉）
6. 開發用假資料 seed script

## Phase 2　單字卡庫（不含 AI、不含匯出）

**目的**：建立首頁字卡庫的檢視、搜尋、篩選與排序功能，驗證資料層與列表 UI 的串接。

任務項目：
1. 列表頁：總單字數、字卡列表（單字、熟悉度圖示、星號）
2. 搜尋（word / normalizedWord / sense 中文意思）
3. 篩選（全部 / 星號）＋排序（最近新增 / 熟悉度由低到高 / 熟悉度由高到低 / A-Z）
4. 空狀態三種（無字卡 / 搜尋無結果 / 星號篩選無結果）
5. 更多選單殼子（CSV 匯出項目先放，功能留到 Phase 8）

## Phase 3　單字詳情（純手動 CRUD，不含 AI）

**目的**：完成字卡內容的完整檢視與手動編輯能力，確保資料模型可被人工完整操作。

任務項目：
1. 基本資訊顯示：單字、音標、熟悉度圖示、星號、備註（可編輯）
2. 發音播放（Web Speech API，美式口音）
3. Sense 列表顯示 + 手動新增 / 編輯 / 刪除 / 設為主要 sense
4. Sense 中文意思重複提醒（先做「文字完全相同」判斷，AI 語意相近判斷留到 Phase 6）
5. 關聯（Relation）顯示 + 手動建立 / 刪除（四種關聯類型，來源標記為 manual）

## Phase 4　AI Adapter 層與 Gemini 串接

**目的**：建立可替換的 AI 呼叫抽象層與安全的 API 代理機制，作為所有 AI 功能的共用基礎。

任務項目：
1. 抽象介面設計：`identifyMainWord`、`generateCardContent`、`generateSense`、`generateDistractors`、`chatDiscuss`
2. Vercel Serverless/Edge Function 代理（隱藏 API Key）
3. Gemini adapter 實作（`gemini-2.5-flash` / `gemini-2.5-flash-lite`）
4. 共用錯誤處理（AI 生成失敗、網路失敗的提示與重試 UI/hook）、輸入內容保留邏輯

## Phase 5　新增單字（自由工作區）

**目的**：實作以 AI 輔助建立字卡的核心流程，涵蓋輸入判定、重複檢查、內容生成與延伸建議。

任務項目：
1. 文字輸入 + AI 辨識主要單字 → 候選字列表（含信心分數、拼字修正）
2. 重複判斷邏輯：已存在單字時 `repeatCount +1`；單純重複 `familiarityScore -15`；新 sense 確認後 `-5`
3. AI 生成字卡內容預覽（1–3 個 sense）+ 使用者確認前可編輯
4. 建立字卡動作，串接 Phase 1 資料層
5. AI 討論區（session-only 暫存對話，離開頁面 / 重新整理 / 重開 App 後清空）
6. AI 延伸單字建議 → 使用者確認後建立新字卡與關聯
7. iPad 手寫（Scribble）情境的實機測試

## Phase 6　單字詳情頁的 AI 功能補強

**目的**：將 AI 討論與語意判斷能力補進單字詳情頁，強化既有字卡的維護與延伸。

任務項目：
1. 內嵌 AI 對話框（帶入目前字卡、sense、備註、關聯脈絡）
2. AI 回覆的操作（加入備註 / 建立新字卡 / 建立關聯）
3. Sense 中文意思語意相近提醒（AI 判斷版本，補齊 Phase 3 的文字比對規則）

## Phase 7　快速學習

**目的**：實作以熟悉度為核心的複習機制，並整合 AI 生成干擾選項。

任務項目：
1. 開始前設定畫面（學習範圍 4 選項：全部 / 星號 / 最近新增 / 熟悉度低優先；題型 2 選項：單字英翻中 / 例句情境英翻中）
2. 抽題邏輯：範圍篩選 + 熟悉度低優先加權隨機（陌生 5 / 一般 3 / 熟悉 1），同輪不重複，題目不足時允許重複
3. AI 干擾選項生成（`gemini-2.5-flash-lite`，批次預生成避免 RPM 超限）；不足時跳過該題並產生下一題
4. 作答流程：正確 / 錯誤回饋、`familiarityScore` / `errorCount` 更新、分數 clamp 於 0–100
5. 結算畫面（本次題數、答對數）
6. 空狀態（無字卡可學習 / 星號篩選無結果）

## Phase 8　CSV 匯出

**目的**：提供資料備份與外部（Excel / Google Sheets）檢視能力。

任務項目：
1. Card + Sense 攤平邏輯（一個 sense 一列，Card 層級欄位重複顯示）
2. UTF-8 with BOM 字串產生（手刻或 `papaparse`）
3. 匯出確認訊息 + 下載觸發，串接單字卡庫右上角更多選單

## Phase 9　PWA / RWD 收尾

**目的**：確保應用在 iPad 與手機的實際使用情境下穩定可用。

任務項目：
1. Service worker 快取策略、manifest 圖示完整化
2. iPad 橫向 / 直向、手機版 RWD 檢查與調整
3. 導覽列響應式行為

## Phase 10　驗收

**目的**：確認 MVP 是否符合 PRD 定義的驗收標準，收斂剩餘問題。

任務項目：
1. 逐條檢查 `LexiCard_PRD.md` 第 8 章驗收標準
2. Bug fix pass
