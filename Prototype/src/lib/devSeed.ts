// Dev-only fake data for exercising the card library / detail UI before the
// AI adapter (Phase 4+) exists. Not bundled into production builds.
//
// Every card here has a fully-filled sense (meaning/context/example/
// translation/note). The set deliberately covers every combination of
// sense count (one vs. multiple) and relation count (none / one / multiple,
// spanning all 3 relation types) so every UI state has real content to
// exercise, not just the handful of hand-picked demo cards.
import { db } from './db'
import { createCard } from './repositories/cardRepository'
import { createSense } from './repositories/senseRepository'
import { createRelation } from './repositories/relationRepository'
import {
  isSenseLevelRelationType,
  type RelationSource,
  type RelationType,
} from '../types/relation'

interface SeedSense {
  chineseMeaning: string
  exampleSentence: string
  exampleSentenceTranslation: string
  note: string
  isPrimary?: boolean
}

interface SeedCard {
  key: string
  word: string
  partOfSpeech: string
  phonetic: string
  familiarityScore: number
  isStarred?: boolean
  errorCount?: number
  senses: SeedSense[]
}

interface SeedRelation {
  source: string
  target: string
  // Index into that card's `senses` array; defaults to 0 (the primary
  // sense). Only used for sense-level relation types (similarMeaning) —
  // card-level types (confusable, partOfSpeechVariant) carry no senseIds.
  sourceSenseIndex?: number
  targetSenseIndex?: number
  relationType: RelationType
  relationSource: RelationSource
  description: string
}

