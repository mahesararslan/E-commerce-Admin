"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { format } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import Loader from "@/components/loader"

type Order = {
  _id: string
  userId: string
  products: Array<{
    productId: string
    quantity: number
  }>
  totalAmount: number
  paymentMethod: string
  orderStatus: "pending" | "shipped"
  shippingAddress: string
  country: string
  city: string
  postalCode: string
  phoneNumber: string
  recieverName: string
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "shipped">("all")
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, filterStatus])

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders")
      setOrders(response.data.orders.reverse()) // Reverse to show recent orders first
      setLoader(false)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filterOrders = () => {
    if (filterStatus === "all") {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter(order => order.orderStatus === filterStatus))
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
  }

  const handleProcessOrder = async (orderId: string) => {
    try {
      await axios.put(`/api/orders`, { 
        orderId,
        orderStatus: "shipped"
     })
      toast({
        title: "Success",
        description: "Order has been processed and marked as shipped.",
      })
      fetchOrders() // Refresh orders after updating
    } catch (error) {
      console.error("Error processing order:", error)
      toast({
        title: "Error",
        description: "Failed to process order. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loader) {
      return (
        <div className="h-screen flex justify-center items-center">
          <Loader />
        </div>
      )
    }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <div className="mb-6">
        <Select onValueChange={(value: "all" | "pending" | "shipped") => setFilterStatus(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending Orders</SelectItem>
            <SelectItem value="shipped">Shipped Orders</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.map((order) => (
          <Card key={order._id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Order ID: {order._id.slice(-6)}</span>
                <Badge 
                  variant={order.orderStatus === "shipped" ? "default" : "secondary"}
                  className={order.orderStatus === "pending" ? "bg-red-100 text-red-800 hover:bg-red-100 px-4 py-2" : "bg-green-100 text-green-800 hover:bg-green-100 px-4 py-2"}
                >
                  {order.orderStatus}
                </Badge>
              </div>
              <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
              <p>Country: {order.country}</p>
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Date: {format(new Date(order.createdAt), "PPP")}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleViewOrder(order)}>View Order</Button>
              {order.orderStatus === "pending" && (
                <Button className="bg-sky-950 hover:bg-sky-950 hover:scale-110" onClick={() => handleProcessOrder(order._id)}>Process Order</Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information for order ID: {selectedOrder?._id.slice(-6)}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            {selectedOrder && (
              <div className="grid gap-4 py-4">
                <div>
                  <h4 className="font-semibold">Receiver</h4>
                  <p>{selectedOrder.recieverName}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Shipping Address</h4>
                  <p>{selectedOrder.shippingAddress}</p>
                  <p>{selectedOrder.city}, {selectedOrder.country}, {selectedOrder.postalCode}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Phone Number</h4>
                  <p>{selectedOrder.phoneNumber}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Products</h4>
                  <ul>
                    {selectedOrder.products.map((product, index) => (
                      <li key={index}>
                        Product ID: {product.productId}, Quantity: {product.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Total Amount</h4>
                  <p>${selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Payment Method</h4>
                  <p>{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Order Status</h4>
                  <p>{selectedOrder.orderStatus}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Order Date</h4>
                  <p>{format(new Date(selectedOrder.createdAt), "PPP")}</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}