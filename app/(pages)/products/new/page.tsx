"use client"

import { useState } from "react"
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
import Outline from "@/app/Outline"
import axios from "axios"
import { Toaster } from "@/components/ui/toaster"

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      price: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log(values)
    setIsSubmitting(false)
    const response = await axios.post("/api/products", values)
    console.log("Resoponse: ", response.data.status)
    if(response.data.status == 200) {
        toast({
            title: "Product Added",
            description: "Your new product has been successfully added.",
          })
        //   form.reset()
    }
    else {
        toast({
            title: "Error",
            description: "An error occurred while adding your product."
          })
    }
  }

  return (
    <Outline>
        <h1>Add New Product</h1>
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
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Describe your product"
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
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl>
                        <Input
                        type="number"
                        placeholder="0.00"
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
                    Adding Product...
                    </>
                ) : (
                    "Add Product"
                )}
                </Button>
            </form>
        </Form>
        <Toaster />
    </Outline>
  )
}