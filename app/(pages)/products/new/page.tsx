"use client"

import { useState } from "react"
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
  images: z.array(z.string()).min(1, "At least one image is required.").max(5, "You can upload a maximum of 5 images."),
})

export default function AddProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      price: 0,
      images: [],
    },
  })

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
                          const newImages = [...field.value, result.info.secure_url];
                          field.onChange(newImages);
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
          <Button
            type="submit"
            className="w-full transition-all duration-300 hover:bg-gray-700"
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
        </form>
      </Form>
      <Toaster />
    </>
  )
}