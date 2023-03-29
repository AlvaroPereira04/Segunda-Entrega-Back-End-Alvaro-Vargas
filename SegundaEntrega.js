const fs = require('fs');

class ProductManager {
  constructor(filename) {
    this.filename = filename;
    this.nextId = 1;
  }

  async addProduct(product) {
    product.id = this.nextId++;
    const products = await this.getProducts();
    products.push(product);
    await this.saveProducts(products);
    return product;
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.filename);
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(product => product.id === id);
  }

  async updateProduct(id, newData) {
    const products = await this.getProducts();
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...newData };
      await this.saveProducts(products);
      return products[productIndex];
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      const deletedProduct = products.splice(productIndex, 1)[0];
      await this.saveProducts(products);
      return deletedProduct;
    }
  }

  async saveProducts(products) {
    await fs.promises.writeFile(this.filename, JSON.stringify(products, null, 2));
  }
}

module.exports = ProductManager;


const producto = new ProductManager('./Productos.json');
const fileUse = async() =>{
    console.log(await producto.getProducts())
    console.log(await producto.addProduct({title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'sin imagen', stock: 25, code: 'abc123'}))
    console.log(await producto.addProduct({title: 'producto prueba2', description: 'Este es un producto prueba2', price: 200, thumbnail: 'sin imagen', stock: 200, code: 'abc124'}))
    console.log(await producto.addProduct({title: 'producto prueba3', description: 'Este es un producto prueba3', price: 300, thumbnail: 'sin imagen', stock: 200, code: 'abc125'}))
    console.log(await producto.getProducts())
    console.log(await producto.updateProduct(1, {title: 'producto modificado', description: 'Este es un producto prueba', price: 600, thumbnail: 'sin imagen', stock: 200, code: 'abc125'}))
    console.log(await producto.deleteProduct(4))
    console.log(await producto.getProducts())
    console.table(await producto.getProductById(2))
}
fileUse();