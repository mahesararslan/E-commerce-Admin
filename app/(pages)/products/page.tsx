"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
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
import { Pencil, Trash2, Search, Plus} from "lucide-react"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import Loader from "@/components/loader"

type Product = {
    _id: string
    name: string
    price: number
    description: string
    images?: string[]
    stock: number
    category: string
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product []>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [loader, setLoader] = useState(true);
    const router = useRouter()
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchCategories = async () => {
          try {
            const response = await axios.get('/api/category');
            if (response.data.status !== 200) {
              throw new Error('Failed to fetch categories')
            }
            setCategories(response.data.categories)
          } catch (error) {
            console.error('Error fetching categories:', error)
            toast({
              title: "Error",
              description: "Failed to load categories. Please try again.",
              variant: "destructive",
            })
          }
        }
    
        fetchCategories()
      }, [toast])

    useEffect(() => {
        axios.get("/api/products")
            .then((response) => {
                console.log("Response: ", response.data)
                setProducts(response.data)
                setFilteredProducts(response.data)
                console.log("Products: ", response.data)
                setLoader(false)
            })
    }, [])

    useEffect(() => {
        const results: any = products.filter(product => // @ts-ignore
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

  if(loader) {
    return <div className="h-screen flex justify-center items-center" ><Loader /></div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Link href="/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4 bg-gray-800 hover:bg-gray-700" />
            Add New Product
          </Button>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product._id} className="overflow-hidden shadow-lg">
            <CardContent className="p-0 relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images && product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <img
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="w-full h-72 object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2" />
                <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2" />
              </Carousel>
              
            </CardContent>
            
            <CardFooter className="flex flex-col items-start p-4">
              <div className="flex justify-between items-center w-full mb-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <Badge variant="secondary" className="text-lg font-bold">
                  ${product.price.toFixed(2)}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mb-1">Category: { // @ts-ignore
                categories.find((category) => category._id === product.category)?.name || "Unknown Category"
              }</p>
              <p className="text-sm text-gray-500 mb-4">Stock: {product.stock}</p>
              
              <div className="flex justify-end w-full space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product._id)}
                  aria-label={`Edit ${product.name}`}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteProductId(product._id)}
                  aria-label={`Delete ${product.name}`}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
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