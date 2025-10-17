import { Document, Page, StyleSheet, Text, View, Image } from "@react-pdf/renderer";
import type { RequestForm } from "~/types";
import logo from '../../assets/logo.png'
import { base64 } from "zod";

const styles = StyleSheet.create({
  waterMark: {
    position: 'absolute',
    top: '30%',
    left: '40%',
    width: 200,
    height: 300,
    zIndex: 1,
    opacity: 0.25,
    transform: 'translate(-50%, -50%)',
  },
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  flex: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  flexContainerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  flexItem: {
    width: "50%",
    paddingRight: 10,
  },
  flexItemFull: {
    width: "100%",
  },
  logo: {
    width: 30,
    height: 50,
    marginRight: 5
  },
  greenBar: {
    backgroundColor: "#008242", // Green color
    height: 2, // Thin bar
    width: "100%", // Full width
    marginTop: 2, // Some space below title
    marginBottom: 10, // Some space above content
    borderRadius: 5, // Rounded edges
  },
});

interface PdfDocumentProps {
  formData: RequestForm;
}


export function PdfDocument({ formData }: PdfDocumentProps) {

  if (!formData) {
    return <Document><Page><Text>Nenhum dado disponível</Text></Page></Document>
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={logo} style={styles.waterMark}></Image>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 }}>
          <Image style={[styles.logo, styles.subtitle]} src={logo}></Image>
          <Text style={[styles.text, styles.title]}>Relatório de Requisição</Text>
        </View>
        <View style={styles.greenBar}></View>

        <View style={styles.flexContainerRow}>
          <View style={styles.flexItem}>
            <Text style={styles.subtitle}>Requerente</Text>
            <Text style={styles.text}>{formData.requester}</Text>
          </View>
          <View style={styles.flexItem}>
            <Text style={styles.subtitle}>Departamento</Text>
            <Text style={styles.text}>{formData.departament.toUpperCase()}</Text>
          </View>
          <View style={styles.flexItem}>
            <Text style={styles.subtitle}>E-mail</Text>
            <Text style={styles.text}>{formData.email}</Text>
          </View>
          <View style={styles.flexItem}>
            <Text style={styles.subtitle}>Cliente</Text>
            <Text style={styles.text}>{formData.client}</Text>
          </View>
          <View style={styles.flexItem}>
            <Text style={styles.subtitle}>Projeto</Text>
            <Text style={styles.text}>{formData.project}</Text>
          </View>
          <View style={styles.flexItem}>
            <Text style={styles.subtitle}>Nº Pedido</Text>
            <Text style={styles.text}>{formData.invoiceNumber}</Text>
          </View>
          <View style={styles.flexItem}>
            <Text style={styles.subtitle}>Nº Cliente</Text>
            <Text style={styles.text}>{formData.clientNumber}</Text>
          </View>

        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Comunicação com o Sigma: {formData.sigmaConnection}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Gateway: {formData.gateway}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Comentários</Text>
          <Text> {formData.comments}</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Image src={logo} style={styles.waterMark}></Image>
        {/* Entradas */}
        <View>
          <Text style={styles.title}>Entradas</Text>
        </View>
        <Text style={[{ fontSize: 12, marginTop: 2, marginBottom: 4 }]}>Aqui estão listados todos os IEDs que serão lidos pelo {formData.gateway} e devem ser mapeados na aplicação de acordo com a paraetrização proposta abaixo: </Text>
        <View style={styles.section}>
          <Text style={styles.subtitle}>Entradas: {formData.entradas?.length}</Text>
          {formData.entradas?.map((entrada, index) => (
            <View key={index} style={{ marginBottom: 10, padding: 10, border: "1px solid #ccc" }}>
              <Text style={styles.text}>Protocolo: {entrada.protocolo}</Text>
              <Text style={styles.text}>Tipo: {entrada.type}</Text>
              {entrada.type !== "TCP/IP" && (
                <View style={[styles.flex, { gap: "2" }]}>
                  <Text style={styles.text}>Parâmetros de rede:</Text>
                  <Text style={styles.text}>Baudrate: {entrada.baudRate} - Data Bits: {entrada.dataBits} - Parity: {entrada.parity} -Stop Bits: {entrada.stopBits} - </Text>
                </View>
              )}
              {entrada.type === "TCP/IP" && (
                <View>
                  <Text style={styles.text}>IP do IED: {entrada.ip}</Text>
                  <Text style={styles.text}>Porta de comunicação do IED: {entrada.port}</Text>
                </View>
              )}
              {entrada.ieds && entrada.ieds.length > 0 && (
                <Text style={styles.subtitle}>IEDs:</Text>
              )}
              {entrada.ieds?.map((ied, iedIndex) => (
                <View key={iedIndex} style={{ marginLeft: 10 }}>
                  <Text style={[styles.text, { fontWeight: "bold" }]}>{ied.name} - {ied.manufacturer}</Text>
                  <Text style={styles.text}>Endereço: {ied.address}  {ied.modules && `- Módulos: ${ied.modules}`}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

      </Page>

      <Page size="A4" style={styles.page}>
        <Image src={logo} style={styles.waterMark}></Image>
        {/* Entradas */}
        <View>
          <Text style={styles.title}>Saídas</Text>
        </View>
        <Text style={[{ fontSize: 12, marginTop: 2, marginBottom: 4 }]}>Aqui estão listados todos os IEDs que serão exportados pelo {formData.gateway} e devem ser mapeados na aplicação de acordo com a paraetrização proposta abaixo nas respectivas saídas: </Text>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Saídas: {formData.saidas?.length}</Text>
          {formData.saidas?.map((saida, index) => (
            <View key={index} style={{ marginBottom: 10, padding: 10, border: "1px solid #ccc" }}>
              <Text style={styles.text}>Protocolo: {saida.protocolo}</Text>
              <Text style={styles.text}>Tipo: {saida.type}</Text>
              {saida.type !== "TCP/IP" && (
                <View>
                  <Text style={styles.text}>Baudrate: {saida.baudRate}</Text>
                  <Text style={styles.text}>Data Bits: {saida.dataBits}</Text>
                  <Text style={styles.text}>Parity: {saida.parity}</Text>
                  <Text style={styles.text}>Stop Bits: {saida.stopBits}</Text>
                </View>
              )}
              {saida.type === "TCP/IP" && (
                <View>
                  <Text style={styles.text}>IP do {formData.gateway}: {saida.ip}</Text>
                  <Text style={styles.text}>Porta de comunicação: {saida.port ? saida.port : "Padrão do protocolo"}</Text>
                </View>
              )}
              {saida.ieds && saida.ieds.length > 0 && (
                <Text style={styles.subtitle}>IEDs:</Text>
              )}
              {saida.ieds?.map((ied, iedIndex) => (
                <View key={iedIndex} style={{ marginLeft: 10 }}>
                  <Text style={[styles.text, { fontWeight: "bold" }]}>{ied.name} - {ied.manufacturer}</Text>
                  <Text style={styles.text}>Endereço: {ied.address}  {ied.modules && `- Módulos: ${ied.modules}`}</Text>

                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
