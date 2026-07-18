# LexiCard Handoff

## 1. 文件狀態

- 最後整理：2026-07-18
- 專案根目錄：`D:\AI Case\Lexicard`
- 程式碼位置：`Prototype/`
- GitHub：`https://github.com/winnie0208/Lexicard.git`
- Branch：`main`
- 目前階段：Phase 5 非 AI 部分人工測試全數通過後，Phase 4 前的介面調整已完成一個檢查點（水平卡片列、關聯卡、AI 唯讀摘要卡、延伸單字建議，`LOG-20260718-02`〜`08`）；使用者於 2026-07-18 表示本輪暫告段落
- 下一個主要階段：Phase 4 AI Adapter（等待 Gemini API Key 與 Vercel 連結）
- 舊版完整交接內容封存於 `docs/archive/session_handoff_legacy_2026-07-13.md`，只供追查歷史，不作為目前狀態來源。

## 2. 目前目標

Phase 5 非 AI 部分的人工測試（測試 1〜6）已於 2026-07-17〜18 全數通過，期間依使用者回饋完成多輪調整（`LOG-20260717-01`〜`07`）。

**本輪暫告段落：Phase 4 前的介面調整。** 詳情頁水平卡片列的桌機回彈已暫時解決；關聯卡、AI 唯讀摘要卡、延伸單字建議與原始語意排序已完成最新一輪實作（`LOG-20260718-02`〜`08`）。最新視覺尚待桌機／iPad 實際確認；確認後可開始 **Phase 4 AI Adapter（Gemini 串接）**：

1. 前置：使用者提供 Google Gemini API Key；建立 Vercel 專案連結與環境變數。
2. 實作 AI 相依項目：五類意圖分類（取代 `parseFreeformWordInput.ts` 規則式邏輯，含「換討論主題」判斷與語意相近比對）、多 sense 生成預覽、例句重新生成按鈕、中文反查候選、拼字候選列表、延伸建議可點選＋關聯建立確認卡、錯誤重試訊息、AI 建議關聯互動定義。

單字詳情頁內嵌 AI 討論為下一階段 MVP 範圍。行動裝置（手機寬度、iPad 實機 Scribble）驗證沿前輪仍待安排，不阻擋 Phase 4 開工。

現行產品規格見 `LexiCard_PRD.md`（3.2 輸入意圖分類／AI 生成預覽／建卡後行為／既有單字線索收斂重複判斷；3.3 關聯配對層級與呈現），Phase 定義見 `MVP_Task_Breakdown.md`，決策歷史見 `Log.md`。

## 3. Phase 狀態

| Phase | 狀態 | 說明 |
|---|---|---|
| Phase 0 專案初始化 | 已完成 | Vite、React、TypeScript、Tailwind、PWA、路由、獨立 Git repo |
| Phase 1 資料層 | 已完成 | Dexie、資料模型、repositories、seed、熟悉度工具 |
| Phase 2 單字卡庫 | 功能與視覺完成 | 等待使用者最終確認 |
| Phase 3 單字詳情 | 功能完成 | 等待使用者實機確認 |
| Phase 4 AI Adapter | 尚未開始 | 需要 Gemini API Key、Vercel 環境變數與專案連結 |
| Phase 5 新增單字 | 非 AI 部分完成並驗證 | 2026-07-18 人工測試全數通過（`LOG-20260718-01`）；AI 相依功能待 Phase 4 |
| Phase 6 之後 | 尚未開始 | 依 `MVP_Task_Breakdown.md` 排程 |

## 4. 最近已完成

**2026-07-18（介面調整檢查點，`LOG-20260718-02`〜`08`）：**

