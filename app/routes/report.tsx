import type { Route } from "./+types/report";

import { ScrollArea } from "../components/ui/scroll-area";
import {
  Check,
  ChevronLeft,
  FileInput,
  FileOutput,
  Sigma,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { redirect } from "react-router";
import { useRequestInfo } from "~/components/store";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { PdfDocument } from "../components/pdf-document";

export default function Report() {
  const formData = useRequestInfo((state) => state.requestInfo);

  return (
    <ScrollArea className=" p-4 max-w-4xl mx-auto h-[900px] shadow-lg ">
      <div className="flex justify-between items-center mb-8">
        <Button onClick={() => redirect("/")} variant={"outline"}>
          <ChevronLeft />
        </Button>
        <PDFDownloadLink
          document={<PdfDocument formData={formData} />}
          fileName="requisicao.pdf"
        >
          {({ blob, url, loading, error }) =>
            loading ? "Carregando documento..." : "Exportar para PDF"
          }
        </PDFDownloadLink>
      </div>
        <PDFViewer height={"600px"} width={"100%"}>
            <PdfDocument formData={formData} />
        </PDFViewer>

    </ScrollArea>
  );
}
