import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Pagination } from "@/components/ui/pagination"
import { Search, Filter, Download } from "lucide-react"

// Dados de exemplo
const invoices = [
  {
    id: "NF-001",
    client: "João Silva",
    date: "01/03/2025",
    value: "R$ 1.500,00",
    status: "Emitida",
  },
  {
    id: "NF-002",
    client: "Maria Santos",
    date: "05/03/2025",
    value: "R$ 2.300,00",
    status: "Emitida",
  },
  {
    id: "NF-003",
    client: "Carlos Oliveira",
    date: "10/03/2025",
    value: "R$ 950,00",
    status: "Cancelada",
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

export default function NotasFiscaisPage() {
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notas Fiscais</h1>
        <Button>Emitir Nova Nota</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar notas fiscais..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <DataTable columns={columns} data={invoices} />

        <div className="mt-4">
          <Pagination currentPage={1} totalPages={10} />
        </div>
      </div>
    </MainLayout>
  )
}
