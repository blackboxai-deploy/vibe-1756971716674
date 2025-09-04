
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { sendContactEmail } from "@/ai/flows/send-contact-email-flow"
import { Loader2, Phone, Mail, MapPin } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, { message: "Meno musí mať aspoň 2 znaky." }),
  email: z.string().email({ message: "Prosím zadajte platnú emailovú adresu." }),
  message: z.string().min(10, { message: "Správa musí mať aspoň 10 znakov." }),
})

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const result = await sendContactEmail(values)
      if (result.success) {
        toast({
          title: "Správa odoslaná!",
          description: result.message,
        })
        form.reset()
      } else {
        throw new Error("Failed to send message.")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Pri odosielaní správy sa vyskytla chyba. Skúste to prosím znova.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="text-4xl font-headline font-bold mb-4">Get in Touch</h1>
        <p className="text-muted-foreground mb-8">
            We'd love to hear from you! Whether you have a question about our services, want to provide feedback, or just want to say hello, feel free to reach out.
        </p>
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <MapPin className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Our Address</h3>
                    <p className="text-muted-foreground">Trieda SNP 61, (Spoločenský pavilón)</p>
                </div>
            </div>
             <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <Mail className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Email Us</h3>
                    <p className="text-muted-foreground">papihairdesign@gmail.com</p>
                </div>
            </div>
             <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <Phone className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Call Us</h3>
                    <p className="text-muted-foreground">+421 949 459 624</p>
                </div>
            </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Send us a Message</CardTitle>
          <CardDescription>
            Fill out the form below and we'll get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Your message" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Odosielam...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
