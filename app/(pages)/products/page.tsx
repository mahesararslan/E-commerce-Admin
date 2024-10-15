"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Pencil, Trash2, Search } from "lucide-react"
import axios from "axios"
import Loader from "@/components/loader"

export default function ProductsPage() {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [loader, setLoader] = useState(true);
    const router = useRouter()

    useEffect(() => {
        axios.get("/api/products")
            .then((response) => {
                setProducts(response.data)
                setFilteredProducts(response.data)
                console.log("Products: ", response.data)
                setLoader(false)
            })
    }, [])

    useEffect(() => {
        const results = products.filter(product => // @ts-ignore
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredProducts(results)
    }, [searchTerm, products])

    const handleEdit = (productId: string) => {
        router.push(`/products/edit/${productId}`)
    }

  const handleDelete = async (productId: string) => {
    try {
      // Send DELETE request to your backend
      const response = await axios.delete(`/api/products/${productId}`)

      if (response.status === 200) { 
        // Remove the product from the local state 
        setProducts(products.filter((product: any) => product._id !== productId))
      } else {
        console.error("Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
    setDeleteProductId(null)
  }

  return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-4">Products</h1>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <Link href="/products/new">
                <Button>Add New Product</Button>
                </Link>
                <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full"
                />
                </div>
            </div>
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredProducts.map((product: any) => ( 
                    <TableRow className="border-zinc-500" key={product._id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-right">
                        <Button
                            variant="ghost"
                            size="icon" 
                            onClick={() => handleEdit(product._id)} 
                            aria-label={`Edit ${product.name}`}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon" 
                            onClick={() => setDeleteProductId(product._id)} 
                            aria-label={`Delete ${product.name}`}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the product.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteProductId && handleDelete(deleteProductId)}>
                    Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
  )
}