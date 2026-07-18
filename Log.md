# LexiCard 專案迭代紀錄

## 紀錄規則

- 本文件保存重要決策、里程碑、重大 bug、重要測試與專案風險，不作為逐次修改清單。
- 現行產品規格以 `LexiCard_PRD.md` 為準；開發順序與驗收條件以 `MVP_Task_Breakdown.md` 為準；目前工作狀態以 `handoff.md` 為準。
- 同一目標的連續 UI 或實作調整應合併記錄，不為每個間距、icon、hover 或 scrollbar 微調建立獨立條目。
- 新紀錄排列在既有歷史紀錄之前，並使用 `LOG-YYYYMMDD-NN` 識別碼。
- 舊決策不得直接刪除；若已失效，標示其取代紀錄。

### 新紀錄格式

```md
## YYYY-MM-DD

### LOG-YYYYMMDD-NN｜紀錄標題

- 類型：決策／里程碑／重大 Bug／測試／風險／執行計畫／暫時例外
- 狀態：提案中／待確認／已核准／實作中／已實作／暫時例外／已撤回／已被取代
- 摘要：
- 原因或決策：
- 影響範圍：
- 測試：
- 已知風險：
- 下一步：
- 相關檔案：
- 取代關係：無，或「取代 LOG-...」
```

只有實際有內容的欄位需要保留。若同一天有多則紀錄，沿用同一日期標題並增加流水號。

## 2026-07-18

### LOG-20260718-08｜Phase 4 前介面調整檢查點：關聯卡與 AI 對話呈現收斂

- 類型：里程碑／實作／測試
- 狀態：已實作，本輪暫告段落
- 摘要：使用者逐步檢視並收斂單字詳情與新增單字頁的介面：關聯卡採頂部單字／詞性／設定、中段中文語意列表、底部關聯類型的三段式結構，長單字最多兩行且詞性固定在下方；關聯卡與新增單字頁單字列表的語意皆將原始意思排第一。AI 對話的唯讀摘要卡統一於底部提供非滿寬「查看詳情」按鈕，建卡成功訊息不再重複顯示入口；靜態延伸單字建議改為含 16px display 英文、詞性與中文意思的資訊卡，上方以單行標題「以下是可繼續延伸學習的相關單字」說明。
- 影響範圍：`RelationSection.tsx`、`WordListPanel.tsx`、`AiConversationFeed.tsx`、`AddWordPage.tsx`；PRD 3.2／3.3 已同步主要呈現與入口規則。
- 測試：`npm run build`、`npm run lint`、本輪主要元件與 hook 的 Prettier 檢查皆通過；環境無可用預覽瀏覽器，最新視覺仍待使用者於桌機／iPad 實際確認。
- 已知風險：延伸單字內容仍為 Phase 4 前的靜態 mock，尚不可點選；最新卡片間距、換行與資訊層級僅完成程式與建置驗證。
- 下一步：下次接續先確認最新關聯卡、唯讀摘要卡與延伸建議的實際畫面；若介面可接受，準備 Gemini API Key 與 Vercel 連結後開始 Phase 4 AI Adapter。
- 相關檔案：`Prototype/src/components/RelationSection.tsx`、`Prototype/src/components/WordListPanel.tsx`、`Prototype/src/components/AiConversationFeed.tsx`、`Prototype/src/pages/AddWordPage.tsx`、`LexiCard_PRD.md`、`handoff.md`
- 取代關係：整合並補充 LOG-20260718-06／07 後續的同目標介面微調。

### LOG-20260718-07｜AI 對話查看詳情入口統一至唯讀摘要卡

- 類型：決策／實作
- 狀態：已實作
- 摘要：AI 對話中的所有唯讀單字摘要卡底部新增「查看詳情」按鈕；建卡成功及既有詞義處理訊息原本透過 `createdCardId` 額外顯示的獨立按鈕移除，避免同一成果出現兩個入口。`ConversationMessage` 的 AI 訊息型別同步移除不再使用的 `createdCardId`。
- 影響範圍：新增單字頁 AI 對話、建卡後行為與既有字卡摘要卡；PRD 3.2 同步入口規則。
- 測試：`npm run build`、`npm run lint`、相關兩個 TSX 檔案的 Prettier 檢查通過。
- 相關檔案：`Prototype/src/components/AiConversationFeed.tsx`、`Prototype/src/pages/AddWordPage.tsx`、`LexiCard_PRD.md`
- 取代關係：調整 LOG-20260717-01「建卡後成功訊息附查看詳情」的入口位置；保留不自動跳轉規則。

### LOG-20260718-06｜關聯卡語意排序與原始／相似標籤統一

- 類型：決策／實作
- 狀態：已實作
- 摘要：關聯卡片依使用者草圖重排為三段式：頂部為單字＋詞性與設定按鈕，中段為中文語意卡列表，底部固定為關聯類型標籤；對方語意列表的原始意思固定排序第一；相似意思配對標籤由「相似」縮寫為「似」並使用低彩度藍灰色底與白字；全站四處原始意思「始」標籤統一為 `accent` 底色與白字；關聯類型標籤改用淺藍灰底與深藍灰文字，與米色中文語意卡區隔。
- 影響範圍：關聯卡結構與語意排序，以及單字詳情詞義卡、關聯卡、AI 對話摘要卡、單字列表中的原始意思標籤；PRD 3.3 同步三段結構、排序與標籤文字規則。
- 測試：`npm run build`、`npm run lint`、指定四個元件的 Prettier 檢查通過。
- 相關檔案：`Prototype/src/components/RelationSection.tsx`、`Prototype/src/components/SenseSection.tsx`、`Prototype/src/components/AiConversationFeed.tsx`、`Prototype/src/components/WordListPanel.tsx`、`LexiCard_PRD.md`
- 取代關係：補充 LOG-20260717-07 的關聯呈現規則。

### LOG-20260718-05｜修復：桌機拖曳停點被觸控校正邏輯拉回

- 類型：重大 Bug
- 狀態：已實作，2026-07-18 使用者回歸確認暫時解決
- 摘要：手機／iPad 觸控滑動正常，但桌機滑鼠拖曳放開後仍容易回彈。根因是 `useDragToScroll` 已依拖曳方向、速度與末端自由區決定停點後，`useSnapAlign` 又在捲動停止 120ms 後無條件尋找最近卡片，兩套桌機對齊邏輯互相競爭。修正為依最近一次實際輸入來源分流：touch／pen 保留 JS 校正；mouse／wheel 停用 JS 校正，桌機僅由 `useDragToScroll` 與 CSS `snap-proximity` 決定停點。採互動來源而非固定裝置判斷，讓觸控筆電也能依當次輸入正確處理。
- 影響範圍：`useSnapAlign.ts`；手機／iPad 既有觸控路徑不變，桌機滑鼠與滾輪不再被最近卡片校正拉回。
- 測試：`npm run build`、`npm run lint`、`prettier --check src/hooks/useSnapAlign.ts` 通過；2026-07-18 使用者於桌機回歸確認回彈問題暫時解決。
- 相關檔案：`Prototype/src/hooks/useSnapAlign.ts`
- 取代關係：補充 LOG-20260718-02〜04；桌機不再套用其中依賴 `useSnapAlign` 的 JS 校正。

### LOG-20260718-04｜詳情頁水平卡片列：滑鼠拖曳加入慣性甩動

- 類型：實作
- 狀態：已實作，待使用者回歸驗證
- 摘要：使用者回饋觸控（手機／iPad）滑動已順暢、桌機拖曳體感不佳；提供三方案（A 慣性甩動／B 滾輪整卡翻頁／C 自訂緩動）後使用者選定僅實作 A。實作：拖曳期間以 100ms 視窗取樣滑鼠位置，放開時計算速度；達 0.5px/ms 即視為快甩（fling），以速度 × 300ms 投影滑行距離（可跨多張卡），目標取投影點附近的卡片邊界（不逆行、至少前進一張；投影落在末端自由區則自由停放），以 ease-out（cubic）rAF 動畫減速抵達（250〜650ms 依距離與速度）；滑行中再按住列表可即時抓停（比照觸控）。慢速拖曳維持 LOG-20260718-02 的方向意圖行為。
- 影響範圍：`useDragToScroll.ts`；僅桌機滑鼠拖曳，觸控與滾輪不受影響。
- 測試：`npm run build`、`npm run lint` 通過；手感待人工驗證。
- 相關檔案：`Prototype/src/hooks/useDragToScroll.ts`
- 取代關係：補充 LOG-20260718-02／03。

### LOG-20260718-03｜詳情頁水平卡片列：邊界回彈動態、移除末端自動靠右

- 類型：決策／實作
- 狀態：已實作，待使用者回歸驗證
- 摘要：延續 LOG-20260718-02 的拖曳手感調整，依使用者回饋再改兩點：
  1. 邊界回彈（rubber-band）：拖曳超過列表頭尾時，超出量以阻尼位移呈現（0.35 阻尼、最大 64px，translateX），放開後 250ms 動畫彈回，取代原本的硬停與瞬間校準。
  2. 移除末端自動靠右：CSS 貼齊由 `snap-mandatory` 改為 `snap-proximity`（兩列表），拖曳釋放邏輯將「離所有卡片邊界超過 160px」視為末端自由區——停在原地，不再強制捲到最右；不可達的卡片邊界（起點貼齊位置超出可捲動範圍）不再列入對齊目標。中段對齊由方向意圖判斷＋`useSnapAlign` JS 校正（原本就跳過最後一張卡）維持不變。
- 影響範圍：`useDragToScroll.ts`（overscroll 位移與回彈、自由區判斷、目標邊界過濾）、`SenseSection.tsx`／`RelationSection.tsx`（`snap-proximity`）。觸控裝置原生捲動不經 drag hook；改為 proximity 後觸控在遠離邊界處不強制吸附，靠近邊界仍吸附，並有 JS 校正補齊。
- 測試：`npm run build`、`npm run lint` 通過；拖曳手感與觸控行為待人工驗證。
- 相關檔案：`Prototype/src/hooks/useDragToScroll.ts`、`Prototype/src/components/SenseSection.tsx`、`Prototype/src/components/RelationSection.tsx`
- 取代關係：補充 LOG-20260718-02；調整其「前進無邊界時停在 maxScrollLeft」的行為（改為停在原地）。

### LOG-20260718-02｜修復：詳情頁水平卡片列拖曳放開後彈回原位

- 類型：重大 Bug
- 狀態：已實作，待使用者回歸驗證
- 摘要：單字詳情頁的詞義／關聯卡片水平列表，以滑鼠拖曳後放開，卡片列經常彈回拖曳前的吸附點，無法前進到下一張卡。原因：`useDragToScroll` 在 mouseup 當下立即恢復 CSS `scroll-snap-type`（mandatory），瀏覽器就地吸附到「最近」的吸附點——拖曳距離不足半張卡寬（約 144px）時最近點仍是原卡；`useSnapAlign` 的 JS 校正同樣以「最近的卡」為目標，形成雙重彈回。已修正：放開時改為**依拖曳方向決定目標**——拖曳超過 40px 即視為有方向意圖，至少前進／後退一個卡片邊界（拖多張時停在離放開位置最近、且不逆行的邊界），以平滑捲動抵達後、捲動停穩（150ms debounce）才恢復 CSS 貼齊；再次按下拖曳會取消未完成的恢復。
- 影響範圍：`useDragToScroll.ts`（新增方向意圖判斷、貼齊延後恢復、`snapPaddingPx` 參數，與 `useSnapAlign` 相同的邊界計算含末端夾限）；詞義與關聯兩列表行為一致。觸控裝置為原生捲動，不經此 hook，不受影響。
- 測試：`npm run build`、`npm run lint` 通過；拖曳手感待使用者人工驗證。
- 相關檔案：`Prototype/src/hooks/useDragToScroll.ts`
- 取代關係：無。

### LOG-20260718-01｜里程碑：Phase 5 非 AI 部分人工測試全數通過