- 詳情頁水平卡片列：修復放開彈回、加入邊界 rubber-band、末端自由停放、`snap-proximity`、桌機慣性甩動，以及依最近輸入來源分流 JS 對齊；使用者已確認手機／iPad 觸控順暢，桌機回彈暫時解決。
- 關聯卡：三段式結構；長單字最多兩行、詞性置於單字下方；原始語意排第一；「始」統一 accent 白字、「似」使用低彩度藍灰；關聯類型標籤與中文卡片配色區隔。
- 新增單字頁：單字列表展開卡的原始語意排第一；AI 唯讀摘要卡底部統一提供靠左、非滿寬「查看詳情」，成功訊息不再重複顯示按鈕。
- 延伸單字建議：靜態 mock 改為含英文、詞性、中文意思的資訊卡，英文 16px display 字體，單行標題說明用途。

**2026-07-17〜18（本輪人工測試與迭代，`LOG-20260717-01`〜`07`、`LOG-20260718-01`）：**

- 人工測試 1〜6 全數通過：建卡不跳轉、唯讀摘要卡與行內編輯、草稿切換確認、既有單字線索收斂與熟悉度背景扣分、關聯依類型配對、桌機寬螢幕限寬版面。
- 既有單字採詞性→中文線索收斂；中文命中背景扣 15，新語意直接建立扣 5；語意比對暫為字串完全相同（`LOG-20260717-05`／`06`）。
- `addWordSessionStore` 保存對話、討論字、sense 草稿、行內編輯與輸入偏好：切頁保留、重整清空；規則式分流支援單字／詞性／中文同行與片語（`LOG-20260717-02`／`04`／`06`）。
- 關聯配對與表單互動已人工驗證；最新卡片呈現由 `LOG-20260718-06`／`08` 接續。

## 5. 未完成事項

**介面調整（本輪暫停）：**

- 桌機拖曳已停用會與 `useDragToScroll` 競爭的最近卡片 JS 校正（`LOG-20260718-05`），使用者確認回彈暫時解決；若後續於不同滑鼠／瀏覽器重現，再微調方向門檻或慣性參數。
- 最新關聯卡、AI 唯讀摘要卡與延伸單字資訊卡尚待桌機／iPad 視覺確認；目前只完成程式、build、lint 與格式驗證。
- Working tree 仍累積大量未提交修改與未追蹤新檔；下次開始先跑 `git status`，不可覆蓋既有成果。Cloudflare `.log`／`.out`／`.err` 不宜直接納入 GitHub。

**行動裝置驗證（沿前輪，不阻擋 Phase 4）：**

- 手機寬度抽屜、640px 斷點、觸控拖放、iPad 實機 Scribble 完整流程（桌機部分已於本輪測試中覆蓋）。

**Phase 4（AI 相依，下一步）：**

- Gemini 串接與 AI Adapter；五類意圖分類取代 `parseFreeformWordInput.ts`（含「換討論主題」判斷、語意相近比對取代字串完全相同）。
- AI 單字辨識、拼字候選、詞性音標與多 sense 生成、例句重新生成按鈕、中文反查候選、延伸建議可點選＋關聯建立確認卡、錯誤重試訊息（目前延伸建議仍為靜態 mock）、AI 建議關聯互動定義。
- Vercel 專案連結與 Gemini API Key 環境變數設定。

## 6. 下一步

1. 重新開啟專案後先檢查 `git status`／diff，確認跨 session 修改仍完整。
2. 於桌機／iPad 檢視最新關聯卡、AI 唯讀摘要卡、延伸單字建議的換行、間距與配色；若有問題再做聚焦微調。
3. 規劃 GitHub milestone commit：確認 `session_handoff.md` → `handoff.md` 是否為預期重新命名，並先排除 Cloudflare 暫存紀錄。
4. 若介面確認完成，使用者提供 Google Gemini API Key、建立 Vercel 專案連結與環境變數，開始 Phase 4 AI Adapter。

## 7. Blocker 與待確認事項

