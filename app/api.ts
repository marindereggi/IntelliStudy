"use server"

export async function apiCall(inputText: FormDataEntryValue, prompt: string) {
  console.log(inputText)

  const model = "gpt-3.5-turbo"
  const token = process.env.OPENAI_API_KEY

  return fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt + inputText }],
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Request failed")
      }
      return response.json()
    })
    .then((data) => {
      console.log(data.choices[0].message.content)
      return data.choices[0].message.content
    })
    .catch((error) => {
      console.error(error)
    })
}

export async function handleSubmitPovzetek(data: FormData) {
  const inputText = data.get("inputText")
  if (!inputText) return null

  const prompt = `Pripravi povzetek le iz podanega besedila, ki ni daljši od 10 stavkov, kjer povzameš najpomembnejše podatke iz teksta, ki je podan. `
  return await apiCall(inputText, prompt)
}

export async function handleSubmitVprasanja(data: FormData) {
  const inputText = data.get("inputText")
  if (!inputText) return null

  const prompt = `Ko dobiš podano besedilo, oblikuj vprašanja in odgovore ter jih podaj v JSON obliki. Podaj 10 vprasanj. Tvoj odgovor naj bo samo JSON oblika in čisto nič drugega. Če ne dobiš besedila, ne naredi nič. To je le primer strukture odgovora, po katerem se zgleduj.Vedno uporabi tako obliko. Vedno vrni json file brez ddatnega besedila. Torej počakaj na novo besedilo:
  {
    "vprasanja": [
      {
        "vprasanje": "Kje se nahaja Slovenija?",
        "odgovor": "Slovenija se nahaja na skrajnem severu Sredozemlja in na skrajnem jugu Srednje Evrope."
      },
    ]
  }
  Pripravi 10 vprašanj. Vse kar sledi, je besedilo, iz česar sestavi vprašanja: `

  return await apiCall(inputText, prompt)
}

export async function handleSubmitABCD(data: FormData) {
  const inputText = data.get("inputText")
  if (!inputText) return null

  const prompt = `Za podani tekst sestavi 10 vprašanj z odgovori a b c, od katerih je eden pravilen in jih zapisi v JSON obliki.
    JSON mora biti vedno v taki obliki kot je podan primer.
    JSON file (NE napiši drugega besedila, vrni SAMO json), ki je kot primer:
    {
      "vprasanja": [
        {
          "vprasanje": "Kako se znanstveno imenuje konj?",
          "odgovor": {
            "a": "Equus caballus",
            "b": "Equus asinus",
            "c": "Equus zebra"
          },
          "pravilenOdgovor": "a"
        },
        {
          "vprasanje": "Kako se imenuje samcu domačega konja?",
          "odgovor": {
            "a": "Žrebec",
            "b": "Kobila",
            "c": "Žrebe"
          },
          "pravilenOdgovor": "a"
        }
      ]
    }
    Sledi besedilo, iz katerega sestavi vprašanja: 
    `
  return await apiCall(inputText, prompt)
}
