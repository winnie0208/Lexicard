// 規則式（非真正 AI）輸入分流：Phase 4 AI Adapter 串接 Gemini 前的暫時方案，
// 之後由真正的語意判斷取代，不代表正式 AI 辨識功能已完成。

export interface ParsedWordInput {
  word?: string
  partOfSpeech?: string
  chineseMeaning?: string
  exampleSentence?: string
  exampleSentenceTranslation?: string
}

const SINGLE_ENGLISH_WORD = /^[A-Za-z][A-Za-z'-]*$/
// 全小寫 2–4 個 token 視為片語（如 "deal with"）——規則式近似：句子通常
// 以大寫開頭或帶標點，全小寫短語較可能是片語；誤判由 Phase 4 AI 解決。
const ENGLISH_PHRASE = /^[a-z][a-z'-]*(?:\s+[a-z][a-z'-]*){1,3}$/
// 「單字（或片語）＋中文」同行輸入（如 "set 一套"、"deal with 處理"）。
// 片語部分限制後續 token 全小寫，中文段不得再含英文字母，否則視為例句＋
// 翻譯的組合，交給後面的規則處理。
const WORD_MEANING = /^([A-Za-z][A-Za-z'-]*(?:\s+[a-z][a-z'-]*){0,3})\s+(.+)$/
// 無空格的詞性前綴（如 "n.測試草稿"）——token 拆不出來時的補充判斷。
const PART_OF_SPEECH_PREFIX = /^(n|v|adj|adv|prep|conj|pron|int|phr)\.\s*/i
const HAS_CJK = /[一-鿿]/
const HAS_LATIN_LETTER = /[A-Za-z]/

// 詞性關鍵字對照：縮寫（點可省略）與中文名稱皆可，出現在行內任何位置
// （以空白分隔的 token）都會被抽取（PRD 3.2 意圖分類的規則式近似）。
const POS_TOKEN_MAP: Record<string, string> = {
  n: 'n.',
  v: 'v.',
  adj: 'adj.',
  adv: 'adv.',
  prep: 'prep.',
  conj: 'conj.',
  pron: 'pron.',
  int: 'int.',
  phr: 'phr.',
  名詞: 'n.',
  動詞: 'v.',
  形容詞: 'adj.',
  副詞: 'adv.',
  介系詞: 'prep.',
  介詞: 'prep.',
  連接詞: 'conj.',
  代名詞: 'pron.',
  感嘆詞: 'int.',
  片語: 'phr.',
}

function splitAtFirstCjk(line: string): { before: string; after: string } | null {
  const index = line.search(HAS_CJK)
  if (index <= 0) return null
  return { before: line.slice(0, index).trim(), after: line.slice(index).trim() }
}

// 從行內抽出詞性 token（如 "deal with 處理 phr" → phr.＋"deal with 處理"），
// 但只有剩餘內容仍符合「單字／片語／中文意思／單字＋中文」形狀時才採用——
// 剩餘像完整句子時不消耗，整行留給例句規則，避免例句裡剛好出現 n、v 等
// 字母時被誤抽。
function tryParsePosHintLine(line: string, result: ParsedWordInput): boolean {
  const tokens = line.split(/\s+/)
  let posValue: string | undefined
  let posIndex = -1
  for (let i = 0; i < tokens.length; i += 1) {
    const mapped = POS_TOKEN_MAP[tokens[i].toLowerCase().replace(/\.$/, '')]
    if (mapped) {
      posValue = mapped
      posIndex = i
      break
    }
  }
  if (!posValue) return false

  const rest = tokens
    .filter((_token, index) => index !== posIndex)
    .join(' ')
    .trim()

  if (!rest) {
    if (!result.partOfSpeech) result.partOfSpeech = posValue
    return true
  }

  if (HAS_CJK.test(rest) && !HAS_LATIN_LETTER.test(rest)) {
    if (!result.partOfSpeech) result.partOfSpeech = posValue
    if (!result.chineseMeaning) result.chineseMeaning = rest
    return true
  }

  if (SINGLE_ENGLISH_WORD.test(rest) || ENGLISH_PHRASE.test(rest)) {
    if (!result.partOfSpeech) result.partOfSpeech = posValue
    if (!result.word) result.word = rest
    return true
  }

  const wordMeaningMatch = rest.match(WORD_MEANING)
  if (
    wordMeaningMatch &&
    HAS_CJK.test(wordMeaningMatch[2]) &&
    !HAS_LATIN_LETTER.test(wordMeaningMatch[2])
  ) {
    if (!result.partOfSpeech) result.partOfSpeech = posValue
    if (!result.word) result.word = wordMeaningMatch[1]
    if (!result.chineseMeaning) result.chineseMeaning = wordMeaningMatch[2].trim()
    return true
  }

  return false
}

export function parseFreeformWordInput(text: string): ParsedWordInput {
  const result: ParsedWordInput = {}

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  for (const line of lines) {
    if (!result.word && SINGLE_ENGLISH_WORD.test(line)) {
      result.word = line
      continue
    }

    if (tryParsePosHintLine(line, result)) continue

    // 無空格的詞性前綴（如 "n.測試草稿"）。
    const posMatch = line.match(PART_OF_SPEECH_PREFIX)
    if (posMatch) {
      if (!result.partOfSpeech) result.partOfSpeech = `${posMatch[1].toLowerCase()}.`
      const remainder = line.slice(posMatch[0].length).trim()
      if (remainder && !result.chineseMeaning) {
        result.chineseMeaning = remainder
      }
      continue
    }

    if (!result.word) {
      const wordMeaningMatch = line.match(WORD_MEANING)
      if (
        wordMeaningMatch &&
        HAS_CJK.test(wordMeaningMatch[2]) &&
        !HAS_LATIN_LETTER.test(wordMeaningMatch[2])
      ) {
        result.word = wordMeaningMatch[1]
        if (!result.chineseMeaning) result.chineseMeaning = wordMeaningMatch[2].trim()
        continue
      }

      // 純片語行（如 "deal with"）——放在組合規則之後，避免搶走判斷。
      if (ENGLISH_PHRASE.test(line)) {
        result.word = line
        continue
      }
    }

    const hasLatin = HAS_LATIN_LETTER.test(line)
    const hasCjk = HAS_CJK.test(line)

    if (hasLatin && hasCjk) {
      const split = splitAtFirstCjk(line)
      if (split && split.before) {
        if (!result.exampleSentence) result.exampleSentence = split.before
        if (split.after && !result.exampleSentenceTranslation) {
          result.exampleSentenceTranslation = split.after
        }
        continue
      }
    }

    if (hasLatin && !hasCjk) {
      if (!result.exampleSentence) {
        result.exampleSentence = line
      }
      continue
    }

    if (hasCjk && !hasLatin) {
      if (!result.exampleSentenceTranslation) {
        result.exampleSentenceTranslation = line
      } else if (!result.chineseMeaning) {
        result.chineseMeaning = line
      }
      continue
    }
  }

  return result
}