- 類型：里程碑／測試
- 狀態：已完成
- 摘要：使用者於 2026-07-17〜18 完成 handoff 本輪人工測試 1〜6 全部項目：(1) 新單字建卡後不跳轉；(2) 既有卡唯讀摘要卡與行內編輯；(3) 草稿切換確認（含行內編輯路徑）；(4) 既有單字線索收斂與熟悉度背景扣分；(5) 關聯依類型配對（含呈現調整與編輯切換）；(6) 桌機寬螢幕限寬版面。測試期間發現的問題與提出的調整均已於當輪修復並回歸驗證（`LOG-20260717-01`〜`07`）。
- 影響範圍：Phase 5 非 AI 部分視為完成並驗證；下一階段為 Phase 4 AI Adapter（Gemini 串接）。
- 未測範圍與剩餘風險：手機寬度、iPad 實機（Scribble、觸控拖放）沿前輪待安排，不阻擋 Phase 4；規則式分流與延伸建議 mock 為暫時方案，Phase 4 汰換；語意相近比對、換討論主題判斷等既知限制由 Phase 4 AI 解決。
- 下一步：使用者提供 Gemini API Key、建立 Vercel 連結，開始 Phase 4。
- 相關檔案：`handoff.md`（第 8 節測試狀態表）、`LexiCard_PRD.md` 3.2／3.3。
- 取代關係：無。

## 2026-07-17

### LOG-20260717-07｜關聯卡片改列全部語意並標註相似配對、類型切換保留搜尋文字

- 類型：決策／實作
- 狀態：已實作，2026-07-18 使用者人工驗證通過（測試 5）
- 摘要：使用者於測試 5 前提出兩項調整，均已實作並同步 PRD 3.3「關聯呈現與操作」：
  1. 單字詳情頁的關聯卡片改為一律在英文單字下方列出對方字卡的**全部語意**（一語意一列，比照單字列表的語意呈現，含「始」標籤）；相似意思關聯於配對到的語意另加「相似」標註。取代原「易混淆／詞性變化不顯示詞義、相似意思僅顯示配對詞義」的呈現。
  2. 新增關聯表單切換關聯類型時，搜尋欄狀態**完全保留**（已選對象與輸入文字皆不重置，經使用者三次回饋收斂至此），也**不自動展開建議清單**（清單僅於聚焦或輸入時顯示）；配對層級差異由系統自動調整——切至相似意思時預設綁定對方主要語意（同編輯表單），切回 Card 層級時解除語意綁定。AI 建議關聯的互動待 Phase 4 串接後再逐步定義（使用者註記）。
  3. 編輯關聯表單切至相似意思時，即時顯示將配對的語意（中文）供確認；原為 Card 層級關聯時預設對方主要語意並附文字說明，不再於儲存時默默綁定。
- 影響範圍：`RelationSection.tsx`（RelationItem 增列語意清單、型別切換不清空 targetQuery、卡片改頂端對齊）；語意資料以 liveQuery 即時取得。`LexiCard_PRD.md` 3.3 新增「關聯呈現與操作」段落。
- 測試：`npm run build`、`npm run lint` 通過；視覺與互動待人工驗證（測試 5 預期已同步更新）。
- 相關檔案：`Prototype/src/components/RelationSection.tsx`、`LexiCard_PRD.md`
- 取代關係：調整 LOG-20260716-02 影響範圍中「易混淆建立後關聯卡片不顯示詞義文字」的呈現規則（配對層級規則不變）。

### LOG-20260717-06｜線索收斂流程人工驗證通過與後續調整：介面微調、片語支援

- 類型：測試／實作
- 狀態：已實作，調整部分待回歸
- 摘要：使用者人工執行新版測試 4，線索收斂流程六步驟全數通過（單卡直入、多卡選詞性、中文命中自動選卡＋扣分、新語意表單直接建立、缺詞性確認三出口）。依測試回饋調整：
  1. 摘要卡移除「與輸入相符」文字標示（保留背景強調）；主要語意標籤由「主要」改回語意卡片原始樣式「始」膠囊。
  2. 新語意分支移除「已幫你帶入下方的新增語意表單…」引導訊息，摘要卡後直接接表單；「新增語意」表單標題拆為兩層——「新增語意」區塊標題（含說明）在上、「單字＋詞性」（與摘要卡頭部同款）在其下（順序依使用者二次回饋調整）。
  3. Dev seed 的 set (n.)「佈景；場景」語意改為「一夥人；圈子」——原資料使「佈景」無法作為新語意測試（非流程錯誤，為 seed 資料撞題）。
  4. 規則式分流支援片語：全小寫 2–4 token 視為片語（`deal with`、`deal with phr.`、`deal with 處理`），詞性清單補上 `phr`；PRD 3.2 意圖分類第一類補註含片語。已知取捨：全小寫短句（如 `he is tall`）會被誤判為片語，Phase 4 AI 意圖分類解決。
  5. 澄清（非 bug）：`set 一套` 出現詞性選擇是因語意比對暫為字串完全相同（「一套」≠「一套；一組」），屬 LOG-20260717-05 既知的 Phase 4 前限制。
  6. 詞性關鍵字彈性辨識（使用者二次回饋，`deal with 處理 phr` 曾誤判為例句）：分流改為 token 抽取式——縮寫（`n`／`v`／`adj`／`adv`／`prep`／`conj`／`pron`／`int`／`phr`，點可省略）與中文名稱（名詞／動詞／形容詞／副詞／介系詞／連接詞／代名詞／感嘆詞／片語）出現在行內任何位置（空白分隔）皆可辨識；僅在剩餘內容仍符合單字／片語／中文意思形狀時才採用，剩餘像完整句子則整行留給例句規則。
- 測試：`npm run build`、`npm run lint` 通過；parser 以臨時安裝之 vitest 撰寫 14 案例單元測試全數通過後移除；調整項待人工回歸。
- 相關檔案：`Prototype/src/components/AiConversationFeed.tsx`、`Prototype/src/pages/AddWordPage.tsx`、`Prototype/src/lib/parseFreeformWordInput.ts`、`Prototype/src/lib/devSeed.ts`、`LexiCard_PRD.md`
- 取代關係：補充 LOG-20260717-05。

### LOG-20260717-05｜既有單字輸入改為線索收斂流程，移除新增語意二次確認

- 類型：決策／實作
- 狀態：已核准（與使用者逐項定案），已實作，待人工回歸驗證
- 摘要：輸入已存在單字時，改以「詞性 → 中文意思」線索收斂自動判定要討論的 Card，只在線索不足時引導選擇（規則詳見 PRD 3.2「重複判斷（既有單字的線索收斂）」）。要點：
  1. 詞性收斂：含詞性且存在 → 直接採用；含詞性但不存在 → 對話流確認「{單字}沒有{詞性}，是否繼續建立新字卡？」（繼續建立／改用既有詞性／取消）；單一 Card → 自動；多 Card 且中文恰命中一張 → 自動採用該卡；否則引導選擇，命中的詞性標示「意思相符」。
  2. 中文分支：無中文 → 唯讀摘要卡＋開場訊息（與帶入路徑統一）；中文=既有語意 → 唯讀摘要卡強調該語意＋背景 `repeatCount +1`、`-15`（扣分時機由建卡時改為輸入判定時）；中文=新語意 → 唯讀摘要卡＋「新增語意」表單（僅 sense 欄位），按下直接建立不二次確認（`-5`）。
  3. 語意相符暫以字串完全相同判斷；Phase 4 改由 AI 判斷相近語意（使用者定案：相近即視為存在）。
  4. 規則式分流補「單字＋中文」「單字＋詞性＋中文」同行辨識（如 `set 一套`、`set n. 一套`，原會誤判為例句）。
  5. 附帶修正：`useLiveQuery` 依賴變更過渡期回傳舊結果造成預覽卡閃現（查詢結果自帶 queriedWord 比對）；收斂邏輯改直接查資料庫，避免頁面剛載入即輸入時比對到空快取。
- 影響範圍：`LexiCard_PRD.md` 3.2 重複判斷改寫；「仍要新增」確認條與 `pendingNewSenseConfirm` 移除；新增 `pendingPosConfirm`（session store，跨頁保留）；預覽表單分為「單字卡片預覽」（全新卡，含單字／詞性／音標）與「新增語意」（既有卡，僅 sense 欄位）兩模式。原「已涵蓋／新增詞義分支是否附摘要卡」待確認事項由本流程取代（兩分支現皆於輸入判定時顯示摘要卡）。
- 測試：臨時安裝 vitest／jsdom／@testing-library/react／fake-indexeddb 撰寫 6 情境元件測試（單卡直接摘要、多卡選詞性、中文命中自動選卡＋扣 15、新語意表單直接建立＋扣 5、缺詞性確認建卡、缺詞性改用既有詞性），全部通過後依慣例移除；`npm run build`、`npm run lint` 通過。人工回歸待使用者執行（測試 4 劇本已依新流程重寫）。
- 已知風險：語意比對為完全相同字串，相近但不同字的輸入會被當成新語意（Phase 4 解除）；已有討論字時輸入另一單字仍為既知限制（LOG-20260717-02）。
- 相關檔案：`LexiCard_PRD.md`、`Prototype/src/pages/AddWordPage.tsx`、`Prototype/src/components/AiConversationFeed.tsx`、`Prototype/src/lib/addWordSessionStore.ts`、`Prototype/src/lib/parseFreeformWordInput.ts`
- 取代關係：取代 LOG-20260716-01 第 10 點之「仍要新增」二次確認設計與建卡時扣分時機；取代 LOG-20260717-01 之「既有卡兩分支是否附摘要卡」待確認事項。

### LOG-20260717-04｜行內編輯狀態納入對話跨頁保留

- 類型：實作
- 狀態：已實作，待使用者回歸驗證
- 摘要：使用者驗證 2026-07-17 各項調整全數通過後提出：摘要卡行內編輯表單在切換頁面後應保持編輯狀態（未儲存資料不寫入資料庫仍為正常）。已實作：編輯狀態由元件本地 state 改存入 `addWordSessionStore` 的 `senseEditDrafts`（以 senseId 為 key，含四欄草稿值），`SenseInlineEditForm` 改為受控元件；切頁往返後表單保持展開且輸入內容保留，重新整理才清空。切換確認防護同步改以 `senseEditDrafts` 是否非空判斷，取代原 `onSenseEditingChange(±1)` 計數機制。副作用：同一張卡的多個 sense 現可同時展開編輯（原本一張摘要卡一次僅一個）；同一 sense 出現在多張摘要卡時編輯內容即時同步。
- 已知風險：若編輯中的 sense 在別處（詳情頁）被刪除，殘留的草稿 entry 會使切換確認誤判為有未存內容；Dev 清除對話時已一併清空草稿。
- 測試：`npm run build`、`npm run lint` 通過；跨頁保持編輯狀態待人工回歸。
- 相關檔案：`Prototype/src/lib/addWordSessionStore.ts`、`Prototype/src/types/sense.ts`、`Prototype/src/components/AiConversationFeed.tsx`、`Prototype/src/pages/AddWordPage.tsx`
- 取代關係：取代 LOG-20260717-03 已知風險中「切換頁面時行內編輯狀態不保留」的限制。

### LOG-20260717-03｜修復：摘要卡行內編輯中切換討論單字未經確認

- 類型：重大 Bug
- 狀態：已實作，待使用者回歸驗證
- 摘要：人工測試 3-3 發現，對話流摘要卡的 sense 行內編輯表單開啟時，從單字列表對另一張卡點「AI 討論」會直接切換討論單字，未出現確認框。原因：切換確認只偵測預覽卡 sense 草稿（`isSenseDraftDirty`），行內編輯狀態存於 `ExistingCardSummaryCard` 元件內部，頁面層完全不知情。已修正：摘要卡以 `onSenseEditingChange(±1)` 回報行內編輯開／關（effect cleanup 確保關閉、換 sense、卸載都會歸零），`AddWordPage` 以 `openSenseEditCount` 計數並納入切換防護；確認框文案依情況顯示草稿清空警告或「建議先儲存或取消該編輯」。
- 測試：臨時安裝 vitest／jsdom／@testing-library/react／fake-indexeddb 撰寫兩情境重現測試——(A) 預覽卡草稿未存時切換（原本即通過，證明劇本路徑邏輯正確）、(B) 行內編輯開啟時切換（修正前失敗、修正後通過）；驗證後依專案慣例移除臨時套件與測試檔。`npm run build`、`npm run lint` 通過。
- 已知風險：確認切換後，尚未儲存的行內編輯表單仍留在對話流中（可捲動回去繼續儲存或取消），不會被自動關閉；切換「頁面」（非討論單字）時行內編輯狀態不保留，屬元件本地狀態，暫不在對話跨頁保留範圍內。
- 相關檔案：`Prototype/src/pages/AddWordPage.tsx`、`Prototype/src/components/AiConversationFeed.tsx`
- 取代關係：無。

