import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import FamiliarityIcon from '../components/FamiliarityIcon'
import SenseSection from '../components/SenseSection'
import RelationSection from '../components/RelationSection'
import ConfirmDialog from '../components/ConfirmDialog'
import { StarIcon, SpeakerIcon, TrashIcon, ChevronLeftIcon } from '../components/icons'
import { useCardDetail } from '../hooks/useCardDetail'
import { deleteCard, updateCard } from '../lib/repositories/cardRepository'

function CardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { card, senses, relationsWithCards } = useCardDetail(id)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  if (!card) {
    return <p className="p-5 text-center text-sm text-ink-soft">載入中…</p>
  }

  async function handleToggleStar() {
    await updateCard(card!.id, { isStarred: !card!.isStarred })
  }

  function handlePlayPronunciation() {
    if (!('speechSynthesis' in window)) return
    const utterance = new SpeechSynthesisUtterance(card!.word)
    utterance.lang = 'en-US'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  async function handleConfirmDelete() {
    await deleteCard(card!.id)
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pt-6 pb-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 -ml-2 flex min-h-[44px] items-center gap-1 px-2 text-sm font-semibold text-ink-soft hover:text-accent"
      >
        <ChevronLeftIcon className="h-5 w-5" />
        上一頁
      </button>

      <div className="rounded-card bg-surface py-5 pr-5 pl-3 shadow-sm">
        <div className="flex items-start gap-1.5">
          <button
            type="button"
            onClick={() => void handleToggleStar()}
            aria-label={card.isStarred ? '取消星號' : '標記星號'}
            aria-pressed={card.isStarred}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full active:bg-paper-deep"
          >
            <StarIcon
              filled={card.isStarred}
              className={`h-6 w-6 ${card.isStarred ? 'text-gold' : 'text-rule'}`}
            />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <h1 className="font-display text-4xl font-semibold text-ink">{card.word}</h1>
                {card.partOfSpeech && (
                  <span className="rounded-full bg-paper-deep px-2 py-0.5 font-mono text-xs text-ink-soft">
                    {card.partOfSpeech}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handlePlayPronunciation}
                aria-label="播放發音"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-stone-100 hover:text-accent"
              >
                <SpeakerIcon className="h-6 w-6" />
              </button>
            </div>
            {card.phonetic && (
              <p className="mt-1 font-mono text-sm text-ink-soft">{card.phonetic}</p>
            )}
            <div className="mt-3 flex items-center justify-between gap-3">
              <FamiliarityIcon score={card.familiarityScore} showLabel />
              <p className="text-xs text-ink-soft">
                建立於 {new Date(card.createdAt).toLocaleDateString('zh-TW')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SenseSection cardId={card.id} senses={senses} />
      <RelationSection cardId={card.id} relationsWithCards={relationsWithCards} />

      <div className="mt-14 flex justify-center">
        <button
          type="button"
          onClick={() => setIsConfirmingDelete(true)}
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-accent px-6 text-sm font-semibold text-accent hover:bg-accent-soft"
        >
          <TrashIcon className="h-5 w-5" />
          刪除單字
        </button>
      </div>

      {isConfirmingDelete && (
        <ConfirmDialog
          title={`確定要刪除「${card.word}」嗎？`}
          description="刪除後無法恢復"
          onConfirm={() => void handleConfirmDelete()}
          onCancel={() => setIsConfirmingDelete(false)}
        >
          {relationsWithCards.length > 0 && (
            <div className="mt-3 rounded-lg bg-paper px-3 py-2 text-sm text-ink">
              <p className="font-semibold text-ink-soft">將與以下單字解除關聯：</p>
              <p className="mt-1.5">
                {relationsWithCards.map(({ relation, otherCard }, index) => (
                  <span key={relation.id} className="inline-block">
                    <span className="text-base font-semibold">
                      {otherCard?.word ?? '（已刪除的字卡）'}
                    </span>
                    {otherCard?.partOfSpeech && (
                      <span className="ml-1 rounded-full bg-paper-deep px-1.5 py-0.5 font-mono text-xs text-ink-soft">
                        {otherCard.partOfSpeech}
                      </span>
                    )}
                    {index < relationsWithCards.length - 1 && <span className="mr-1">、</span>}
                  </span>
                ))}
              </p>
            </div>
          )}
        </ConfirmDialog>
      )}
    </div>
  )
}

export default CardDetailPage
