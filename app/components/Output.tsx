import { useFieldArray, useFormContext } from 'react-hook-form'
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
import { InputIedSidebar } from './InputIedSidebar'
import { IedList } from './IedList'
import { useEffect } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function Output({
  index,
  remove,
  data,
  selectedIedsFromInput,
}: {
  index: number
  remove: (index: number) => void
  data: any
  selectedIedsFromInput: {
    name: string
    address: string
    modules?: string
    comment?: string
  }[]
}) {
  const { control, register, watch, setValue } = useFormContext()
  const protocolo = watch(`saidas.${index}.protocolo`)
  const _port = watch(`saidas.${index}.port`)
  const _ip = watch(`saidas.${index}.ip`)
  const saidaType = watch(`saidas.${index}.type`)
  const ieds = watch(`saidas.${index}.ieds`)
  const allSaidas = watch(`saidas`)
  const baudRate = watch(`saidas.${index}.baudRate`)
  const dataBits = watch(`saidas.${index}.dataBits`)
  const parity = watch(`saidas.${index}.parity`)
  const stopBits = watch(`saidas.${index}.stopBits`)

  useEffect(() => {
    if (!baudRate) {
      setValue(`saidas.${index}.baudRate`, '9600')
    }
    if (!dataBits) {
      setValue(`saidas.${index}.dataBits`, '8')
    }
    if (!parity) {
      setValue(`saidas.${index}.parity`, 'None')
    }
    if (!stopBits) {
      setValue(`saidas.${index}.stopBits`, '1')
    }
  }, [baudRate, dataBits, parity, stopBits, index, setValue])

  const filteredSaidas = data?.entradas.filter((saida: string) => {
    const isAlreadySelected = allSaidas.some(
      (e: any, i: number) => i !== index && e.type === saida
    )

    if (isAlreadySelected && (saida === '71-72' || saida === '74-75')) {
      return false
    }

    const is7172Selected = allSaidas.some(
      (e: any, i: number) => i !== index && e.type === '71-72'
    )
    const is7475Selected = allSaidas.some(
      (e: any, i: number) => i !== index && e.type === '74-75'
    )
    const is717273Selected = allSaidas.some(
      (e: any, i: number) => i !== index && e.type === '71-72-73'
    )

    if (saida === '71-72-73' && (is7172Selected || is7475Selected)) {
      return false
    }

    if ((saida === '71-72' || saida === '74-75') && is717273Selected) {
      return false
    }

    return true
  })

  function defaultPort() {
    if (protocolo === 'Modbus') return '502'
    if (protocolo === 'DNP3') return '20000'
    if (protocolo === 'IEC61850') return '102'
  }

  useEffect(() => { }, [protocolo, selectedIedsFromInput])

  const { append: appendIed, remove: removeIed } = useFieldArray({
    control,
    name: `saidas.${index}.ieds`,
  })

  return (
    <div className="flex flex-col gap-2 ml-6 mt-4">
      <h1 className="text-lg flex gap-2 items-center font-bold">
        {index + 1}-) Saída
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
        onValueChange={value => setValue(`saidas.${index}.protocolo`, value)}
        value={protocolo}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione o protocolo" />
        </SelectTrigger>
        <SelectContent>
          {data?.protocolos_saida.map((p: string) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue="TCP/IP"
        onValueChange={value => setValue(`saidas.${index}.type`, value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione o tipo da saida" />
        </SelectTrigger>
        <SelectContent>
          {filteredSaidas.map((saida: string) => (
            <SelectItem key={saida} value={saida}>
              {saida}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Label className="mt-2 flex">
        <p>Parâmetros de rede</p>
        {saidaType && saidaType !== 'TCP/IP' && (
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
        {saidaType && saidaType === 'TCP/IP' && (
          <Tooltip>
            <TooltipTrigger>
              <CircleQuestionMark className="size-4" />
            </TooltipTrigger>
            <TooltipContent>
              <pre>
                Parâmetros de rede Ethernet
                <br />
                <br />
                IP do SD a ser lido - Este IP deve ser fornecido pelo CLIENTE. Caso contrário, será deixado o IP padrão do Gateway
                <br />
                Porta TCP da comunicação (padrão por protocolo)
              </pre>
            </TooltipContent>
          </Tooltip>
        )}
      </Label>
      {saidaType === 'TCP/IP' && (
        <div className="flex gap-2">
          <Input
            defaultValue={'192.168.10.87'}
            placeholder="IP"
            {...register(`saidas.${index}.ip`)}
          />
          <Input
            defaultValue={defaultPort()}
            placeholder="Port"
            {...register(`saidas.${index}.port`)}
          />
        </div>
      )}

      {saidaType && saidaType !== 'TCP/IP' && (
        <div className="flex gap-2">
          <Select
            defaultValue="9600"
            onValueChange={value => setValue(`saidas.${index}.baudRate`, value)}
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
            onValueChange={value => setValue(`saidas.${index}.dataBits`, value)}
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
            onValueChange={value => setValue(`saidas.${index}.parity`, value)}
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
            onValueChange={value => setValue(`saidas.${index}.stopBits`, value)}
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
      <InputIedSidebar ieds={selectedIedsFromInput} onAddIed={appendIed} />
      <IedList
        entradaIndex={index}
        fieldName="saidas"
        ieds={ieds}
        onRemoveIed={removeIed}
      />
    </div>
  )
}
