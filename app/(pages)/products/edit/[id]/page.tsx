"use client";

import Loader from '@/components/loader';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function EditProduct() {
  const [id, setId] = useState<string | null>(null);
  const [product, setProduct] = useState<any | null>(null);
  const [loader, setLoader] = useState<boolean>(true)

  useEffect(() => {
    // Access the ID directly from the pathname
    const pathParts = window.location.pathname.split('/');
    const productId = pathParts[pathParts.length - 1];
    setId(productId);

    axios.get(`/api/products/${productId}`)
        .then((response) => {
            console.log(response.data);
            setProduct(response.data.product);
            setLoader(false)
        });  
  }, []);

  if (loader) {
    return <div className='h-screen flex justify-center items-center'><Loader /></div>;
  }

  return (
    <div>
      Product ID to edit: {id}
    </div>
  );
}
