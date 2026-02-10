import { describe, expect, test } from "bun:test";
import {
  buildShareURL,
  deriveResult,
  formatDate,
  getCompatComment,
  getTotalScore,
  isEIAxis,
  isMainCode,
  parseRefCode,
} from "@/lib/utils";
import type { MainCode } from "@/types";

describe("isMainCode", () => {
  test("returns true for all valid MainCode values", () => {
    const codes = ["SNF", "SNL", "SRF", "SRL", "PNF", "PNL", "PRF", "PRL"];
    for (const code of codes) {
      expect(isMainCode(code)).toBe(true);
    }
  });

  test("returns false for invalid codes", () => {
    expect(isMainCode("ABC")).toBe(false);
    expect(isMainCode("")).toBe(false);
    expect(isMainCode("snf")).toBe(false);
    expect(isMainCode("SN")).toBe(false);
    expect(isMainCode("SNFL")).toBe(false);
  });
});

describe("isEIAxis", () => {
  test("returns true for E and I", () => {
    expect(isEIAxis("E")).toBe(true);
    expect(isEIAxis("I")).toBe(true);
  });

  test("returns false for other values", () => {
    expect(isEIAxis("e")).toBe(false);
    expect(isEIAxis("X")).toBe(false);
    expect(isEIAxis("")).toBe(false);
  });
});

describe("getTotalScore", () => {
  test("returns rounded average of three stats", () => {
    expect(getTotalScore({ plan: 80, invest: 70, yolo: 90 })).toBe(80);
    expect(getTotalScore({ plan: 100, invest: 100, yolo: 100 })).toBe(100);
    expect(getTotalScore({ plan: 0, invest: 0, yolo: 0 })).toBe(0);
  });

  test("rounds correctly", () => {
    // (10 + 15 + 5) / 3 = 10
    expect(getTotalScore({ plan: 10, invest: 15, yolo: 5 })).toBe(10);
    // (33 + 33 + 34) / 3 = 33.333... -> 33
    expect(getTotalScore({ plan: 33, invest: 33, yolo: 34 })).toBe(33);
  });
});

describe("formatDate", () => {
  test("returns date in YYYY.MM.DD format", () => {
    const result = formatDate();
    expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2}$/);
  });
});

describe("deriveResult", () => {
  test("derives correct mainCode and subCode from answers", () => {
    // answers[0]=SP, answers[1]=EI, answers[2]=NR, answers[3]=FL
    // mainCode = answers[0] + answers[2] + answers[3]
    const result = deriveResult(["S", "E", "N", "F"]);
    expect(result).toEqual({ mainCode: "SNF", subCode: "E" });
  });

  test("derives all 8 main codes correctly", () => {
    const cases: Array<{ answers: string[]; mainCode: MainCode }> = [
      { answers: ["S", "E", "N", "F"], mainCode: "SNF" },
      { answers: ["S", "I", "N", "L"], mainCode: "SNL" },
      { answers: ["S", "E", "R", "F"], mainCode: "SRF" },
      { answers: ["S", "I", "R", "L"], mainCode: "SRL" },
      { answers: ["P", "E", "N", "F"], mainCode: "PNF" },
      { answers: ["P", "I", "N", "L"], mainCode: "PNL" },
      { answers: ["P", "E", "R", "F"], mainCode: "PRF" },
      { answers: ["P", "I", "R", "L"], mainCode: "PRL" },
    ];
    for (const { answers, mainCode } of cases) {
      const result = deriveResult(answers);
      expect(result.mainCode).toBe(mainCode);
    }
  });

  test("throws on invalid combination", () => {
    expect(() => deriveResult(["X", "E", "N", "F"])).toThrow("Invalid result");
  });

  test("throws on invalid subCode", () => {
    expect(() => deriveResult(["S", "X", "N", "F"])).toThrow("Invalid result");
  });
});

describe("parseRefCode", () => {
  test("parses valid 3-char ref code", () => {
    expect(parseRefCode("SNF")).toBe("SNF");
    expect(parseRefCode("PRL")).toBe("PRL");
  });

  test("parses ref code from longer string (first 3 chars)", () => {
    expect(parseRefCode("SNFE")).toBe("SNF");
    expect(parseRefCode("PRLIextra")).toBe("PRL");
  });

  test("returns null for invalid ref code", () => {
    expect(parseRefCode("ABC")).toBeNull();
    expect(parseRefCode("")).toBeNull();
    expect(parseRefCode("SN")).toBeNull();
  });
});

describe("getCompatComment", () => {
  test("returns known comment for defined pair", () => {
    const comment = getCompatComment("SNF", "SRL");
    expect(comment).toBe("한 명이 지르면 한 명이 막는다. 환상의 밸런스");
  });

  test("returns same comment regardless of order", () => {
    expect(getCompatComment("SNF", "SRL")).toBe(getCompatComment("SRL", "SNF"));
    expect(getCompatComment("PRF", "SNL")).toBe(getCompatComment("SNL", "PRF"));
  });

  test("returns same-type comment when codes match", () => {
    const comment = getCompatComment("SNF", "SNF");
    expect(comment).toContain("약점도 같아서");
  });

  test("returns generic comment for undefined pair", () => {
    // SNF-PNL is not in COMPAT_COMMENTS
    const comment = getCompatComment("SNF", "PNL");
    expect(comment).toContain("서로 다른 매력");
  });

  test("returns known comment for all defined pairs", () => {
    const definedPairs: Array<[MainCode, MainCode]> = [
      ["SNF", "SRL"],
      ["PRF", "SNL"],
      ["PNF", "SNL"],
      ["PNF", "SRL"],
      ["PNF", "PRL"],
      ["PRF", "PRF"],
      ["SRL", "SRL"],
      ["PRF", "SNF"],
      ["PRL", "SRF"],
      ["PNL", "SRF"],
    ];
    for (const [a, b] of definedPairs) {
      const comment = getCompatComment(a, b);
      expect(comment).not.toContain("서로 다른 매력");
    }
  });
});

describe("buildShareURL", () => {
  test("returns empty string on server (no window)", () => {
    // In bun:test, window is undefined
    const result = buildShareURL("SNF", "E", "kakao");
    expect(result).toBe("");
  });
});
