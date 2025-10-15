import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { Button } from './ui/button'

import { ScrollArea } from './ui/scroll-area'
import { Plus } from 'lucide-react'
import { Separator } from './ui/separator'

export function IedSidebar({
  ieds,
  ieds_terceiros,
  onAddIed,
  currentIeds,
}: {
  ieds: { nome: string }[]
  ieds_terceiros: { nome: string; fabricante: string }[]
  onAddIed: (ied: {
    name: string
    address: string
    manufacturer: string
  }) => void
  currentIeds: any[]
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="border border-primary" variant="ghost">
          Adicionar IEDs <Plus className="text-primary"></Plus>{' '}
        </Button>
      </SheetTrigger>
      <SheetContent className=" w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Adicionar IEDs</SheetTitle>
        </SheetHeader>
        <SheetDescription className="pl-2">
          Lista de todos os IEDs disponíveis para a aplicação
        </SheetDescription>

        <ScrollArea className="h-[calc(100%-120px)] p-4">
          <div className="flex flex-col gap-2">
            {ieds.map(ied => (
              <div className="p-1">
                <div
                  className="flex items-center justify-between"
                  key={ied.nome}
                >
                  <div>
                    <legend className="text-xs text-muted-foreground">
                      Treetech
                    </legend>
                    <span>{ied.nome}</span>
                  </div>
                  <Button
                    onClick={() =>
                      onAddIed({
                        name: ied.nome,
                        address: `${currentIeds.length + 1}`,
                        manufacturer: 'Treetech',
                      })
                    }
                  >
                    <Plus></Plus>
                  </Button>
                </div>
                <Separator></Separator>
              </div>
            ))}
            {ieds_terceiros.map(ied => (
              <div className="p-1">
                <div
                  className="flex items-center justify-between"
                  key={ied.nome}
                >
                  <div>
                    <legend className="text-xs text-muted-foreground">
                      {ied.fabricante}
                    </legend>
                    <span>{ied.nome}</span>
                  </div>
                  <Button
                    onClick={() =>
                      onAddIed({
                        name: ied.nome,
                        address: `${currentIeds.length + 1}`,
                        manufacturer: ied.fabricante,
                      })
                    }
                  >
                    <Plus></Plus>
                  </Button>
                </div>
                <Separator></Separator>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