### LOG-20260717-02｜對話跨頁保留採方案 A、預覽卡除備註外皆必填、規則式分流已知限制

- 類型：決策／實作
- 狀態：前兩項已實作（待人工驗證）；已知限制待 Phase 4 解決
- 摘要：
  1. AI 討論對話跨頁保留採方案 A（使用者定案）：新增模組層 `addWordSessionStore.ts`（`useSyncExternalStore` 訂閱），將對話訊息、目前討論字、sense 草稿、輸入框草稿與輸入區偏好（模式、分隔線寬度）自 `AddWordPage` 元件狀態提升至記憶體 store；路由切換不再清空，重新整理頁面才重置，符合「AI 對話只保留於目前 session」決策。
  2. 預覽卡除備註外所有欄位皆為必填（使用者定案）：以使用者輸入為準、未填欄位由 AI 生成補齊（Phase 4 前需手動填寫）；新增詞性必選、音標於建立全新卡時必填（既有卡不顯示音標欄位），未填齊時「建立字卡」disabled。PRD 3.2 AI 生成預覽已補述。
  3. 已知限制（待 Phase 4）：已有討論字時輸入另一個英文單字（如已建立 tree 後輸入 mango），規則式分流只會填空欄位、不會判斷「切換討論主題」意圖，回覆「判斷不出要放進哪個欄位」；此為 Phase 4 AI 意圖分類（五類之一「英文單字」）的涵蓋範圍，暫不在規則式邏輯內加工。
  4. 使用者提出未來方向（提案中、未排程）：考慮跨裝置儲存（含單字庫同步），屬 MVP 後範圍。
- 測試：`npm run build`、`npm run lint` 通過；對話跨頁保留與必填驗證待人工驗證。人工測試 2（唯讀摘要卡／行內編輯／模板開場）與測試 1 的兩項調整（音標欄位、建卡後摘要卡）已由使用者驗證通過。
- 相關檔案：`Prototype/src/lib/addWordSessionStore.ts`、`Prototype/src/pages/AddWordPage.tsx`、`Prototype/src/components/AiConversationFeed.tsx`、`LexiCard_PRD.md`
- 取代關係：解除 LOG-20260717-01 中「對話跨頁保留提案中」狀態（採方案 A）。

### LOG-20260717-01｜人工測試回饋：預覽卡音標欄位、建卡後摘要卡、對話跨頁保留提案

- 類型：測試／決策
- 狀態：音標欄位與建卡後摘要卡已實作；對話跨頁保留為提案中
- 摘要：使用者執行 handoff 第 6 節「測試 1：新單字建卡後不跳轉」全數通過，並提出三項調整：
  1. 預覽卡欄位增加音標（已實作）：可編輯的字卡預覽新增 Card 層級「音標」欄位，僅在建立全新單字卡時顯示（既有卡的音標由建立時決定、詳情頁唯讀，新增 sense 不需重填）；音標草稿列入未儲存草稿判斷（切換討論字時觸發確認）。此為補齊 PRD 3.2 既有規格（預覽卡上半部含單字、詞性、音標），非規格變更。
  2. 建立全新單字卡後，成功訊息後於對話流顯示該卡的唯讀摘要卡（已實作）：重用既有 `ai-card-summary` 訊息型別與 `ExistingCardSummaryCard`（含 sense 編輯入口，內容隨資料庫即時更新）；PRD 3.2「建立字卡後行為」已同步補述。既有卡的「已涵蓋」與「新增詞義」兩分支暫不附摘要卡，待使用者確認是否比照。
  3. AI 討論對話內容在切換頁面後應保留（提案中）：目前 `messages` 等狀態存於 `AddWordPage` 元件內，路由切換即卸載清空；解法方案見 handoff 待確認事項，尚待使用者選定後實作。
- 測試：測試 1（建卡三分支之新卡路徑、不跳轉、查看詳情、列表即時更新、預覽卡收起、釘選卡熟悉度圖示）人工通過；本次調整後 `npm run build`、`npm run lint` 通過，音標欄位與建卡後摘要卡待人工回歸驗證。
- 相關檔案：`Prototype/src/pages/AddWordPage.tsx`、`Prototype/src/components/AiConversationFeed.tsx`、`LexiCard_PRD.md`
- 取代關係：無。

## 2026-07-16

### LOG-20260716-01｜新增單字頁 AI 討論使用情境盤點與介面決策定案

- 類型：決策
- 狀態：已核准（非 AI 相依部分實作中；AI 相依部分待 Phase 4）
- 摘要：完成新增單字頁 AI 討論區塊的完整使用情境盤點，定案以下產品規則：
  1. 輸入意圖分類（取代格式分類）：英文單字／中文意思／單字＋意思＋詞性／開放聊天／無法判斷或拼字混淆，共五類，由 AI 判斷意圖；例句、翻譯、音標一律由 AI 生成，使用者只在預覽卡上修改。
  2. 中文意思在無目前討論字時，AI 反查建議 2–4 個英文候選單字供點選。
  3. AI 生成預覽為單一預覽卡承載 1–3 個 sense 區塊，可個別刪除（至少留一個），第一個為主要 sense；例句欄位右側提供「重新生成」icon 按鈕，點擊後例句與例句翻譯一起重新生成，不自動觸發。
  4. 全新單字有多個常用詞性時，AI 依語境選一個生成預覽，其餘詞性以「詞性變化」延伸建議呈現。
  5. 建卡成功後停留在新增單字頁，不自動跳轉；對話流顯示成功訊息附「查看詳情」按鈕。
  6. 延伸單字建議可點選：切換目前討論並直接生成字卡候選預覽（含重複檢查）；建卡後接關聯建立確認卡，可只建卡不建關聯。
  7. 熟悉度扣分為背景紀錄不通知，改於「目前討論」釘選卡常駐顯示熟悉度圖示。
  8. 帶入既有字卡：對話流顯示唯讀摘要卡＋本地模板開場訊息（不耗 AI 額度）；既有內容預設唯讀，可由摘要卡編輯入口展開編輯。
  9. 切換目前討論單字時若有未儲存草稿，需經使用者確認才切換。
  10. 一次提交多個新 sense 時，重複規則以一次提交為單位（`repeatCount +1`、`-5` 各一次）。
  11. 錯誤與重試以對話流系統訊息呈現，不用彈窗。
- 原因或決策：AI 討論區塊先前為逐次零散調整，缺乏系統性的情境與介面物件盤點；本次與使用者逐項確認入口路徑、輸入意圖、狀態分支與介面物件後定案，作為 Phase 4 AI Adapter 的介面規格基礎。單字詳情頁內嵌 AI 討論（P5 路徑）列為下階段 MVP，本次盤點不含。
- 影響範圍：`LexiCard_PRD.md` 3.2（輸入意圖分類、AI 生成預覽、建立字卡後行為、延伸單字建議、既有字卡帶入討論、重複判斷）、第 6 章（AI 功能、錯誤狀態呈現）。程式面：建卡後不跳轉、釘選卡熟悉度圖示、唯讀摘要卡、模板開場訊息、草稿切換確認可先行實作；意圖分類、多 sense 生成、重新生成按鈕、反查候選、拼字候選、延伸建議點選為 Phase 4 AI 相依項目。
- 下一步：先行實作非 AI 相依項目；Phase 4 串接 Gemini 後實作其餘項目並淘汰 `parseFreeformWordInput.ts` 規則式邏輯。
- 相關檔案：`LexiCard_PRD.md`、`Prototype/src/pages/AddWordPage.tsx`、`Prototype/src/components/AiConversationFeed.tsx`
- 取代關係：取代 LOG-20260715-02 已知風險中「切換目前討論清空草稿未做二次確認」的未決狀態（本次定案需確認）；其餘不取代既有決策。

### LOG-20260716-02｜Relation 配對層級改為依關聯類型決定，senseId 改為選填

- 類型：決策
- 狀態：已核准，實作中
- 摘要：Relation 的配對層級由「一律必填 `sourceSenseId`／`targetSenseId`」改為依關聯類型決定：易混淆單字與詞性變化為 Card 層級（僅需 `sourceCardId`／`targetCardId`，senseId 留空）；相似意思為 Sense 層級（senseId 必填）。
- 原因或決策：使用者定案——拼字／發音相近（易混淆）與詞性變體（詞性變化）是單字整體的性質，與特定意思無關，掛在 sense 上反而不合理；只有「相似意思」本質上是特定 sense 之間的關係。
- 影響範圍：`LexiCard_PRD.md` 3.3「關聯配對」與第 4 章 Relation 欄位表；`Prototype/src/types/relation.ts`（senseId 改選填）、`relationRepository.ts`（建立驗證依類型）、`RelationSection.tsx`（新增／編輯表單依類型決定是否選 sense）、`useCardDetail.ts`（otherSense 允許缺席）、`devSeed.ts`（seed 資料僅相似意思帶 senseId）。Dexie schema 未索引 senseId，不需版本升級；既有資料庫中 Card 層級關聯的舊 senseId 值不再被讀取，開發階段不做資料清理。
- 已知風險：既有（開發用）資料的易混淆／詞性變化關聯仍殘留 senseId 屬性於 IndexedDB，僅不再顯示；重新執行 dev seed 即可重建乾淨資料。
- 下一步：完成程式端調整並以 build／lint 與 dev seed 驗證。
- 相關檔案：`LexiCard_PRD.md`、`Prototype/src/types/relation.ts`、`Prototype/src/lib/repositories/relationRepository.ts`、`Prototype/src/components/RelationSection.tsx`、`Prototype/src/hooks/useCardDetail.ts`、`Prototype/src/lib/devSeed.ts`
- 取代關係：取代 handoff 既有決策「Relation 連結兩張卡的具體 sense，必須保存 `sourceSenseId` 與 `targetSenseId`」（該決策源自 Phase 3 實作期間的 Relation 設計）。

### LOG-20260716-03｜新增單字頁版面限寬 1440px，左欄寬度改為容器比例

- 類型：實作
- 狀態：已實作
- 摘要：新增單字頁 `<form>` 加上 `max-w-[1440px]` 並水平置中（`mx-auto w-full`）；左欄單字列表寬度由 `minmax(320px, 24vw)` 改為 `minmax(280px, 22%)`，比例基準從視窗寬度改為限寬後的版面寬度。
- 原因或決策：桌機大螢幕（約 1920px）上三欄整體被拉得過寬，左欄依 `24vw` 達約 461px。選 1440px 是因為最大的 iPad Pro 12.9" 橫向為 1366px，此上限在所有 iPad 上完全不生效、行為不變，只約束桌機。左欄改用 `%` 是因為版面限寬後，`vw`（以視窗計）會與限寬版面脫鉤，改以容器百分比才能與版面一起縮放；最小值 280px 經檢查左欄內容（truncate、彈性按鈕）不會擠壞。
- 影響範圍：`Prototype/src/pages/AddWordPage.tsx`（僅 className）；左欄實際寬度 1920px 桌機由 461px 變約 317px、1366px iPad Pro 橫向由 328px 變約 292px、1024px iPad 橫向由 320px 變 280px。手機抽屜式單字列表與 640px 斷點行為不變。
- 測試：`npm run build`、`npm run lint` 通過；桌機寬螢幕限寬置中與左欄比例的實際視覺待人工確認。
- 相關檔案：`Prototype/src/pages/AddWordPage.tsx`
- 取代關係：無。

## 2026-07-15

### LOG-20260715-01｜修復 iPad Scribble 書寫後手指點擊無法叫出鍵盤

