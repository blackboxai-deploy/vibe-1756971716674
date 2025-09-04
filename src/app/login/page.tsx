
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Logo from "@/components/logo"
import { FirebaseProvider, useFirebase } from "@/hooks/use-firebase"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({
    message: "Prosím zadajte platnú emailovú adresu.",
  }),
  password: z.string().min(8, {
    message: "Heslo musí mať aspoň 8 znakov.",
  }),
})

function LoginPageContent() {
  const { auth } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRegistering, setIsRegistering] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth) {
      toast({ variant: "destructive", title: "Chyba", description: "Autentifikácia nie je pripravená." });
      return;
    }
    setIsLoading(true);

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: "Registrácia úspešná", description: "Boli ste úspešne zaregistrovaný a prihlásený." });
      } else {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: "Prihlásenie úspešné" });
      }
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      let description = "Vyskytla sa neznáma chyba.";
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        description = "Nesprávny email alebo heslo.";
      } else if (error.code === 'auth/email-already-in-use') {
        description = "Tento email je už zaregistrovaný.";
      }
      toast({ variant: "destructive", title: isRegistering ? "Chyba registrácie" : "Chyba prihlásenia", description });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="absolute top-6 left-6">
            <Logo />
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">{isRegistering ? 'Vytvoriť účet' : 'Vitajte späť!'}</CardTitle>
          <CardDescription>
            {isRegistering ? 'Zadajte svoje údaje pre vytvorenie nového účtu.' : 'Zadajte svoje údaje pre prístup do vášho účtu.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="vas@email.com" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heslo</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                    {!isRegistering && (
                       <FormMessage>
                        <Link href="#" className="text-xs hover:underline text-muted-foreground">
                          Zabudli ste heslo?
                        </Link>
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isRegistering ? 'Zaregistrovať sa' : 'Prihlásiť sa'}
              </Button>
            </form>
          </Form>
           <div className="mt-4 text-center text-sm">
              {isRegistering ? 'Už máte účet?' : 'Nemáte ešte účet?'}{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => setIsRegistering(!isRegistering)}>
                 {isRegistering ? 'Prihláste sa' : 'Zaregistrujte sa'}
              </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}


export default function LoginPage() {
  return (
    <FirebaseProvider>
      <LoginPageContent />
    </FirebaseProvider>
  )
}
