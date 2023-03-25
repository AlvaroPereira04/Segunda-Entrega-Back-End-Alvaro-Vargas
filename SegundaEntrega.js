const fs = require('fs')

class ProductManager {
    constructor(filePath){
        this.product = []
        this.path = filePath
    }

    getProducts = async() => {
        try{
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.product = JSON.parse(data);
            return this.product
        }
        catch (error){
            return(error)
        }
    }

    addProduct  = async (newProduct) => {
        this.getProducts()
        try{
            if (!newProduct.title ||
                !newProduct.description ||
                !newProduct.price ||
                !newProduct.thumbnail ||
                !newProduct.stock ||
                !newProduct.code) return 'Error: Todos los campos son necesarios'
            let codProd = this.product.find(prod => prod.code === newProduct.code)
            if (codProd) return 'Code duplicado' 
            this.product.push({id: this.product.length + 1 , ...newProduct})
            await fs.promises.writeFile(this.path, JSON.stringify(this.product,'utf-8','\t'))
            return 'Producto cargado'
        }
        catch (error){
            return(error)
        }
	}	

    getProductById = async (id) => {
        this.getProducts()
        let producto = this.product.find(prod => prod.id === id)
        if (!producto) return 'Not found' 
        return producto
    }

    updateProduct  = async (id, updProd) => {
        try{
            let producto = this.product.find(prod => prod.id === id)
            if (!producto) return 'Not found'
            producto.title = updProd.title
            producto.description = updProd.description
            producto.price = updProd.price
            producto.thumbnail = updProd.thumbnail
            producto.stock = updProd.stock
            producto.code= updProd.code
            await fs.promises.writeFile(this.path, JSON.stringify(this.product,'utf-8','\t'))
            return 'Producto Actualizado'
            }
        catch (error){
            return(error)
        }
    }

    deleteProduct  = async (idDelete) => {
        try{
            const remove = this.product.filter(prod => prod.id !== idDelete) // filtramos
            if (!remove) return 'Id no encontrado'
            console.log(remove)
            await fs.promises.writeFile(this.path, JSON.stringify(remove,'utf-8','\t'))
            return 'Producto eliminado'
        }
        catch (error){
            return(error)
        }
    }
}

const producto = new ProductManager('./Productos.json');
const fileUse = async() =>{
    console.log(await producto.getProducts())
    console.log(await producto.addProduct({title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'sin imagen', stock: 25, code: 'abc123'}))
    console.log(await producto.addProduct({title: 'producto prueba2', description: 'Este es un producto prueba2', price: 200, thumbnail: 'sin imagen', stock: 200, code: 'abc124'}))
    console.log(await producto.addProduct({title: 'producto prueba3', description: 'Este es un producto prueba3', price: 300, thumbnail: 'sin imagen', stock: 200, code: 'abc125'}))
    console.log(await producto.getProducts())
    console.log(await producto.updateProduct(1, {title: 'producto modificado', description: 'Este es un producto prueba', price: 200, thumbnail: 'sin imagen', stock: 200, code: 'abc125'}))
    console.log(await producto.deleteProduct(2))
    console.log(await producto.getProducts())
    console.table(await producto.getProductById(2))
}
fileUse();