# LexiCard PRD：iPad 手寫 AI 英文單字卡工具

## 1. 產品目的

LexiCard 是一個以 iPad 建立單字卡、手機快速複習為主要情境的 AI 英文單字卡 PWA。使用者可以用手寫或文字輸入快速記錄英文單字，透過 AI 生成詞性、中文意思、音標、例句、延伸單字與易混淆字，並用選項式快速學習加強記憶。

MVP 核心價值：

- 快速建立英文單字卡。
- 以 AI 協助理解單字、語境與相近字差異。
- 將同一單字的不同意思整理為多個 sense。
- 從 AI 討論中延伸建立相關單字卡。
- 用快速學習追蹤熟悉度。
- 支援 CSV 匯出備份與檢視。

## 2. 產品形式與導覽

- 產品名稱：LexiCard。
- 產品形式：PWA，供個人測試使用。
- 首頁：單字卡庫。
- 導覽列：單字庫 / 新增單字 / 快速學習。
- RWD 使用情境：iPad 主要用於手寫、新增、整理與 AI 討論；手機主要用於文字輸入 + AI 新增、查看字卡與快速學習。
- iPad 新增方式：手寫 / 文字輸入 + AI。
- 手機新增方式：文字輸入 + AI。
- 發音：MVP 使用美國口音播放。

## 3. 核心畫面

### 3.1 單字卡庫

單字卡庫作為首頁，用於查看、搜尋、篩選、排序、管理與匯出所有單字卡。

畫面資訊：

- 總單字數
- 搜尋框
- 篩選
- 排序
- 字卡列表
- 更多選單

搜尋範圍：

- `word`
- `normalizedWord`
- sense 的中文意思

篩選：

- 全部
- 星號

排序：

- 最近新增
- 熟悉度由低到高
- 熟悉度由高到低
- A-Z

字卡列表顯示：

- 單字
- 熟悉度圖示
- 星號

熟悉度圖示：

- 一本書：陌生
- 兩本書：一般
- 三本書：熟悉

空狀態：

- 無字卡：顯示簡短引導文字，說明可先建立第一張單字卡，並提供新增單字入口。
- 搜尋無結果：顯示找不到符合的單字，提供清除搜尋或新增此單字入口。
- 星號篩選無結果：顯示尚未標記星號字卡。

CSV 匯出入口：

- 位於單字卡庫右上角更多選單。
- 操作名稱為「匯出 CSV」。
- 匯出前顯示確認訊息，說明將匯出所有單字與 sense。

### 3.2 新增單字

新增單字採自由工作區形式，整合手寫、文字輸入、AI 討論、AI 生成預覽與延伸單字建議。

畫面資訊：

- 手寫 / 文字輸入區
- 候選單字列表
- 重複單字檢查結果
- AI 生成預覽
- AI 討論區
- AI 延伸單字建議
- 建立字卡操作

建立方式：

1. 手寫單字  
   使用者在 iPad 以 Apple Pencil 手寫，iPadOS Scribble 將手寫轉為文字。LexiCard 對轉換後文字進行候選判定、拼字修正與重複檢查。

2. 文字輸入  
   使用者輸入單字、句子或問題。AI 辨識主要單字並生成字卡內容。

3. AI 討論延伸  
   AI 在討論中提出延伸單字、易混淆單字、相似意思或詞性變化。使用者確認後可建立新字卡與關聯。

重複判斷：

- 系統以 `normalizedWord` 判斷單字是否已存在。
- 使用者主動嘗試建立已存在單字時，該 Card 的 `repeatCount +1`。
- 若本次語境已涵蓋於既有 sense，`familiarityScore -15`。
- 若本次語境代表新的 sense，系統提示新增 sense；使用者確認後 `familiarityScore -5`。
- 熟悉度在 MVP 維持 Card 層級。

新字卡預設值：

- `familiarityScore = 50`
- `repeatCount = 0`
- `errorCount = 0`
- `isStarred = false`
- `pronunciationAccent = US`

### 3.3 單字詳情

單字詳情用於查看與管理單張單字卡的完整內容。

畫面資訊：

- 單字
- 音標
- 美國口音發音播放
- 熟悉度圖示
- 星號
- 備註
- sense 列表
- 關聯單字
- 內嵌 AI 對話框

sense 顯示內容：

