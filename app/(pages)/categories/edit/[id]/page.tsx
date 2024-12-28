"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Upload, X } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'
import axios from "axios"
import Loader from "@/components/loader"

// Define the category type
type Category = {
  _id: string
  name: string
  description: string
  parentCategory: string | null
  image: string
}

// Zod schema for form validation
const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().min(10, "Category description must be at least 10 characters"),
  parentCategory: z.string().optional().nullable(), // 
  image: z.string().min(1, "Image is required")
})

export default function EditCategory({ params }: { params: { id: string } }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      parentCategory: null,
      image: "",
    },
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category');
        if (response.data.status !== 200) {
          throw new Error('Failed to fetch categories')
        }
        console.log("Categories response:", response.data.categories)
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
    console.log("Categories: ",categories)
    fetchCategories()
  }, [toast])

  useEffect(() => {
    const fetchCategory = async () => {
      
      const response = await axios.get(`/api/category/${params.id}`)

      
      form.reset({
        name: response.data.category.name,
        description: response.data.category.description,
        parentCategory: response.data.category.parentCategory,
        image: response.data.category.image,
      }) // @ts-ignore
      setImagePreview(response.data.category.image)
      setLoading(false);
    }
    fetchCategory()
  }, [params.id, form])

  const onSubmit = async (data: z.infer<typeof categorySchema>) => {
    // Placeholder for updating the category
    // Replace with your actual API call
    const payload =  {
        id: params.id,
        name: data.name,
        parentCategory: data.parentCategory,
        description: data.description,
        image: data.image
    }
    console.log("Payload:", payload)
    const response = await axios.put(`/api/category`, payload);
    if(response.status !== 200) {
      return toast({
        title: "Error",
        description: "An error occurred while updating the category."
      })
    }
    console.log("Updating category:", data)
    toast({
      title: "Category Updated",
      description: "The category has been successfully updated.",
    })
    router.push('/categories')
  }

  const handleImageUpload = (result: any) => {
    if (result.event === "success") {
      form.setValue("image", result.info.secure_url)
      setImagePreview(result.info.secure_url)
    }
  }

  const handleRemoveImage = () => {
    form.setValue("image", "")
    setImagePreview(null)
  }

  if(loading) {
    return <div className="h-screen flex justify-center items-center" ><Loader /></div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter category name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Category Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Description</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter category description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
          control={form.control}
          name="parentCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Category</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value || "0"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Image</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-start space-y-2">
                    {imagePreview && (
                      <div className="relative">
                        <img src={imagePreview} alt="Category" className="w-32 h-32 object-cover rounded" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0"
                          onClick={(result) => { // @ts-ignore
                            field.value = ""
                            field.onChange(field.value)
                            setImagePreview(field.value)
                            console.log("Image uploaded:", field.value)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <CldUploadWidget
                      uploadPreset="e-commerce-admin"
                      onSuccess={handleImageUpload}
                    >
                      {({ open }) => (
                        <Button type="button" variant="outline" onClick={() => open()}>
                          <Upload className="h-4 w-4 mr-2" />
                          {imagePreview ? "Change Image" : "Upload Image"}
                        </Button>
                      )}
                    </CldUploadWidget>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" className="hover:scale-110" onClick={() => router.push('/categories')}>
              Cancel
            </Button>
            <Button className="bg-sky-950 hover:bg-sky-950 hover:scale-110" type="submit">Update Category</Button>
          </div>
        </form>
      </Form>
      <Toaster />
    </div>
  )
}