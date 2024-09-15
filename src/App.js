// import logo from './logo.svg';
import './App.css';
import NavbarComponent from './components/Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const edidata = location.state;
  console.log(edidata);
  const [rows, setRows] = useState([{
    id: 1,
    product: '',
    description: '',
    unit: '',
    rate: '',
    image: null
  }]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
  };

  // const [list,SetList] = useState([]);
  const [formData, SetFormData] = useState({
    customer_name: edidata ? edidata.customer_name : '',
    customer_address: edidata ? edidata.customer_address : '',
    kindAttention: edidata ? edidata.kindAttention : '',
    quotationNo: edidata ? edidata.quotationNo : '',
    quotationDate: edidata ? formatDate(edidata.quotationDate) : '',
    enquiryRef: edidata ? edidata.enquiryRef : '',
    payment: edidata ? edidata.payment : '',
    delivery: edidata ? edidata.delivery : '',
    taxes: edidata ? edidata.taxes : '',
    transport: edidata ? edidata.transport : ''
  })
  // const id = new URLSearchParams(location.search).get('id');
  // const isEditMode = Boolean(id);

  const addrow = () => {
    setRows([...rows, {
      id: rows.length + 1,
      product: '',
      description: '',
      unit: '',
      rate: '',
      image: null
    }]);
  }

  const handleFileChange = (id, file) => {
    setRows(rows.map(row =>
      row.id === id ? { ...row, image: file } : row
    ));
  };

  const handleInputChange = (id, field, value) => {
    setRows(rows.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const handleFormChange = (field, value) => {
    SetFormData({ ...formData, [field]: value });
  };

  useEffect(() => {
    axios.get(`http://localhost:4000/api/details/${edidata?.id}`)
      .then(response => {
        console.log(response.data);
        const productsData = response.data.products || edidata ? JSON.parse(edidata.products) : [];
        const parsedProducts = Array.isArray(productsData) ? productsData : JSON.parse(productsData);
        console.log(parsedProducts);
        setRows(parsedProducts.map((product, index) => ({
          id: index + 1,
          product: product.product || '',
          description: product.description || '',
          unit: product.unit || '',
          rate: product.rate || '',
          image: product.image || null
        })));
      })
      .catch(error => {
        console.error('There was an error fetching the products details!', error);
      });
  }, [edidata])

  const saveData = (id) => {
    // const dataToSend = {
    //   ...formData,
    //   products: rows
    // }
    // const formDataToSend = new FormData();
    // // console.log(dataToSend.products);
    // // console.log(dataToSend.customer_address);
    // // console.log(dataToSend);
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    rows.forEach((row, index) => {
      formDataToSend.append(`products[${index}][product]`, row.product);
      formDataToSend.append(`products[${index}][description]`, row.description);
      formDataToSend.append(`products[${index}][unit]`, row.unit);
      formDataToSend.append(`products[${index}][rate]`, row.rate);
      if (row.image instanceof File) {
        formDataToSend.append(`image`, row.image, row.image.name);
      }
    });

    // console.log(formDataToSend);
    // console.log(dataToSend.customer_address);
    // console.log(dataToSend);
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    if (id) {
      axios.put(`http://localhost:4000/api/details/${id}`, formDataToSend, config)
        .then(response => {
          console.log('Customer details updated:', response.data);
          navigate('/dashboard');
        })
        .catch(error => {
          console.error('There was an error updating the customer details!', error);
        });
    }
    else {
      axios.post('http://localhost:4000/api/details', formDataToSend, config)
        .then(response => {
          console.log('Customer details saved:', response.data);
          navigate('/dashboard');
        })
        .catch(error => {
          console.error('There was an error saving the customer details!', error);
        });
    }
  }

  const removeRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
    // axios.delete(`http://localhost:4000/api/records/${id}`)
    //   .then(response => {
    //     console.log("Records deleted", response.data);
    //     // fetchData();
    //   })
    //   .catch(error => {
    //     console.error('There was an error deleting the data!', error);
    //   });
  }

  return (
    <div className="container-fluid">
      <NavbarComponent></NavbarComponent>
      <div className='container' style={{ marginTop: '20px' }}>
        <div className='row'>
          <div className='col-6'>
            <label className='form-label'>Customer </label>
            <input className='form-control' onChange={(e) => handleFormChange('customer_name', e.target.value)} value={formData.customer_name} type='text' placeholder='Name' />
            <textarea className='form-control' onChange={(e) => handleFormChange('customer_address', e.target.value)} value={formData.customer_address} placeholder='Address' itemType='text' style={{ marginTop: '20px' }} />
            <label className='form-label' style={{ marginTop: '25px' }}>Kind Attention</label>
            <input className='form-control' value={formData.kindAttention} onChange={(e) => handleFormChange('kindAttention', e.target.value)} type='text' />
          </div>
          <div className='col-6' style={{ marginTop: '10px', padding: '20px' }}>
            <div className='row'>
              <div className='col-3'><label className='form-label'>Quotation No</label></div>
              <div className='col-9'><input className='form-control' value={formData.quotationNo} onChange={(e) => handleFormChange('quotationNo', e.target.value)} type='text' /></div>
            </div>
            <div className='row' style={{ marginTop: '25px' }}>
              <div className='col-3'><label className='form-label'>Quotation Date</label></div>
              <div className='col-9'><input className='form-control' value={formData.quotationDate} onChange={(e) => handleFormChange('quotationDate', e.target.value)} type='date' /></div>
            </div>
            <div className='row' style={{ marginTop: '25px' }}>
              <div className='col-3'><label className='form-label'>Enquiry Ref</label></div>
              <div className='col-9'><input className='form-control' value={formData.enquiryRef} onChange={(e) => handleFormChange('enquiryRef', e.target.value)} type='text' /></div>
            </div>
          </div>
        </div>
      </div>
      <div className='container' style={{ marginTop: '20px' }}>
        <div className='row'>
          <div className='col-12'>
            <div className="table-responsive">
              <table className='table table-borderless'>
                <thead>
                  <tr>
                    <td>Id</td>
                    <td>Product</td>
                    <td>Description</td>
                    <td>Unit</td>
                    <td>Rate</td>
                    <td>Image</td>
                    <td><button type='button' className='btn btn-light' onClick={addrow}>+</button></td>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <tr key={row.id}>
                      <td>
                        {row.id}
                      </td>
                      <td>
                        <select
                          className='form-select'
                          value={row.product}
                          // name={row.product}
                          onChange={(e) => handleInputChange(row.id, 'product', e.target.value)}
                        >
                          <option value="">Select Product</option>
                          <option value="Product 1">Product 1</option>
                          <option value="Product 2">Product 2</option>
                          <option value="Product 3">Product 3</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={row.description}
                          // name={row.description}
                          onChange={(e) => handleInputChange(row.id, 'description', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={row.unit}
                          // name={row.unit}
                          onChange={(e) => handleInputChange(row.id, 'unit', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={row.rate}
                          // name={row.rate}
                          onChange={(e) => handleInputChange(row.id, 'rate', e.target.value)}
                        />
                      </td>
                      <td>{
                        row.image ? (
                          <div>
                            <img src={`http://localhost:4000/uploads/${row.image}`} alt="Product" width="50" />
                            <br />
                            <input className="form-control" type="file" name={row.image} onChange={(e) => handleFileChange(row.id, e.target.files[0])} />
                          </div>
                        )
                          : (<input className="form-control" type="file" name={row.image} onChange={(e) => handleFileChange(row.id, e.target.files[0])} />)
                      }
                      </td>
                      <td><button type='button' className='btn btn-light' onClick={addrow}>+</button></td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-light"
                          onClick={() => removeRow(row.id)}
                        >
                          -
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className='container'>
        <p>Terms & Conditions</p>
        <div className='row'>
          <div className='col-1'>
            Payment
          </div>
          <div className='col-11' style={{ textAlign: 'start' }}>
            <input className='form-control' value={formData.payment} onChange={(e) => handleFormChange('payment', e.target.value)} type='text' style={{ width: '200px' }} />
          </div>
        </div>
        <div className='row' style={{ marginTop: '20px' }}>
          <div className='col-1'>
            Delivery
          </div>
          <div className='col-11' style={{ textAlign: 'start' }}>
            <input className='form-control' value={formData.delivery} onChange={(e) => handleFormChange('delivery', e.target.value)} type='text' style={{ width: '200px' }} />
          </div>
        </div>
        <div className='row' style={{ marginTop: '20px' }}>
          <div className='col-1'>
            Taxes
          </div>
          <div className='col-11' style={{ textAlign: 'start' }}>
            <input className='form-control' value={formData.taxes} onChange={(e) => handleFormChange('taxes', e.target.value)} type='text' style={{ width: '200px' }} />
          </div>
        </div>
        <div className='row' style={{ marginTop: '20px' }}>
          <div className='col-1'>
            Transport
          </div>
          <div className='col-11' style={{ textAlign: 'start' }}>
            <input className='form-control' value={formData.transport} onChange={(e) => handleFormChange('transport', e.target.value)} type='text' style={{ width: '200px' }} />
          </div>
        </div>
      </div>
      <div className='container'>
        <button type='button' className='btn btn-light' onClick={() => saveData(edidata?.id)}>
          {edidata?.id ? 'Update' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default App;
