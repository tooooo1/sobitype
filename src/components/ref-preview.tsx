'use client'

import type { Character } from '@/types'

interface RefPreviewProps {
  refCharacter: Character
  onStart: () => void
}

const RefPreview = ({ refCharacter, onStart }: RefPreviewProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <p className="text-sm text-white/50 mb-4">친구의 소비 캐릭터</p>

      <div className="text-5xl mb-4">{refCharacter.emoji}</div>

      <h2 className="text-2xl font-bold mb-1" style={{ color: refCharacter.color }}>
        {refCharacter.name}
      </h2>

      <p className="text-white/60 text-sm mb-10">{refCharacter.title}</p>

      <button
        type="button"
        onClick={onStart}
        className="px-8 py-4 rounded-2xl text-white font-semibold text-lg
                   transition-transform active:scale-95"
        style={{
          background: `linear-gradient(135deg, ${refCharacter.color}, ${refCharacter.color}99)`,
        }}
      >
        나도 해보고 비교하기 👀
      </button>
    </div>
  )
}

export default RefPreview
