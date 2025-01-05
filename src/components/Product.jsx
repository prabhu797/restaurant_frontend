import React, { useState, useEffect, useContext } from 'react';
import ApiContext from '../contexts/ApiContext';

const ProductManagement = () => {

  const apiKeyDuplicate = useContext(ApiContext).apiKey;
  const apiKey = apiKeyDuplicate !== ''? apiKeyDuplicate : localStorage.getItem("apiKey");
  const url = useContext(ApiContext).url + 'product/';


  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
  });
  const [editingProduct, setEditingProduct] = useState(-1);
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState(0);
  const [newCategory, setNewCategory] = useState(0);

  useEffect(() => {
    // Fetch categories and products on component mount
    fetchCategories();
    fetchProducts();
    // eslint-disable-next-line
  }, [searchId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/category/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey,
        }
      }); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Error fetching categories:', response.status);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(url + 'get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey,
        }
      }); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Error fetching products:', response.status);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = async () => {
    // Fetch product by ID (searchId)
    try {
      const response = await fetch(url + `getById/${searchId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey,
        }
      }); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
        // Handle the retrieved product data (e.g., display it)
        // console.log(data);
        let data1 = [data];
        setProducts(data1);
      } else {
        console.error('Error fetching product by ID:', response.status);
      }
    } catch (error) {
      console.error('Error fetching product by ID:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch(url + 'add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey,
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        // Product added successfully, refresh the product list
        fetchProducts();
        // Clear the new product input fields
        setNewProduct({
          name: '',
          description: '',
          price: '',
          categoryId: '',
        });
      } else {
        console.error('Error adding product:', response.status);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async (productId) => {
    // Implement edit functionality here
    
    let temp = products.find( product => product.id === productId);
    let obj = {
      "id": productId,
      "name": newName?newName:temp.name,
      "description": newDescription?newDescription:temp.description,
      "price": newPrice?newPrice:temp.price,
      "categoryId": newCategory?newCategory:temp.categoryId,
    }
    try {
      const response = await fetch(url + 'update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey,
        },
        body: JSON.stringify(obj),
      });

      if (response.ok) {
        // Product updated successfully, refresh the product list
        fetchProducts();
        // Clear the new details to default product input fields
        setEditingProduct(-1);
        setIsEditing(false);
        setNewCategory(0);
        setNewPrice(0);
        setNewName('');
        setNewDescription('');
      } else {
        console.error('Error updating product:', response.status);
      }
    } catch (error) {
      console.error('Error updating product 2:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    // Implement delete functionality here
    try {
      const response = await fetch(url + `delete/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey,
        },
      });

      if (response.ok) {
        // Product deleted successfully, refresh the product list
        fetchProducts();
        // Clear the new product input fields
      } else {
        console.error('Error deleting product:', response.status);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="container">
      <h1>Product Management</h1>
      <div className="row">
        <div className="col-md-4">
          <h2>Search by ID</h2>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Product ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <h2>Add New Product</h2>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Product Description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Product Price"
              value={newProduct.price}
              onChange={(e) => 
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <select
              className="form-control"
              value={newProduct.categoryId}
              onChange={(e) =>
                setNewProduct({ ...newProduct, categoryId: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-success"
            onClick={handleAddProduct}
            disabled={
              !newProduct.name ||
              !newProduct.description ||
              !newProduct.price ||
              !newProduct.categoryId
            }
          >
            Add Product
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h2>All Products</h2>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <td>
                    {index+1}
                  </td>
                  <td>
                    {
                      isEditing && product.id === editingProduct?
                      (
                        <div className='mx-1'>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={product.name}
                            onChange={(e) => setNewName(e.target.value)}
                          />
                        </div>
                      )
                      :
                      (
                        product.name
                      )
                    }
                  </td>
                  <td>
                  {
                      isEditing && product.id === editingProduct?
                      (
                        <div className='mx-1'>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={product.description}
                            onChange={(e) => setNewDescription(e.target.value)}
                          />
                        </div>
                      )
                      :
                      (
                        product.description
                      )
                    }
                  </td>
                  <td>
                  {
                      isEditing && product.id === editingProduct?
                      (
                        <div className='mx-1'>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={product.price}
                            onChange={(e) => setNewPrice(e.target.value)}
                          />
                        </div>
                      )
                      :
                      (
                        product.price
                      )
                    }
                  </td>
                  <td>
                    {
                      isEditing && product.id === editingProduct?
                      (
                        <div className='mx-1'>
                          <select
                            className="form-control"
                            value={newCategory?newCategory:product.categoryName}
                            onChange={(e) =>
                              setNewCategory(e.target.value)
                            }
                          >
                            <option value='0'>{product.categoryName}</option>
                            {categories.map((category) => (
                              product.categoryName !== category.name?
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option> : ''
                            ))}
                          </select>
                        </div>
                      )
                      :
                      (
                        product.categoryName
                      )
                    }
                  </td>
                  <td>
                    {editingProduct === product.id? (
                      <>
                      <div className='hstack gap-3'>
                        <button
                          className="btn btn-success btn-sm mr-2"
                          onClick={() => handleEditProduct(product.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => {handleEditProduct(product.id);}}
                        >
                          Cancel
                        </button>
                      </div>
                      </>
    
                    )
                    :
                    (
                      <div>
                        {!isEditing? (
                          <div className='hstack gap-3'>
                            <button
                              className="btn btn-warning btn-sm mr-2"
                              onClick={() => {setIsEditing(true);setEditingProduct(product.id)}}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              Delete
                            </button>
                          </div>
                        ):('')}
                      </div>
                    )
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
