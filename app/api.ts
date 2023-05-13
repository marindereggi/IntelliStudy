// api.ts
"use server"
export async function handleSubmit(data: FormData) {
    const inputText = data.get("inputText");
    console.log(inputText);
  
    const prompt = inputText;
    const model = "gpt-3.5-turbo";
    const token = "qzWOoGbUqRQhc5i0kSkfmzkdFmcRwq";
  
    try {
      const response = await fetch(
        "https://openai-api.meetings.bio/api/openai/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Request failed");
      }
  
      const data = await response.json();
      console.log(data.choices[0].message.content);
      return data.choices[0].message.content;
    } catch (error) {
      console.error(error);
    }
  }
  