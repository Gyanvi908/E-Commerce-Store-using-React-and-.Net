import { Product } from "../../app/models/product";
import ProductList from './ProductList';
import { useState, useEffect } from 'react';

export default function Catalog(){
    const [products, setProducts] = useState<Product[]>([]);
  

  useEffect(() => {
    fetch('https://localhost:7124/api/Products')
    .then(response => response.json())
    .then(data => setProducts(data))
  }, [])

    return (
        <>
       <ProductList products={products} />
      
      </>
    )
}