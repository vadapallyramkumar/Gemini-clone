export default async function runChat(prompt) {
  const res = await fetch(`/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-app-secret": import.meta.env.VITE_FRONTEND_SECRET },
    body: JSON.stringify({ prompt })
  });
  console.log('res ', res);
  
  // for await (const chunk of res) {
  //   return chunk.text;
  // }
};