import type { ComponentProps } from "react";
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";

type ViewStyle = ComponentProps<typeof View>["style"];
import { formatCentsToBRL, formatDate, formatDateTime } from "@/lib/format";
import type { getInvoiceDetail } from "@/app/dashboard/(pages)/notas/(pages)/[id]/lib/get-invoice-detail";

type InvoiceDetail = NonNullable<Awaited<ReturnType<typeof getInvoiceDetail>>>["invoice"];

const border = "0.75 solid #000000";
const borderLight = "0.75 solid #52525b";

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#18181b",
  },
  headerBox: {
    flexDirection: "row",
    border,
  },
  headerLeft: {
    flex: 1.4,
    padding: 8,
    justifyContent: "center",
    borderRight: border,
  },
  logo: {
    width: 100,
    height: 40,
    objectFit: "contain",
    marginBottom: 4,
  },
  storeName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
  },
  storeMeta: {
    fontSize: 7,
    color: "#3f3f46",
    marginTop: 1,
  },
  headerRight: {
    flex: 1,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  docTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  docSubtitle: {
    fontSize: 6,
    color: "#52525b",
    textAlign: "center",
    marginTop: 2,
    marginBottom: 6,
  },
  docNumber: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    border,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  docDate: {
    fontSize: 7,
    color: "#3f3f46",
    marginTop: 4,
  },
  natureRow: {
    flexDirection: "row",
    border,
    borderTopWidth: 0,
  },
  natureCell: {
    flex: 1,
    padding: 6,
  },
  fieldLabel: {
    fontSize: 6,
    color: "#52525b",
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  clientBox: {
    border,
    borderTopWidth: 0,
    padding: 8,
  },
  clientNameRow: {
    marginBottom: 6,
  },
  clientFieldsRow: {
    flexDirection: "row",
  },
  clientField: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginTop: 10,
    marginBottom: 3,
  },
  table: {
    border,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f4f4f5",
    borderBottom: border,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: borderLight,
  },
  tableRowLast: {
    flexDirection: "row",
  },
  th: {
    padding: 4,
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: "#3f3f46",
    borderRight: borderLight,
  },
  td: {
    padding: 4,
    fontSize: 7.5,
    borderRight: borderLight,
  },
  colCode: { width: "14%" },
  colDesc: { width: "44%" },
  colQty: { width: "10%", textAlign: "right" },
  colUnit: { width: "10%", textAlign: "right" },
  colUnitPrice: { width: "11%", textAlign: "right" },
  colTotal: { width: "11%", textAlign: "right", borderRight: "none" },
  colServiceDesc: { width: "78%" },
  colServiceValue: { width: "22%", textAlign: "right", borderRight: "none" },
  totalsRow: {
    flexDirection: "row",
    border,
    borderTopWidth: 0,
  },
  totalsCell: {
    flex: 1,
    padding: 6,
    borderRight: borderLight,
  },
  totalsCellLast: {
    flex: 1,
    padding: 6,
    backgroundColor: "#f4f4f5",
  },
  totalsValueBig: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  notesBox: {
    border,
    borderTopWidth: 0,
    padding: 8,
  },
  disclaimer: {
    marginTop: 28,
    textAlign: "center",
    fontSize: 6.5,
    color: "#a1a1aa",
  },
});

function Field({
  label,
  value,
  style,
}: {
  label: string;
  value?: string | null;
  style?: ViewStyle;
}) {
  return (
    <View style={style}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || "-"}</Text>
    </View>
  );
}