- 類型：重大 Bug
- 狀態：已實作，使用者實機確認有效
- 摘要：新增單字頁輸入框（`WordCaptureInput.tsx`）在 iPad 上，配對 Apple Pencil 的裝置一旦用 Pencil（Scribble）在該欄位寫過字，之後即使清空欄位內容，用手指點擊也無法再叫出螢幕鍵盤，只顯示精簡的鍵盤輔助工具列（還原／語言切換／展開鍵盤／聽寫／換行），且點工具列上的展開鍵盤按鈕也無反應；只有整頁重新整理才會恢復正常。已修正：偵測該欄位最近一次互動的 `pointerType`，若為 `'pen'`，在欄位 `blur`（書寫結束、失焦）時把 textarea 的 `key` 換新值，強制 React 重建底層 DOM 節點（不清空使用者已輸入的文字，因為內容由外部 state 控制），模擬「重新整理」的重置效果，讓下一次手指點擊能正常叫出鍵盤。
- 原因或決策：這是 iPadOS／WebKit 對「已接收過 Scribble 輸入的特定 DOM 元素」的內部鍵盤顯示偏好造成，屬於系統行為，網頁無法透過 HTML 屬性或一般 JS API 直接覆蓋；只能用「讓瀏覽器把該元素視為全新節點」的方式間接繞過，因此選擇在書寫結束離開焦點時才觸發重建（不在書寫過程中打斷使用者）。
- 影響範圍：`Prototype/src/components/WordCaptureInput.tsx`（新增 `textareaInstanceKey` state、`onPointerDown`／`onBlur` 偵測邏輯，textarea 的自動增高 `useLayoutEffect` 依賴加入該 key）。
- 測試：`npm run build`、`npm run lint` 通過；使用者於實機（配對 Apple Pencil 的 iPad，透過 cloudflared tunnel 存取）重現原始問題並確認此修正解決該問題。
- 已知風險：修正邏輯依賴 Pointer Events 的 `pointerType === 'pen'` 判斷，若未來有其他觸控筆或裝置回報不同的 `pointerType` 值，可能偵測不到；此修正僅處理「書寫後手指點不出鍵盤」，未處理鍵盤工具列上「展開鍵盤」按鈕本身無反應的系統層級問題（該按鈕行為超出網頁可控範圍）。
- 相關檔案：`Prototype/src/components/WordCaptureInput.tsx`
- 取代關係：無。

### LOG-20260715-02｜新增單字頁「目前討論」改為單一單字狀態，AI 回覆改為無框敘述樣式

- 類型：決策／實作
- 狀態：已實作
- 摘要：
  1. `contextCards: Card[]`（可累積多張參考字卡的清單）拿掉，改成單一「目前討論」狀態：直接沿用既有的 `word`／`selectedPartOfSpeech` 狀態，從單字列表拖曳或點擊「討論」既有字卡時，會把該字卡的單字／詞性寫回 `word`／`selectedPartOfSpeech`（並清空前一個單字尚未儲存的 sense 草稿），跟輸入框打字辨識出的單字共用同一條路徑，確保任何時候「目前討論」只會有一個單字，且會隨對話自動更新為最新判斷出的單字。
  2. 「目前討論」卡片從原本混在可捲動內容裡的清單，改成固定在 AI 對話區塊最上方的釘選卡片，拿掉「目前討論」標題文字，單字字級改為 20px，詞性標籤補上外框樣式；卡片依 `word`／`resolvedPartOfSpeech` 及比對到的既有字卡 sense 即時呈現，並提供關閉按鈕清除目前討論。
  3. AI 回覆訊息改為無外框、無底色的純敘述文字（比照 Claude／ChatGPT 的回應樣式），使用者訊息維持原本的色塊泡泡；單字卡片候選預覽與詞性選擇提示等互動式區塊維持卡片容器，不受影響。
  4. 對話訊息之間距離加大（`space-y-3`→`space-y-5`）、對話文字字級改為 16px，改善無外框敘述文字的閱讀擁擠感。
- 原因或決策：使用者認為新增單字頁一次應該只圍繞一個單字討論，且「目前討論」應該依對話自動更新，而不是允許同時堆疊多張參考字卡；此設計同時簡化了狀態管理（不再需要獨立的 `contextCards` 陣列與其增減邏輯），讓「輸入框打字辨識出的單字」與「從單字列表帶入的既有單字」統一走同一條狀態路徑。AI 回覆改為無框敘述樣式則是使用者要求比照主流 AI 助理（Claude／ChatGPT）的呈現方式，與新單字卡候選等結構化互動內容做區隔。
- 影響範圍：`Prototype/src/pages/AddWordPage.tsx`（移除 `contextCards` state，新增 `currentDiscussionCard` 衍生值與 `handleClearTopic`，`handleDiscussCard` 改寫路徑，dev demo 資料同步調整）、`Prototype/src/components/AiConversationFeed.tsx`（props 由 `contextCards`／`onDismissContextCard` 改為 `currentDiscussionCard`／`onClearTopic`，訊息與釘選卡片版面重寫）。
- 測試：`npm run build`、`npm run lint` 通過；`curl /add` HTTP 200。因無瀏覽器自動化工具，拖曳／點擊帶入既有字卡後「目前討論」是否正確更新、切換單字時舊 sense 草稿是否正確清空、AI 訊息無框樣式的實際閱讀體感，皆尚未瀏覽器人工驗證。
- 已知風險：`handleDiscussCard` 切換目前討論單字時會清空使用者尚未送出的 sense 草稿欄位（詞義／使用情境／例句／例句翻譯／備註），若使用者在切換前已填寫一半內容且未預期會被清空，可能造成困惑；目前未做二次確認提示。
- 下一步：使用者實機／瀏覽器測試新的單一討論狀態切換與 AI 敘述樣式；評估是否需要在切換目前討論單字、且有未儲存草稿時加提示。
- 相關檔案：`Prototype/src/pages/AddWordPage.tsx`、`Prototype/src/components/AiConversationFeed.tsx`
- 取代關係：取代 `LOG-20260714-03`／`LOG-20260714-01` 中「AI 討論區塊可帶入多張參考字卡（`contextCards` 陣列）」的設計，改為單一「目前討論」狀態；三欄／兩欄版面與 640px 斷點等其餘決策不受影響。

### LOG-20260715-03｜Sense 資料模型移除「使用情境」欄位

- 類型：決策／實作
- 狀態：已實作
- 摘要：`Sense` 移除 `usageContext` 欄位，新增／編輯 sense 只需填寫中文意思、例句、例句中文翻譯（備註選填），單字詳情頁、單字卡片預覽、單字列表展開卡片等所有顯示與編輯介面同步移除對應欄位與驗證。
- 原因或決策：使用者要求從單字資訊架構中移除「使用情境」，影響單字詳情、單字卡片預覽、單字列表卡片等多處呈現。
- 影響範圍：`Prototype/src/types/sense.ts`（移除欄位定義）、`Prototype/src/lib/repositories/senseRepository.ts`（`CreateSenseInput`／`createSense`）、`Prototype/src/lib/parseFreeformWordInput.ts`（移除規則式解析對應分支）、`Prototype/src/lib/devSeed.ts`（移除 `SeedSense` 欄位與 45 筆假資料內容）、`Prototype/src/components/AiConversationFeed.tsx`、`Prototype/src/components/SenseSection.tsx`、`Prototype/src/components/WordListPanel.tsx`、`Prototype/src/pages/AddWordPage.tsx`（state、必填驗證、`createSense` 呼叫、AI 自動分流回覆訊息、dev demo 資料）；`Prototype/src/lib/db.ts` 的 Dexie schema 未索引此欄位，不需要 schema 版本升級。`LexiCard_PRD.md` 第 3.2／3.3／4／8 章對應段落與欄位表已同步移除。
- 測試：`npm run build`、`npm run lint` 通過；`curl /` 與 `curl /add` 皆 HTTP 200。因無瀏覽器自動化工具，單字詳情頁新增／編輯 sense 表單、單字卡片預覽、單字列表展開內容的實際呈現尚未瀏覽器人工驗證。
- 已知風險：資料庫中既有（若使用者先前已建立過）的舊 sense 紀錄仍可能殘留 `usageContext` 屬性於 IndexedDB 儲存的 JSON 中（Dexie 不會自動清除未宣告欄位），僅是不再被程式讀取／顯示，不影響功能；此為開發階段 MVP，尚無正式使用者資料，暫不處理歷史資料清理。
- 下一步：使用者於瀏覽器測試單字詳情頁、新增單字頁、單字列表的 sense 顯示與編輯表單皆已正確移除使用情境欄位。
- 相關檔案：`Prototype/src/types/sense.ts`、`Prototype/src/lib/repositories/senseRepository.ts`、`Prototype/src/lib/parseFreeformWordInput.ts`、`Prototype/src/lib/devSeed.ts`、`Prototype/src/components/AiConversationFeed.tsx`、`Prototype/src/components/SenseSection.tsx`、`Prototype/src/components/WordListPanel.tsx`、`Prototype/src/pages/AddWordPage.tsx`、`LexiCard_PRD.md`
- 取代關係：取代 `LexiCard_PRD.md` 第 4 章 `Sense` 欄位定義中 `usageContext` 一列，以及第 3.2／3.3 章所有「使用情境」為必填／可編輯欄位的敘述。

## 2026-07-14

### LOG-20260714-01｜新增單字頁改為三欄式介面架構

- 類型：決策／實作
- 狀態：已實作
- 摘要：新增單字頁（`/add`）由原本「AI 討論（含輸入）／畫布輸入」兩欄，改為「單字列表｜AI 對話結果｜輸入框」三欄；手寫畫布與 AI 討論輸入合併為單一輸入框；新增規則式（非真正 AI）輸入分流邏輯；新增從單字列表拖曳或點擊「討論」把既有字卡帶入 AI 對話區塊的互動；手機版改為聊天式堆疊＋可收合單字列表抽屜。
- 原因或決策：使用者直接要求調整新增單字頁介面架構，並在釐清範圍後選擇：(1) 版面調整同時做基本規則式自動判斷，(2) 畫布與討論輸入合併為單一輸入框，(3) 手機採聊天式堆疊＋可收合單字列表。規則式分流（`parseFreeformWordInput.ts`）為 Phase 4 AI Adapter 尚未開始前的暫時方案，之後由真正 AI 語意判斷取代。
- 影響範圍：`Prototype/src/pages/AddWordPage.tsx` 版面與狀態管理；新增 `WordListPanel.tsx`、`AiConversationFeed.tsx`、`WordCaptureInput.tsx`、`parseFreeformWordInput.ts`；刪除 `AiDiscussionPanel.tsx`、`RecentlyAddedWords.tsx`；`icons.tsx` 新增 `ListIcon`／`CloseIcon`；此為專案第一次使用 Tailwind `md:` 響應式斷點。
- 測試：`npm run build`、`npm run lint` 通過；`curl /add` 回應 HTTP 200。因無瀏覽器自動化工具，三欄／手機堆疊版面、拖曳互動、iPad Scribble 尚未實機或瀏覽器人工驗證。
- 已知風險：規則式分流僅能處理單一 sense、單行結構化輸入等簡單情況，複雜或多 sense 輸入仍需人工修正，且尚未與真正 AI 比較準確度；原生 HTML5 拖放在觸控裝置（iPad／手機）可靠性較低，因此保留「討論」按鈕作為主要互動路徑；手機抽屜與三欄斷點切換尚未經實機測試。
- 下一步：使用者於瀏覽器與 iPad／手機實機測試三欄與手機版行為；確認無誤後回頭實作 Phase 4 AI Adapter，屆時以真正 AI 取代 `parseFreeformWordInput.ts` 的規則式邏輯。
- 相關檔案：`Prototype/src/pages/AddWordPage.tsx`、`Prototype/src/components/WordListPanel.tsx`、`Prototype/src/components/AiConversationFeed.tsx`、`Prototype/src/components/WordCaptureInput.tsx`、`Prototype/src/lib/parseFreeformWordInput.ts`
- 取代關係：取代先前「AI 討論（含輸入）／畫布輸入」兩欄版面（原介面骨架已被此版取代，AI 尚未串接的整體狀態不變）。

