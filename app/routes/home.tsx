import type { Route } from "./+types/home";
import Logo from '../../assets/logo.png'

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
import { Plus } from "lucide-react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>

      <section className="w-full flex min-h-[400px]  flex-col items-center justify-center text-center">
        <AlertDialog>
          <AlertDialogTrigger><div className="border-2 cursor-pointer p-8 flex flex-col items-center gap-2 rounded bg-slate-800  text-white hover:bg-slate-700 transition-all">
            <h1> Nova requisição</h1><Plus /></div></AlertDialogTrigger>
          <AlertDialogContent className="w-[95%] md:w-[900px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Preencha o formulário</AlertDialogTitle>
              <AlertDialogDescription>
                <Form />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section >
    </>

  );
}
