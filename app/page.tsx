"use client"


import React,{ ChangeEvent, FormEvent, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"

import { Progress } from "@/components/ui/progress"

import { Button, buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { handleSubmitPovzetek, handleSubmitVprasanja, handleSubmitABCD } from "./api"
import { Slider } from "@/components/ui/slider"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Link, Loader2 } from "lucide-react"

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
  vprasanje: string
  odgovor: string
}

interface FaqData {
  vprasanja: FaqItem[]
}
interface ABCOdg {
  a: string;
  b: string;
  c: string;
}
interface ABCItem {
  vprasanje: string;
  odgovor: ABCOdg
  pravilenOdgovor :string;
}

interface ABCData {
  vprasanja: ABCItem[];
}


export default function IndexPage() {
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [AbcOdgovor, setAbcOdgovor] = useState("")
  const [steviloVprasanj, setSteviloVprasanj] = useState(10)
  const [progress, setProgress] = useState(0)
  const [stVseh, setstVseh] = useState(0)

  const [vrstaVprasanja, setVrstaVprasanja] = useState("Povzetek")

  const HandleRadioChange = (value: string) =>{
    console.log(value);

    setAbcOdgovor(value);

  }
  const HandleonCheckedChange = (value: boolean) =>{
    console.log(value);

    value ? setProgress(progress+1):setProgress(progress-1) ;

  }

  function FaqPage() {
    const resp: FaqData = JSON.parse(response)
    setstVseh(resp.vprasanja.length);
    return (
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <Accordion type="single" collapsible>
          {resp.vprasanja.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.vprasanje}</AccordionTrigger>
              <AccordionContent>{item.odgovor}</AccordionContent>
              <Checkbox  onCheckedChange={HandleonCheckedChange}/>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    )
  }

  function IzpisiPovzetek() {
    return (
      <div className="flex gap-4 pb-8 md:py-4">
        {response}
      </div>
    )
  }

  function ABCDizpis() {
    const resp: ABCData = JSON.parse(response);
    setstVseh(resp.vprasanja.length);
    console.log(resp);
    return (
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        {resp.vprasanja.map((item, index) => (
      <RadioGroup defaultValue="" onValueChange={HandleRadioChange}>

          <div key={index}>
            <div>{item.vprasanje}</div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={`a${index}`} id={`r${index}-a`} />
              <Label htmlFor={`r${index}-a`}>{item.odgovor.a}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={`b${index}`} id={`r${index}-b`} />
              <Label htmlFor={`r${index}-b`}>{item.odgovor.b}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={`c${index}`} id={`r${index}-c`} />
              <Label htmlFor={`r${index}-c`}>{item.odgovor.c}</Label>
            </div>
          </div>
          {AbcOdgovor === `${item.pravilenOdgovor}${index}` ? <div>Pravilno.</div>: <div>Narobe.</div>}
         
      </RadioGroup>

        ))}
    </section>
    );
  }
  

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    console.log(typeof event)
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setLoading(true)
    setProgress(0);

    try {
      let result;
      if(vrstaVprasanja === "Povzetek"){
        result = await handleSubmitPovzetek(formData);
      }else if(vrstaVprasanja === "vprasanja"){
        result = await handleSubmitVprasanja(formData,steviloVprasanj);
      }
      else if(vrstaVprasanja === "A B C "){
        result = await handleSubmitABCD(formData,steviloVprasanj);
      }
      setResponse(result)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const handleSelectChange = (value: string) =>{
    console.log(value);

    setVrstaVprasanja(value);
    setResponse("");

  }

  const handleSlideChange = (value: number[]) =>{
    console.log(value);

    setSteviloVprasanj(value[0]);

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
      <div className="flex gap-4 pb-8 md:py-4">
       {/* <Slider defaultValue={[33]} max={50} step={1} onValueChange={handleSlideChange}/>*/}
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

        <div className="flex gap-4 pb-8 md:py-4">
          <Button type="submit" disabled={loading} className={buttonVariants({ size: "lg" })}>

            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </form>
      <div className="flex gap-4 pb-8 md:py-4">
      <Progress value={(progress/stVseh)*100} />

      </div>


      {response !== "" && vrstaVprasanja=="vprasanja" && (
        <div>
          <h2>Vprašanja in odgovori:</h2>
          <p>
          <FaqPage />
          {/*FaqPage()*/}</p>
         {/*<a
            href={"data:text/csv;charset=utf-8," + encodeURI(getCSV())}
            target="_blank"
            rel="noreferrer"
            download="faq.csv"
            className={buttonVariants({ size: "lg" })}
          >
            Download CSV
          </a> */} 
        </div>
        
      )}

      {response !== "" && vrstaVprasanja=="Povzetek" && (
        <div>
          <h2>Povzetek:</h2>
          <p>
          <IzpisiPovzetek />
          {/*izpisiPovzetek()*/}</p>
          {/*<a
            href={"data:text/csv;charset=utf-8," + encodeURI(getCSV())}
            target="_blank"
            rel="noreferrer"
            download="faq.csv"
            className={buttonVariants({ size: "lg" })}
          >
            Download CSV
          </a> */} 
        </div>
      )}

      {response !== "" && vrstaVprasanja=="A B C " && (
        <div>
          <h2>Response:</h2>

          <p>
          <ABCDizpis />
          {/*ABCDizpis()*/}</p>
         {/*<a
            href={"data:text/csv;charset=utf-8," + encodeURI(getCSV())}
            target="_blank"
            rel="noreferrer"
            download="faq.csv"
            className={buttonVariants({ size: "lg" })}
          >
            Download CSV
          </a> */} 
         
        </div>
      )}
    </section>
  )
}