### LOG-20260714-02｜新增單字頁支援手寫／文字輸入模式切換，斷點統一為 640px

- 類型：決策／實作
- 狀態：已實作
- 摘要：新增單字頁輸入改為可切換「手寫模式」（維持三欄：單字列表｜AI 對話｜畫布輸入）與「文字模式」（兩欄：單字列表｜AI 對話＋精簡輸入框堆疊）；兩模式共用同一份輸入內容，切換不遺失。畫面寬度 640px（Tailwind `sm:`）以下強制文字模式，手寫選項顯示但 disabled；同時把單字列表「常駐欄位／抽屜」的門檻由原本 768px（`md:`）**統一改成 640px**，與手寫模式門檻共用同一個斷點。
- 原因或決策：使用者要求輸入模式可切換，並希望手機自動用文字模式。評估後選擇把 768 與 640 兩個門檻合併成一個（640），避免 640–768 之間出現「單字列表仍是抽屜、但中間內容已經是雙欄」的過渡畫面，且更符合「iPad 起都是完整工作區」的產品定位（見 `LexiCard_PRD.md` 2 節 RWD 使用情境）。切換時輸入內容互通採「兩模式共用同一份 `draft` state」而非手動複製，避免同步邏輯出錯。
- 影響範圍：`Prototype/src/pages/AddWordPage.tsx`（新增 `inputMode`／`effectiveInputMode`／`inputDraft` 狀態，版面 class 由 `md:` 全面改為 `sm:`，grid 欄數依模式動態切換）、`Prototype/src/components/WordCaptureInput.tsx`（改為受控元件，新增 `canvas`／`compact` 兩種樣式）、新增 `Prototype/src/hooks/useMediaQuery.ts`（以 `useSyncExternalStore` 包裝 `window.matchMedia`）。單字列表常駐／抽屜行為的既有斷點（原 768px）已被此次改動取代。
- 測試：`npm run build`、`npm run lint` 通過；`curl /add` HTTP 200。因無瀏覽器自動化工具，實際切換互動、640px 上下的版面表現、輸入內容跨模式沿用、縮小視窗時手寫自動退回文字等，尚未瀏覽器人工驗證。
- 已知風險：`effectiveInputMode` 採「視窗夠寬則用使用者上次選擇、否則強制文字」的推導方式（非用 effect 強制修正 state），使用者在寬螢幕選手寫後縮小又放大視窗，會恢復成手寫模式而非停留文字模式——這是刻意的設計選擇（保留使用者偏好），但尚未經使用者實際體驗確認是否符合預期。
- 下一步：使用者於瀏覽器縮放視窗與 iPad／手機實機測試模式切換、斷點行為與輸入內容沿用是否正常。
- 相關檔案：`Prototype/src/pages/AddWordPage.tsx`、`Prototype/src/components/WordCaptureInput.tsx`、`Prototype/src/hooks/useMediaQuery.ts`
- 取代關係：取代 `LOG-20260714-01` 中「單字列表常駐欄位門檻為 768px（`md:`）」的部分，其餘三欄式架構與規則式輸入分流的決策仍有效、未被取代。

### LOG-20260714-03｜AI 對話與輸入框合併為單一可調整寬度卡片；單字列表改為展開式檢視

- 類型：決策／實作
- 狀態：已實作
- 摘要：
  1. `AiConversationFeed` 與 `WordCaptureInput` 合併成同一個卡片容器（`AddWordPage.tsx` 內單一 `rounded-card border bg-surface` 區塊），手寫模式用 `flex-row`（對話｜可拖曳分隔線｜輸入）、文字模式用 `flex-col`（對話在上、輸入在下）；兩個子元件現在永遠同時掛載，切換模式只改變 flex 方向與尺寸 class，不再有 unmount/remount。
  2. 手寫模式新增可拖曳調整寬度的中間分隔線（Pointer Events + `setPointerCapture` 實作），輸入欄寬度存成 state，依容器實際寬度動態計算上下限，避免對話區或輸入區被拖到消失。
  3. 手寫／文字切換鈕改為「設定」齒輪按鈕＋彈出面板（沿用 `CardActionsMenu.tsx` 的 portal／`fixed` 定位模式），从固定顯示的 pill 開關收進輸入區塊的按鈕列（設定／送出旁），手機（<640px）額外多一顆純 icon 的「單字列表」按鈕（辭典圖示，沿用 `BookIcon`），取代原本頁面上方的獨立文字按鈕列。
  4. `WordListPanel` 卡片互動改為「點擊展開」：展開後顯示該字卡所有 sense（詞義＋使用情境），並提供「查看詳情」（連到 `/cards/:id`）與「AI 討論」兩顆按鈕；原本列上常駐的「討論」按鈕移除，改為展開後才出現，拖曳互動不變。
  5. 版面細節調整：單字列表欄寬 `minmax(220px,18vw)` → 最終 `minmax(320px,24vw)`；手機抽屜寬度 `max-w-xs`（320px 上限）造成與 85vw 設定落差過大，改為 `max-w-[480px]`；手寫模式輸入框邊框／底色改為與文字模式共用同一組樣式（不再用虛線框），對話區與分隔線間距、分隔線與輸入區間距分別微調定案為 4px／8px。
- 原因或決策：使用者提出「同一張卡片＋flex 調整排版」可以更徹底解決模式切換時的元件掛載/卸載問題，比逐一元件切換更乾淨；後續針對單字列表互動、手機版按鈕整併、間距與寬度數值，皆為使用者逐步提出的細節調整，過程中依使用者回饋反覆定案（例如手機抽屜寬度上限、欄寬 vw 數值、scrollbar 與分隔線間距皆多次來回調整，此處僅記錄最終值）。
- 影響範圍：`Prototype/src/pages/AddWordPage.tsx`、`Prototype/src/components/AiConversationFeed.tsx`、`Prototype/src/components/WordCaptureInput.tsx`、`Prototype/src/components/WordListPanel.tsx`、`Prototype/src/components/icons.tsx`（新增 `SettingsIcon`）。
- 測試：`npm run build`、`npm run lint` 每次修改後皆重跑通過；`curl /add` HTTP 200。因無瀏覽器自動化工具，拖曳調整寬度的手感、展開/收合互動、settings 彈出面板定位、手機版按鈕列排版皆尚未實機／瀏覽器人工驗證。
- 已知風險：拖曳寬度的上下限僅在拖曳當下即時量測容器寬度，尚未測試視窗大小改變後（例如拖曳中同時旋轉裝置）是否會有邊界情況；`WordListPanel` 多卡片同時展開為各自獨立狀態（非手風琴單選），大量字卡同時展開時的捲動體驗尚未驗證。
- 下一步：使用者於瀏覽器與 iPad／手機實機測試本次所有互動（拖曳調整寬度、單字列表展開查看 sense、設定彈出面板、手機輸入列三顆按鈕）。
- 相關檔案：`Prototype/src/pages/AddWordPage.tsx`、`Prototype/src/components/AiConversationFeed.tsx`、`Prototype/src/components/WordCaptureInput.tsx`、`Prototype/src/components/WordListPanel.tsx`、`Prototype/src/components/icons.tsx`
- 取代關係：取代 `LOG-20260714-01`／`LOG-20260714-02` 中「AI 對話與輸入框為兩個獨立區塊、依模式條件式渲染」的版面實作（三欄／兩欄的視覺分類與 640px 斷點決策仍有效，未被取代，只是底層改用單一卡片＋flex 方向實現）。

## 2026-07-13

### LOG-20260713-01｜重整專案紀錄文件治理

- 類型：文件決策
- 狀態：已實作
- 摘要：統一 `AGENTS.md`、`Log.md` 與 `handoff.md` 的職責、更新條件及固定格式，並將 `session_handoff.md` 更名為 `handoff.md`。
- 原因或決策：PRD、歷史紀錄與目前狀態原先大量重複，造成 handoff 過長、Log 日期與事件層級不一致。往後由 PRD 管現行規格、MVP Task Breakdown 管執行計畫、Log 管歷史原因、handoff 管目前快照。
- 影響範圍：專案 session 啟動、文件更新頻率、規格衝突處理、context 壓縮檢查點與交接流程。
- 已知風險：Codex context 壓縮只有在產品能辨識壓縮事件或另設 lifecycle hook 時，才能可靠自動觸發文件更新。
- 相關檔案：`AGENTS.md`、`Log.md`、`handoff.md`、`docs/archive/session_handoff_legacy_2026-07-13.md`
- 取代關係：取代舊有「每次重大變更及長 session 均頻繁更新兩份紀錄」的寬鬆規則。

---

**舊格式歷史說明：**以下內容建立於新格式採用前，保留原文作為歷史脈絡；後續不必逐條回填識別碼。

## 2026-07-03

### 專案管理規則

- 專案已統一以 `Log.md` 作為唯一迭代紀錄檔。
- 後續 PRD 修改或功能開發時，需同步在 `Log.md` 補上變更紀錄。
- 紀錄目的為協助換工具、換 thread 或重新接手時快速理解目前任務、進度與決策脈絡。
- 已在 `AGENTS.md` 補充新 session 啟動規則：每次開啟新 session 需自動讀取專案啟動腳本或 agent notes、`Log.md` 與 `LexiCard_PRD.md`，必要時同步讀取 `handoff.md`（原名 `session_handoff.md`）。
- 已建立開發 session 切分規則：PRD 中的開發 phase 需再拆成較小任務，每一任務以一個 focused session 進行，並在有實質進展時記錄任務邊界、輸出、狀態與下一步。
- 已建立測試流程規則：每次功能開發需搭配該功能的人為單元測試，並在 `Log.md` 記錄測試範圍、結果、剩餘風險或後續事項。
- 已建立 `handoff.md` 定期維護規則（原檔名 `session_handoff.md`）：長 session、重要里程碑、PRD 或實作大幅變更、下一步或 blocker 改變、上下文或額度接近不足時，需更新交接摘要，避免突然中斷後難以轉交其他工具或 session。

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

### Phase 5　新增單字（僅非 AI 部分，Phase 4 暫緩、跳過先做）＋畫布/AI討論/已新增單字三區塊佈局

