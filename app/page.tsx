"use client"

import React,{ ChangeEvent, FormEvent, useState } from "react"
import { Loader2 } from "lucide-react"



import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { handleSubmitPovzetek, handleSubmitVprasanja, handleSubmitABCD } from "./api"
import { Slider } from "@/components/ui/slider"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FaqItem {
  vprasanje: string;
  odgovor: string;
}

interface FaqData {
  vprasanja: FaqItem[];
}

interface ABCItem {
  a: string;
  b: string;
  c: string;
}

interface ABCData {
  vprasanje: string;
  odgovor: ABCItem[]
}


export default function IndexPage() {
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  const [vrstaVprasanja, setVrstaVprasanja] = useState("Povzetek")

  function FaqPage() {
    const resp: FaqData=JSON.parse(response);
    return (
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <Accordion type="single" collapsible>
          {resp.vprasanja.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.vprasanje}</AccordionTrigger>
              <AccordionContent>
                {item.odgovor}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    );
  }
  function izpisiPovzetek() {
    return (
      <div className="flex gap-4 pb-8 md:py-4">
        {response}
      </div>
    );
  }
  function ABCDizpis() {
    const resp: ABCData = JSON.parse(response);
    return (
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <RadioGroup defaultValue="">
          {resp.odgovor.map((item, index) => (
            <div key={index}>
              <div>{resp.vprasanje}</div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="a" id={`r${index}-a`} />
                <Label htmlFor={`r${index}-a`}>{item.a}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="b" id={`r${index}-b`} />
                <Label htmlFor={`r${index}-b`}>{item.b}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="c" id={`r${index}-c`} />
                <Label htmlFor={`r${index}-c`}>{item.c}</Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </section>
    );
  }
  

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    console.log(typeof event)
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setLoading(true)

    try {
      let result;
      if(vrstaVprasanja === "Povzetek"){
        result = await handleSubmitPovzetek(formData);
      }else if(vrstaVprasanja === "vprasanja"){
        result = await handleSubmitVprasanja(formData);
      }
      else if(vrstaVprasanja === "A B C "){
        result = await handleSubmitABCD(formData);
      }
      setResponse(result)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const handleSelectChange = (value: string) =>{
    console.log("wlgbbgsgblbibhehwtbč");
    console.log(value);

    setVrstaVprasanja(value);
    console.log(vrstaVprasanja);

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
      <div className="flex gap-4 pb-8 md:py-4">
        <Slider defaultValue={[33]} max={100} step={1} />
      </div>
      <div className="flex gap-4 pb-8 md:py-4">
      <Select onValueChange={handleSelectChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Vrsta vprašanj" />
        </SelectTrigger>
        <SelectContent  >
          <SelectItem value="Povzetek">Povzetek</SelectItem>
          <SelectItem value="vprasanja">Opisna vprašanja</SelectItem>
          <SelectItem value="A B C ">A B C vprašanje</SelectItem>
        </SelectContent>
      </Select>
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
        <div className="flex gap-4 ">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </form>

      {response !== "" && vrstaVprasanja=="vprasanja" && (
        <div>
          <h2>Vprašanja in odgovori:</h2>
          <p>
          {FaqPage()}</p>
        </div>
      )}

      {response !== "" && vrstaVprasanja=="Povzetek" && (
        <div>
          <h2>Povzetek:</h2>
          <p>
          {izpisiPovzetek()}</p>
        </div>
      )}

      {response !== "" && vrstaVprasanja=="A B C " && (
        <div>
          <h2>Response:</h2>
          <p>
          {ABCDizpis()}</p>
        </div>
      )}
    </section>
  )
}
