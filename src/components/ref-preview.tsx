"use client";

import type { Character } from "@/types";

interface RefPreviewProps {
  refCharacter: Character;
  onStart: () => void;
}

const RefPreview = ({ refCharacter, onStart }: RefPreviewProps) => {
  const totalScore = Math.round(
    (refCharacter.stats.plan + refCharacter.stats.invest + refCharacter.stats.yolo) / 3,
  );

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen px-6 text-center"
      aria-label="친구의 소비 캐릭터 미리보기"
    >
      <p className="text-white/35 text-sm mb-6 tracking-wider">친구의 소비 캐릭터</p>

      <div className="text-6xl mb-4" role="img" aria-label={refCharacter.name}>
        {refCharacter.emoji}
      </div>

      <h1 className="text-[1.75rem] font-bold mb-1" style={{ color: refCharacter.color }}>
        {refCharacter.name}
      </h1>

      <p className="text-white/40 text-sm mb-6">{refCharacter.title}</p>

      {/* Mini stats card */}
      <div className="w-full max-w-[260px] bg-white/[0.06] rounded-xlarge px-5 py-4 mb-8">
        <div className="flex justify-between text-[11px] text-white/40 mb-2">
          <span>소비력</span>
          <span className="font-mono font-bold text-white/70">{totalScore}점</span>
        </div>
        <div className="flex justify-between text-[11px] text-white/40 mb-2">
          <span>희귀도</span>
          <span className="font-mono">[{refCharacter.badge}]</span>
        </div>
        <div className="flex justify-between text-[11px] text-white/40">
          <span>출현율</span>
          <span className="font-mono">100명 중 {refCharacter.rarity}명</span>
        </div>
      </div>

      <p className="text-white/55 text-sm mb-8 leading-relaxed">
        친구 소비력 <span className="font-bold text-white/90">{totalScore}점</span>이래.
        <br />
        이길 수 있어?
      </p>

      <button
        type="button"
        onClick={onStart}
        className="px-10 py-4 rounded-xlarge text-white font-semibold text-lg
                   transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        style={{ backgroundColor: refCharacter.color }}
      >
        나도 테스트하기
      </button>
    </main>
  );
};

export default RefPreview;
