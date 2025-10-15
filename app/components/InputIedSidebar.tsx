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

export function InputIedSidebar({
  ieds,
  onAddIed,
}: {
  ieds: {
    name: string
    address: string
    modules?: string
    comment?: string
    manufacturer: string
  }[]
  onAddIed: (ied: {
    name: string
    address: string
    manufacturer: string
  }) => void
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
          <SheetTitle>Adicionar IEDs do Input</SheetTitle>
        </SheetHeader>
        <SheetDescription className="pl-2">
          Lista de IEDs selecionados na entrada.
        </SheetDescription>

        <ScrollArea className="h-[calc(100%-120px)] p-4">
          <div className="flex flex-col gap-2">
            {ieds.map(ied => (
              <div className="p-1" key={ied.name}>
                <div className="flex items-center justify-between">
                  <div>
                    <span>{ied.name}</span>
                  </div>
                  <Button
                    onClick={() =>
                      onAddIed({
                        name: ied.name,
                        address: '',
                        manufacturer: ied.manufacturer,
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
