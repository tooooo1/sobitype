export type MainCode = "SNF" | "SNL" | "SRF" | "SRL" | "PNF" | "PNL" | "PRF" | "PRL";

export type EIAxis = "E" | "I";

export type QuestionId = "q1" | "q2" | "q3" | "q4";

export interface ChoiceOption {
  readonly text: string;
  readonly emoji: string;
  readonly value: string;
}

export interface Question {
  readonly id: QuestionId;
  readonly axis: string;
  readonly text: string;
  readonly a: ChoiceOption;
  readonly b: ChoiceOption;
  readonly ratio: { readonly A: number; readonly B: number };
}

export interface CharacterStats {
  readonly plan: number;
  readonly invest: number;
  readonly yolo: number;
}

export interface Character {
  readonly emoji: string;
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly color: string;
  readonly cardBg: string;
  readonly rarity: number;
  readonly badge: string;
  readonly badgeColor: string;
  readonly stats: CharacterStats;
  readonly oneLiner: string;
  readonly traits: readonly { readonly label: string; readonly value: string }[];
  readonly match: { readonly best: MainCode; readonly worst: MainCode };
}

export type GAEventName =
  | "q1_answer"
  | "q2_answer"
  | "q3_answer"
  | "q4_answer"
  | "result_view"
  | "share_kakao"
  | "share_oneline"
  | "share_link"
  | "share_image"
  | "compat_auto"
  | "compat_share"
  | "ref_landing"
  | "restart";

type ResultData = {
  mainCode: MainCode;
  subCode: EIAxis;
  randomTag: string;
  refCode: MainCode | null;
};

export type AppState =
  | { phase: "ref-preview"; refCode: MainCode }
  | { phase: "question"; qi: number; answers: string[]; refCode: MainCode | null }
  | ({ phase: "loading" } & ResultData)
  | ({ phase: "result" } & ResultData);
