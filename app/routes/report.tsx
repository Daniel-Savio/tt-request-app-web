
import { ScrollArea } from '../components/ui/scroll-area'
import {
    Check,
    ChevronLeft,
    FileInput,
    FileOutput,
    Sigma,
    X,
} from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import type { RequestForm } from '../types'

import { useRef } from 'react'
import pkg from 'react-to-print';
import { redirect } from 'react-router'
const { useReactToPrint } = pkg;


export function Report() {
    const formDataString = sessionStorage.getItem('formData');
    const formData: RequestForm | null = formDataString ? JSON.parse(formDataString) : null;
    const contentRef = useRef<HTMLDivElement>(null)

    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: `requisiçao-`,
    })

    if (!formData || formData === undefined) {
        return <div>Nenhum dado para ser exibido</div>
    }

    return (
        <ScrollArea className=" p-4 max-w-4xl mx-auto h-[900px] shadow-lg ">
            <div className="flex justify-between items-center mb-8">
                <Button onClick={() => redirect("/")} variant={'outline'}>
                    <ChevronLeft />
                </Button>
                <Button onClick={handlePrint}>Exportar para PDF</Button>
            </div>
            <div
                className="bg-white text-slate-950 pl-12 pr-8 pt-8 max-w-4xl mx-auto min-h-[1123px]"
                ref={contentRef}
            >
                <h1 className="text-2xl text-slate-950 font-bold">
                    Relatório de Requisição
                </h1>
                <div className="grid grid-cols-2  gap-4 mb-4">
                    <div>
                        <h2 className="text-lg font-semibold">Requerente</h2>
                        <p>{formData.requester}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Departamento</h2>
                        <p>{formData.departament.toUpperCase()}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">E-mail</h2>
                        <p>{formData.email}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Cliente</h2>
                        <p>{formData.client}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Projeto</h2>
                        <p>{formData.project}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Nº Pedido</h2>
                        <p>{formData.invoiceNumber}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Nº Cliente</h2>
                        <p>{formData.clientNumber}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">
                            Data de envio ao processamento
                        </h2>
                        <p>{new Date(formData.processingDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <Separator></Separator>
                <h1 className="text-xl mt-10 flex gap-2">
                    <strong className="font-bold">Gateway:</strong>{' '}
                    <p>{formData.gateway}</p>
                </h1>
                {/* Entrada */}
                <div className="mt-4 space-y-3 divider">
                    <h2 className="text-lg flex gap-3 font-semibold text-primary">
                        <FileInput />
                        Entradas: {formData.entradas?.length}{' '}
                    </h2>
                    {formData.entradas?.map((entrada, index) => (
                        <div className="p-4 border border-slate-600 rounded" key={index}>
                            <header className="flex gap-5 items-center mb-4">
                                <Badge className="text-slate-50">{index + 1}</Badge>
                                <h3 className="font-bold">Protocolo: {entrada.protocolo}</h3>
                                <h3 className="font-bold">Tipo: {entrada.type}</h3>
                            </header>
                            {entrada.type !== 'TCP/IP' && (
                                <div className="flex gap-2 justify-between">
                                    <p>Baudrate: {entrada.baudRate}</p>
                                    <p>Data Bits: {entrada.dataBits}</p>
                                    <p>Parity: {entrada.parity}</p>
                                    <p>Stop Bits: {entrada.stopBits}</p>
                                </div>
                            )}

                            {entrada.type === 'TCP/IP' && (
                                <div className="flex gap-2 ">
                                    <p>IP do IED: {entrada.ip}</p>
                                    <Separator className="" orientation="vertical" />
                                    <p>Porta de copmunicação do IED: {entrada.port}</p>
                                </div>
                            )}

                            {entrada.ieds && entrada.ieds.length > 0 && (
                                <h3 className="font-semibold my-2">IEDs:</h3>
                            )}
                            <ul className="flex gap-4 flex-wrap">
                                {entrada.ieds?.map((ied, iedIndex) => (
                                    <Card
                                        className="p-2 text-slate-950 bg-slate-50"
                                        key={iedIndex}
                                    >
                                        <CardTitle className="border-b-2 border-b-primary p-1">
                                            <legend className="text-muted-foreground text-sm">
                                                {ied.manufacturer}
                                            </legend>
                                            <p>{ied.name}</p>
                                        </CardTitle>
                                        <CardContent>
                                            <p>Endereço: {ied.address}</p>
                                            {ied.modules && <p>Módulos: {ied.modules}</p>}
                                        </CardContent>
                                    </Card>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <Separator className="break-after-page bg-slate950"> </Separator>

                {/* Saída */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold flex gap-3 text-primary">
                        <FileOutput />
                        Saídas:{' '}
                        {formData.sigmaConnection !== 'Sem Comunicação'
                            ? formData.saidas?.length + 1
                            : formData.saidas?.length}{' '}
                    </h2>

                    <div className="mt-4 flex gap-2 items-center">
                        <Sigma />
                        <h2 className="text-lg font-semibold">Comunicação com o Sigma:</h2>
                        <p>{formData.sigmaConnection}</p>
                        {formData.sigmaConnection !== 'Sem Comunicação' ? (
                            <Check className="text-primary border rounded-full p-1 border-primary" />
                        ) : (
                            <X className="text-destructive border rounded-full p-1 border-destructive" />
                        )}
                    </div>

                    {formData.saidas?.map((saida, index) => (
                        <div className="p-4 border border-slate-600 rounded" key={index}>
                            <header className="flex gap-5 items-center mb-4">
                                <Badge className="text-slate-50">{index + 1}</Badge>
                                <h3 className="font-bold">Protocolo: {saida.protocolo}</h3>
                                <h3 className="font-bold">Tipo: {saida.type}</h3>
                            </header>
                            {saida.type !== 'TCP/IP' && (
                                <div className="flex gap-2 justify-between">
                                    <p>Baudrate: {saida.baudRate}</p>
                                    <p>Data Bits: {saida.dataBits}</p>
                                    <p>Parity: {saida.parity}</p>
                                    <p>Stop Bits: {saida.stopBits}</p>
                                </div>
                            )}

                            {saida.type === 'TCP/IP' && (
                                <div className="flex gap-2 ">
                                    <p>
                                        IP do {formData.gateway}: {saida.ip}
                                    </p>
                                    <Separator className="" orientation="vertical" />
                                    <p>Porta de comunicação: {saida.port ? saida.port : 'Padrão do protocolo'}</p>
                                </div>
                            )}

                            {saida.ieds && saida.ieds.length > 0 && (
                                <h3 className="font-semibold my-2">IEDs:</h3>
                            )}
                            <ul className="flex gap-4 flex-wrap">
                                {saida.ieds?.map((ied, iedIndex) => (
                                    <Card
                                        className="p-2 bg-slate-50 text-slate-950"
                                        key={iedIndex}
                                    >
                                        <CardTitle className="border-b-2 border-b-primary p-1">
                                            <legend className="text-muted-foreground text-sm">
                                                {ied.manufacturer}
                                            </legend>
                                            <p>{ied.name}</p>
                                        </CardTitle>
                                        <CardContent>
                                            <p>Endereço: {ied.address}</p>
                                            {ied.modules && <p>Módulos: {ied.modules}</p>}
                                        </CardContent>
                                    </Card>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <Separator className="break-after-page bg-slate950"> </Separator>

                <div className="mt-8">
                    <h2 className="text-lg font-semibold">Comentários</h2>
                    <div
                        className="tiptap bg-slate-50 p-1 rounded-lg"
                        dangerouslySetInnerHTML={{
                            __html: formData.comments || 'Sem comentários',
                        }}
                    />
                </div>
            </div>
        </ScrollArea>
    )
}