- 詞性
- 中文意思
- 使用情境
- 例句
- 例句中文翻譯
- 是否為主要 sense

sense 操作：

- 新增 sense
- 編輯 sense
- 刪除 sense
- 設為主要 sense
- 編輯詞性
- 編輯中文意思
- 編輯使用情境
- 編輯例句
- 編輯例句中文翻譯

sense 重複提醒：

- 使用者新增或編輯 sense 中文意思時，系統比對同一 Card 既有 sense。
- 中文意思文字相同時，顯示提醒：「此中文意思已存在，是否仍要保存？」
- AI 判斷語意高度相近時，顯示提醒：「此意思可能與既有 sense 相近，請確認是否要保留。」
- 使用者可自行決定是否保存。

關聯類型：

- 延伸單字
- 易混淆單字
- 相似意思
- 詞性變化

關聯來源：

- AI 關聯
- 手動關聯

AI 討論：

- AI 對話框會帶入目前字卡、sense、備註與關聯脈絡。
- AI 回覆可由使用者加入備註、建立新字卡或建立關聯。
- 新增單字頁與單字詳情頁的 AI 對話為當前 session 暫存。
- 使用者離開頁面、重新整理頁面或重新開啟 App 後，未保存的 AI 對話內容會清空。
- AI 對話框提示使用者：需要保留的內容可加入備註或建立字卡。

### 3.4 快速學習

快速學習以 4 選 1 選項題進行複習。

開始前設定：

- 學習範圍
- 題型

學習範圍：

- 全部字卡
- 星號字卡
- 最近新增字卡
- 熟悉度低優先

熟悉度低優先抽題：

- 採加權隨機。
- 陌生權重 5。
- 一般權重 3。
- 熟悉權重 1。
- 同一輪學習中，已出現過的題目優先不重複。
- 可用題目不足時，允許重複已作答題目。

題型：

1. 單字英翻中  
   顯示單字與發音播放，使用者從中文選項中選答案。該 Card 所有 sense 的中文意思皆為正確答案。

2. 例句情境英翻中  
   顯示單字、例句與發音播放，使用者根據語境選中文意思。正確答案為該例句對應 sense 的中文意思。

選項產生：

- 標準題目為 4 選 1。
- 每題包含 1 個正確答案與 3 個 AI 生成干擾選項。
- AI 生成干擾選項時，避開目前 Card 的所有 sense 中文意思。
- AI 生成干擾選項時，避免與正確答案語意過於接近而造成爭議。
- AI 無法產生足夠干擾選項時，該題跳過並嘗試產生下一題。
- 被跳過的題目不更新 `errorCount`、`repeatCount` 或 `familiarityScore`。

答題規則：

- 答對：`familiarityScore +10`，顯示短暫正確回饋後進入下一題。
- 答錯：`errorCount +1`，`familiarityScore -15`，顯示錯誤通知與正確答案後接續下一題。
- 分數限制在 0–100。

結束狀態：

- 完成後顯示簡短結算。
- 結算顯示本次題數與答對數。

空狀態：

- 無字卡：顯示目前沒有可學習的單字卡。
- 選星號但無星號卡：顯示尚未標記星號字卡。

### 3.5 CSV 匯出

CSV 匯出位於單字卡庫更多選單，用於備份或在 Excel / Google Sheets 中檢視資料。

格式：

- CSV
- UTF-8 with BOM
- 一個 sense 一列

攤平規則：

- 同一張 Card 若有多個 sense，CSV 中會產生多列。
- Card 層級欄位在每一列重複顯示。
- Sense 層級欄位依每個 sense 顯示。
- 多列呈現代表多義項攤平，不代表字卡被重複建立。

欄位：

- word
- normalizedWord
- phonetic
- pronunciationAccent
- isStarred
- familiarityScore
- familiarityStatus
- note
- partOfSpeech
- chineseMeaning
- usageContext
- exampleSentence
- exampleSentenceTranslation
- isPrimary
- repeatCount
- errorCount
- createdAt
- updatedAt

## 4. Data Model

### Card

