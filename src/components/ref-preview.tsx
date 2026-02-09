"use client";

import type { Character } from "@/types";

interface RefPreviewProps {
  refCharacter: Character;
  onStart: () => void;
}

const RefPreview = ({ refCharacter, onStart }: RefPreviewProps) => {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen px-6 text-center"
      aria-label="친구의 소비 캐릭터 미리보기"
    >
      <p className="text-sm text-white/60 mb-4">친구의 소비 캐릭터</p>

      <div className="text-5xl mb-4" role="img" aria-label={refCharacter.name}>
        {refCharacter.emoji}
      </div>

      <h1 className="text-2xl font-bold mb-1" style={{ color: refCharacter.color }}>
        {refCharacter.name}
      </h1>

      <p className="text-white/70 text-sm mb-10">{refCharacter.title}</p>

      <button
        type="button"
        onClick={onStart}
        className="px-8 py-4 rounded-small text-white font-semibold text-lg
                   transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        style={{
          backgroundColor: refCharacter.color,
        }}
      >
        나도 해보고 비교하기 👀
      </button>
    </main>
  );
};

export default RefPreview;
