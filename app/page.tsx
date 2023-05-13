import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function IndexPage() {
  async function handleSubmit(data: FormData) {
    "use server"
    const inputText = data.get("inputText")
    console.log(inputText)

    const prompt = inputText
    const model = "gpt-3.5-turbo"
    const token = "qzWOoGbUqRQhc5i0kSkfmzkdFmcRwq"

    return await fetch("https://openai-api.meetings.bio/api/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
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

    // ...
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Besedilo
          <br className="hidden sm:inline" />
          Besedilo
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Besedilo
        </p>
      </div>
      {/* <form className="flex gap-4">
        <Textarea />
      <div className="flex gap-4">
        <Button>Upload</Button>
      </div>
      </form> */}
      <form action={handleSubmit}>
        <Textarea name="inputText" />
        <Button type="submit">Submit</Button>
      </form>
    </section>
  )
}
