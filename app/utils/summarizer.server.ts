import { pipeline } from "@huggingface/transformers";

let summarizer: any = null;
// Initialize the model
async function initializeSummarizer() {
  if (!summarizer) {
    summarizer = await pipeline("text-generation",
      "onnx-community/Qwen2.5-Coder-0.5B-Instruct",
      { dtype: "q4" },);
  }
  return summarizer;
};

export async function generateSummary(prompt: FormDataEntryValue) {
  const model = await initializeSummarizer();

  const messages = [
    { role: "system", content: "You are Qwen, created by Alibaba Cloud. You are a helpful assistant." },
    { role: "user", content:  prompt },
  ];

  const result = await model(messages, {
    max_new_tokens: 300,
    temperature: 0.7,
    do_sample: false,
    top_k: 50,
    top_p: 0.9,
  });
  if (result[0].generated_text?.length) {
    return result[0].generated_text[result[0].generated_text.length - 1].content;
  }
  else return null;
};