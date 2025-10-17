import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Link } from "react-router";
import { PdfDocument } from "~/pdf/pdf-document";
import { useRequestInfo } from "~/components/store";
import { Button } from "~/components/ui/button";
export default function Docs() {
    const formData = useRequestInfo((state) => state.requestInfo);
    return (
        <div className="flex flex-col  gap-4 p-4 items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-4">
                <Button>

                    <PDFDownloadLink
                        document={<PdfDocument formData={formData} />}
                        fileName="requisicao.pdf"
                    >
                        {({ blob, url, loading, error }) =>
                            loading ? "Carregando documento..." : "Exportar para PDF"
                        }
                    </PDFDownloadLink>
                </Button>
                <div className="w-xl">

                    <PDFViewer height={"600px"} width={"100%"}>
                        <PdfDocument formData={formData} />
                    </PDFViewer>
                </div>
            </div>
        </div>
    );
}
