"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Upload, X } from "lucide-react"
import { CldUploadWidget } from 'next-cloudinary'

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
import { Toaster } from "@/components/ui/toaster"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from "axios"
import { useRouter } from "next/navigation"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

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


export default function AddProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      price: 0,
      isOnSale: false,
      salePrice: undefined,
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
    console.log(categories)
    fetchCategories()
  }, [toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to add product')
      }

      toast({
        title: "Product Added",
        description: "Your new product has been successfully added.",
      })
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setTimeout(() => {
        router.push("/products")
      }, 2000)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter product name"
                    {...field}
                    className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormDescription>
                  The name of your product as it will appear to customers.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your product"
                    {...field}
                    className="min-h-[100px] transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormDescription>
                  Provide a detailed description of your product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (USD)</FormLabel>
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
                  Set the price for your product in USD.
                </FormDescription>
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
                              const newImages = [...field.value];
                              newImages.splice(index, 1);
                              field.onChange(newImages);
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
                          console.log(result.info) // @ts-ignore 
                          field.value = [...field.value, result.info.secure_url]; // @ts-ignore
                          field.onChange(field.value); // @ts-ignore
                          console.log("FIELDN VALUE: \n", field.value)
                        }
                        }
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
                <FormDescription>
                  Upload up to 5 images of your product. Max size: 5MB per image.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
          <Button
            type="submit"
            className="w-full sm:w-fit  transition-all duration-300 bg-sky-950 hover:bg-sky-950 sm:hover:scale-110"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Product...
              </>
            ) : (
              "Add Product"
            )}
          </Button>
          </div>
        </form>
      </Form>
      <Toaster />
    </>
  )
}