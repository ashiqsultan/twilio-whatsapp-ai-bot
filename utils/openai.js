const OpenAI = require('openai');

const openaiApiKey = process.env.OPENAI_API_KEY || '';
const openai = new OpenAI({
  apiKey: openaiApiKey,
});

async function main(context, message) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: context,
      },
      { role: 'user', content: message },
    ],
    model: 'gpt-3.5-turbo',
    response_format: { type: 'json_object' },
  });
  const outputJson = JSON.parse(completion.choices[0].message.content);
  console.log('===== openAiResponse START =====');
  console.log(outputJson);
  console.log('===== openAiResponse END =====');
  return outputJson;
}

module.exports = main;
