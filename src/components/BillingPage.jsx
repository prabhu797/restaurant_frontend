import React, { useState, useEffect, useContext } from 'react';
import ApiContext from '../contexts/ApiContext';

const BillingPage = () => {
  const [products, setProducts] = useState([]);
  const [bill, setBill] = useState({
    fileName: 'xyzzzxy',
    contactNumber: '',
    email: '',
    name: '',
    paymentMethod: 'Cash',
    productDetails: [],
    totalAmount: 0,
  });

  const apiKeyDuplicate = useContext(ApiContext).apiKey;
  const apiKey = apiKeyDuplicate !== ''? apiKeyDuplicate : localStorage.getItem("apiKey");
  const url = useContext(ApiContext).url;

  useEffect(() => {
    // Fetch products and set initial bill details
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(url + 'product/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey,
        },
      });

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

  const handleProductQuantityChange = (productId, quantity) => {
    // Filter out the product with quantity 0
    const updatedProductDetails = bill.productDetails
      .map((product) => {
        if (product.id === productId) {
          if (quantity <= 0) {
            return null; // Remove the product
          } else {
            product.quantity = quantity;
            product.total = product.price * quantity;
            return product;
          }
        }
        return product;
      })
      .filter((product) => product !== null);
  
    const totalAmount = updatedProductDetails.reduce(
      (total, product) => total + product.total,
      0
    );
  
    setBill({
      ...bill,
      productDetails: updatedProductDetails,
      totalAmount,
    });
  };
  

  const handleAddToBill = (product) => {
    // Add a product to the bill with quantity 1
    const productInBill = bill.productDetails.find(
      (item) => item.id === product.id
    );

    if (productInBill) {
      handleProductQuantityChange(product.id, productInBill.quantity + 1);
    } else {
      setBill({
        ...bill,
        productDetails: [
          ...bill.productDetails,
          {
            id: product.id,
            name: product.name,
            category: product.category,
            quantity: 1,
            price: product.price,
            total: product.price,
          },
        ],
        totalAmount: bill.totalAmount + product.price,
      });
    }
  };

  return (
    <div className="container">
      <h1>Billing Page</h1>
      <div className="row">
        <div className="col-md-8">
          {/* Product List */}
          <h2>Product List</h2>
          <ul className="list-group">
            {products.map((product) => (
              <li key={product.id} className="list-group-item">
                {product.name} - Rs. {product.price}
                <button
                  className="btn btn-primary btn-sm float-end"
                  onClick={() => handleAddToBill(product)}
                >
                  Add to Bill
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-4">
          {/* Billing Details */}
          <h2>Billing Details</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Customer Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={bill.name}
                onChange={(e) => setBill({ ...bill, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={bill.email}
                onChange={(e) => setBill({ ...bill, email: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contactNumber" className="form-label">
                Contact Number
              </label>
              <input
                type="text"
                className="form-control"
                id="contactNumber"
                value={bill.contactNumber}
                onChange={(e) =>
                  setBill({ ...bill, contactNumber: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="paymentMethod" className="form-label">
                Payment Method
              </label>
              <select
                className="form-select"
                id="paymentMethod"
                value={bill.paymentMethod}
                onChange={(e) =>
                  setBill({ ...bill, paymentMethod: e.target.value })
                }
              >
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col">
          {/* Bill Summary */}
          <h2>Bill Summary</h2>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {bill.productDetails.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        handleProductQuantityChange(
                          product.id,
                          product.quantity - 1
                        )
                      }
                    >
                      -
                    </button>
                    {product.quantity}
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        handleProductQuantityChange(
                          product.id,
                          product.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </td>
                  <td>Rs. {product.price}</td>
                  <td>Rs. {product.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mb-3">
            <strong>Total Amount: Rs. {bill.totalAmount}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
