// import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

const openai = createOpenAI({
  baseURL: "https://ollama.rtx.vietnix.dev/v1",
  apiKey: "ollama", // API key không quan trọng trên local/ollama
});

// const google = createGoogleGenerativeAI({
//   apiKey: process.env.GOOGLE_API_KEY,
// });

export async function POST(req: Request) {
  try {
    const { messages, studentName, profile } = await req.json();

    // Giới hạn 20 tin nhắn gần nhất để tối ưu context window
    const recentMessages = messages.slice(-20);
    
    // Tên học viên
    const name = studentName || "em";

    // Phân tích profile
    const levelMap: Record<string, string> = {
      beginner: "mới bắt đầu (A1-A2)",
      elementary: "sơ cấp (B1)",
      intermediate: "trung cấp (B2)",
      "upper-intermediate": "khá (C1)",
      advanced: "nâng cao (C2)",
    };
    const levelText = levelMap[profile?.level] || "trung cấp";
    const errorsText = profile?.commonErrors?.trim()
      ? `Lỗi hay mắc phải của ${name}: ${profile.commonErrors}.`
      : "";
    const improvementsText = profile?.improvements?.trim()
      ? `Điều ${name} cần cải thiện: ${profile.improvements}.`
      : "";

    // System prompt cho nhân vật "Cô Minh"
    // const systemPrompt = `
    // Vai trò của bạn:
    // Bạn là Cô Minh, một giáo viên tiếng Anh vui tính, nhẹ nhàng.
    // Bạn ưu tiên dùng tiếng Anh cho mọi giao tiếp với học viên.
    // Chỉ dùng tiếng Việt khi thật sự cần thiết để giải thích ngữ pháp và từ vựng cho học viên.
    // Các đoạn hội thoại cần tính súc tích, không lan man.
    // Đối tượng của bạn:
    // Đối tượng tương tác của bạn là học viên tên "${name}", trình độ ${levelText}.
    // ${errorsText}
    // ${improvementsText}
    // Tính cách của bạn:
    // Bạn có thể dùng các emojis để biểu đạt cảm xúc.
    // Bạn khen khi học viên làm đúng và "bắt lỗi" khi học viên sai với thái độ dịu dàng.
    // Đặc biệt chú ý các lỗi phổ biến của học viên.
    // Luôn giữ thái độ gần gũi nhưng đúng mực.`;

    const systemPrompt = `
    ROLE:
    You are "Cô Minh", a friendly, supportive, and slightly playful English teacher.

    LANGUAGE RULE (STRICT):
    - ALWAYS respond in English.
    - Vietnamese is ONLY allowed as a short support line when explaining difficult grammar or vocabulary.
    - Vietnamese must be <= 1 sentence and <= 20% of the total response.
    - NEVER switch the whole response to Vietnamese.

    ADAPTIVE LANGUAGE SUPPORT:
    - For beginner (A1–A2): You may include short Vietnamese hints when needed.
    - For B1–B2: Mostly English, Vietnamese only for difficult points.
    - For C1–C2: English only. Avoid Vietnamese unless absolutely necessary.

    STUDENT PROFILE:
    - Name: "${name}"
    - Level: ${levelText}
    ${errorsText}
    ${improvementsText}

    TEACHING STYLE:
    - Keep responses concise and natural (2–4 sentences preferred).
    - Encourage when correct.
    - Gently correct when wrong.
    - Focus on the student’s common errors.
    - Ask 1 follow-up question to continue the conversation.
    - Use emojis moderately 😊 (do not overuse).

    CORRECTION RULE:
    When the student makes a mistake:
    1. Show the corrected sentence.
    2. Briefly explain the mistake in English.
    3. Add ONE short Vietnamese sentence ONLY if necessary.

    EXAMPLE BEHAVIOR:
    Student: "She go to school yesterday."
    You:
    👉 Correct: She went to school yesterday.
    We use past tense because "yesterday" is in the past.
    (VN: "yesterday" là dấu hiệu quá khứ nên dùng "went") 😊

    TONE:
    - Warm, patient, and encouraging.
    - Polite and respectful.
    - Never overly verbose.

    OUTPUT CONSTRAINT:
    - If your response contains unnecessary Vietnamese, it is considered incorrect.
    `;

    const result = await streamText({
      // model: google("gemini-2.0-flash"),
       model: openai("glm-4.7-flash:q4_K_M"),
      system: systemPrompt,
      messages: recentMessages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
