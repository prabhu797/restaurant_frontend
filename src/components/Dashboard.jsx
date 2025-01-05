import React, {useState, useContext } from 'react';
import ApiContext from '../contexts/ApiContext';

function Dashboard() {

    const apiKeyDuplicate = useContext(ApiContext).apiKey;
    const apiKey = apiKeyDuplicate !== ''? apiKeyDuplicate : localStorage.getItem("apiKey");
    const url = useContext(ApiContext).url;

    const [data, setData] = useState('')
    const fetchDetails = () => {
        fetch(url + "dashboard/details", {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiKey,
        }
        })
        .then((res) => {
            return res.json();
        })
        .then((response) => {
            setData(response);
        })
        .catch(error => console.log(error));
    }

  return (
    <>
        <div className="container my-3">
            <input type="button" className='btn btn-primary btn-lg' value='fetchDetails' onClick={fetchDetails} />
        </div>
        <div className='container my-3' style={{display:'flex',justifyContent: 'space-between'}}>
            <button type="button" className="btn btn-primary btn-lg column">Category {data.category}</button>
            <button type="button" className="btn btn-primary btn-lg">Product {data.product}</button>
            <button type="button" className="btn btn-primary btn-lg">Bill {data.bill}</button>
        </div>
    </>
  )
}

export default Dashboard;