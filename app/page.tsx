"use client"

import { FormEvent, useState } from "react"
import { Link, Loader2 } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button, buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { handleSubmit } from "./api"

interface FaqItem {
  vprasanje: string
  odgovor: string
}

interface FaqData {
  vprasanja: FaqItem[]
}

export default function IndexPage() {
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  function FaqPage() {
    const resp: FaqData = JSON.parse(response)
    return (
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <Accordion type="single" collapsible>
          {resp.vprasanja.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.vprasanje}</AccordionTrigger>
              <AccordionContent>{item.odgovor}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    )
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    console.log(typeof event)
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setLoading(true)

    try {
      const result = await handleSubmit(formData)
      setResponse(result)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  function getCSV() {
    const resp: FaqData = JSON.parse(response)
    var csv = ""
    resp.vprasanja.forEach(
      (item, index) => (csv += `"${item.vprasanje}","${item.odgovor}"\n`)
    )
    return csv
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

      <form onSubmit={handleFormSubmit}>
        <div className="flex gap-4 pb-8 md:py-4">
          <Label htmlFor="message-2">Your Message</Label>
          <Textarea
            name="inputText"
            placeholder="Post your text here"
            id="message-2"
          />
        </div>
        <div className="flex gap-4 pb-8 md:py-4">
          <Button type="submit" disabled={loading} className={buttonVariants({ size: "lg" })}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </form>

      {response !== "" && (
        <div>
          <h2>Response:</h2>
          <p>{FaqPage()}</p>
          <a
            href={"data:text/csv;charset=utf-8," + encodeURI(getCSV())}
            target="_blank"
            rel="noreferrer"
            download="faq.csv"
            className={buttonVariants({ size: "lg" })}
          >
            Download CSV
          </a>
        </div>
      )}
    </section>
  )
}
