import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Pagination } from "@/components/ui/pagination"
import { Plus, Download } from "lucide-react"

// Dados de exemplo
const recentSales = [
  {
    id: "NF-001",
    client: "João Silva",
    date: "01/03/2025",
    value: "R$ 1.500,00",
    status: "Emitida",
  },
]

const columns = [
  { key: "id", header: "Nº Nota" },
  { key: "client", header: "Cliente" },
  { key: "date", header: "Data" },
  { key: "value", header: "Valor" },
  {
    key: "status",
    header: "Status",
    cell: (item: any) => <StatusBadge status={item.status} />,
  },
  {
    key: "actions",
    header: "Ações",
    cell: () => (
      <Button variant="ghost" size="icon">
        <Download className="h-4 w-4" />
      </Button>
    ),
  },
]

export default function VendasPage() {
  return (
    <MainLayout title="Processamento de Vendas">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Nova Venda</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Cliente</label>
            <input type="text" placeholder="Nome do cliente" className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CPF/CNPJ</label>
            <input type="text" placeholder="000.000.000-00" className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <input type="text" placeholder="dd/mm/aaaa" className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>

        <div className="bg-white border rounded-md mb-6">
          <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium">
            <div className="col-span-5">Produto</div>
            <div className="col-span-2">Quantidade</div>
            <div className="col-span-2">Valor Unit.</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-1"></div>
          </div>

          <div className="grid grid-cols-12 gap-4 p-4 items-center">
            <div className="col-span-5">
              <input type="text" placeholder="Nome do produto" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="col-span-2">
              <input type="number" defaultValue={1} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="col-span-2">
              <input type="text" placeholder="R$ 0,00" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="col-span-2">
              <div className="px-3 py-2">R$ 0,00</div>
            </div>
            <div className="col-span-1 text-center">
              <Button variant="ghost" size="icon" className="text-red-500">
                <span className="sr-only">Remover</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </Button>
            </div>
          </div>

          <div className="p-4 border-t">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Item
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>R$ 0,00</span>
            </div>
            <div className="flex justify-between">
              <span>Impostos:</span>
              <span>R$ 0,00</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>R$ 0,00</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline">Cancelar</Button>
            <Button>Emitir Nota Fiscal</Button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Vendas Recentes</h2>
        <DataTable columns={columns} data={recentSales} />
        <Pagination currentPage={1} totalPages={1} className="mt-4" />
      </div>
    </MainLayout>
  )
}
