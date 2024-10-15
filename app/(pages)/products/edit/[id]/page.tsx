"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

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
import Link from "next/link"
import { useRouter } from "next/navigation"
import Loader from "@/components/loader"

// Define the schema
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
})

export default function AddProductForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [id, setId] = useState<string | null>(null)
  const [product, setProduct] = useState<any | null>(null)
  const [loader, setLoader] = useState<boolean>(true)

  // Form initialization
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      price: 0,
    },
  })

  useEffect(() => {
    // Access the ID directly from the pathname
    const pathParts = window.location.pathname.split('/')
    const productId = pathParts[pathParts.length - 1]
    setId(productId)

    axios.get(`/api/products/${productId}`).then((response) => {
      console.log(response.data)
      setProduct(response.data.product)
      setLoader(false)

      // Reset form with fetched product data
      form.reset({
        productName: response.data.product.name,
        productDescription: response.data.product.description,
        price: response.data.product.price,
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
    console.log("Sending request to update product: ", values)
    const response = await axios.put(`/api/products/${product._id}`, values)
    console.log("Response: ", response.data.status)
    if (response.data.status == 200) {
      toast({
        title: "Updated Successfully",
        description: "Your new product has been successfully updated.",
      })
      form.reset()
      setIsSubmitting(false)
      // add timeinterval to redirect to products page
      setTimeout(() => {
        router.push("/products")
      }, 2000)
    } else {
      toast({
        title: "Error",
        description: "An error occurred while adding your product.",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1>Add New Product</h1>
      <Link href="/products">
        <div className="w-full flex justify-end text-blue-900 font-bold text-md ">
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
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md">Product Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary"
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
                <FormLabel className="text-md">Product Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="min-h-[100px] transition-all duration-300 focus:ring-2 focus:ring-primary"
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
                <FormLabel className="text-md">Price (USD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                  />
                </FormControl>
                <FormDescription>
                  Set the price for your product in USD.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full transition-all duration-300 hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </Form>
      <Toaster />
    </div>
  )
}
