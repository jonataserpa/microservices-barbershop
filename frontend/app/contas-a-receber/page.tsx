import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dados de exemplo
const receivables = [
  {
    id: "FAT-001",
    client: "João Silva",
    value: "R$ 2.500,00",
    dueDate: "15/04/2025",
    status: "Pendente",
  },
  {
    id: "FAT-002",
    client: "Maria Santos",
    value: "R$ 1.800,00",
    dueDate: "20/04/2025",
    status: "Pago",
  },
]

const columns = [
  { key: "id", header: "Nº Fatura" },
  { key: "client", header: "Cliente" },
  { key: "value", header: "Valor" },
  { key: "dueDate", header: "Vencimento" },
  {
    key: "status",
    header: "Status",
    cell: (item: any) => <StatusBadge status={item.status} />,
  },
  {
    key: "actions",
    header: "Ações",
    cell: (item: any) => (
      <Button variant="outline" size="sm" disabled={item.status === "Pago"}>
        Registrar Pagamento
      </Button>
    ),
  },
]

export default function ContasReceberPage() {
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Contas a Receber</h1>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="paid">Pagas</TabsTrigger>
          <TabsTrigger value="overdue">Vencidas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Faturas</CardTitle>
              <Button>Nova Fatura</Button>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={receivables} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Faturas Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={receivables.filter((item) => item.status === "Pendente")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Faturas Pagas</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={receivables.filter((item) => item.status === "Pago")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Faturas Vencidas</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={[]} emptyMessage="Não há faturas vencidas no momento" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total a Receber:</span>
                <span className="font-medium">R$ 4.300,00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recebido no Mês:</span>
                <span className="font-medium">R$ 1.800,00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vencido:</span>
                <span className="font-medium">R$ 0,00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Próximos Vencimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {receivables
                .filter((item) => item.status === "Pendente")
                .map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{item.client}</p>
                      <p className="text-sm text-muted-foreground">
                        Fatura {item.id} - Vence em {item.dueDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.value}</p>
                      <Button size="sm" variant="outline" className="mt-1">
                        Registrar
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
