import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function IndexPage() {
  async function handleSubmit(data: FormData) {
    "use server"
    console.log(data)
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
