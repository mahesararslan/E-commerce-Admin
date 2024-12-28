"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
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
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Pencil, Trash2, Plus, Search } from 'lucide-react'
import axios from "axios"
import { set } from "mongoose"
import Loader from "@/components/loader"

// Define the category type
type Category = {
  _id: string
  name: string
  description: string
  parentCategory: string | null
  image: string
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    fetchCategories()
    setLoading(false)
  }, [])

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCategories(filtered)
  }, [searchTerm, categories])

  const fetchCategories = async () => {
    // Placeholder for fetching categories
    const response = await axios.get("/api/category");
    setCategories(response.data.categories)
    setFilteredCategories(response.data.categories)
    setLoader(false)
  }

  const handleDelete = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedCategory) {
      // Placeholder for deleting a category
      // Replace with your actual API call
      const response = await axios.delete(`/api/category/${selectedCategory._id}`);
      if (response.status !== 200) {
        return toast({
          title: "Error",
          description: "An error occurred while deleting the category."
        })
      }
      console.log("Deleting category:", selectedCategory)
      toast({
        title: "Category Deleted",
        description: "The category has been successfully deleted.",
      })
      await fetchCategories()
    }
    setIsDeleteDialogOpen(false)
  }

  if (loader) {
      return (
        <div className="h-screen flex justify-center items-center">
          <Loader />
        </div>
      )
    }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
        <Button className="w-full sm:w-auto bg-sky-950 hover:bg-sky-950 hover:scale-110" onClick={() => router.push('/categories/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add New Category
        </Button>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCategories.map((category) => (
          <Card key={category._id}>
            <CardContent className="p-4">
              <img src={category.image} alt={category.name} className="w-full h-56 object-cover mb-2 rounded" />
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className="text-sm text-gray-500">
                Parent: {category.parentCategory ? categories.find(cat => cat._id === category.parentCategory)?.name : "None"}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/categories/edit/${category._id}`)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(category)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster />
    </div>
  )
}