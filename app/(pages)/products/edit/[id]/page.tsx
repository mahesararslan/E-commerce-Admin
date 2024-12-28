"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Upload, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { Toaster } from "@/components/ui/toaster"
import { useRouter } from "next/navigation"
import { CldUploadWidget } from 'next-cloudinary'
import Loader from "@/components/loader"
import Link from "next/link"

// Define the schema with images
const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  productDescription: z.string().min(10, {
    message: "Product description must be at least 10 characters.",
  }),
  price: z.number().min(0.01, {
    message: "Price must be at least $0.01.",
  }),
  isOnSale: z.boolean().default(false),
  salePrice: z.number().optional(),
  categoryId: z.string({
    required_error: "Please select a category.",
  }),
  stock: z.number().int().min(0, {
    message: "Stock must be a non-negative integer.",
  }),
  images: z.array(z.string()).min(1, "At least one image is required.").max(5, "You can upload a maximum of 5 images."),
}).refine((data) => {
  // If the product is on sale, ensure that salePrice is defined and is a positive number
  if (data.isOnSale) {
    return data.salePrice !== undefined && data.salePrice > 0;
  }
  return true;
}, {
  path: ['salePrice'], // Point to salePrice in case of an error
  message: 'Sale price must be provided and greater than 0 if the product is on sale.',
});

export default function EditProductForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [id, setId] = useState<string | null>(null)
  const [product, setProduct] = useState<any | null>(null)
  const [loader, setLoader] = useState<boolean>(true)
  const [categories, setCategories] = useState([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      price: 0,
      isOnSale: false,
      salePrice: 0,
      categoryId: "",
      stock: 0,
      images: [],
    },
  });

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
    const pathParts = window.location.pathname.split('/')
    const productId = pathParts[pathParts.length - 1]
    setId(productId)

    axios.get(`/api/products/${productId}`).then((response) => {
      const productData = response.data.product
      setProduct(productData)
      setLoader(false)

      // Reset form with fetched product data including images
      form.reset({
        productName: productData.name,
        productDescription: productData.description,
        price: productData.price,
        images: productData.images || [],
        stock: productData.stock,
        categoryId: productData.category,
        isOnSale: productData.isOnSale,
        salePrice: productData.salePrice || undefined,
      })
    })
  }, [form])

  if (loader) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    )
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      console.log("Product: ", values)
      const response = await axios.put(`/api/products/${product._id}`, values)

      if (response.status === 200) {
        toast({
          title: "Product Updated",
          description: "Your product has been successfully updated.",
        })
        setTimeout(() => {
          router.push("/products")
        }, 2000)
      } else {
        throw new Error("Error updating product")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Link href="/products">
        <div className="w-full flex justify-end text-blue-900 font-bold text-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
            />
          </svg>
          <div className="text-zinc-700 font-bold">Products Page</div>
        </div>
      </Link>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Product Name Field */}
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input {...field} className="transition-all duration-300 focus:ring-2 focus:ring-blue-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Description Field */}
          <FormField
            control={form.control}
            name="productDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-[100px] transition-all duration-300 focus:ring-2 focus:ring-blue-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price Field */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (USD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isOnSale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>On Sale</FormLabel>
                <FormControl>
                  <Input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="ml-2 h-5 w-5"
                  />
                </FormControl>
                <FormDescription>
                  Check this box if the product is on sale.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("isOnSale") && (
            <FormField
              control={form.control}
              name="salePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Price (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormDescription>
                    Set the sale price for your product if it is on sale.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category: any) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the category that best fits your product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormDescription>
                  Enter the number of items in stock.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Images Field */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Images</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      {field.value.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Product image ${index + 1}`}
                            className="h-24 w-24 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => {
                              // const newImages = [...field.value]
                              // newImages.splice(index, 1)
                              // field.onChange(newImages)
                              // remove image in array based on matching url
                              const newImagesArray = field.value.filter((image) => image !== url)
                              field.onChange(newImagesArray)

                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {field.value.length < 5 && (
                      <CldUploadWidget
                        uploadPreset="e-commerce-admin"
                        onSuccess={(result) => { // @ts-ignore
                          field.value = [...field.value, result.info.secure_url]; // @ts-ignore
                          field.onChange(field.value); // @ts-ignore
                          console.log("FIELDN VALUE: \n", field.value)
                        }}
                      >
                        {({ open }) => (
                          <Button type="button" variant="outline" onClick={() => open()}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Images
                          </Button>
                        )}
                      </CldUploadWidget>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex items-start justify-end" >
          <Button type="submit" className="w-full sm:w-fit transition-all duration-300 bg-sky-950 hover:bg-sky-950 hover:scale-110" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Product...
              </>
            ) : (
              "Update Product"
            )}
          </Button>
          </div>
        </form>
      </Form>
      <Toaster />
    </>
  )
}
