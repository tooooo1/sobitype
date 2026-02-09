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
      <div className="text-6xl mb-5" role="img" aria-label={refCharacter.name}>
        {refCharacter.emoji}
      </div>

      <h1 className="text-[1.75rem] font-bold mb-1" style={{ color: refCharacter.color }}>
        {refCharacter.name}
      </h1>

      <p className="text-white/50 mb-12">{refCharacter.title}</p>

      <button
        type="button"
        onClick={onStart}
        className="px-8 py-4 rounded-xlarge text-white font-semibold text-lg
                   transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        style={{
          backgroundColor: refCharacter.color,
        }}
      >
        나도 테스트하기
      </button>
    </main>
  );
};

export default RefPreview;
