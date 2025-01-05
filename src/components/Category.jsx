import React, { useState, useEffect, useContext } from 'react';
import ApiContext from '../contexts/ApiContext';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');

  const apiKeyDuplicate = useContext(ApiContext).apiKey;
  const apiKey = apiKeyDuplicate !== ''? apiKeyDuplicate : localStorage.getItem("apiKey");
  const url = useContext(ApiContext).url + 'category/';


  const fetchCategories = async () => {
    try {
      const response = await fetch(url + 'get',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey,
        }
      });
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

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const handleAddCategory = async () => {
    try {
      const response = await fetch(url + `add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey,
        },
        body: JSON.stringify({ name: newCategory }),
      });
      if (response.ok) {
        fetchCategories();
        setNewCategory('');
      } else {
        console.error('Error adding category:', response.status);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (name,id) => {
    try {
      id = id + '';
      let obj = {
        "name": name,
        "id": id,
      }
      console.log(url + `delete/${id}`);
      const response = await fetch(url + `delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey,
        },
        body: JSON.stringify(obj),
      });
      if (response.ok) {
        fetchCategories();
      } else {
        console.error('Error deleting category:', response.status);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // eslint-disable-next-line
  const handleEditCategory = async (id) => {
    try {
      id = id + '';
      let obj = {
        "name": newName,
        "id": id,
      }
      const response = await fetch(url + `update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey,
        },
        body: JSON.stringify(obj),
      });
      if (response.ok) {
        fetchCategories();
        setEditingCategory(0);
        setIsEditing(false);
      } else {
        console.error('Error updating category:', response.status);
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    <div className="container">
      <h1>Category Management</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="input-group mb-3 hstack gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleAddCategory}
              >
                Add
              </button>
            </div>
          </div>
          <ul className="list-group">
            {categories.map((category) => (
              <li
                key={category.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {editingCategory === category.id ? (
                  <>
                  <div className='mx-1'>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={category.name}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>

                  <div className='hstack gap-3'>
                    <button
                      className="btn btn-success btn-sm mr-2"
                      onClick={() => handleEditCategory(category.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => {console.log("Cancel clicked");setIsEditing(false);setEditingCategory(0)}}
                    >
                      Cancel
                    </button>
                  </div>
                  </>

                ) : (
                  <span>{category.name}</span>
                )}
                <div> {!isEditing? (
                  <div className='hstack gap-3'>
                  <button
                    className="btn btn-warning btn-sm mr-2"
                    onClick={() => {setEditingCategory(category.id);setIsEditing(true)}}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteCategory(category.name,category.id)}
                  >
                    Delete
                  </button>
                </div>
                 ) : (''
                  // <div>
                  //   <button
                  //     className="btn btn-success btn-sm mr-2"
                  //     onClick={() => setEditingCategory(category.id)}
                  //   >
                  //     Save
                  //   </button>
                  //   <button
                  //     className="btn btn-info btn-sm"
                  //     onClick={() => {console.log("Cancel clicked");setIsEditing(false);setEditingCategory(0)}}
                  //   >
                  //     Cancel
                  //   </button>
                  // </div>
                )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