export function InvoicePdfDocument({
  invoice,
  subtotalCents,
  logoPath,
  storePhone,
}: {
  invoice: InvoiceDetail;
  subtotalCents: number;
  logoPath?: string;
  storePhone?: string;
}) {
  const productsTotalCents = invoice.items.reduce((sum, item) => sum + item.subtotalCents, 0);
  const servicesTotalCents = invoice.services.reduce((sum, service) => sum + service.amountCents, 0);

  return (
    <Document title={`Comprovante ${invoice.number}`}>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.headerBox}>
          <View style={styles.headerLeft}>
            {logoPath ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={logoPath} style={styles.logo} />
            ) : (
              <Text style={styles.storeName}>Jairo Motos</Text>
            )}
            {storePhone && <Text style={styles.storeMeta}>{storePhone}</Text>}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.docTitle}>COMPROVANTE DE VENDA</Text>
            <Text style={styles.docSubtitle}>Documento sem valor fiscal</Text>
            <Text style={styles.docNumber}>Nº {invoice.number}</Text>
            <Text style={styles.docDate}>Emitido em {formatDateTime(invoice.issuedAt)}</Text>
          </View>
        </View>

        <View style={styles.natureRow}>
          <View style={styles.natureCell}>
            <Text style={styles.fieldLabel}>NATUREZA DA OPERAÇÃO</Text>
            <Text style={styles.fieldValue}>Venda de produtos e serviços</Text>
          </View>
        </View>

        {/* Cliente */}
        <View style={styles.clientBox}>
          <View style={styles.clientNameRow}>
            <Text style={styles.fieldLabel}>CLIENTE</Text>
            <Text style={styles.fieldValue}>{invoice.customer.name}</Text>
          </View>
          <View style={styles.clientFieldsRow}>
            <Field label="TELEFONE" value={invoice.customer.phone} style={styles.clientField} />
            <Field
              label="ATENDIDO POR"
              value={invoice.createdBy.name}
              style={styles.clientField}
            />
          </View>
        </View>

        {/* Produtos */}
        {invoice.items.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>PRODUTOS</Text>
            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.th, styles.colCode]}>CÓDIGO</Text>
                <Text style={[styles.th, styles.colDesc]}>DESCRIÇÃO</Text>
                <Text style={[styles.th, styles.colQty]}>QUANT.</Text>
                <Text style={[styles.th, styles.colUnit]}>UNID.</Text>
                <Text style={[styles.th, styles.colUnitPrice]}>VALOR UNIT.</Text>
                <Text style={[styles.th, styles.colTotal]}>VALOR TOTAL</Text>
              </View>
              {invoice.items.map((item, i) => (
                <View
                  key={item.id}
                  style={i === invoice.items.length - 1 ? styles.tableRowLast : styles.tableRow}
                >
                  <Text style={[styles.td, styles.colCode]}>{item.product.sku}</Text>
                  <Text style={[styles.td, styles.colDesc]}>{item.product.name}</Text>
                  <Text style={[styles.td, styles.colQty]}>{item.quantity}</Text>
                  <Text style={[styles.td, styles.colUnit]}>{item.product.unit}</Text>
                  <Text style={[styles.td, styles.colUnitPrice]}>
                    {formatCentsToBRL(item.unitPriceCents)}
                  </Text>
                  <Text style={[styles.td, styles.colTotal]}>
                    {formatCentsToBRL(item.subtotalCents)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Serviços */}
        {invoice.services.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>SERVIÇOS</Text>
            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.th, styles.colServiceDesc]}>DESCRIÇÃO</Text>
                <Text style={[styles.th, styles.colServiceValue]}>VALOR</Text>
              </View>
              {invoice.services.map((service, i) => (
                <View
                  key={service.id}
                  style={
                    i === invoice.services.length - 1 ? styles.tableRowLast : styles.tableRow
                  }
                >
                  <Text style={[styles.td, styles.colServiceDesc]}>{service.description}</Text>
                  <Text style={[styles.td, styles.colServiceValue]}>
                    {formatCentsToBRL(service.amountCents)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Resumo do pagamento */}
        <Text style={styles.sectionLabel}>RESUMO DO PAGAMENTO</Text>
        <View style={styles.totalsRow}>
          <View style={styles.totalsCell}>
            <Text style={styles.fieldLabel}>VALOR DOS PRODUTOS</Text>
            <Text style={styles.fieldValue}>{formatCentsToBRL(productsTotalCents)}</Text>
          </View>
          <View style={styles.totalsCell}>
            <Text style={styles.fieldLabel}>VALOR DOS SERVIÇOS</Text>
            <Text style={styles.fieldValue}>{formatCentsToBRL(servicesTotalCents)}</Text>
          </View>
          <View style={styles.totalsCell}>
            <Text style={styles.fieldLabel}>DESCONTO</Text>
            <Text style={styles.fieldValue}>
              {invoice.discountCents > 0 ? `-${formatCentsToBRL(invoice.discountCents)}` : "-"}
            </Text>
          </View>
          <View style={styles.totalsCellLast}>
            <Text style={styles.fieldLabel}>VALOR TOTAL</Text>
            <Text style={styles.totalsValueBig}>{formatCentsToBRL(invoice.totalCents)}</Text>
          </View>
        </View>

        {invoice.notes && (
          <View style={styles.notesBox}>
            <Text style={styles.fieldLabel}>OBSERVAÇÕES</Text>
            <Text style={styles.fieldValue}>{invoice.notes}</Text>
          </View>
        )}

        <Text style={styles.disclaimer}>
          Este comprovante não possui valor fiscal e não substitui a Nota Fiscal Eletrônica (NF-e).
          Gerado em {formatDate(new Date())}.
        </Text>
      </Page>
    </Document>
  );
}

export function renderInvoicePdfBuffer(props: {
  invoice: InvoiceDetail;
  subtotalCents: number;
  logoPath?: string;
  storePhone?: string;
}) {
  return renderToBuffer(<InvoicePdfDocument {...props} />);
}
