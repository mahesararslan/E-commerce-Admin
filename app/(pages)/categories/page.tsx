"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Pencil, Trash2, Plus } from "lucide-react";
import axios from "axios";

// Define the category type
type Category = {
  _id: string;
  name: string;
  parentCategory: string | null;
};

// Mock API function to fetch categories
const fetchCategories = async (): Promise<Category[]> => {
  const categories = await axios.get("/api/category");
  return categories.data.categories;
};

// Zod schema for form validation
const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  parentCategory: z.string().nullable(),
});

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const { toast } = useToast();

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      parentCategory: null,
    },
  });

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
      setFilteredCategories(fetchedCategories);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const onSubmit = async (data: z.infer<typeof categorySchema>) => {
    try {
      if (selectedCategory) {
        // Edit existing category
        const response = await axios.put(`/api/category`, {
          name: data.name,
          parentCategory: data.parentCategory,
          id: selectedCategory._id,
        });

        if (response.status !== 200) {
          toast({
            title: "Error",
            description: "There was an error processing your request.",
            variant: "destructive",
          });
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          return;
        }

        const updatedCategories = categories.map((cat) =>
          cat._id === selectedCategory._id ? { ...cat, ...data } : cat
        );
        setCategories(updatedCategories);
        toast({
          title: "Category Updated",
          description: "The category has been successfully updated.",
        });
        setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          form.reset();
      } else {
        // Add new category
        const response = await axios.post("/api/category", {
          name: data.name,
          parentCategory: data.parentCategory === "0" ? null : data.parentCategory,
        });

        const newCategory: Category = {
          _id: response.data.category._id,
          name: response.data.category.name,
          parentCategory: response.data.category.parentCategory,
        };

        if (response.status === 200) {
          setCategories([...categories, newCategory]);
          toast({
            title: "Category Added",
            description: "The new category has been successfully added.",
          });
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          form.reset();
        } else {
          toast({
            title: "Error",
            description: "There was an error processing your request.",
            variant: "destructive",
          });
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your request.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedCategory) {
      const response = await axios.delete(
        `/api/category/${selectedCategory._id}`
      );

      if (response.status !== 200) {
        toast({
          title: "Error",
          description: "There was an error processing your request.",
          variant: "destructive",
        });
        return;
      }

      const updatedCategories = categories.filter(
        (cat) => cat._id !== selectedCategory._id
      );
      setCategories(updatedCategories);
      toast({
        title: "Category Deleted",
        description: "The category has been successfully deleted.",
      });
    }
    setIsDeleteDialogOpen(false);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    form.reset({
      name: category.name,
      parentCategory: category.parentCategory || "0",
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              form={form}
              onSubmit={onSubmit}
              categories={categories}
              isEdit={false}
            />
          </DialogContent>
        </Dialog>
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64"
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Parent Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  {category.parentCategory
                    ? categories.find((cat) => cat._id === category.parentCategory)
                        ?.name
                    : "None"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            form={form}
            onSubmit={onSubmit}
            categories={categories}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster />
    </div>
  );
}

// Form component for adding/editing category
type CategoryFormProps = {
  form: any;
  onSubmit: (data: z.infer<typeof categorySchema>) => void;
  categories: Category[];
  isEdit: boolean;
};

const CategoryForm = ({ form, onSubmit, categories, isEdit }: CategoryFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Category name" {...field} />
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
        <Button type="submit">{isEdit ? "Update Category" : "Add Category"}</Button>
      </form>
    </Form>
  );
};
