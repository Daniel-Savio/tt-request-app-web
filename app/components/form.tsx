import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";

import {
  ChevronDownIcon,
  ChevronLeft,
  ChevronRight,
  FileWarning,
  FolderInput,
  Github,
  Plus,
} from "lucide-react";
import { type ChangeEvent, useRef } from "react";
import { useEffect, useState } from "react";
import { Entrada } from "./Input";
import { Output } from "./Output";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { ScrollArea } from "./ui/scroll-area";
import { type RequestForm, requestFormSchema } from "../types";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequestInfo } from "./store";
import { useNavigate } from "react-router";
import Tiptap from "./TipTap";
import { Switch } from "./ui/switch";
import data from "../request-info.json";



export function Form() {
  const [formStep, setFormStep] = useState(0);
  const [numbers, setNumbers] = useState(false);
  const navigate = useNavigate();


  function nextStep() {
    setFormStep(formStep + 1);
  }
  function previousStep() {
    setFormStep(formStep - 1);
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importedData: RequestForm = JSON.parse(
            e.target?.result as string
          );
          requestForm.reset(importedData);

          importedData.entradas?.forEach((entrada, index) => {
            requestForm.setValue(`entradas.${index}.type`, entrada.type);
            requestForm.setValue(
              `entradas.${index}.protocolo`,
              entrada.protocolo
            );
          });

          toast("Sucesso", {
            description: "Formulário importado com sucesso!",
            invert: false,
            richColors: true,
            duration: 2000,
          });


        } catch (error) {
          toast("Erro", {
            description: "Arquivo JSON inválido.",
            invert: false,
            richColors: true,
            duration: 2000,
            icon: <FileWarning className="text-destructive size-4" />,
          });
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const data = requestForm.getValues();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "request-form.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("Sucesso", {
      description: "Formulário exportado com sucesso!",
      invert: false,
      richColors: true,
      duration: 2000,
    });
  };

  //Formulario
  const requestForm = useForm({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      sigmaConnection: "Com Comunicação",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = requestForm;


  const allEntradas = watch("entradas");
  const selectedIedsFromInput = Array.from(
    new Map(
      allEntradas
        ?.flatMap((e) => e.ieds)
        .filter(Boolean)
        .map((ied: any) => [ied.name, ied])
    ).values()
  );

  const {
    fields: entradaFields,
    append: appendEntrada,
    remove: removeEntrada,
  } = useFieldArray({
    control,
    name: "entradas",
  });

  const {
    fields: saidaFields,
    append: appendSaida,
    remove: removeSaida,
  } = useFieldArray({
    control,
    name: "saidas",
  });

  const invoiceNumber = watch("invoiceNumber");
  const clientNumber = watch("clientNumber");
  const requester = watch("requester");
  const email = watch("email");
  const departament = watch("departament");

  useEffect(() => {
    if (requester) {
      const employee = data?.requester.find((emp) => emp.name === requester);
      if (employee) {
        setValue("email", employee.email);
        setValue("departament", employee.departament);
      } else {
        setValue("email", "");
        setValue("departament", "");
      }
    }
  }, [requester, data, setValue]);

  useEffect(() => {
    if (numbers) {
      setValue("invoiceNumber", "0001");
      setValue("clientNumber", "0001");
    } else {
      setValue("invoiceNumber", "");
      setValue("clientNumber", "");
    }
  }, [numbers, setValue]);

  useEffect(() => {
    if (
      errors.client ||
      errors.clientNumber ||
      errors.invoiceNumber ||
      errors.project ||
      errors.requester ||
      errors.email ||
      errors.departament
    ) {
      setFormStep(0);
    }
    if (errors.entradas) setFormStep(1);
    if (errors.gateway) setFormStep(1);
    if (errors.sigmaConnection) setFormStep(2);
    if (errors.saidas) setFormStep(3);

    if (errors.root) {
      toast("Erro", {
        description: (
          <p className="text-wrap overflow-auto">
            Houve algum erro no preenchimento do formulário
          </p>
        ),
        invert: false,
        richColors: true,
        duration: 2000,
        icon: <FileWarning className="text-destructive size-4" />,
      });
    }
    setValue("sigmaConnection", "Com Comunicação");
  }, [
    invoiceNumber,
    clientNumber,
    errors,
    setValue,
    email,
    departament,
    requester,
  ]);


  const setRequest = useRequestInfo((state) => state.setRequest);


  //Post form
  function postForm(data: RequestForm) {

    let formComplete = true;
    if (data.entradas?.length !== 0 && data.saidas?.length === 0) {
      toast("Erro", {
        description: (
          <p className="text-wrap overflow-auto">Inclua ao menos uma saída</p>
        ),
        invert: false,
        richColors: true,
        duration: 2000,
        icon: <FileWarning className="text-destructive size-4" />,
      });
      return;
    }

    if (data.entradas?.length === 0) {
      toast("Erro", {
        description: (
          <p className="text-wrap overflow-auto">Inclua ao menos uma entrada</p>
        ),
        invert: false,
        richColors: true,
        duration: 2000,
        icon: <FileWarning className="text-destructive size-4" />,
      });
      setFormStep(1);
      return;
    }

    data.entradas?.forEach((entrada, index) => {
      if (!entrada.ieds || entrada.ieds.length === 0) {
        formComplete = false;
        toast("Entrada Vazia", {
          description: (
            <p className="text-wrap overflow-auto">{`Inclua ao menos um IED na entrada: ${index + 1
              }`}</p>
          ),
          invert: false,
          richColors: true,
          duration: 2000,
          icon: <FileWarning className="text-destructive size-4" />,
        });
      }
      setFormStep(1);
      return;
    });

    //Checagem das saídas
    data.saidas?.forEach((saida, index) => {
      if (!saida.ieds || saida.ieds.length === 0) {
        formComplete = false;
        toast("Saída Vazia", {
          description: (
            <p className="text-wrap overflow-auto">{`Inclua ao menos um IED na saída: ${index + 1
              }`}</p>
          ),
          invert: false,
          richColors: true,
          duration: 2000,
          icon: <FileWarning className="text-destructive size-4" />,
        });
      }
      return;
    });

    data.entradas?.forEach((entrada, index) => {
      if (entrada.protocolo === "" || entrada.type === "") {
        formComplete = false;
        toast(`Entrada: ${index + 1}`, {
          description: (
            <p className="text-wrap overflow-auto">{`Confira os parâmetros na entrada: ${index + 1
              }`}</p>
          ),
          invert: false,
          richColors: true,
          duration: 2000,
          icon: <FileWarning className="text-destructive size-4" />,
        });
      }
      setFormStep(1);
      return;
    });

    data.saidas?.forEach((saida, index) => {
      if (saida.protocolo === "" || saida.type === "") {
        formComplete = false;
        toast(`Entrada: ${index + 1}`, {
          description: (
            <p className="text-wrap overflow-auto">{`Confira os parâmetros na saída: ${index + 1
              }`}</p>
          ),
          invert: false,
          richColors: true,
          duration: 2000,
          icon: <FileWarning className="text-destructive size-4" />,
        });
      }

      return;
    });

    setFormStep(3);

    if (formComplete) {
      toast("Sucesso");
      setRequest(data);
      navigate("/report");


    }
  }

  return (
    <div className="flex flex-col items-center justify-center  text-foreground">
      <ScrollArea className="w-full h-[800px] p-8 rounded-lg">
        <input
          accept=".json"
          className="hidden"
          onChange={handleImport}
          ref={fileInputRef}
          type="file"
        />
        <Button
          className="w-fit p-2"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          <FolderInput />
          Importar Formulário
        </Button>

        <Separator className="my-4"></Separator>

        <FormProvider {...requestForm}>

          <form className="" onSubmit={handleSubmit(postForm)}>
            <section
              className={` ${formStep === 0 ? "" : "hidden"
                } p-2 mb-4 rounded flex flex-col gap-4 shadow-md `}
            >
              {/* //Requerente */}
              <section className="flex gap-2 justify-between">
                <div>
                  <Label className=" text-sm font-medium ">Requerente</Label>

                  <Select
                    onValueChange={(value: string) => {
                      setValue("requester", value);
                    }}
                    value={watch("requester")}
                  >
                    <SelectTrigger className="w-96">
                      <SelectValue placeholder="Quem está fazendo a requisição?" />
                    </SelectTrigger>
                    <SelectContent>
                      {data?.requester.map((requester) => {
                        return (
                          <SelectItem
                            key={requester.name}
                            value={requester.name}
                          >
                            {requester.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  {errors.requester && (
                    <p className="mt-2 text-sm text-destructive">
                      {errors.requester.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-4 items-center">
                  <div>
                    <Label className=" text-sm font-medium " htmlFor="email">
                      Email
                    </Label>

                    <Input
                      disabled={true}
                      id={`email`}
                      type="email"
                      {...register("email")}
                      className=""
                    />
                  </div>

                  <hr className="bg-muted-foreground w-10 h-0.5" />

                  <div>
                    <Label
                      className=" text-sm font-medium "
                      htmlFor="departament"
                    >
                      Setor
                    </Label>

                    <Input
                      disabled={true}
                      id={`departament`}
                      type="text"
                      defaultValue={""}
                      {...register("departament")}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                  {errors.departament && (
                    <p className="mt-2 text-sm text-destructive">
                      {errors.departament.message}
                    </p>
                  )}
                </div>
              </section>

              <div>
                <Label className=" text-sm font-medium " htmlFor="client">
                  Nome do Cliente ou da Fábrica
                </Label>
                <Input
                  id={`client`}
                  placeholder="Para quem vai ser enviada?"
                  {...register("client")}
                  className=""
                />
                {errors.client && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.client.message}
                  </p>
                )}
              </div>
              <div>
                <Label className=" text-sm font-medium " htmlFor="projeto">
                  Projeto
                </Label>
                <Input
                  id={`projeto`}
                  placeholder="Pertence a qual projeto?"
                  {...register("project")}
                  className=""
                />
                {errors.project && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.project.message}
                  </p>
                )}
              </div>
              <section className="space-y-4">
                <span>
                  <h3 className="text-md font-bold">
                    Tem o número do pedido e do cliente?
                  </h3>
                  <span className="flex gap-2 items-center my-2">
                    <p>Sim</p>{" "}
                    <Switch id={`airplane-mode`} onCheckedChange={setNumbers} />
                    <p>Não</p>
                  </span>
                </span>
                <div className="ml-4">
                  <Label
                    className=" text-sm font-medium "
                    htmlFor="numeroPedido"
                  >
                    Nº Pedido
                  </Label>
                  <Input
                    id={`numeroPedido`}
                    placeholder="54321"
                    type="number"
                    {...register("invoiceNumber")}
                    className=""
                    disabled={numbers}
                  />
                  {errors.invoiceNumber && (
                    <p className="mt-2 text-sm text-destructive">
                      {errors.invoiceNumber.message}
                    </p>
                  )}
                </div>
                <div className="ml-4">
                  <Label
                    className=" text-sm font-medium "
                    htmlFor="clientNumber"
                  >
                    Nº Cliente
                  </Label>
                  <Input
                    id={`clientNumber`}
                    placeholder="12345"
                    type="number"
                    {...register("clientNumber")}
                    className=""
                    disabled={numbers}
                  />
                  {errors.clientNumber && (
                    <p className="mt-2 text-sm text-destructive">
                      {errors.clientNumber.message}
                    </p>
                  )}
                </div>
              </section>

            </section>

            {/* STEP 2 */}
            <section
              className={` ${formStep === 1 ? "" : "hidden"
                }  p-2 mb-4 rounded gap-4 shadow-md `}
            >
              <div>
                <Label className=" text-sm font-medium ">Gateway</Label>
                <Select
                  onValueChange={(value: string) => {
                    setValue("gateway", value);
                  }}
                  value={watch("gateway")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um IED" />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.sd.map((sd) => {
                      return (
                        <SelectItem key={sd} value={sd}>
                          {sd}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.gateway && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.gateway.message}{" "}
                  </p>
                )}
              </div>

              <ScrollArea className="max-h-900 mt-4 w-full">
                <h1 className="text-lg font-bold ">
                  Entradas{" "}
                  <Button
                    className="mt-2 border  size-6 "
                    onClick={() =>
                      appendEntrada({
                        type: "",
                        protocolo: "",
                        baudRate: "9600",
                        dataBits: "8",
                        parity: "None",
                        stopBits: "1",
                        ieds: [],
                      })
                    }
                    type="button"
                    variant="default"
                  >
                    <Plus className="" />
                  </Button>
                </h1>
                {errors.entradas && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.entradas.message}
                  </p>
                )}

                {entradaFields.map((field, index) => (
                  <Entrada
                    data={data}
                    index={index}
                    key={field.id}
                    remove={removeEntrada}
                  />
                ))}
              </ScrollArea>
            </section>

            {/* STEP 3 */}
            <section
              className={` ${formStep === 2 ? "" : "hidden"
                }  p-2 mb-4 rounded gap-4 shadow-md `}
            >
              <div>
                <Label
                  className=" text-sm font-medium "
                  htmlFor="responsavelComercial"
                >
                  Comunicação com o Sigma
                </Label>

                <Select
                  defaultValue="Com Comunicação"
                  onValueChange={(value: string) => {
                    setValue("sigmaConnection", value);
                  }}
                  value={watch("sigmaConnection")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tipo da comunicação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key={1} value={"Sem Comunicação"}>
                      Sem Comunicação
                    </SelectItem>
                    <SelectItem key={2} value={"Com Comunicação"}>
                      Com Comunicação
                    </SelectItem>
                    <SelectItem key={3} value={"SigmaSync"}>
                      Sigma Sync
                    </SelectItem>
                  </SelectContent>
                </Select>

                {errors.sigmaConnection && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.sigmaConnection.message}
                  </p>
                )}
              </div>
            </section>

            {/* STEP 4 */}
            <section
              className={` ${formStep === 3 ? "" : "hidden"
                }  p-2 mb-4 rounded gap-4 shadow-md `}
            >
              <ScrollArea className="max-h-900 mt-4 w-full">
                <h1 className="text-lg font-bold">
                  Saídas{" "}
                  <Button
                    className="mt-2 border  size-6 "
                    onClick={() => {
                      const firstInput = requestForm.getValues("entradas.0");
                      appendSaida({
                        type: "TCP/IP",
                        protocolo: firstInput?.protocolo || "",
                        ieds: firstInput?.ieds,
                        baudRate: "9600",
                        dataBits: "8",
                        parity: "None",
                        stopBits: "1",
                      });
                    }}
                    type="button"
                    variant="default"
                  >
                    <Plus className="" />
                  </Button>
                </h1>

                {saidaFields.map((field, index) => (
                  <Output
                    data={data}
                    index={index}
                    key={field.id}
                    remove={removeSaida}
                    selectedIedsFromInput={selectedIedsFromInput}
                  />
                ))}
              </ScrollArea>
              <div className="mt-4">
                <Tiptap name="comments"></Tiptap>
              </div>
            </section>



            <Separator></Separator>

            {/* Botao */}
            <div className="w-full flex justify-between items-center mt-2">
              <Button
                disabled={formStep === 0}
                onClick={previousStep}
                className={` ${formStep === 0 ? "invisible" : ""}`}
                type="button"
                variant={"secondary"}
              >
                <ChevronLeft />
                Anterior
              </Button>
              <span className="w-full mx-auto text-center text-muted-foreground">
                {formStep + 1}/4
              </span>
              <Button
                onClick={nextStep}
                type="button"
                variant={"secondary"}
                className={` ${formStep === 3 ? "invisible" : ""}`}
              >
                Próximo
                <ChevronRight />
              </Button>
              {/* Send Button */}
            </div>

            <div
              className={`  mt-8 md:col-span-2 space-y-4  justify-end ${formStep === 3 ? "" : "hidden"
                }`}
            >
              <Button className="w-full" type="submit">
                Baixar PDF
              </Button>

              <Button
                className="w-full mr-2"
                onClick={handleExport}
                type="button"
                variant="outline"
              >
                Exportar Template
              </Button>
              {errors.root && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.root.message}
                </p>
              )}
            </div>
          </form>

        </FormProvider>


      </ScrollArea>
    </div>
  );
}
