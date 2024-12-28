"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, TrendingUp, Package, Users } from 'lucide-react'

// Mock data
const weeklyData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
]

const salesDistribution = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Books', value: 300 },
  { name: 'Home', value: 200 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const recentTransactions = [
  { id: 1, user: 'John Doe', amount: 250, status: 'completed' },
  { id: 2, user: 'Jane Smith', amount: 180, status: 'pending' },
  { id: 3, user: 'Bob Johnson', amount: 420, status: 'completed' },
  { id: 4, user: 'Alice Brown', amount: 150, status: 'failed' },
  { id: 5, user: 'Charlie Wilson', amount: 300, status: 'completed' },
]

const recentOrders = [
  { id: 1, product: 'Wireless Headphones', quantity: 2, total: 199.98 },
  { id: 2, product: 'Smart Watch', quantity: 1, total: 249.99 },
  { id: 3, product: 'Laptop Stand', quantity: 3, total: 89.97 },
  { id: 4, product: 'Bluetooth Speaker', quantity: 1, total: 79.99 },
  { id: 5, product: 'Ergonomic Keyboard', quantity: 2, total: 159.98 },
]

const topSellingProducts = [
  { id: 1, name: 'Smartphone X', sales: 1200, revenue: 599999 },
  { id: 2, name: 'Laptop Pro', sales: 800, revenue: 999999 },
  { id: 3, name: 'Wireless Earbuds', sales: 2000, revenue: 299999 },
  { id: 4, name: 'Smart Home Hub', sales: 500, revenue: 99999 },
  { id: 5, name: 'Fitness Tracker', sales: 1500, revenue: 149999 },
]

export default function Dashboard() {
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalSales, setTotalSales] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)

  useEffect(() => {
    // Simulate API call to fetch data
    setTimeout(() => {
      setTotalEarnings(1234567)
      setTotalRevenue(2345678)
      setTotalSales(3456)
      setTotalProfit(987654)
    }, 1000)
  }, [])

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Earnings"
          value={totalEarnings}
          icon={<DollarSign className="h-6 w-6" />}
          trend={0.12}
        />
        <MetricCard
          title="Total Revenue"
          value={totalRevenue}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={-0.05}
        />
        <MetricCard
          title="Total Sales"
          value={totalSales}
          icon={<ShoppingCart className="h-6 w-6" />}
          trend={0.08}
        />
        <MetricCard
          title="Total Profit"
          value={totalProfit}
          icon={<Package className="h-6 w-6" />}
          trend={0.15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#00838f" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${transaction.user}`} alt={transaction.user} />
                      <AvatarFallback>{transaction.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <p className="text-sm font-medium">{transaction.user}</p>
                      <p className="text-sm text-muted-foreground">${transaction.amount}</p>
                    </div>
                  </div>
                  <Badge variant={transaction.status === 'completed' ? 'default' : transaction.status === 'pending' ? 'secondary' : 'destructive'}>
                    {transaction.status}
                  </Badge>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left font-medium">Product</th>
                    <th className="text-left font-medium">Quantity</th>
                    <th className="text-left font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-2">{order.product}</td>
                      <td className="py-2">{order.quantity}</td>
                      <td className="py-2">${order.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {topSellingProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                  </div>
                  <p className="font-medium">${(product.revenue / 100).toFixed(2)}</p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-8">
        <Button className="bg-sky-950 hover:bg-sky-950 hover:scale-110 text-white">
          View Detailed Reports
        </Button>
      </div>
    </div>
  )
}

// @ts-ignore
function MetricCard({ title, value, icon, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${value.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {trend > 0 ? (
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                {(trend * 100).toFixed(2)}% from last month
              </span>
            ) : (
              <span className="text-red-500 flex items-center">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                {(Math.abs(trend) * 100).toFixed(2)}% from last month
              </span>
            )}
          </p>
        </CardContent>
        <div
          className="absolute bottom-0 left-0 w-full h-1"
          style={{
            background: `linear-gradient(to right, #006064 ${Math.abs(trend) * 100}%, transparent ${Math.abs(trend) * 100}%)`,
          }}
        />
      </Card>
    </motion.div>
  )
}