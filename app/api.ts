// api.ts
"use server"

export async function handleSubmit(data: FormData) {
  const inputText = data.get("inputText")
  console.log(inputText)

  const prompt = `Ko dobiš podano besedilo, oblikuj vprašanja in odgovore ter jih podaj v JSON obliki. Tvoj odgovor naj bo samo JSON oblika in čisto nič drugega. Če ne dobiš besedila, ne naredi nič. To je le primer strukture odgovora, po katerem se zgleduj. Torej počakaj na novo besedilo:
{
  "vprasanja": [
    {
      "vprasanje": "Kje se nahaja Slovenija?",
      "odgovor": "Slovenija se nahaja na skrajnem severu Sredozemlja in na skrajnem jugu Srednje Evrope."
    },
  ]
}
Pripravi 10 vprašanj. Vse kar sledi, je besedilo, iz česar sestavi vprašanja: `
  const model = "gpt-3.5-turbo"
  const token = "qzWOoGbUqRQhc5i0kSkfmzkdFmcRwq"

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
          messages: [{ role: "user", content: prompt + inputText }],
        }),
      }
    )

    if (!response.ok) {
      throw new Error("Request failed")
    }

    const data = await response.json()
    console.log(data.choices[0].message.content)
    return data.choices[0].message.content
  } catch (error) {
    console.error(error)
  }
}
