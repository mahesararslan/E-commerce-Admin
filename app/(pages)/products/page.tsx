import Outline from "@/app/Outline";
import Link from "next/link";

export default function Products() {

    return (
        <Outline>
            <Link href={"/products/new"} className="bg-blue-900 text-white rounded-md py-1 px-2 ">Add new Product</Link>
        </Outline>
    )
}