- 修改摘要：使用者明確要求先跳過 Phase 4（AI Adapter 層與 Gemini 串接，尚未開始），直接進行 Phase 5（新增單字）。由於 Phase 5 任務中「文字輸入 AI 辨識」「AI 生成字卡內容預覽」「AI 討論區」「AI 延伸單字建議」皆直接依賴尚未存在的 AI Adapter，經 `AskUserQuestion` 確認處理方式後，先實作不依賴 AI 的部分；隨後使用者再要求把介面改為更貼近 PRD 3.2 節「自由工作區」樣貌（畫布手寫建立單字、AI 討論區塊、已新增單字檢視區塊），AI 功能本身仍不串接、僅先建立介面骨架，並要求 AI 討論區塊模擬「已有對話資料」的情境（而非空的殼子）。本節為兩輪合併後的最終狀態。
- 事前以 `EnterPlanMode` 完整規劃兩次（第一次為非 AI 部分的重複判斷邏輯設計；第二次為三區塊佈局設計，含一次 Explore 探索畫布/canvas 相關套件與既有清單樣式、一次 Plan agent 設計方案），皆經使用者核准後才動工。
- **本節記錄過程中的重要插曲**：`AddWordPage.tsx`、`cardRepository.ts` 新增的 `findCardsByNormalizedWord`，以及對應的 Log.md／handoff.md 記錄，在寫入磁碟後的某個時間點消失、回退成更早的版本（重新 Read 時發現）。已用 `git reflog` 確認排除是 git commit/reset/checkout 造成（這個 repo 只有 3 個 commit，reflog 全程沒有任何 reset 動作），確認純屬本專案已知的「編輯偶爾靜默回退」問題，與 git 無關。因此本節等同重做一次，並在重做後逐一用 Read 確認每個檔案落地。
- 影響範圍：
  - `Prototype/src/lib/repositories/cardRepository.ts`：新增 `findCardsByNormalizedWord(word): Promise<Card[]>`，回傳所有共用同一 `normalizedWord` 的字卡（同一單字可能有多張不同詞性的 Card）。既有的 `findCardByNormalizedWord`（只回傳第一筆、忽略詞性，供 `RelationSection.tsx` 手動關聯查找使用）維持不變。
  - `Prototype/src/pages/AddWordPage.tsx`：從 Phase 0 留下的最簡 stub 全面改寫。核心重複判斷三分支邏輯（依 PRD 3.2 節「重複判斷」規則）：
    1. **全新單字，或同單字不同詞性**：`findCardsByNormalizedWord` 找不到詞性也相符的既有卡 → 視為全新 Card，直接 `createCard` + `createSense`（`isPrimary: true`），無任何懲罰或提示，導向新字卡。
    2. **同單字同詞性、輸入的中文意思已涵蓋於既有 sense**（trim 後完全相同字串比對）：不新增 sense，直接 `updateCard` 套用 `repeatCount +1` 與 `familiarityScore` `duplicateExistingSense`（-15，經 `clampFamiliarityScore` 夾住），無需確認，導向既有字卡。
    3. **同單字同詞性、中文意思代表新的 sense**（不匹配既有任何 sense）：需二次確認——沿用 `SenseForm` 已建立的「`pendingXxxConfirm` 布林值 + 內嵌提示 banner + 按鈕文字切換」兩段式送出模式（`pendingNewSenseConfirm`），第一次送出僅顯示提示「此單字已存在，此語境將新增為新詞義，是否仍要新增？」，不寫入任何資料；第二次送出才真正 `updateCard`（`repeatCount +1`、`familiarityScore` `duplicateNewSense` -5）+ `createSense`（`isPrimary: existingSenses.length === 0` 防禦性判斷），導向既有字卡。`pendingNewSenseConfirm` 在單字／詞性／中文意思任一欄位變更時重置為 `false`。
    - 詞性比對採 `.trim().toLowerCase()`，兩個既有字卡分支皆將 `repeatCount` 與 `familiarityScore` 合併成單一次 `updateCard` 呼叫。
  - **介面佈局（第二輪，取代原本單純表單版）**：頁面由上而下改為四區塊：
    1. **畫布區**（單字）：原本的「單字」`LabeledInput` 改為大型 `<textarea>`（`rows={3}`，虛線邊框 `border-2 border-dashed`、大字級 `text-3xl`，placeholder「在此手寫或輸入單字」），視覺做成空白紙張／畫布樣式；詞性／音標維持原本的 `LabeledInput`，同區塊內。選用 textarea 而非真正的 `<canvas>` 繪圖元素，因為 iPadOS Scribble 只認得真正的文字輸入元素，這樣現在就能直接用手寫轉文字，不需要等 AI/OCR（專案目前完全沒有畫圖/手寫套件，也沒有 textarea/contentEditable 先例，已用 Explore agent 確認）。
    2. **AI 討論區**（新元件 `src/components/AiDiscussionPanel.tsx`）：純介面殼子，AI 功能不串接。依使用者要求，改為顯示一組**模擬已有對話紀錄**的假資料（`MOCK_MESSAGES` 陣列，4 則來回訊息，圍繞示範單字「set」的詞性/例句討論），使用者訊息靠右（`bg-accent text-paper`）、AI 訊息靠左（`bg-paper-deep text-ink`）的聊天氣泡樣式；輸入框與送出按鈕維持 `disabled`，避免使用者誤以為真的可以送出訊息（送出按鈕借用既有 `PlusIcon` 旋轉 45 度充當占位圖示，未新增圖示）。
    3. **內容表單**（既有詞義表單，重新標示為「AI 生成預覽」區塊的手動替代版）：標題改為「AI 生成預覽」，下方加一行「AI 尚未串接，請先手動填寫」；欄位（中文意思/使用情境/例句/例句翻譯/備註）與驗證邏輯不變，未來 AI 串接後把這裡換成/補上 AI 預先生成的內容即可。
    4. **已新增單字**（新元件 `src/components/RecentlyAddedWords.tsx`）：頁面最下方，用 `useLiveQuery` + Dexie 原生 `db.cards.orderBy('createdAt').reverse().limit(5).toArray()` 顯示全域最近建立的 5 張字卡（非僅本次 session 建立），點擊項目導向 `/cards/:id`；這是專案第一次使用 Dexie 原生 `orderBy`/`limit`（先前都是整表 `toArray()` 後在記憶體排序，如 `cardLibraryQuery.ts`），效能更好、寫法更直接，適合「只要前 N 筆」的場景，之後有類似需求可比照。
  - 未新增獨立共用元件處理內容表單：`SenseForm` 本身即內嵌於 `SenseSection.tsx` 而非獨立檔案，`AddWordPage` 表單形狀相近、單一用途，沿用相同慣例寫在頁面檔案內；但兩個全新概念（AI 討論、已新增單字列表）因功能獨立、未來會各自擴充，各自抽成獨立元件檔案。
  - 未提供返回連結：`/add` 是底部導覽固定分頁，非鑽入後的子頁面，無「返回」語意，與 `CardDetailPage` 不同。
- 驗證：`npm run build`（`tsc -b`）、`npm run lint`、`prettier --check .` 皆通過（過程中 `prettier --check` 抓到 import 換行與 class 換行問題，以 `--write` 修正後重新確認一致）；每次結構性 Edit 後皆先用 Read 重新確認磁碟內容再驗證。因環境無瀏覽器自動化工具，以下情境待使用者於 `npm run dev` 手動測試並回報：(1) 畫布輸入是否正常（含 iPad 上 Scribble 手寫轉文字，如方便測試）；(2) 全新單字、同單字不同詞性、中文意思重複於既有 sense、中文意思為新 sense 的兩段式確認、必填驗證，重複判斷三分支邏輯是否維持正常運作；(3) AI 討論區塊的模擬對話呈現與 disabled 輸入框/按鈕；(4) 已新增單字清單是否正確顯示最近建立的字卡並可點擊進入詳情頁。
- 目前進度：Phase 5 非 AI 部分邏輯 + 三區塊佈局（含模擬 AI 對話）程式碼與建置驗證完成，等待使用者實機測試回饋。
- 下一步：使用者測試確認無誤後，AI 依賴項目（辨識主要單字、AI 生成內容預覽、AI 討論區真正串接、AI 延伸單字建議、iPad Scribble 手寫實機測試）留待 Phase 4（AI Adapter 層與 Gemini 串接）完成後再回頭補上；Phase 4 本身仍待使用者提供/設定 Google Gemini API Key。

### 新增單字頁改為左右兩欄佈局：左 AI 討論（內嵌生成預覽）、右畫布＋已建立單字卡列表

- 修改摘要：使用者要求把上一輪的直向四區塊佈局改為左右兩欄，右區塊比例偏大；左區塊為 AI 討論，且討論過程中要包含生成預覽（而非分開的獨立表單）；右區塊為畫布，右上方顯示已建立之單字卡列表。執行前先用 `AskUserQuestion` 確認「討論過程中也包含生成預覽」的整合方式，使用者選擇「內容欄位直接嵌入聊天氣泡中」（而非兩張卡片上下堆疊在同一欄）。
- 影響範圍：
  - `Prototype/src/pages/AddWordPage.tsx`：外層容器加寬為 `max-w-5xl`（原本 `max-w-2xl` 在雙欄下太窄）；`<form>` 改為 `grid grid-cols-[2fr_3fr] gap-4 items-start`（左欄 2 份、右欄 3 份，右邊比例偏大）。左欄放 `<AiDiscussionPanel>`（改吃 props，見下）；右欄依序放 `<RecentlyAddedWords />`（已建立單字卡列表，移到本欄最上方）與畫布卡片（單字 textarea + 詞性/音標 `LabeledInput`，內容不變）。原本獨立的「AI 生成預覽」`<section>` 與底部送出按鈕整段移除，改由 `AiDiscussionPanel` 內部渲染；`AddWordPage` 改為把中文意思/使用情境/例句/例句翻譯/備註的 state 與 setter（含 `chineseMeaning` 變更時重置 `pendingNewSenseConfirm` 的邏輯）、`isRequiredFilled`、`pendingNewSenseConfirm` 都透過 props 往下傳。`handleSubmit` 邏輯完全不變，仍掛在最外層 `<form onSubmit>` 上，送出按鈕雖然現在渲染在 `AiDiscussionPanel` 內部，但因為是同一個 `<form>` 的後代元素、`type="submit"`，觸發送出的行為不受影響。
  - `Prototype/src/components/AiDiscussionPanel.tsx`：改為接收 11 個 props（5 個內容欄位的 value/onChange、`isRequiredFilled`、`pendingNewSenseConfirm`）。原本 4 則模擬對話訊息維持不變（僅微調最後一則 AI 回覆的措辭，改成呼應「內容已幫你填進下面的預覽」），對話串列表最後新增一個「AI 訊息樣式」的卡片（`bg-paper-deep` 圓角卡、靠左對齊、寬度 92%），裡面放「AI 生成預覽」小標題＋說明文字＋5 個 `LabeledInput`＋（有重複新 sense 情境時的）確認提示＋送出按鈕（`type="submit"`），視覺上讓生成預覽讀起來像是 AI 對話串裡的最後一輪回覆，而不是分開的表單區塊。
- 目前進度：左右兩欄佈局＋生成預覽嵌入對話氣泡皆已完成並通過建置驗證，`handleSubmit` 三分支重複判斷邏輯未變。
- 下一步：等待使用者於 `npm run dev` 確認兩欄比例、AI 討論串內嵌生成預覽的呈現、已建立單字卡列表移到右上方後的效果；其餘同上一則 Phase 5 條目的下一步（等待確認後續進 Phase 4）。

### 已建立單字卡列表改為橫向捲動卡片列，外層加色塊容器

- 修改摘要：使用者要求「已新增單字」列表改為水平滑動，並用一個色塊把單字卡片包在裡面，比照 Phase 3 詞義/關聯單字列表已建立的橫向捲動卡片列慣例。
- 影響範圍：`Prototype/src/components/RecentlyAddedWords.tsx` 改寫：
  - 外層 `<section>` 改為色塊容器 `rounded-card bg-paper-deep p-4`（區別於卡片本身的 `bg-surface`，形成「色塊裡放卡片」的視覺層次）。
  - 卡片列表由原本的垂直 `<ul>` 改為橫向捲動 `<div>`（`-mx-4 px-4 scroll-px-4`、`overflow-x-auto snap-x snap-mandatory`、12px 邊緣淡出遮罩、隱藏捲軸），每張卡片 `w-40 shrink-0 snap-start rounded-card bg-surface p-3 shadow-sm`，沿用 Phase 3 詞義/關聯單字列表已驗證過的 `useSnapAlign`／`useHorizontalWheelScroll`／`useDragToScroll` 三個 hook（捲動吸附校正、滑鼠滾輪橫向捲動、滑鼠拖曳捲動），深度／內距數值改用這個元件自己的 `p-4`（16px）而非頁面層級的 `px-5`（20px），因為此元件現在是巢狀在兩欄 grid 裡、不是直接貼齊頁面邊緣。
  - 三個 hook 皆依此專案已知的慣例傳入 `[cards?.length ?? 0]` 作為 deps（`useLiveQuery` 非同步載入完成、資料筆數從 0 變有值時，effect 需要重新執行才能抓到剛掛載的 DOM 元素，此為 Phase 3 踩過的真實 bug，這裡直接套用避免重蹈覆轍）。
- 驗證：`npm run build`／`npm run lint`／`prettier --check .` 皆通過；結構性 Edit 後已用 Read 重新確認磁碟內容。
- 目前進度：已建立單字卡列表改為橫向捲動＋色塊容器，完成並通過建置驗證。
- 下一步：等待使用者實機確認橫向捲動手感（含桌機滑鼠拖曳/滾輪、iPad 觸控）與色塊視覺效果；其餘同上一則 Phase 5 條目。

### 新增單字頁改為固定高度雙欄、內容各自捲動（平板/電腦設計）

