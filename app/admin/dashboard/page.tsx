'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ShoppingCart, Users, Package, DollarSign, PlusCircle } from "lucide-react";
import Link from "next/link";

// --- Datos ficticios (dummy) ---
const stats = [
  { title: "Ventas del mes", value: "$12,430", icon: <DollarSign className="text-green-500" size={24} /> },
  { title: "Pedidos pendientes", value: "23", icon: <ShoppingCart className="text-yellow-500" size={24} /> },
  { title: "Clientes nuevos", value: "+12", icon: <Users className="text-blue-500" size={24} /> },
  { title: "Stock bajo", value: "5", icon: <Package className="text-red-500" size={24} /> },
];

const ventasData = [
  { name: "Lun", total: 2400 },
  { name: "Mar", total: 1398 },
  { name: "Mié", total: 9800 },
  { name: "Jue", total: 3908 },
  { name: "Vie", total: 4800 },
  { name: "Sáb", total: 3800 },
  { name: "Dom", total: 4300 },
];

const pedidosRecientes = [
  { id: "#001", cliente: "Juan Pérez", fecha: "13/10/2025", estado: "Pendiente", total: "$520" },
  { id: "#002", cliente: "María Gómez", fecha: "13/10/2025", estado: "Completado", total: "$340" },
  { id: "#003", cliente: "Carlos Díaz", fecha: "12/10/2025", estado: "Enviado", total: "$1250" },
];

const productosTop = [
  { nombre: "Filamento PLA 1kg", vendidos: 120 },
  { nombre: "Resina UV gris", vendidos: 80 },
  { nombre: "Boquilla 0.4mm", vendidos: 65 },
  { nombre: "Tubo PTFE", vendidos: 40 },
];

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Panel de Administración</h1>

      {/* --- Estadísticas principales --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.title} className="shadow-md hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{item.title}</CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- Gráfico de ventas --- */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Ventas de la semana</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ventasData}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* --- Últimos pedidos --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Últimos pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Cliente</th>
                  <th className="text-left p-2">Fecha</th>
                  <th className="text-left p-2">Estado</th>
                  <th className="text-left p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {pedidosRecientes.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{p.id}</td>
                    <td className="p-2">{p.cliente}</td>
                    <td className="p-2">{p.fecha}</td>
                    <td className="p-2">{p.estado}</td>
                    <td className="p-2 font-semibold">{p.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* --- Productos más vendidos --- */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Productos más vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {productosTop.map((p) => (
                <li key={p.nombre} className="flex justify-between">
                  <span>{p.nombre}</span>
                  <span className="font-semibold">{p.vendidos}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* --- Acciones rápidas --- */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Acciones rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link href="/admin/productos/create" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <PlusCircle size={18} /> Nuevo Producto
          </Link>
          <Link href="/admin/pedidos" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            <ShoppingCart size={18} /> Ver Pedidos
          </Link>
          <Link href="/admin/productos/inventario" className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
            <Package size={18} /> Inventario
          </Link>
          <Link href="/admin/clientes" className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
            <Users size={18} /> Clientes
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
