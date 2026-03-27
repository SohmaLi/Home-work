import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

const openai = createOpenAI({
  baseURL: "https://ollama.rtx.vietnix.dev/v1",
  apiKey: "ollama",
});

const WordSchema = z.object({
  word: z.string().describe("The correct English word (may differ from input if input was misspelled)"),
  corrected_word: z
    .string()
    .optional()
    .describe("If the input was misspelled, set this to the corrected word. Leave empty/omit if input was correct."),
  phonetic: z.string().describe("IPA phonetic transcription, e.g. /lɜːrn/"),
  meaning: z.string().describe("Vietnamese meaning of the word"),
  example: z.string().describe("A natural English example sentence using the word"),
  grammar_notes: z
    .array(z.string())
    .describe("List of grammar notes related to this word (verb forms, collocations, etc.)"),
  level: z
    .enum(["Dễ", "Trung bình", "Khó"])
    .describe("Difficulty level of the word"),
});

export type WordResult = z.infer<typeof WordSchema>;

export async function POST(req: Request) {
  try {
    const { word } = await req.json();

    if (!word || typeof word !== "string") {
      return Response.json({ error: "Vui lòng nhập từ vựng hợp lệ." }, { status: 400 });
    }

    const { object } = await generateObject({
      model: openai("glm-4.7-flash:q4_K_M"),
      schema: WordSchema,
      prompt: `You are a professional English dictionary with spell-checking ability.

The user input is: "${word.trim()}"

Step 1 — Spell check:
- If the input is a valid English word, proceed normally. Do NOT set corrected_word.
- If the input is misspelled or not a real English word, find the closest correct English word.
  - Set "word" to the corrected word.
  - Set "corrected_word" to the corrected word (so the UI knows to show a correction notice).

Step 2 — Dictionary entry for the (possibly corrected) word:
- phonetic: standard IPA notation
- meaning: clear Vietnamese translation
- example: a natural, common sentence
- grammar_notes: 2-4 useful grammar/usage notes
- level: "Dễ" (A1-B1), "Trung bình" (B2-C1), or "Khó" (C2+)`,
    });

    return Response.json(object);
  } catch (error) {
    console.error("Dictionary API Error:", error);
    return Response.json(
      { error: "Không thể tra cứu từ này. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
