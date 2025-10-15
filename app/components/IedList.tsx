import { useFormContext } from 'react-hook-form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Trash } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'

import { Card } from './ui/card'
import { useEffect } from 'react'

export function IedList({
  entradaIndex,
  ieds,
  onRemoveIed,
  fieldName,
}: {
  entradaIndex: number
  ieds: any[]
  onRemoveIed: (index: number) => void
  fieldName: string
}) {
  const {
    register,
    watch,
    setValue,
    formState: { errors: _errors },
  } = useFormContext()
  const currentIeds = watch(`${fieldName}.${entradaIndex}.ieds`)

  useEffect(() => {
    if (currentIeds) {
      currentIeds.forEach((ied: any, index: number) => {
        if (!ied.address) {
          setValue(
            `${fieldName}.${entradaIndex}.ieds.${index}.address`,
            index + 1,
            { shouldValidate: true }
          )
        }
      })
    }
  }, [currentIeds, setValue, fieldName, entradaIndex])

  const hasEmptyAddress = currentIeds?.some((ied: any) => !ied.address)
  const hasRepetitiveAddress = currentIeds?.some(
    (ied: any, index: number) =>
      currentIeds.findIndex(
        (otherIed: any) => otherIed.address === ied.address
      ) !== index && ied.address
  )

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {ieds?.map((field, index) => (
          <Card
            className="flex items-center gap-2 p-2 rounded-sm"
            key={field.id}
          >
            <div className="flex flex-col gap-2">
              <span className="flex items-center justify-between gap-2">
                <Badge
                  className={`text-slate-50 h-4 shadow font-normal   ${field.manufacturer === 'Treetech' ? `` : `bg-blue-500`}`}
                >
                  <legend>{field.manufacturer}:</legend>
                  {field.name}
                </Badge>
                <Button
                  className="h-4 w-4"
                  onClick={() => onRemoveIed(index)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Trash className="size-3 text-destructive" />
                </Button>
              </span>
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground text-xs font-semibold">
                  Endereço
                </Label>
                <Input
                  id={field.id}
                  placeholder="Endereço"
                  {...register(
                    `${fieldName}.${entradaIndex}.ieds.${index}.address`
                  )}
                  className="w-full h-5 bg-card! text-sm text-center rounded-xs"
                  max={255}
                  min={1}
                  type="number"
                />
                {field.name === 'BM' && (
                  <>
                    <Label className="text-muted-foreground text-xs font-semibold">
                      Módulos
                    </Label>
                    <Input
                      id={field.id}
                      placeholder="Qtd de módulos do BM"
                      {...register(
                        `${fieldName}.${entradaIndex}.ieds.${index}.modules`
                      )}
                      className="w-full h-5 bg-card! text-sm text-center rounded-xs"
                      defaultValue={1}
                      max={3}
                      min={1}
                      type="number"
                    />
                  </>
                )}
                {field.name === 'COMM4' && (
                  <>
                    <Label className="text-muted-foreground text-xs font-semibold">
                      SPSs conectados
                    </Label>
                    <Input
                      id={field.id}
                      placeholder="Qtd de SPS conectados"
                      {...register(
                        `${fieldName}.${entradaIndex}.ieds.${index}.modules`
                      )}
                      className="w-full h-5 bg-card! text-sm text-center rounded-xs"
                      defaultValue={1}
                      max={18}
                      min={1}
                      type="number"
                    />
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Aviso de erro */}
      {hasEmptyAddress && (
        <p className="text-sm text-destructive">
          Existem IEDs sem endereço. Por favor, preencha todos os endereços.
        </p>
      )}
      {hasRepetitiveAddress && (
        <p className="text-sm text-destructive">
          Existem IEDs com endereços repetidos. Por favor, verifique.
        </p>
      )}
    </>
  )
}