| 欄位 | 定義 |
|---|---|
| `id` | 單字卡唯一識別碼。 |
| `word` | 使用者看到的單字。 |
| `normalizedWord` | 標準化單字，用於搜尋與重複判斷；MVP 為 trim + lowercase。 |
| `phonetic` | 音標。 |
| `pronunciationAccent` | 發音口音；MVP 固定為 US。 |
| `note` | 使用者備註。 |
| `isStarred` | 是否標記星號。 |
| `repeatCount` | 使用者在新增單字流程中主動嘗試建立已存在單字的次數。 |
| `errorCount` | 快速學習答錯次數。 |
| `familiarityScore` | 熟悉度分數，0–100。 |
| `createdAt` | 建立時間。 |
| `updatedAt` | 更新時間。 |

### Sense

| 欄位 | 定義 |
|---|---|
| `id` | sense 唯一識別碼。 |
| `cardId` | 所屬單字卡 ID。 |
| `partOfSpeech` | 詞性；初始由 AI 產生，使用者可手動編輯。 |
| `chineseMeaning` | 中文意思；初始由 AI 產生，使用者可手動編輯。 |
| `usageContext` | 使用情境或語意說明；初始由 AI 產生，使用者可手動編輯。 |
| `exampleSentence` | 英文例句；初始由 AI 產生，使用者可手動編輯。 |
| `exampleSentenceTranslation` | 例句中文翻譯；初始由 AI 產生，使用者可手動編輯。 |
| `isPrimary` | 是否為主要 sense。 |
| `createdAt` | 建立時間。 |
| `updatedAt` | 更新時間。 |

### Relation

| 欄位 | 定義 |
|---|---|
| `sourceCardId` | 來源字卡。 |
| `targetCardId` | 目標字卡。 |
| `relationType` | 延伸單字、易混淆單字、相似意思、詞性變化。 |
| `relationSource` | manual 或 ai。 |
| `description` | 關聯說明。 |

### WordCandidate

WordCandidate 為 transient / session-only 資料，用於手寫或輸入判定過程。

| 欄位 | 定義 |
|---|---|
| `candidateWord` | 候選單字。 |
| `confidenceScore` | 系統判斷信心分數。 |
| `cardExists` | 是否已有字卡。 |
| `cardId` | 已存在字卡的 ID。 |

## 5. 熟悉度規則

初始分數：

- 新字卡 `familiarityScore = 50`

分數變化：

- 快速學習答對：+10
- 快速學習答錯：-15，且 `errorCount +1`
- 單純重複新增已存在單字：-15，且 `repeatCount +1`
- 重複新增但新增為新 sense：-5，且 `repeatCount +1`

熟悉度分級：

- 0–39：陌生，一本書圖示
- 40–69：一般，兩本書圖示
- 70–100：熟悉，三本書圖示

## 6. AI 功能與錯誤狀態

AI 功能：

- 從輸入文字中辨識主要單字。
- 產生單字卡基本內容。
- 產生 1–3 個 sense。
- 產生音標、中文意思、詞性、例句與例句中文翻譯。
- 討論單字用法、語境、例句與相近字差異。
- 根據討論提出延伸單字。
- 建議易混淆單字、相似意思字、詞性變化字。
- 產生關聯說明。
- 為快速學習題目生成干擾選項。
- 在單字詳情中依據目前字卡脈絡進行 AI 問答。

AI 建立規則：

- AI 可以建議字卡與關聯。
- 建立新字卡與建立關聯前需經使用者確認。
- AI 回覆由使用者手動選擇保存方式。

錯誤狀態：

- AI 生成失敗時，顯示「AI 暫時無法產生內容，請稍後重試。」並提供重試操作。
- 網路或連線失敗時，顯示「目前無法連線，請確認網路後重試。」並提供重試操作。
- AI 生成失敗與連線失敗時，保留使用者已輸入內容。
- 候選字信心過低時，顯示候選字列表或提示使用者修正文字。
- 無法產生可靠候選字時，顯示「無法判定單字，請修改輸入」。
- 使用者可手動編輯輸入文字後重新判定。

## 7. MVP 範圍邊界

MVP 範圍包含：

- 單字卡庫
- 新增單字
- 單字詳情
- 快速學習
- CSV 匯出
- AI 字卡生成
- AI 討論
- AI 干擾選項生成
- 手動編輯字卡與 sense
- 手動與 AI 字卡關聯

MVP 範圍外：

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

## 8. 驗收標準

