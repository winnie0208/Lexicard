// Dev-only fake data for exercising the card library / detail UI before the
// AI adapter (Phase 4+) exists. Not bundled into production builds.
import { db } from './db'
import { createCard } from './repositories/cardRepository'
import { createSense } from './repositories/senseRepository'
import { createRelation } from './repositories/relationRepository'

export async function clearAllData(): Promise<void> {
  await db.transaction('rw', db.cards, db.senses, db.relations, async () => {
    await db.relations.clear()
    await db.senses.clear()
    await db.cards.clear()
  })
}

export async function seedDevData(): Promise<void> {
  await clearAllData()

  const book = await createCard({ word: 'book', phonetic: '/bʊk/' })
  await createSense({
    cardId: book.id,
    partOfSpeech: 'n.',
    chineseMeaning: '書',
    exampleSentence: 'She is reading a book.',
    exampleSentenceTranslation: '她正在看一本書。',
    isPrimary: true,
  })
  await createSense({
    cardId: book.id,
    partOfSpeech: 'v.',
    chineseMeaning: '預訂',
    exampleSentence: 'I booked a table for two.',
    exampleSentenceTranslation: '我訂了一張兩人桌。',
  })

  const bank = await createCard({ word: 'bank', phonetic: '/bæŋk/' })
  await createSense({
    cardId: bank.id,
    partOfSpeech: 'n.',
    chineseMeaning: '銀行',
    exampleSentence: 'I need to go to the bank.',
    exampleSentenceTranslation: '我需要去銀行一趟。',
    isPrimary: true,
  })
  await createSense({
    cardId: bank.id,
    partOfSpeech: 'n.',
    chineseMeaning: '河岸',
    exampleSentence: 'They sat on the bank of the river.',
    exampleSentenceTranslation: '他們坐在河岸邊。',
  })

  const run = await createCard({ word: 'run', phonetic: '/rʌn/' })
  await createSense({
    cardId: run.id,
    partOfSpeech: 'v.',
    chineseMeaning: '跑步',
    exampleSentence: 'He runs every morning.',
    exampleSentenceTranslation: '他每天早上跑步。',
    isPrimary: true,
  })

  const novel = await createCard({ word: 'novel', phonetic: '/ˈnɒvəl/' })
  await createSense({
    cardId: novel.id,
    partOfSpeech: 'adj.',
    chineseMeaning: '新奇的',
    exampleSentence: 'That is a novel idea.',
    exampleSentenceTranslation: '那是一個新奇的想法。',
    isPrimary: true,
  })
  await createSense({
    cardId: novel.id,
    partOfSpeech: 'n.',
    chineseMeaning: '小說',
    exampleSentence: 'She wrote her first novel last year.',
    exampleSentenceTranslation: '她去年寫了第一本小說。',
  })

  const light = await createCard({ word: 'light', phonetic: '/laɪt/' })
  await createSense({
    cardId: light.id,
    partOfSpeech: 'n.',
    chineseMeaning: '光',
    exampleSentence: 'Turn on the light, please.',
    exampleSentenceTranslation: '請把燈打開。',
    isPrimary: true,
  })
  await createSense({
    cardId: light.id,
    partOfSpeech: 'adj.',
    chineseMeaning: '輕的',
    exampleSentence: 'This bag is very light.',
    exampleSentenceTranslation: '這個包包很輕。',
  })

  await createRelation({
    sourceCardId: novel.id,
    targetCardId: book.id,
    relationType: 'similarMeaning',
    relationSource: 'ai',
    description: '兩者皆與書籍、閱讀相關。',
  })

  // Vary familiarity/star/error state so Phase 2/3 UI (icons, sort, filters) has
  // something realistic to render.
  const now = Date.now()
  await db.cards.update(book.id, { familiarityScore: 82, isStarred: true, updatedAt: now })
  await db.cards.update(bank.id, { familiarityScore: 45, updatedAt: now })
  await db.cards.update(run.id, { familiarityScore: 25, errorCount: 2, updatedAt: now })
  await db.cards.update(novel.id, { familiarityScore: 60, isStarred: true, updatedAt: now })
  await db.cards.update(light.id, { familiarityScore: 70, updatedAt: now })

  console.info('[lexicard] dev seed data loaded: book, bank, run, novel, light')
}

const devSeedApi = { seedDevData, clearAllData }

declare global {
  interface Window {
    lexicardDevSeed?: typeof devSeedApi
  }
}

if (import.meta.env.DEV) {
  window.lexicardDevSeed = devSeedApi
  console.info(
    '[lexicard] dev seed helpers ready — run `lexicardDevSeed.seedDevData()` in the console to load fake cards.',
  )
}
