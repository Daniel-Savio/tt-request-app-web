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

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      <div className='flex  mb-4 items-baseline'>
        <img src={Logo} className='h-14 w-10' />
        <h1 className="text-2xl font-bold mb-4 ">Formulário de Requisição</h1>
      </div>
      <section className="w-full flex min-h-[400px]  flex-col items-center justify-center text-center">
        <AlertDialog>
          <AlertDialogTrigger><div>test</div></AlertDialogTrigger>
          <AlertDialogContent className="w-[95%] md:w-[900px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Preencha o formulário</AlertDialogTitle>
              <AlertDialogDescription>
                <Form />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section >
    </>

  );
}
