import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Pagination } from "@/components/ui/pagination"
import { StatCard } from "@/components/ui/stat-card"
import { Plus, Search, Filter, Pencil, Package, AlertTriangle, ArrowDownLeft, ArrowUpRight } from "lucide-react"

// Dados de exemplo
const products = [
  {
    name: "Produto A",
    code: "PRD001",
    quantity: 150,
    status: "Normal",
    lastUpdate: "10/03/2025",
  },
  {
    name: "Produto B",
    code: "PRD002",
    quantity: 25,
    status: "Baixo",
    lastUpdate: "11/03/2025",
  },
]

const columns = [
  { key: "name", header: "Produto" },
  { key: "code", header: "Código" },
  { key: "quantity", header: "Quantidade" },
  {
    key: "status",
    header: "Status",
    cell: (item: any) => <StatusBadge status={item.status} />,
  },
  { key: "lastUpdate", header: "Última Movimentação" },
  {
    key: "actions",
    header: "Ações",
    cell: () => (
      <Button variant="ghost" size="icon">
        <Pencil className="h-4 w-4" />
      </Button>
    ),
  },
]

export default function EstoquePage() {
  return (
    <MainLayout title="Controle de Estoque">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard de Estoque</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Produtos" value="1,234" icon={<Package className="h-5 w-5" />} />
        <StatCard title="Produtos Baixos" value="45" icon={<AlertTriangle className="h-5 w-5" />} />
        <StatCard title="Entradas Hoje" value="28" icon={<ArrowDownLeft className="h-5 w-5" />} />
        <StatCard title="Saídas Hoje" value="56" icon={<ArrowUpRight className="h-5 w-5" />} />
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Lista de Produtos</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Buscar produtos..." className="w-full pl-10 pr-4 py-2 border rounded-md" />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <DataTable columns={columns} data={products} />

        <div className="mt-4">
          <Pagination currentPage={1} totalPages={10} />
        </div>
      </div>
    </MainLayout>
  )
}
