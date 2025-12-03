const key = "";

import {
  GoogleGenAI,
} from '@google/genai';

async function runChat(prompt) {
  const ai = new GoogleGenAI({
    apiKey: key,
  });
  const tools = [
    {
      googleSearch: {
      }
    },
  ];
  const config = {
    thinkingConfig: {
      thinkingLevel: 'HIGH',
    },
    tools,
  };
  const model = 'gemini-3-pro-preview';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  for await (const chunk of response) {
    console.log(chunk.text);
  }
  console.log('response ', response.text)
  return response.text;
}

export default runChat;