const SEED_CARDS: SeedCard[] = [
  // 1 sense, multiple relations (different types)
  {
    key: 'book.n',
    word: 'book',
    partOfSpeech: 'n.',
    phonetic: '/bʊk/',
    familiarityScore: 82,
    isStarred: true,
    senses: [
      {
        chineseMeaning: '書',
        exampleSentence: 'She is reading a book.',
        exampleSentenceTranslation: '她正在看一本書。',
        note: '可以是紙本或電子書',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, multiple relations (different types)
  {
    key: 'book.v',
    word: 'book',
    partOfSpeech: 'v.',
    phonetic: '/bʊk/',
    familiarityScore: 58,
    senses: [
      {
        chineseMeaning: '預訂',
        exampleSentence: 'I booked a table for two.',
        exampleSentenceTranslation: '我訂了一張兩人桌。',
        note: '常用於餐廳、飯店、機票',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'look.v',
    word: 'look',
    partOfSpeech: 'v.',
    phonetic: '/lʊk/',
    familiarityScore: 44,
    senses: [
      {
        chineseMeaning: '看、看起來',
        exampleSentence: 'She looked at the photo.',
        exampleSentenceTranslation: '她看了那張照片。',
        note: '與 book 拼字相近，容易看錯',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, multiple relations (different types)
  {
    key: 'novel.adj',
    word: 'novel',
    partOfSpeech: 'adj.',
    phonetic: '/ˈnɒvəl/',
    familiarityScore: 33,
    senses: [
      {
        chineseMeaning: '新奇的',
        exampleSentence: 'That is a novel idea.',
        exampleSentenceTranslation: '那是一個新奇的想法。',
        note: '常用於描述發明、想法或方法',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, multiple relations (different types)
  {
    key: 'novel.n',
    word: 'novel',
    partOfSpeech: 'n.',
    phonetic: '/ˈnɒvəl/',
    familiarityScore: 60,
    isStarred: true,
    senses: [
      {
        chineseMeaning: '小說',
        exampleSentence: 'She wrote her first novel last year.',
        exampleSentenceTranslation: '她去年寫了第一本小說。',
        note: '通常指長篇故事，短篇稱作 short story',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'fresh.adj',
    word: 'fresh',
    partOfSpeech: 'adj.',
    phonetic: '/freʃ/',
    familiarityScore: 77,
    isStarred: true,
    senses: [
      {
        chineseMeaning: '新鮮的',
        exampleSentence: 'This bread is fresh.',
        exampleSentenceTranslation: '這個麵包很新鮮。',
        note: '也可形容天氣涼爽',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'original.adj',
    word: 'original',
    partOfSpeech: 'adj.',
    phonetic: '/əˈrɪdʒənəl/',
    familiarityScore: 59,
    senses: [
      {
        chineseMeaning: '原創的',
        exampleSentence: 'This is an original painting.',
        exampleSentenceTranslation: '這是一幅原創畫作。',
        note: '也可作名詞，指「原作」',
        isPrimary: true,
      },
    ],
  },
  // multiple senses, 1 relation
  {
    key: 'bank.n',
    word: 'bank',
    partOfSpeech: 'n.',
    phonetic: '/bæŋk/',
    familiarityScore: 45,
    senses: [
      {
        chineseMeaning: '銀行',
        exampleSentence: 'I need to go to the bank.',
        exampleSentenceTranslation: '我需要去銀行一趟。',
        note: '',
        isPrimary: true,
      },
      {
        chineseMeaning: '河岸',
        exampleSentence: 'They sat on the bank of the river.',
        exampleSentenceTranslation: '他們坐在河岸邊。',
        note: '此意思較少用，注意上下文',
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'bench.n',
    word: 'bench',
    partOfSpeech: 'n.',
    phonetic: '/bɛntʃ/',
    familiarityScore: 51,
    senses: [
      {
        chineseMeaning: '長椅',
        exampleSentence: 'We sat on a bench in the park.',
        exampleSentenceTranslation: '我們坐在公園的長椅上。',
        note: '拼字與 bank 相近，容易看錯',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 0 relations
  {
    key: 'money.n',
    word: 'money',
    partOfSpeech: 'n.',
    phonetic: '/ˈmʌni/',
    familiarityScore: 52,
    errorCount: 1,
    senses: [
      {
        chineseMeaning: '錢',
        exampleSentence: "He doesn't have much money.",
        exampleSentenceTranslation: '他沒有很多錢。',
        note: '不可數名詞，沒有複數形',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, multiple relations (different types)
  {
    key: 'run.v',
    word: 'run',
    partOfSpeech: 'v.',
    phonetic: '/rʌn/',
    familiarityScore: 25,
    errorCount: 2,
    senses: [
      {
        chineseMeaning: '跑步',
        exampleSentence: 'He runs every morning.',
        exampleSentenceTranslation: '他每天早上跑步。',
        note: '',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'run.n',
    word: 'run',
    partOfSpeech: 'n.',
    phonetic: '/rʌn/',
    familiarityScore: 30,
    senses: [
      {
        chineseMeaning: '一次跑步；一連串',
        exampleSentence: 'We went for a run this morning.',
        exampleSentenceTranslation: '我們今天早上去跑了一趟步。',
        note: '也可指「連續」，如 a run of bad luck（一連串的壞運氣）',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'walk.v',
    word: 'walk',
    partOfSpeech: 'v.',
    phonetic: '/wɔːk/',
    familiarityScore: 71,
    senses: [
      {
        chineseMeaning: '走路',
        exampleSentence: 'I like to walk in the park.',
        exampleSentenceTranslation: '我喜歡在公園散步。',
        note: '速度比 run 慢',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 0 relations
  {
    key: 'marathon.n',
    word: 'marathon',
    partOfSpeech: 'n.',
    phonetic: '/ˈmærəθɒn/',
    familiarityScore: 18,
    senses: [
      {
        chineseMeaning: '馬拉松',
        exampleSentence: 'She finished her first marathon.',
        exampleSentenceTranslation: '她完成了她的第一場馬拉松。',
        note: '',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, multiple relations (different types)
  {
    key: 'light.n',
    word: 'light',
    partOfSpeech: 'n.',
    phonetic: '/laɪt/',
    familiarityScore: 70,
    senses: [
      {
        chineseMeaning: '光',
        exampleSentence: 'Turn on the light, please.',
        exampleSentenceTranslation: '請把燈打開。',
        note: '也可作動詞「點燃」，但此卡僅收錄名詞意',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'light.adj',
    word: 'light',
    partOfSpeech: 'adj.',
    phonetic: '/laɪt/',
    familiarityScore: 48,
    senses: [
      {
        chineseMeaning: '輕的',
        exampleSentence: 'This bag is very light.',
        exampleSentenceTranslation: '這個包包很輕。',
        note: '與 heavy 意思相反',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'bright.adj',
    word: 'bright',
    partOfSpeech: 'adj.',
    phonetic: '/braɪt/',
    familiarityScore: 66,
    senses: [
      {
        chineseMeaning: '明亮的',
        exampleSentence: 'The room is very bright.',
        exampleSentenceTranslation: '這個房間很明亮。',
        note: '也可比喻聰明',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 0 relations
  {
    key: 'heavy.adj',
    word: 'heavy',
    partOfSpeech: 'adj.',
    phonetic: '/ˈhɛvi/',
    familiarityScore: 39,
    senses: [
      {
        chineseMeaning: '重的',
        exampleSentence: 'The box is too heavy to carry.',
        exampleSentenceTranslation: '這個箱子太重了搬不動。',
        note: '與 light（形容詞）意思相反',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'quiet.adj',
    word: 'quiet',
    partOfSpeech: 'adj.',
    phonetic: '/ˈkwaɪət/',
    familiarityScore: 55,
    senses: [
      {
        chineseMeaning: '安靜的',
        exampleSentence: 'Please keep quiet in the library.',
        exampleSentenceTranslation: '請在圖書館保持安靜。',
        note: '拼字與 quite 相近，容易混淆',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'quite.adv',
    word: 'quite',
    partOfSpeech: 'adv.',
    phonetic: '/kwaɪt/',
    familiarityScore: 41,
    senses: [
      {
        chineseMeaning: '相當、頗',
        exampleSentence: 'This test is quite difficult.',
        exampleSentenceTranslation: '這個測驗相當困難。',
        note: '拼字與 quiet 相近，容易混淆',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'happy.adj',
    word: 'happy',
    partOfSpeech: 'adj.',
    phonetic: '/ˈhæpi/',
    familiarityScore: 80,
    isStarred: true,
    senses: [
      {
        chineseMeaning: '開心的',
        exampleSentence: 'She looks very happy today.',
        exampleSentenceTranslation: '她今天看起來很開心。',
        note: '',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'glad.adj',
    word: 'glad',
    partOfSpeech: 'adj.',
    phonetic: '/ɡlæd/',
    familiarityScore: 47,
    senses: [
      {
        chineseMeaning: '高興的',
        exampleSentence: "I'm glad to see you.",
        exampleSentenceTranslation: '我很高興見到你。',
        note: '較少直接放在名詞前修飾（不太說 a glad person）',
        isPrimary: true,
      },
    ],
  },
  // multiple senses, multiple relations (different types)
  {
    key: 'letter.n',
    word: 'letter',
    partOfSpeech: 'n.',
    phonetic: '/ˈlɛtər/',
    familiarityScore: 63,
    senses: [
      {
        chineseMeaning: '信',
        exampleSentence: 'She wrote a letter to her grandmother.',
        exampleSentenceTranslation: '她寫了一封信給她的祖母。',
        note: '',
        isPrimary: true,
      },
      {
        chineseMeaning: '字母',
        exampleSentence: 'The word "cat" has three letters.',
        exampleSentenceTranslation: '「cat」這個字有三個字母。',
        note: '注意與「word（單字）」不同',
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'ladder.n',
    word: 'ladder',
    partOfSpeech: 'n.',
    phonetic: '/ˈlædər/',
    familiarityScore: 42,
    senses: [
      {
        chineseMeaning: '梯子',
        exampleSentence: 'He climbed up the ladder.',
        exampleSentenceTranslation: '他爬上了梯子。',
        note: '拼字與 letter 相近，容易看錯',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'mail.n',
    word: 'mail',
    partOfSpeech: 'n.',
    phonetic: '/meɪl/',
    familiarityScore: 68,
    senses: [
      {
        chineseMeaning: '郵件',
        exampleSentence: 'I received a mail from my friend.',
        exampleSentenceTranslation: '我收到了朋友寄來的郵件。',
        note: '美式英文常用，英式英文多用 post',
        isPrimary: true,
      },
    ],
  },
  // 3 senses, multiple relations (different types)
  {
    key: 'watch.v',
    word: 'watch',
    partOfSpeech: 'v.',
    phonetic: '/wɒtʃ/',
    familiarityScore: 56,
    senses: [
      {
        chineseMeaning: '觀看',
        exampleSentence: 'They watched a movie together.',
        exampleSentenceTranslation: '他們一起看了一部電影。',
        note: '',
        isPrimary: true,
      },
      {
        chineseMeaning: '注意；當心',
        exampleSentence: 'Watch out for the wet floor.',
        exampleSentenceTranslation: '小心地板濕滑。',
        note: '常用於片語 watch out',
      },
      {
        chineseMeaning: '照看；看顧',
        exampleSentence: 'Can you watch my bag for a second?',
        exampleSentenceTranslation: '你可以幫我看一下包包嗎？',
        note: '',
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'watch.n',
    word: 'watch',
    partOfSpeech: 'n.',
    phonetic: '/wɒtʃ/',
    familiarityScore: 62,
    senses: [
      {
        chineseMeaning: '手錶',
        exampleSentence: 'He checked the time on his watch.',
        exampleSentenceTranslation: '他看了看手錶上的時間。',
        note: '也可作動詞「觀看」，但此卡僅收錄名詞意',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'wash.v',
    word: 'wash',
    partOfSpeech: 'v.',
    phonetic: '/wɒʃ/',
    familiarityScore: 49,
    senses: [
      {
        chineseMeaning: '洗、清洗',
        exampleSentence: 'She washes her hands before dinner.',
        exampleSentenceTranslation: '她在晚餐前洗手。',
        note: '拼字與 watch 相近，容易看錯',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'see.v',
    word: 'see',
    partOfSpeech: 'v.',
    phonetic: '/siː/',
    familiarityScore: 74,
    senses: [
      {
        chineseMeaning: '看見',
        exampleSentence: 'I can see the mountains from here.',
        exampleSentenceTranslation: '我從這裡可以看到山。',
        note: '與 watch 不同，watch 強調持續注視',
        isPrimary: true,
      },
    ],
  },
  // multiple senses, 0 relations
  {
    key: 'spring.n',
    word: 'spring',
    partOfSpeech: 'n.',
    phonetic: '/sprɪŋ/',
    familiarityScore: 54,
    senses: [
      {
        chineseMeaning: '春天',
        exampleSentence: 'Flowers bloom in spring.',
        exampleSentenceTranslation: '花朵在春天綻放。',
        note: '',
        isPrimary: true,
      },
      {
        chineseMeaning: '彈簧',
        exampleSentence: 'The mattress has metal springs inside.',
        exampleSentenceTranslation: '這張床墊裡面有金屬彈簧。',
        note: '也可作動詞，指「跳躍」',
      },
    ],
  },
  // 5 senses, 5 relations — for exercising the horizontal scroll behaviour
  // of both the sense-card row and the relation-card row.
  {
    key: 'set.n',
    word: 'set',
    partOfSpeech: 'n.',
    phonetic: '/sɛt/',
    familiarityScore: 50,
    senses: [
      {
        chineseMeaning: '一套；一組',
        exampleSentence: 'She bought a new set of dishes.',
        exampleSentenceTranslation: '她買了一套新餐具。',
        note: '',
        isPrimary: true,
      },
      {
        chineseMeaning: '（電視、收音機等）裝置',
        exampleSentence: 'They watched the news on an old TV set.',
        exampleSentenceTranslation: '他們用一台舊電視機看新聞。',
        note: '',
      },
      {
        chineseMeaning: '（網球等）盤',
        exampleSentence: 'She won the match in three sets.',
        exampleSentenceTranslation: '她以三盤獲勝了這場比賽。',
        note: '',
      },
      {
        chineseMeaning: '一夥人；圈子',
        exampleSentence: 'He is part of the fashionable set in the city.',
        exampleSentenceTranslation: '他是城裡時尚圈的一員。',
        note: '',
      },
      {
        chineseMeaning: '（數學）集合',
        exampleSentence: 'Every even number belongs to this set.',
        exampleSentenceTranslation: '每個偶數都屬於這個集合。',
        note: '',
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'group.n',
    word: 'group',
    partOfSpeech: 'n.',
    phonetic: '/gruːp/',
    familiarityScore: 62,
    senses: [
      {
        chineseMeaning: '群組；一群',
        exampleSentence: 'They divided the students into four groups.',
        exampleSentenceTranslation: '他們把學生分成四組。',
        note: '',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'device.n',
    word: 'device',
    partOfSpeech: 'n.',
    phonetic: '/dɪˈvaɪs/',
    familiarityScore: 58,
    senses: [
      {
        chineseMeaning: '裝置；設備',
        exampleSentence: 'This device can measure your heart rate.',
        exampleSentenceTranslation: '這個裝置可以測量你的心率。',
        note: '',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'scene.n',
    word: 'scene',
    partOfSpeech: 'n.',
    phonetic: '/siːn/',
    familiarityScore: 55,
    senses: [
      {
        chineseMeaning: '場景；景象',
        exampleSentence: 'The sunset created a beautiful scene.',
        exampleSentenceTranslation: '夕陽形成了一幅美麗的景象。',
        note: '',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'sit.v',
    word: 'sit',
    partOfSpeech: 'v.',
    phonetic: '/sɪt/',
    familiarityScore: 70,
    senses: [
      {
        chineseMeaning: '坐',
        exampleSentence: 'Please sit down and relax.',
        exampleSentenceTranslation: '請坐下放輕鬆。',
        note: '拼字與 set 相近，容易看錯',
        isPrimary: true,
      },
    ],
  },
  // 1 sense, 1 relation
  {
    key: 'set.v',
    word: 'set',
    partOfSpeech: 'v.',
    phonetic: '/sɛt/',
    familiarityScore: 46,
    senses: [
      {
        chineseMeaning: '設定；放置',
        exampleSentence: 'She set the alarm for six o’clock.',
        exampleSentenceTranslation: '她把鬧鐘設定在六點。',
        note: '',
        isPrimary: true,
      },
    ],
  },
]

const SEED_RELATIONS: SeedRelation[] = [
  {
    source: 'book.n',
    target: 'book.v',
    relationType: 'partOfSpeechVariant',
    relationSource: 'manual',
    description: '同一單字的名詞／動詞用法。',
  },
  {
    source: 'book.n',
    target: 'novel.n',
    relationType: 'similarMeaning',
    relationSource: 'ai',
    description: '兩者皆與書籍、閱讀相關。',
  },
  {
    source: 'book.v',
    target: 'look.v',
    relationType: 'confusable',
    relationSource: 'ai',
    description: '拼字相近，容易混淆。',
  },
  {
    source: 'novel.adj',
    target: 'novel.n',
    relationType: 'partOfSpeechVariant',
    relationSource: 'manual',
    description: '同一單字的形容詞／名詞用法。',
  },
  {
    source: 'novel.adj',
    target: 'fresh.adj',
    relationType: 'similarMeaning',
    relationSource: 'ai',
    description: '新奇與新鮮語感相近。',
  },
  {
    source: 'novel.adj',
    target: 'original.adj',
    relationType: 'similarMeaning',
    relationSource: 'manual',
    description: '新奇與原創語感相近。',
  },
  {
    source: 'bank.n',
    target: 'bench.n',
    relationType: 'confusable',
    relationSource: 'ai',
    description: '拼字相近（bank／bench），容易看錯。',
  },
  {
    source: 'run.v',
    target: 'walk.v',
    relationType: 'confusable',
    relationSource: 'ai',
    description: '動作相近，速度不同，容易混淆使用情境。',
  },
  {
    source: 'run.v',
    target: 'run.n',
    relationType: 'partOfSpeechVariant',
    relationSource: 'manual',
    description: '同一單字的動詞／名詞用法。',
  },
  {
    source: 'light.n',
    target: 'light.adj',
    relationType: 'partOfSpeechVariant',
    relationSource: 'manual',
    description: '同一單字的名詞／形容詞用法。',
  },
  {
    source: 'light.n',
    target: 'bright.adj',
    relationType: 'similarMeaning',
    relationSource: 'ai',
    description: '皆與光線、明亮相關。',
  },
  {
    source: 'quiet.adj',
    target: 'quite.adv',
    relationType: 'confusable',
    relationSource: 'ai',
    description: '拼字相近（quiet／quite），容易混淆。',
  },
  {
    source: 'happy.adj',
    target: 'glad.adj',
    relationType: 'similarMeaning',
    relationSource: 'manual',
    description: '開心與高興語感相近。',
  },
  {
    source: 'letter.n',
    target: 'ladder.n',
    relationType: 'confusable',
    relationSource: 'ai',
    description: '拼字相近（letter／ladder），容易看錯。',
  },
  {
    source: 'letter.n',
    target: 'mail.n',
    relationType: 'similarMeaning',
    relationSource: 'manual',
    description: '信件與郵件語意相近。',
  },
  {
    source: 'watch.v',
    target: 'watch.n',
    relationType: 'partOfSpeechVariant',
    relationSource: 'manual',
    description: '同一單字的動詞／名詞用法。',
  },
  {
    source: 'watch.v',
    target: 'wash.v',
    relationType: 'confusable',
    relationSource: 'ai',
    description: '拼字相近（watch／wash），容易看錯。',
  },
  {
    source: 'watch.v',
    target: 'see.v',
    relationType: 'similarMeaning',
    relationSource: 'ai',
    description: '皆與「看」相關，語意相近。',
  },
  {
    source: 'set.n',
    target: 'group.n',
    sourceSenseIndex: 0,
    relationType: 'similarMeaning',
    relationSource: 'manual',
    description: '「一套／一組」與群組語意相近。',
  },
  {
    source: 'set.n',
    target: 'device.n',
    sourceSenseIndex: 1,
    relationType: 'similarMeaning',
    relationSource: 'ai',
    description: '皆指電子裝置整體。',
  },
  {
    source: 'set.n',
    target: 'scene.n',
    sourceSenseIndex: 3,
    relationType: 'similarMeaning',
    relationSource: 'manual',
    description: '佈景與場景語意相近。',
  },
  {
    source: 'set.n',
    target: 'sit.v',
    sourceSenseIndex: 0,
    relationType: 'confusable',
    relationSource: 'ai',
    description: '拼字相近（set／sit），容易混淆。',
  },
  {
    source: 'set.n',
    target: 'set.v',
    sourceSenseIndex: 4,
    relationType: 'partOfSpeechVariant',
    relationSource: 'manual',
    description: '同一單字的名詞／動詞用法。',
  },
]

export async function clearAllData(): Promise<void> {
  await db.transaction('rw', db.cards, db.senses, db.relations, async () => {
    await db.relations.clear()
    await db.senses.clear()
    await db.cards.clear()
  })
}

export async function seedDevData(): Promise<void> {
  await clearAllData()

  const cardIdByKey = new Map<string, string>()
  // Senses in creation order per card, so relations can point at a specific
  // sense by index (defaulting to 0, the primary sense).
  const senseIdsByKey = new Map<string, string[]>()

  for (const seedCard of SEED_CARDS) {
    const card = await createCard({
      word: seedCard.word,
      partOfSpeech: seedCard.partOfSpeech,
      phonetic: seedCard.phonetic,
    })
    cardIdByKey.set(seedCard.key, card.id)

    const senseIds: string[] = []
    for (const sense of seedCard.senses) {
      const created = await createSense({ cardId: card.id, ...sense })
      senseIds.push(created.id)
    }
    senseIdsByKey.set(seedCard.key, senseIds)

    await db.cards.update(card.id, {
      familiarityScore: seedCard.familiarityScore,
      isStarred: seedCard.isStarred ?? false,
      errorCount: seedCard.errorCount ?? 0,
      updatedAt: Date.now(),
    })
  }

  for (const relation of SEED_RELATIONS) {
    const isSenseLevel = isSenseLevelRelationType(relation.relationType)
    await createRelation({
      sourceCardId: cardIdByKey.get(relation.source)!,
      targetCardId: cardIdByKey.get(relation.target)!,
      sourceSenseId: isSenseLevel
        ? senseIdsByKey.get(relation.source)![relation.sourceSenseIndex ?? 0]
        : undefined,
      targetSenseId: isSenseLevel
        ? senseIdsByKey.get(relation.target)![relation.targetSenseIndex ?? 0]
        : undefined,
      relationType: relation.relationType,
      relationSource: relation.relationSource,
      description: relation.description,
    })
  }

  console.info(`[lexicard] dev seed data loaded: ${SEED_CARDS.length} cards`)
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