- 修改摘要：使用者要求以平板/電腦為設計目標，將左右兩欄固定高度、內容在欄位內部捲動，而非讓整個頁面往下捲；並明確指出 AI 討論欄要垂直捲動。同時移除頁面最上方的「新增單字」標題，左欄改設最小寬度 320px。
- 影響範圍：
  - `Prototype/src/pages/AddWordPage.tsx`：移除 `<h1>新增單字</h1>` 標題；`<form>` 的 grid 容器改為 `h-[calc(100svh-9.5rem)]`（固定高度，9.5rem 為估算的頁面上下 padding 與底部導覽列高度總和，實際數值待使用者實機檢視後可能需要微調）、`items-stretch`（原為 `items-start`，讓兩欄都撐滿這個固定高度）、`grid-cols-[minmax(320px,2fr)_3fr]`（左欄最小寬度 320px，兩欄比例維持 2:3）。右欄外層 wrapper 加上 `h-full min-h-0 overflow-y-auto`，讓「已建立單字卡列表＋畫布」這兩塊內容在固定高度的欄位內自行垂直捲動。
  - `Prototype/src/components/AiDiscussionPanel.tsx`：整個元件從單純的 `space-y-3` 區塊改為 `flex h-full min-h-0 flex-col` 三段式結構——標題 `shrink-0` 固定在頂部、訊息串（含內嵌的「AI 生成預覽」表單）改為 `flex-1 min-h-0 overflow-y-auto` 在中間垂直捲動、對話輸入框/送出按鈕 `shrink-0` 固定在底部，形成類似一般聊天 App 的「標題固定＋訊息可捲動＋輸入框固定」版面。
  - 技術要點：flex 子項要能正確 `overflow-y-auto` 捲動，必須同時加上 `min-h-0`（flex item 預設 `min-height: auto` 會依內容撐開、蓋掉 `flex-1` 想要的固定高度限制，導致捲動失效），本次在 `AiDiscussionPanel` 的外層 `<section>` 與內層訊息串 `<div>`、以及 `AddWordPage` 右欄 wrapper 皆加上 `min-h-0`。
- 驗證：`npm run build`／`npm run lint`／`prettier --check .` 皆通過；每次結構性 Edit 後皆先用 Read 重新確認磁碟內容再驗證。因環境無瀏覽器自動化工具，固定高度的精確數值（`9.5rem`）與捲動手感待使用者於平板/桌機瀏覽器實機確認，若高度估算有誤差（例如底部被裁切或留白過多）需要再微調。
- 目前進度：固定高度雙欄＋各自內部捲動已完成並通過建置驗證。
- 下一步：等待使用者確認固定高度數值是否需要微調、AI 討論欄垂直捲動與右欄捲動的實際手感；其餘同上一則 Phase 5 條目。

### 右下畫布 textarea 改為填滿剩餘高度

- 修改摘要：使用者要求右下區塊的畫布（單字輸入 textarea）高度改為 filled（填滿可用空間），而非固定 `rows={4}`。
- 影響範圍：`Prototype/src/pages/AddWordPage.tsx` 右欄整體改為 flex 直向排列（`flex h-full min-h-0 flex-col gap-4`）：已建立單字卡列表固定自身高度（`shrink-0`）在上；下方畫布卡片 `<section>` 改為 `flex min-h-0 flex-1 flex-col`，吃掉扣除列表後的剩餘高度；卡片內部再分三段——標題 `shrink-0`、畫布 textarea 的外層 wrapper `flex min-h-0 flex-1 flex-col`（label `shrink-0` + textarea 本身 `flex-1`，移除原本固定的 `rows={4}`，改由 flex 撐滿）、詞性/音標兩個 `LabeledInput` 維持 `shrink-0` 排在最下方。同樣需要在每一層加 `min-h-0`（前一輪已記錄的 flex 捲動/撐高慣例）textarea 才能真的撐到底而不是被內容高度卡住。
- 驗證：`npm run build`／`npm run lint`／`prettier --check .` 皆通過；結構性 Edit 後已用 Read 重新確認磁碟內容。
- 目前進度：畫布 textarea 已改為 flex-1 填滿右欄扣除列表後的剩餘高度，完成並通過建置驗證。
- 下一步：等待使用者實機確認畫布高度填滿效果；其餘同上一則 Phase 5 條目。

### 新增單字頁 main 區塊置中修正

- 修改摘要：使用者截圖回報新增單字頁的雙欄區塊沒有置中，明顯偏左。
- 內容：`Prototype/src/pages/AddWordPage.tsx` 外層容器由 `mx-auto max-w-5xl` 改為 `mx-auto w-full max-w-5xl`，補上明確的 `w-full`——這是 Tailwind `mx-auto` + `max-w-*` 置中的標準寫法，避免元素在某些父層情境下寬度判定不明確導致置中失效。
- **已知限制**：這是最直接、風險最低的修正，但無法排除真正根因是「頁面某處有水平溢位、導致可捲動內容比視窗寬，使置中基準跟著跑掉」——這種情況只能透過瀏覽器 DevTools 實際檢查（本環境無瀏覽器自動化工具）。若使用者套用此修正後畫面仍偏左，麻煩截圖或用 DevTools 檢查是否有水平捲軸／哪個元素寬度超出視窗，再回報進一步排查。
- 驗證：`npm run build`／`npm run lint`／`prettier --check .` 皆通過；結構性 Edit 後已用 Read 重新確認磁碟內容。
- 目前進度：已套用標準置中寫法修正，待使用者確認是否解決。
- 下一步：等待使用者確認置中效果；其餘同上一則 Phase 5 條目。

### 新增單字頁移除限寬，改為撐滿

- 修改摘要：使用者詢問新增單字頁是否有限寬設定，確認後（`max-w-5xl`＝1024px）要求移除限制、讓頁面撐滿視窗寬度，取代上一則的置中修正方向。
- 內容：`Prototype/src/pages/AddWordPage.tsx` 外層容器由 `mx-auto w-full max-w-5xl` 改為 `w-full`（移除 `mx-auto` 與 `max-w-5xl`），僅保留 `px-5 pt-6 pb-10` 內距，雙欄區塊會撐滿到視窗寬度（扣除左右各 20px 內距）。
- 驗證：`npm run build`／`npm run lint`／`prettier --check .` 皆通過；結構性 Edit 後已用 Read 重新確認磁碟內容。
- 目前進度：已移除限寬，頁面改為撐滿視窗。
- 下一步：等待使用者確認撐滿後的視覺效果（尤其超寬螢幕下兩欄比例是否仍合適）；其餘同上一則 Phase 5 條目。

### 新增單字頁左右兩欄比例改為 1:3

- 修改摘要：使用者要求左右兩欄寬度比例改為 1:3（原為 2:3）。
- 內容：`Prototype/src/pages/AddWordPage.tsx` 的 `grid-cols-[minmax(320px,2fr)_3fr]` 改為 `grid-cols-[minmax(320px,1fr)_3fr]`，左欄最小寬度 320px 維持不變。
- 驗證：`npm run build`／`npm run lint`／`prettier --check .` 皆通過；結構性 Edit 後已用 Read 重新確認磁碟內容。
- 目前進度：兩欄比例已改為 1:3。
- 下一步：等待使用者確認新比例視覺效果；其餘同上一則 Phase 5 條目。

### 新增單字頁高度改用 h-full 逐層繼承（含一次靜默回退再修正）＋移除底部多餘留白

- 修改摘要：使用者要求外層容器（`w-full px-5 pt-6 pb-10`）撐滿螢幕高度（扣除底部導覽列）。過程中發現前一次已套用的 `h-full` 修正（連同對應的 Log 記錄）又一次靜默消失、回退成更早版本（重新 Read 才發現，`<div>` 又變回沒有 `h-full`、`<form>` 又變回 `h-[calc(100svh-9.5rem)]`），本節等同重做一次並補齊記錄。
- 高度計算鏈說明（供後續參考）：`App.tsx` 的 `<main className="flex-1 pb-[calc(72px+env(safe-area-inset-bottom))]">` 因為 `NavBar` 是 `position: fixed`（不佔版面），`main` 是 `flex min-h-svh flex-col` 容器裡唯一參與排版的項目，會撐滿整個視窗高度；`main` 自己的 `pb-[72px+safe-area]` 是特意保留給固定在底部的 `NavBar`（避免內容被蓋住）。`AddWordPage` 根 `<div>` 用 `h-full` 直接繼承 main 扣掉這段 padding 後的高度，逐層往下（`<div>` → `<form>`）都用 `h-full` 才能正確拿到「扣除導覽列後的可用高度」，不需要用猜測的 `calc(100svh-9.5rem)` 魔術數字。
- 內容：
  - `Prototype/src/pages/AddWordPage.tsx` 根 `<div>` 加回 `h-full`；`<form>` 的高度由 `h-[calc(100svh-9.5rem)]` 改回 `h-full`。
  - 順帶處理使用者前一輪回報的「下方間距比較多」問題：根因是 `<div>` 自己的 `pb-10`（40px）內距吃掉了 `h-full` 撐出來的高度，讓 `<form>` 內容沒有真正貼齊到底（`pb-10` 是沿用單字庫/單字詳情頁「一般會捲動的頁面」的底部留白慣例，但新增單字頁現在是固定高度版面，不需要這段留白）。改為 `pb-4`（16px，保留一點點呼吸空間，不完全貼死）。
- 驗證：`npm run build`／`npm run lint`／`prettier --check .` 皆通過；結構性 Edit 後已用 Read 重新確認磁碟內容。
- 目前進度：高度改用 `h-full` 逐層繼承，底部留白從 `pb-10` 縮小為 `pb-4`。
- 下一步：等待使用者確認畫面是否已撐滿到導覽列上緣、底部留白是否合適；因本節記錄過程中再次遇到「編輯靜默回退」，後續每一輪修改都要更提高警覺、每次都重新 Read 確認再回報完成。其餘同上一則 Phase 5 條目。

### 修正 main 缺少 min-h-0 導致新增單字頁仍需要整頁捲動的根本問題

- 修改摘要：使用者在 iPad 實機（透過 Cloudflare Tunnel）測試新增單字頁，回報畫面應該完全填滿可視區域、不應該出現捲動，但實際上內容被裁切、需要整頁往下捲才能看到底部（截圖標註紅框為預期應完整顯示的範圍）。
- 根因：`App.tsx` 的 `<main className="flex-1 pb-[...]">` 缺少 `min-h-0`。flex item 預設 `min-height: auto`，會依內容的自然高度撐開；`AddWordPage` 內部雖然整條都用 `h-full` 逐層繼承高度，但最外層的 `<main>` 本身若沒有 `min-h-0`，一旦內容想要的高度超過 flex-grow 原本分配的空間，`main` 就會被內容撐高，連帶讓最外層 `flex min-h-svh flex-col` 容器一起變高，超出原本 100svh 的視窗高度，逼得整個網頁（而非個別欄位內部）需要捲動——這正是這幾輪一路在 `AddWordPage` 內部元件（`AiDiscussionPanel` 等）加 `min-h-0` 時學到的同一個 flex 撐高陷阱，這次遺漏在最外層 `<main>` 沒補上。
- 內容：`Prototype/src/App.tsx` 的 `<main>` className 加上 `min-h-0`（`flex-1 pb-[...]` 改為 `min-h-0 flex-1 pb-[...]`）。
- **確認不影響其他頁面**：`min-h-0` 只是移除瀏覽器預設「依內容自動決定最小高度」的下限，不會限制上限、也不會裁切內容——單字庫／單字詳情頁等內容較長、原本就需要正常整頁捲動的頁面，`main` 依然會依內容自然撐高，不受影響；只有像新增單字頁這種刻意用 `h-full` 整條撐滿可視高度的頁面，才會實際受益於這個下限被移除。
- 驗證：`npm run build`／`npm run lint`／`prettier --check .` 皆通過；結構性 Edit 後已用 Read 重新確認磁碟內容（含 `App.tsx` 與 `AddWordPage.tsx` 皆確認仍是預期狀態，未再度靜默回退）。
- 目前進度：`main` 已補上 `min-h-0`，理論上新增單字頁應該能完全撐滿可視區域、不需整頁捲動，內部各欄位維持各自的內部捲動（AI 討論垂直捲動、右欄視需要垂直捲動）。
- 下一步：等待使用者於 iPad 實機重新測試，確認整頁不再需要捲動、內容確實填滿紅框範圍；若仍有問題，需要進一步用實機 DevTools 檢查是否還有其他元素撐高。其餘同上一則 Phase 5 條目。

