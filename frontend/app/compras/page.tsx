import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Dados de exemplo
const orders = [
  {
    id: "#1234",
    supplier: "Empresa ABC",
    value: "R$ 5.000,00",
    status: "Pendente",
    dueDate: "25/03/2025",
  },
  {
    id: "#1235",
    supplier: "Empresa XYZ",
    value: "R$ 3.500,00",
    status: "Pago",
    dueDate: "28/03/2025",
  },
]

const deliveries = [
  {
    id: "#1234",
    supplier: "Empresa ABC",
    expectedDate: "25/03/2025",
    status: "Em Trânsito",
  },
  {
    id: "#1235",
    supplier: "Empresa XYZ",
    expectedDate: "28/03/2025",
    status: "Aguardando",
  },
]

const columns = [
  { key: "id", header: "Nº Pedido" },
  { key: "supplier", header: "Fornecedor" },
  { key: "value", header: "Valor" },
  {
    key: "status",
    header: "Status",
    cell: (item: any) => <StatusBadge status={item.status} />,
  },
  { key: "dueDate", header: "Vencimento" },
]

export default function ComprasPage() {
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Gestão de Compras e Contas a Receber</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Novo Pedido de Compra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fornecedor</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Data do Pedido</label>
                <input type="text" placeholder="dd/mm/aaaa" className="w-full px-3 py-2 border rounded-md" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valor Total</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md" />
              </div>

              <Button className="w-full">Registrar Pedido</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acompanhamento de Entregas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">Pedido {delivery.id}</h3>
                    <StatusBadge status={delivery.status} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Fornecedor: {delivery.supplier}</p>
                    <p>Previsão: {delivery.expectedDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Controle Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={orders} />
        </CardContent>
      </Card>
    </MainLayout>
  )
}