- App 開啟後以單字卡庫作為首頁。
- 導覽列包含單字庫、新增單字、快速學習。
- 單字卡庫可顯示總單字數、搜尋、篩選、排序、字卡列表與更多選單。
- 單字卡庫列表可顯示單字、熟悉度圖示、星號。
- 單字庫無字卡時可顯示簡短引導與新增單字入口。
- CSV 匯出可從單字卡庫更多選單啟動。
- 使用者可透過 iPad 手寫 / 文字輸入 + AI 建立單字卡。
- 使用者可透過手機文字輸入 + AI 建立單字卡。
- 建立前能正確檢查重複字卡。
- 重複新增既有單字時，可更新 `repeatCount` 與熟悉度。
- 重複新增且本次語境為新 sense 時，可新增 sense 並套用新 sense 熟悉度規則。
- 新字卡可包含多個 sense。
- 使用者可事後新增 3 個以上 sense。
- 詞性、中文意思、使用情境、例句與例句中文翻譯可手動編輯。
- sense 中文意思重複或語意相近時可顯示提醒。
- 使用者可手動建立字卡關聯。
- 單字詳情可在頁面內進行 AI 討論。
- AI 回覆可由使用者手動加入備註、建立新字卡或建立關聯。
- AI 對話離開頁面後清空未保存內容。
- 快速學習以 4 選 1 題型呈現。
- 快速學習干擾選項由 AI 生成，並避開目前 Card 所有 sense 中文意思。
- 快速學習開始前可選擇學習範圍與題型。
- 熟悉度低優先採加權隨機抽題。
- 快速學習完成後可顯示本次題數與答對數。
- 答錯時顯示錯誤通知與正確答案後接續下一題。
- AI 生成失敗、網路失敗與候選字信心過低時有對應錯誤提示與重試 / 修正操作。
- CSV 匯出為 UTF-8 with BOM，中文在 Excel 中可正常顯示。
- CSV 採一個 sense 一列，Card 層級欄位於多列中重複顯示。
- RWD 在 iPad 與手機主要使用情境下可正常操作。

## 9. 技術架構與套件

技術選型原則：無成本／低成本、個人測試使用、免自建後端伺服器。詳細決策歷程見 `Log.md` 2026-07-03「技術選型：前端架構與 AI 串接」。

### 9.1 前端框架

- Vite + React + TypeScript
- `vite-plugin-pwa`：PWA manifest 與 service worker
- Tailwind CSS：樣式與 RWD

### 9.2 本地資料儲存

- IndexedDB，透過 `dexie` 封裝
- 資料留存於使用者裝置本地，無雲端資料庫

### 9.3 手寫輸入

- iPadOS Scribble（OS 層級手寫轉文字），標準文字輸入元件即可支援，不需額外手寫辨識套件

### 9.4 發音播放

- Web Speech API（瀏覽器內建 `speechSynthesis`）
- MVP 僅使用美式口音

### 9.5 AI 串接

- 供應商：Google Gemini API 免費層（無需信用卡）
- 預設模型：
  - `gemini-2.5-flash`：字卡生成、sense 拆分、AI 討論
  - `gemini-2.5-flash-lite`：快速學習干擾選項生成
- SDK：`@google/genai`（官方新版統一 SDK，取代已棄用的 `@google/generative-ai`）
- 串接方式：AI 呼叫封裝為抽象層介面（如 `generateSense`、`generateDistractors`、`chatDiscuss`），底層 adapter 可替換供應商，保留未來切換 OpenAI 或其他 API 之彈性
- API Key 保存：透過 Vercel Serverless/Edge Function 代理呼叫，不存於前端程式碼

### 9.6 CSV 匯出

- 手刻 UTF-8 with BOM 字串產生，或使用 `papaparse`

### 9.7 部署與託管

- Vercel 免費 Hobby 方案（含免費 Serverless/Edge Function）
- GitHub 免費 repo 版控

### 9.8 套件清單

```
react, react-dom, typescript, vite
vite-plugin-pwa
tailwindcss
dexie
react-router
zustand（可選，狀態管理）
@google/genai
papaparse（可選）
```

### 9.9 已知限制

- Gemini 免費層依模型有 RPM／每日請求數限制（5–15 RPM，100–1,000 次/日），快速學習單輪多題建議批次預生成，避免瞬間超過 RPM 上限。
- Gemini 免費層 prompt／回覆可能被用於模型改善，資料保護等級低於付費層。
- Gemini 2.0 Flash 已棄用，選型統一採 2.5 系列模型。
