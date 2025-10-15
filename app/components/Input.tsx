import { useFieldArray, useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import { Button } from './ui/button'
import { CircleQuestionMark, Trash } from 'lucide-react'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { IedSidebar } from './IedSidebar'
import { IedList } from './IedList'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function Entrada({
  index,
  remove,
  data,
}: {
  index: number
  remove: (index: number) => void
  data: any
}) {
  const { control, register, watch, setValue } = useFormContext()
  const entradaType = watch(`entradas.${index}.type`)
  const ieds = watch(`entradas.${index}.ieds`)
  const allEntradas = watch(`entradas`)
  const baudRate = watch(`entradas.${index}.baudRate`)
  const dataBits = watch(`entradas.${index}.dataBits`)
  const parity = watch(`entradas.${index}.parity`)
  const stopBits = watch(`entradas.${index}.stopBits`)

  useEffect(() => {
    if (!baudRate) {
      setValue(`entradas.${index}.baudRate`, '9600')
    }
    if (!dataBits) {
      setValue(`entradas.${index}.dataBits`, '8')
    }
    if (!parity) {
      setValue(`entradas.${index}.parity`, 'None')
    }
    if (!stopBits) {
      setValue(`entradas.${index}.stopBits`, '1')
    }
  }, [baudRate, dataBits, parity, stopBits, index, setValue])

  const filteredEntradas = data?.entradas.filter((entrada: string) => {
    const isAlreadySelected = allEntradas.some(
      (e: any, i: number) => i !== index && e.type === entrada
    )

    if (isAlreadySelected && (entrada === '71-72' || entrada === '74-75')) {
      return false
    }

    const is7172Selected = allEntradas.some(
      (e: any, i: number) => i !== index && e.type === '71-72'
    )
    const is7475Selected = allEntradas.some(
      (e: any, i: number) => i !== index && e.type === '74-75'
    )
    const is717273Selected = allEntradas.some(
      (e: any, i: number) => i !== index && e.type === '71-72-73'
    )

    if (entrada === '71-72-73' && (is7172Selected || is7475Selected)) {
      return false
    }

    if ((entrada === '71-72' || entrada === '74-75') && is717273Selected) {
      return false
    }

    return true
  })

  const { append: appendIed, remove: removeIed } = useFieldArray({
    control,
    name: `entradas.${index}.ieds`,
  })

  return (
    <div className="flex flex-col gap-2 ml-6 mt-4">
      <h1 className="text-lg flex gap-2 items-center font-bold">
        {index + 1}-) Entrada
        <Button
          className="w-fit border size-6 "
          onClick={() => remove(index)}
          type="button"
          variant={'ghost'}
        >
          <Trash className="text-destructive" />
        </Button>
      </h1>

      <Label>Protocolo</Label>

      <Select
        onValueChange={value => setValue(`entradas.${index}.protocolo`, value)}
        value={watch(`entradas.${index}.protocolo`)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione o protocolo" />
        </SelectTrigger>
        <SelectContent>
          {data?.protocolos_entrada.map((protocolo: string) => (
            <SelectItem key={protocolo} value={protocolo}>
              {protocolo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={value => setValue(`entradas.${index}.type`, value)}
        value={watch(`entradas.${index}.type`)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione o tipo da entrada" />
        </SelectTrigger>
        <SelectContent>
          {filteredEntradas.map((entrada: string) => (
            <SelectItem key={entrada} value={entrada}>
              {entrada}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label className="mt-2 flex">
        <p>Parâmetros de rede</p>
        {entradaType && entradaType !== 'TCP/IP' && (
          <Tooltip>
            <TooltipTrigger>
              <CircleQuestionMark className="size-4" />
            </TooltipTrigger>
            <TooltipContent>
              <pre>
                Parâmetros de rede serial
                <br />
                Baudrate, Bit de dados, Paridade e Bit de parada
              </pre>
            </TooltipContent>
          </Tooltip>
        )}
        {entradaType && entradaType === 'TCP/IP' && (
          <Tooltip>
            <TooltipTrigger>
              <CircleQuestionMark className="size-4" />
            </TooltipTrigger>
            <TooltipContent>
              <pre>
                Parâmetros de rede Ethernet
                <br />
                IP do ied a ser lido e Porta TCP da comunicação
              </pre>
            </TooltipContent>
          </Tooltip>
        )}
      </Label>
      {entradaType === 'TCP/IP' && (
        <div className="flex gap-2">
          <Input placeholder="IP" {...register(`entradas.${index}.ip`)} />
          <Input placeholder="Port" {...register(`entradas.${index}.port`)} />
        </div>
      )}

      {entradaType && entradaType !== 'TCP/IP' && (
        <div className="flex gap-2">
          <Select
            defaultValue="9600"
            onValueChange={value =>
              setValue(`entradas.${index}.baudRate`, value)
            }
            value={baudRate}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Baudrate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={1} value={'9600'}>
                9600
              </SelectItem>
              <SelectItem key={2} value={'19200'}>
                19200
              </SelectItem>
              <SelectItem key={3} value={'115200'}>
                115200
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue="8"
            onValueChange={value =>
              setValue(`entradas.${index}.dataBits`, value)
            }
            value={dataBits}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Bits de dados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={1} value={'8'}>
                8
              </SelectItem>
              <SelectItem key={2} value={'7'}>
                7
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={'None'}
            onValueChange={value => setValue(`entradas.${index}.parity`, value)}
            value={parity}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Paridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={1} value={'None'}>
                None
              </SelectItem>
              <SelectItem key={2} value={'Odd'}>
                Odd
              </SelectItem>
              <SelectItem key={3} value={'Even'}>
                Even
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue="1"
            onValueChange={value =>
              setValue(`entradas.${index}.stopBits`, value)
            }
            value={stopBits}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Bit de parada" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={1} value={'1'}>
                1
              </SelectItem>
              <SelectItem key={2} value={'2'}>
                2
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Separator />
      <IedSidebar
        currentIeds={ieds}
        ieds={data?.ied || []}
        ieds_terceiros={data?.ied_terceiros || []}
        onAddIed={appendIed}
      />
      <IedList
        entradaIndex={index}
        fieldName="entradas"
        ieds={ieds}
        onRemoveIed={removeIed}
      />
    </div>
  )
}