- 【已知限制，待 Phase 4】已有討論字時輸入另一個英文單字，規則式分流不會判斷「切換討論主題」意圖（`LOG-20260717-02`）；由 Phase 4 AI 意圖分類解決，暫不加工規則式邏輯。
- 【已知限制，待 Phase 4】既有單字的語意相符判斷暫為字串完全相同（`LOG-20260717-05`）；相近但不同字的輸入會被當成新語意，Phase 4 改由 AI 判斷。
- 【提案中，MVP 後】使用者提出未來考慮跨裝置儲存（含單字庫同步），尚未排程。
- Phase 4 需要使用者提供或設定 Google Gemini API Key。
- Vercel 專案尚未完成連結；目前環境沒有 `vercel` CLI。
- 手機寬度、iPad 實機（Scribble、觸控拖放）驗證沿前輪待安排；桌機瀏覽器部分已於本輪人工測試覆蓋。
- 新增單字頁目前的 AI 訊息、規則式輸入分流與延伸建議預覽皆為暫時方案，不可視為 AI 功能已完成。

## 8. 測試狀態

| 測試 | 結果 | 備註 |
|---|---|---|
| Build／lint／Prettier | 通過 | 2026-07-18 本輪 UI 檢查點後重跑，通過 |
| 元件／parser 自動化測試 | 通過 | 切換確認 2 情境、線索收斂 6 情境、parser 14 案例——以臨時安裝之 vitest 等驗證後移除（`LOG-20260717-03`／`05`／`06`） |
| Phase 5 非 AI 人工測試 1〜6 | 通過 | 建卡、摘要卡／行內編輯、草稿確認、線索收斂、關聯配對、寬螢幕版面皆通過（`LOG-20260718-01`） |
| 建卡不跳轉／查看詳情入口 | 部分通過 | 原流程人工驗證通過；入口已移至唯讀摘要卡底部，最新視覺待確認（`LOG-20260718-07`） |
| 詳情頁卡片列拖曳手感（彈回修復／回彈／末端自由／proximity） | 通過（暫定） | 2026-07-18 使用者確認手機／iPad 觸控順暢，桌機回彈問題暫時解決（`LOG-20260718-05`） |
| 最新關聯卡／AI 唯讀摘要卡／延伸單字建議視覺 | 待人工確認 | Build、lint、Prettier 通過；環境無可用預覽瀏覽器（`LOG-20260718-08`） |
| 手機抽屜／640px 斷點／觸控拖放／iPad 實機 Scribble | 待測 | 沿前輪，需手機寬度與 iPad 實機測試；桌機部分已覆蓋 |
| Gemini／AI 串接 | 未測 | Phase 4 尚未開始 |

## 9. 目前有效的重要決策

- Card 只代表單一詞性（相同單字不同詞性拆卡）；`partOfSpeech`／`phonetic` 位於 Card，`note` 位於各 Sense。
- 新增 sense 時，中文意思、例句與例句翻譯必填（「使用情境」欄位已移除，見 `LOG-20260715-03`）。
- Relation 配對層級依類型：易混淆／詞性變化為 Card 層級（senseId 留空）、相似意思為 Sense 層級（senseId 必填）；取代舊的「senseId 一律必填」決策（`LOG-20260716-02`）。
- 輸入分流為「意圖分類」而非格式分類，共五類（PRD 3.2）；例句、翻譯、音標由 AI 生成，使用者只在預覽卡修改；預覽卡除備註外皆必填。
- 既有單字輸入走線索收斂（詞性→中文自動判定討論卡，收斂不了才引導；缺詞性經確認才建新卡）；中文命中既有語意時於輸入判定當下背景扣 15；新語意按「新增語意」直接建立（無二次確認）扣 5；語意相符由 AI 判斷相近（暫為字串相同）（`LOG-20260717-05`）。
- 建卡後留在新增單字頁不跳轉，成功訊息後附唯讀摘要卡；「查看詳情」入口統一位於唯讀摘要卡底部，不在成功訊息重複顯示；熟悉度增減為背景紀錄，不通知，僅以釘選卡熟悉度圖示呈現。
- AI 討論狀態（對話、草稿、行內編輯）存於模組層 session store：切頁保留、重新整理清空（方案 A，`LOG-20260717-02`／`04`）。
- 帶入既有卡預設唯讀摘要，討論途中可經編輯入口修改；切換討論字有未存草稿（含開啟中的行內編輯）需確認。
- 關聯卡片採三段式結構並列出對方全部語意，原始語意排第一並加「始」，相似意思配對語意加「似」；新增表單切換類型保留搜尋狀態、不自動彈清單；編輯表單切相似意思即時顯示配對語意（`LOG-20260717-07`、`LOG-20260718-06`／`08`）。
- 單字詳情頁內嵌 AI 討論為下一階段 MVP 範圍。
- iPadOS Scribble 使用真正的文字輸入元素，不使用 canvas 接收文字。
- AI 對話在 MVP 中只保留於目前 session，不保存完整歷史。

