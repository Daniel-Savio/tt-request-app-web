import type { Route } from "./+types/home";
import { useFormControl } from "../store/formControl"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import { Button } from "~/components/ui/button";
import { Form } from "~/components/form";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {

  const formControl = useFormControl();
  return (
    <>

      <section className="w-full flex min-h-[400px]  flex-col items-center justify-center text-center">
        <AlertDialog>
          <AlertDialogTrigger><div className="border-2 cursor-pointer p-8 flex flex-col items-center gap-2 rounded bg-slate-800  text-white hover:bg-slate-700 transition-all">
            <h1> Nova requisição</h1><Plus /></div></AlertDialogTrigger>
          <AlertDialogContent className=" h-[calc(100vh-140px)] w-[95%] md:w-[900px] overflow-hidden">


            <AlertDialogHeader className="flex justify-around">
              <AlertDialogTitle className="w-full flex justify-between">Preencha o formulário  <AlertDialogCancel><X size={12} className="text-destructive" /></AlertDialogCancel></AlertDialogTitle>

              <AlertDialogDescription className="">
                <ScrollArea className="h-[470px]">

                  <Form />
                </ScrollArea>
              </AlertDialogDescription>
            </AlertDialogHeader>


            <Separator ></Separator>
            <AlertDialogFooter className="flex flex-row justify-center items-center">
              <Button
                disabled={formControl.step === 0}
                onClick={formControl.previous}
                className={` ${formControl.step === 0 ? "invisible" : "w-fit"}`}
                type="button"
                variant={"secondary"}
                size={"sm"}

              >
                <ChevronLeft />
                Anterior
              </Button>
              <span className="w-fit md:w-full md:mx-auto text-sm text-center text-muted-foreground">
                {formControl.step + 1}/4
              </span>
              <Button
                onClick={formControl.next}
                type="button"
                variant={"secondary"}
                className={` ${formControl.step === 3 ? "invisible" : "w-fit"}`}
                size={"sm"}
              >
                Próximo
                <ChevronRight />
              </Button>

              <Button
                onClick={formControl.end}
                type="button"
                variant={"outline"}
                className={` ${formControl.step === 3 ? "invisible" : "w-fit"}`}
                size={"sm"}
              >
                Final

              </Button>

            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section >
    </>

  );
}
