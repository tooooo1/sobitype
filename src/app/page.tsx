import type { Metadata } from "next";
import SpendingTest from "@/components/spending-test";
import { CHARACTERS } from "@/lib/characters";
import { parseRefCode } from "@/lib/utils";
import type { MainCode } from "@/types";

const isMainCode = (code: string): code is MainCode => {
  return code in CHARACTERS;
};

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}): Promise<Metadata> => {
  const { ref } = await searchParams;
  const refCode = ref ? ref.slice(0, 3) : null;

  if (refCode && isMainCode(refCode)) {
    const character = CHARACTERS[refCode];
    return {
      title: `${character.emoji} ${character.name} | 소비 유형 테스트`,
      description: `${character.title} — 너는 어떤 소비 캐릭터야? 4문항으로 확인하기`,
      openGraph: {
        type: "website",
        title: `${character.emoji} ${character.name}`,
        description: `${character.title} — 너는 어떤 소비 캐릭터야?`,
        images: [`/api/og?code=${refCode}`],
      },
    };
  }

  return {
    title: "내 소비 캐릭터는? | 소비 유형 테스트",
    description:
      "4문항으로 알아보는 내 소비 캐릭터. 전국에서 나 같은 유형은 몇 %? 친구와 궁합도 확인하기",
    openGraph: {
      type: "website",
      images: ["/api/og"],
    },
  };
};

const Home = async ({ searchParams }: { searchParams: Promise<{ ref?: string }> }) => {
  const { ref } = await searchParams;
  const refCode = ref ? parseRefCode(ref) : null;

  return <SpendingTest refCode={refCode} />;
};

export default Home;
