import { OpenAIStream } from "../lib/OpenAIStream"

export interface APIrequest {
  vrstaVprasanja: string
  inputText: string
}

export const config = {
  runtime: "edge",
}

export default async function api(req: Request) {
  const { vrstaVprasanja, inputText } = (await req.json()) as APIrequest

  const prompt = getPrompt(vrstaVprasanja)
  const stream = await OpenAIStream(payload(inputText, prompt))

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

function payload(inputText: string, prompt: string) {
  return JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt + inputText }],
    stream: true,
  })
}

function getPrompt(tip: string) {
  switch (tip) {
    default:
    case "Povzetek":
      return `Pripravi povzetek le iz podanega besedila, ki ni daljši od 10 stavkov, kjer povzameš najpomembnejše podatke iz teksta, ki je podan. `
    case "vprasanja":
      return `Ko dobiš podano besedilo, oblikuj vprašanja in odgovore ter jih podaj v JSON obliki. Podaj 10 vprasanj. Tvoj odgovor naj bo samo JSON oblika in čisto nič drugega. Če ne dobiš besedila, ne naredi nič. To je le primer strukture odgovora, po katerem se zgleduj.Vedno uporabi tako obliko. Vedno vrni json file brez ddatnega besedila. Torej počakaj na novo besedilo:
      {
        "vprasanja": [
          {
            "vprasanje": "Kje se nahaja Slovenija?",
            "odgovor": "Slovenija se nahaja na skrajnem severu Sredozemlja in na skrajnem jugu Srednje Evrope."
          },
        ]
      }
      Pripravi 10 vprašanj. Vse kar sledi, je besedilo, iz česar sestavi vprašanja: `
    case "A B C ":
      return `Za podani tekst sestavi 10 vprašanj z odgovori a b c, od katerih je eden pravilen in jih zapisi v JSON obliki.
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
  }
}