## 2026-07-08

### Dev access: allow Cloudflare Tunnel host in Vite

- Summary: Added Vite dev-server `server.allowedHosts` support for `.trycloudflare.com` so the temporary Cloudflare Tunnel URL can open the local Prototype on iPhone/iPad.
- Affected scope: `Prototype/vite.config.ts` dev-only network access.
- Verification: Ran `npm.cmd run build` in `Prototype`; build passed.
- Next steps: Restart the Vite dev server, keep `cloudflared tunnel --url http://127.0.0.1:5173` running, then open the generated `https://*.trycloudflare.com` URL on mobile.

## 2026-07-09

### 新增單字頁修正：main 高度改為明確扣除底部導覽列

- 修改摘要：使用者截圖回報新增單字頁左右欄位仍有部分內容被底部導覽列遮住，未符合「扣除導覽列後的可用高度」。
- 根因：前一輪雖已在 `<main>` 加上 `min-h-0`，但 `App.tsx` 的 `<main>` 仍是整個 `100svh` 高度，再用 `pb-[calc(72px+env(safe-area-inset-bottom))]` 預留底部固定導覽列空間。新增單字頁內層使用 `h-full` 逐層繼承時，仍會吃到「整個 viewport 的 main 高度」，而不是「扣除 nav 後的高度」，因此左右欄底部仍可能延伸到 fixed nav 後方。
- 內容：
  - `Prototype/src/index.css` 新增全域高度變數：`--lexicard-nav-height: 72px` 與 `--lexicard-main-height: calc(100svh - var(--lexicard-nav-height) - env(safe-area-inset-bottom))`。
  - `Prototype/src/App.tsx` 根容器改為 `h-svh overflow-hidden`，`<main>` 改為 `h-[var(--lexicard-main-height)] flex-none overflow-y-auto`，讓所有頁面的主要內容區實際高度就是扣除底部導覽列與 safe area 後的高度，而非靠 padding 迴避遮擋。
  - `Prototype/src/components/NavBar.tsx` 固定使用同一個 nav 高度變數：`h-[calc(var(--lexicard-nav-height)+env(safe-area-inset-bottom))]`，避免 App 與 NavBar 各自猜高度。
  - `Prototype/src/pages/AddWordPage.tsx` 根 `<div>` 與 `<form>` 補上 `min-h-0`，讓已扣除 nav 的高度能穩定傳給左右欄與內部捲動容器。
- 驗證：`npm.cmd run build` 與 `npm.cmd run lint` 於 `Prototype/` 皆通過；已啟動 Vite dev server，`http://127.0.0.1:5173/add` 回應 200。嘗試用 in-app browser 量測 DOM，但此環境回報沒有可用瀏覽器實例（`agent.browsers.list()` 為空），因此仍需使用者於桌機/iPad 實機視覺確認底部是否已不再被 nav 遮住。
- 目前進度：高度計算已改為單一來源的 CSS 變數，新增單字頁不再依賴 `main` padding 或頁面層級魔術數字。
- 下一步：請使用者重新整理 `/add` 實機確認左右欄底部是否剛好停在導覽列上方；若仍有遮擋，下一輪需用實機 DevTools 檢查 `--lexicard-nav-height` 是否與實際 nav 高度不一致。

### 新增單字頁修正：寬度改為可隨瀏覽器收縮，避免水平遮擋

- 修改摘要：使用者截圖回報新增單字頁寬度也有類似問題，瀏覽器可視寬度縮小時，左欄與右欄內容不應被裁切，而應隨可視區域縮放。
- 根因：CSS Grid track 預設會受到子元素 `min-width: auto` / min-content 影響。右欄內的「已新增單字」橫向卡片列雖然本身有 `overflow-x-auto`，但其父層 grid track 是 `3fr`（隱含 `minmax(auto, 3fr)`），加上左右欄缺少 `min-w-0`，會把整個 grid 撐到比 viewport 更寬，導致 app 產生水平溢位；畫面看起來就像左欄被瀏覽器邊界裁掉。
- 內容：
  - `Prototype/src/App.tsx`：`main` 改為 `overflow-x-hidden overflow-y-auto`，避免 app 層出現整頁水平捲動。
  - `Prototype/src/pages/AddWordPage.tsx`：外層 `<div>`、`<form>`、右欄 wrapper、右下畫布卡片、textarea wrapper、textarea 皆補 `min-w-0`；grid 欄位由 `grid-cols-[minmax(320px,1fr)_3fr]` 改為 `grid-cols-[minmax(clamp(260px,25vw,320px),1fr)_minmax(0,3fr)]`，讓左欄可在窄 viewport 下從 320px 收縮到 260px，右欄也可正確縮小而不是被 min-content 撐寬。
  - `Prototype/src/components/AiDiscussionPanel.tsx`：外層加 `min-w-0 overflow-hidden`，內部對話串、生成預覽卡片、底部輸入列補 `min-w-0`，訊息氣泡加 `break-words`，避免長文字撐寬左欄。
  - `Prototype/src/components/RecentlyAddedWords.tsx`：外層色塊容器補 `min-w-0 overflow-hidden`，內部橫向列表補 `min-w-0`，讓水平捲動只發生在卡片列內部，不再撐開整個頁面。
- 驗證：`npm.cmd run build` 與 `npm.cmd run lint` 於 `Prototype/` 皆通過；`http://127.0.0.1:5173/add` 回應 200。因本環境仍沒有可用 in-app browser，需使用者於 iPad/桌機實機重新整理確認左右邊界是否不再裁切。
- 目前進度：新增單字頁的寬度鏈已改為「欄位可縮、內部列表自己橫向捲」，應能隨瀏覽器可視寬度縮放。
- 下一步：使用者實機確認若仍有水平遮擋，下一輪需用 DevTools 找出哪個元素的 `scrollWidth > clientWidth`，優先檢查剩餘未補 `min-w-0` 的 grid/flex 子項或固定寬度元件。

### 新增單字頁調整：移除手動詞性/音標欄位，改由候選詞性選擇

- 修改摘要：使用者要求手寫區移除兩個「單字」標題文字，並移除手動填寫的詞性與音標欄位；詞性與音標應由手寫單字自動辨識/生成，若同一單字有一個以上詞性，提供選項讓使用者選擇。
- 內容：
  - `Prototype/src/pages/AddWordPage.tsx` 移除畫布卡片內可見的 `<h2>單字</h2>` 與 textarea label（保留 `aria-label="手寫或輸入單字"` 維持無障礙名稱），也移除原本的 `LabeledInput` 詞性與音標手動輸入欄位。
  - 新增 `useLiveQuery` 依目前手寫/輸入的 `word` 查詢 `findCardsByNormalizedWord`，從既有字卡推導 `partOfSpeechOptions`。
  - 若既有資料中該單字只有一個詞性，建立/重複判斷時自動採用該詞性與對應音標；若有多個詞性，畫布下方顯示 44px 觸控高度的詞性選項按鈕，使用者需先選擇，送出按鈕才會啟用；若沒有既有資料，暫時以空詞性/空音標建立，等待 Phase 4 AI Adapter 接上後改由 AI 真正生成。
  - `handleSubmit` 內新增二次防呆：提交瞬間重新查詢候選詞性，若候選詞性超過一個且尚未選擇，直接 return，不寫入資料。
- 驗證：`npm.cmd run build` 與 `npm.cmd run lint` 於 `Prototype/` 皆通過；`http://127.0.0.1:5173/add` 回應 200。因本環境沒有可用 in-app browser，需使用者於 iPad/桌機實機確認畫布區文字與欄位已移除、既有多詞性單字會出現詞性選項。
- 目前進度：新增單字頁已不再提供手動詞性/音標輸入；多詞性既有字卡情境已有選擇 UI。
- 下一步：Phase 4 AI Adapter 完成後，將目前的「既有字卡候選」補強為真正由 AI 生成詞性/音標與候選詞性；若新單字沒有既有資料，應由 AI 在建立前填入 `partOfSpeech` 與 `phonetic`。

### 新增單字頁調整：移除 AI 討論區標題

- 修改摘要：使用者要求移除 AI 討論區上方的「AI 討論」標題文字。
- 內容：`Prototype/src/components/AiDiscussionPanel.tsx` 移除可見 `<h2>AI 討論</h2>`，並移除訊息串原本因標題存在而保留的 `mt-3` 上方間距，讓對話內容從面板頂部開始。
- 驗證：`npm.cmd run build` 與 `npm.cmd run lint` 於 `Prototype/` 皆通過。
- 目前進度：AI 討論區不再顯示上方標題。
- 下一步：等待使用者於實機確認新增單字頁兩欄視覺是否符合預期。

### 新增單字頁調整：AI 討論區 scrollbar 靠右且低調化

- 修改摘要：使用者要求 AI 討論區的 scrollbar 更靠近右側邊緣，並降低視覺存在感。
- 內容：
  - `Prototype/src/components/AiDiscussionPanel.tsx` 將對話串捲動容器加上 `-mr-3 pr-3`，讓 scrollbar 往面板右側 padding 延伸，靠近右側邊緣，但內容仍保留右側呼吸空間。
  - `Prototype/src/index.css` 新增 `.scrollbar-subtle` 工具類：Firefox 使用 `scrollbar-width: thin` 與低透明度 `scrollbar-color`；WebKit scrollbar 設為 6px、透明軌道、低透明度圓角 thumb，hover 時才稍微加深。
- 驗證：`npm.cmd run build` 與 `npm.cmd run lint` 於 `Prototype/` 皆通過。
- 目前進度：AI 討論串 scrollbar 已靠近右緣且低調化。
- 下一步：等待使用者於實機確認 scrollbar 位置與視覺強度是否剛好。

### 新增單字頁調整：AI 討論輸入欄自動增高

- 修改摘要：使用者要求 AI 討論區下方輸入欄參考 ChatGPT 模式，多行時自動增加高度，最多增加到三行；超過三行後改由輸入欄內部 scroll。
- 內容：
  - `Prototype/src/components/AiDiscussionPanel.tsx` 將底部單行 `input` 改為 `textarea`，新增 `chatDraft`、`chatInputRef` 與 `useLayoutEffect`，依 `scrollHeight` 自動調整輸入欄高度。
  - textarea 設定 `rows={1}`、`min-h-[44px]`、`max-h-[calc(1.25rem*3+1rem)]`、`resize-none` 與 `scrollbar-subtle`；三行以內高度跟著內容增加，超過三行後只在欄位內捲動。
  - 送出按鈕仍維持 disabled，因 Phase 4 AI 對話尚未串接；目前此欄位僅提供本地草稿輸入，用於驗證輸入欄互動行為。
- 驗證：`npm.cmd run build` 通過；`npm.cmd run lint` 通過。
- 目前進度：AI 討論輸入欄已具備 1 至 3 行自動增高與三行以上內部 scroll。
- 下一步：Phase 4 AI Adapter 完成後，將 `chatDraft` 對接真正的 AI 討論送出流程。

### 新增單字頁調整：AI 討論輸入欄送出按鈕圖示化

- 修改摘要：使用者要求 AI 討論區下方輸入欄右側原本的 X 按鈕改成 SEND 按鈕，且一樣以 icon 呈現。
- 內容：
  - `Prototype/src/components/icons.tsx` 新增 `SendIcon`，延續現有 stroke-based、currentColor 的客製 icon 風格。
  - `Prototype/src/components/AiDiscussionPanel.tsx` 將底部按鈕從旋轉的 `PlusIcon` 改為 `SendIcon`，並把 `aria-label` 改為「送出 AI 討論訊息」。
  - 因 Phase 4 AI 對話尚未串接，按鈕仍維持 disabled，僅先修正視覺語意。
- 驗證：`npm.cmd run build` 通過；`npm.cmd run lint` 通過。
- 目前進度：AI 討論輸入欄右側已顯示送出箭頭 icon。
- 下一步：Phase 4 AI Adapter 完成後，將此按鈕接上真正送出 AI 討論訊息的流程。
