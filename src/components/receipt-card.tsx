"use client";

import { CHARACTERS, SUB_TAGS } from "@/lib/characters";
import { formatDate, getCompatComment, getTotalScore } from "@/lib/utils";
import type { Character, EIAxis, MainCode } from "@/types";

interface ReceiptCardProps {
  character: Character;
  mainCode: MainCode;
  subCode: EIAxis;
  refCode: MainCode | null;
}

const StatBar = ({ value }: { value: number }) => (
  <div className="flex-1 h-[10px] bg-receipt-text/10 overflow-hidden">
    <div className="h-full bg-receipt-text" style={{ width: `${value}%` }} />
  </div>
);

const ReceiptCard = ({ character, mainCode, subCode, refCode }: ReceiptCardProps) => {
  const fullCode = `${mainCode}${subCode}`;
  const bestMatch = CHARACTERS[character.match.best];
  const worstMatch = CHARACTERS[character.match.worst];
  const refCharacter = refCode ? CHARACTERS[refCode] : null;
  const totalScore = getTotalScore(character.stats);

  const dateStr = formatDate();

  return (
    <div className="w-full max-w-[340px] animate-receipt-print">
      <div className="receipt-edge-top w-full h-[10px]" />

      <div className="receipt-body px-6 py-6">
        <div className="text-center mb-4">
          <h2 className="text-[13px] font-bold tracking-[0.2em] text-receipt-text">
            SOBITYPE 소비연구소
          </h2>
          <div className="receipt-divider-thick my-2" />
          <p className="text-[11px] text-receipt-text/50">소비 성향 명세서</p>
        </div>

        <div className="flex justify-between text-[11px] text-receipt-text/50 mb-1">
          <span>
            날짜 <span className="font-mono ml-1">{dateStr}</span>
          </span>
          <span>
            No. <span className="font-mono ml-1">#{fullCode}</span>
          </span>
        </div>

        <div className="receipt-divider" />

        <div className="text-center py-2">
          <div className="text-4xl mb-2" role="img" aria-label={character.name}>
            {character.emoji}
          </div>
          <h1 className="text-[1.35rem] font-bold text-receipt-text">{character.name}</h1>
          <p className="text-[12px] text-receipt-text/45 mt-1">&ldquo;{character.title}&rdquo;</p>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-receipt-text/8 text-receipt-text/50">
            #{SUB_TAGS[subCode]}
          </span>
        </div>

        <div className="receipt-divider" />

        {refCharacter && refCode ? (
          <div className="py-2">
            <h3 className="text-[12px] font-bold text-receipt-text mb-3">■ 소비 궁합 결과</h3>
            <div className="flex items-center justify-center gap-5 mb-3">
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">{character.emoji}</span>
                <span className="text-[10px] font-bold text-receipt-text/60">나</span>
                <span className="text-[9px] text-receipt-text/35">{character.name}</span>
              </div>
              <span className="text-receipt-text/20 text-xl font-light">&times;</span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">{refCharacter.emoji}</span>
                <span className="text-[10px] font-bold text-receipt-text/60">친구</span>
                <span className="text-[9px] text-receipt-text/35">{refCharacter.name}</span>
              </div>
            </div>
            <p className="text-[12px] text-receipt-text/70 text-center leading-relaxed font-medium">
              &ldquo;{getCompatComment(mainCode, refCode)}&rdquo;
            </p>
          </div>
        ) : (
          <div className="py-2">
            <h3 className="text-[12px] font-bold text-receipt-text mb-3">■ 소비 궁합</h3>
            <div className="flex items-center justify-center gap-5 mb-3">
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">{character.emoji}</span>
                <span className="text-[10px] font-bold text-receipt-text/60">나</span>
              </div>
              <span className="text-receipt-text/20 text-xl font-light">&times;</span>
              <div className="flex flex-col items-center gap-1">
                <div className="w-[30px] h-[30px] rounded-full border-2 border-dashed border-receipt-text/15 flex items-center justify-center">
                  <span className="text-receipt-text/25 text-sm">?</span>
                </div>
                <span className="text-[10px] text-receipt-text/30">???</span>
              </div>
            </div>
            <p className="text-[11px] text-receipt-text/45 text-center leading-relaxed">
              도전장을 보내고 궁합을 확인해보세요
            </p>
          </div>
        )}

        <div className="receipt-divider" />

        <div className="py-1">
          <h3 className="text-[12px] font-bold text-receipt-text mb-3">■ 소비 성향 분석</h3>
          <div className="flex flex-col gap-1.5">
            {[
              { label: "계획력", value: character.stats.plan },
              { label: "투자성향", value: character.stats.invest },
              { label: "YOLO", value: character.stats.yolo },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2 text-[11px] text-receipt-text">
                <span className="w-[52px] shrink-0 text-receipt-text/60">{label}</span>
                <StatBar value={value} />
                <span className="font-mono w-[28px] text-right font-bold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="receipt-divider" />

        <div className="py-1">
          <h3 className="text-[12px] font-bold text-receipt-text mb-3">■ 상세 진단</h3>
          <p className="text-[12px] text-receipt-text/70 leading-relaxed mb-3">
            {character.oneLiner}
          </p>
          <div className="flex flex-col gap-1.5">
            {character.traits.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-baseline text-[11px] font-mono text-receipt-text"
              >
                <span className="shrink-0 text-receipt-text/55">{label}</span>
                <span
                  className="flex-1 overflow-hidden whitespace-nowrap text-receipt-text/20 mx-0.5"
                  aria-hidden="true"
                >
                  {".................................................."}
                </span>
                <span className="shrink-0 font-bold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="receipt-divider" />

        <div className="py-1">
          <h3 className="text-[12px] font-bold text-receipt-text mb-3">■ 희귀도</h3>
          <div className="flex justify-between text-[12px] text-receipt-text">
            <span className="text-receipt-text/50">100명 중</span>
            <span className="font-mono font-bold">{character.rarity}명</span>
          </div>
          <div className="flex justify-between text-[12px] text-receipt-text mt-1">
            <span className="text-receipt-text/50">등급</span>
            <span className="font-mono font-bold">[{character.badge}]</span>
          </div>
        </div>

        {!refCode && (
          <>
            <div className="receipt-divider" />
            <div className="py-1">
              <h3 className="text-[12px] font-bold text-receipt-text mb-3">■ 궁합 힌트</h3>
              <div className="flex justify-between text-[11px] text-receipt-text">
                <span className="text-receipt-text/50">찰떡</span>
                <span>
                  {bestMatch.emoji} {bestMatch.name}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-receipt-text mt-1">
                <span className="text-receipt-text/50">상극</span>
                <span>
                  {worstMatch.emoji} {worstMatch.name}
                </span>
              </div>
            </div>
          </>
        )}

        <div className="receipt-divider-thick my-3" />

        <div className="py-1">
          <p className="text-[11px] text-receipt-text/50 mb-2 text-center">합계 — 총 소비력</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-[12px] bg-receipt-text/10 overflow-hidden">
              <div className="h-full bg-receipt-text" style={{ width: `${totalScore}%` }} />
            </div>
            <span className="font-mono text-[15px] font-bold text-receipt-text w-[28px] text-right">
              {totalScore}
            </span>
          </div>
        </div>

        <div className="receipt-barcode mt-5 mx-auto" />
      </div>

      <div className="receipt-edge-bottom w-full h-[10px]" />
    </div>
  );
};

export default ReceiptCard;
