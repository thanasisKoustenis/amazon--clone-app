import { useEffect, useState } from "react"
import AddProductForm from "./AddProductForm"
import Product from "./Product"

const Products = () => {

    const [products, setProducts] = useState<productType[]>([])
    const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>()

    useEffect(() => {
        const getProductsFromSErver = async () => {
            const productsFromServer = await getProducts()
            setProducts(productsFromServer)
        }

        getProductsFromSErver()

    }, [])

    const getProducts = async () => {
        const res = await fetch("http://localhost:7000/products")
        const data = await res.json()
        return data
    }

    const getProductByID = async (id: number) => {
        const res = await fetch(`http://localhost:7000/products/${id}`)
        const data = await res.json()
        return data
    }

    const addProduct = async (newProduct: newProductType) => {

        const res = await fetch("http://localhost:7000/products", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(newProduct)
        }
        )

        const data = await res.json()

        setProducts([...products, data])
    }

    const clickAdd = () => {
        setIsAddProductOpen(!isAddProductOpen)
    }

    const deleteProduct = async (id: number) => {
        await fetch(`http://localhost:7000/products/${id}`, {
            method: "DELETE"
        })

        setProducts(products.filter(
            (prod) => {
                return prod.id !== id 
            }
        ))
    }

    const editProduct = async (id: number) => {
        const productToEdit = getProductByID(id)
        const res = await fetch(`http://localhost:7000/products/${id}`,{
            method: "PUT",
            headers: {"content-type": "application/json"},
            body: JSON.stringify()
        })
    }


    return (
        <div >
            <button className="btn" onClick={clickAdd}>Add Product</button>
            <>{isAddProductOpen ? <AddProductForm addProduct={addProduct} /> : null}</>
            {products.map(
                (product) => (<Product key={product.id} product={product} clickDel={deleteProduct}/>)
            )}
        </div>
    )
}

export type productType = {
    name: string
    // category: string
    // price: number
    // isSold: boolean
    image: string
    id: number
}

export type newProductType = {
    name: string
    // category: string
    // price: number
    // isSold: boolean
    image: string
}

export type AddProductType = {
    (newProduct: newProductType): void
}

export type DelProductType = {
    (delID: number): void
}

export default Products