import { PlatformId } from "@/utils/types";

export function getPrompt(
  platformId: PlatformId,
  userMessage: string,
  hasImage: boolean
): string {
  let instruction = "";

  switch (platformId) {
    case "Instagram":
      instruction = `Write in a personal, storytelling tone. Use emojis. End with a call to action. After the main caption, add 5 VERTICAL dots ON NEW LINES, followed by relevant hashtags.`;
      break;
    case "Twitter":
      instruction = `Keep the content short and punchy (under 280 characters). Use wit or bold statements. Append relevant hashtags directly to the end of the text.`;
      break;
    case "Facebook":
      instruction = `Write in a friendly, conversational tone (2-3 sentences). After the main text, add a new line, followed by relevant hashtags.`;
      break;
    case "LinkedIn":
      instruction = `Use a professional, insightful tone (1-2 short paragraphs). After the main text, add two new lines, followed by relevant hashtags.`;
      break;
  }

  const imageInstruction = hasImage
    ? "Carefully analyze the provided image. Identify key elements, mood, context, subjects, and any text visible in the image."
    : "";

  const contextSection = userMessage.trim()
    ? `User's Context/Requirements: "${userMessage}"\n\nSynthesize the image analysis with the user's context to create a cohesive message.`
    : "Based purely on your image analysis, create engaging content that captures what you see.";

  return `You are an expert social media copywriter for ${platformId}.

${imageInstruction}

${contextSection}

Platform-Specific Rules: ${instruction}

IMPORTANT: Generate ONLY the final text for the social media post. Do not include any explanations, preambles, titles, or any text other than the post content itself. Start directly with the post content.`;
}
