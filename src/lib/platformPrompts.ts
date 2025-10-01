import { PlatformId } from "@/utils/types";

export function getPrompt(platformId: PlatformId, userMessage: string): string {
  let instruction = "";

  switch (platformId) {
    case "Instagram":
      instruction = `Write in a personal, storytelling tone. Use emojis. End with a call to action. After the main caption, add 5 vertical dots on new lines, followed by relevant hashtags.`;
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

  return `You are an expert social media copywriter.
Analyze the user's request for a social media post for the platform: ${platformId}.

User's Context: "${userMessage}"

Follow these rules strictly: ${instruction}

IMPORTANT: Generate ONLY the final text for the social media post. Do not include any explanations, titles, or any text other than the post content itself.`;
}