## 10. 重要實作注意事項

- ID 統一使用 `src/lib/generateId.ts` 的 `generateId()`；不要改回需要安全情境的 `crypto.randomUUID()`。
- 固定高度 flex/grid 版面需從最外層到捲動容器逐層檢查 `min-h-0`。
- 可縮放的 flex/grid 子項需檢查 `min-w-0`。
- 橫向捲動容器內的浮動選單使用 React Portal、`position: fixed` 與 `getBoundingClientRect()`，避免被 overflow 裁切。
- `useSnapAlign`、`useHorizontalWheelScroll`、`useDragToScroll` 應傳入列表長度依賴，避免非同步資料載入前抓不到 DOM。
- CSS `snap-mandatory` 列表配滑鼠拖曳時，mouseup 不可立即恢復 snap（會就地吸回最近點造成彈回）；`useDragToScroll` 已實作方向意圖判斷＋捲動停穩後才恢復貼齊（`LOG-20260718-02`），調整吸附行為時兩者需一併考慮。
- `useSnapAlign` 只應在最近輸入來源為 touch／pen 時執行 JS 校正；mouse／wheel 由 `useDragToScroll` 與 CSS `snap-proximity` 決定停點，避免兩套邏輯競爭（`LOG-20260718-05`）。
- 依 id 重置元件 state 優先使用 `key={id}` 重新掛載，不使用 effect 內直接 `setState`。
- 訂閱瀏覽器外部狀態（如 `window.matchMedia`）優先用 `useSyncExternalStore`，不要在 `useEffect` 內直接呼叫 `setState` 同步當前值——本專案 ESLint 設定會擋 `react-hooks/set-state-in-effect`；需要「視窗夠寬則 A、否則 B」這類推導值，優先用 render 階段直接計算（如 `effectiveInputMode`），不要用 effect 強制修正另一個 state。
- 結構性編輯完成後重新讀取磁碟內容；本專案曾出現編輯結果靜默回退，且已排除為 git reset 所致。
- iPad 上文字輸入欄一旦被 Apple Pencil（Scribble）寫過，該 DOM 元素會被 WebKit 內部標記偏好精簡鍵盤工具列，之後手指點擊叫不出完整鍵盤，且清空內容無效；解法是用 `onPointerDown` 記錄 `pointerType`，`pen` 輸入後於 `onBlur` 換 `key` 強制 React 重建該 DOM 節點（見 `WordCaptureInput.tsx`／`LOG-20260715-01`）。

## 11. 重要檔案

- `Prototype/src/pages/AddWordPage.tsx`
- `Prototype/src/components/WordListPanel.tsx`
- `Prototype/src/components/AiConversationFeed.tsx`
- `Prototype/src/components/WordCaptureInput.tsx`
- `Prototype/src/lib/parseFreeformWordInput.ts`
- `Prototype/src/hooks/useMediaQuery.ts`
- `Prototype/src/components/CardActionsMenu.tsx`
- `Prototype/src/types/relation.ts`
- `Prototype/src/lib/repositories/relationRepository.ts`
- `Prototype/src/components/RelationSection.tsx`

## 12. 維護方式

- 本文件只保留目前狀態；產品規格、歷史與 Phase 細節分別見 `LexiCard_PRD.md`、`Log.md`、`MVP_Task_Breakdown.md`。
