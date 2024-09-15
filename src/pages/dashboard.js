import axios from "axios";
import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";

function Dashboard() {
    const [data, SetData] = useState([]);
    console.log(data);
    // console.log(products);
    const [selectedId, SetSelectedId] = useState(null);
    const [SearchBar, SetSearchBar] = useState(false);
    const [selectedColumn,SetSelectedColumn] = useState('');
    const navigate = useNavigate();
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    };
    useEffect(() => {
        axios.get('http://localhost:4000/api/details')
            .then(response => {
                console.log('Data fetched', response.data);
                if (response.data && response.data.length > 0) {
                    SetData(response.data);
                    // SetProducts(response.data.products);
                } else {
                    SetData([]);  // Or handle the case where data is empty
                }
            })
            .catch(error => {
                console.error('There was an error fetching details!', error);
            });
    }, []);
    const handleButtonClick = (id) => {
        // SetSelectedId(id);
        if (selectedId == id) {
            SetSelectedId(null);
        } else {
            SetSelectedId(id);
        }
    };

    const getSearchBar = () => {
        if (SearchBar === true) {
            SetSearchBar(false);
        } else {
            SetSearchBar(true);
        }
    }
    // const handleUpdate = (id) => {
    //     navigate(`/${id}`);
    //     console.log(id);
    // };

    const handleDelete = (id) => {
        const updatedData = [...data];
        updatedData.splice(id, 1);
        SetData(updatedData);
        axios.delete(`http://localhost:4000/api/details/${id}`)
            .then(response => {
                console.log('Record deleted successfully', response.data);
            })
            .catch(error => {
                console.error('There was an error deleting details!', error);
            });
        console.log(`Delete product with id ${id}`);
        window.location.reload();
    };

    const handleFilter = (column,value) => {
        console.log(column,value);
        if (value) {
            axios.get(`http://localhost:4000/api/details/filters/${column}/${value}`)
                .then(response => {
                    console.log('Record fetched successfully', response.data);
                    SetData(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching details!', error);
                });
        } else {
            axios.get('http://localhost:4000/api/details')
                .then(response => {
                    console.log('Data fetched', response.data);
                    if (response.data && response.data.length > 0) {
                        SetData(response.data);
                        // SetProducts(response.data.products);
                    } else {
                        SetData([]);  // Or handle the case where data is empty
                    }
                })
                .catch(error => {
                    console.error('There was an error fetching details!', error);
                });
        }
    }

    return (
        <div>
            <Navbar></Navbar>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-6">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="/">Home</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-6 d-flex" style={{ flexDirection: 'row' }}>
                        <button type="button" onClick={getSearchBar} className="btn btn-primary me-1"><i className="fa-solid fa-filter"></i></button>
                        {SearchBar === true && (
                             <><select onChange={(e) => SetSelectedColumn(e.target.value)} className="form-select me-2" style={{width : "50%"}}>
                                <option value="">Select Column</option>
                                <option value="customer_name">Customer Name</option>
                                <option value="quotationDate">Quotation Date</option>
                                <option value="quotationNo">Quotation No</option>
                                <option value="payment">Payment</option>
                                <option value="delivery">Delivery</option>
                            </select>
                            {selectedColumn === 'quotationDate' ?  <input type="date" class="form-control" placeholder="Search" onKeyDown={e => e.key === 'Enter' ? handleFilter(selectedColumn,e.target.value) :
                                ''} style={{ width: '50%' }}></input>  :
                                <input type="text" class="form-control" placeholder="Search" onKeyDown={e => e.key === 'Enter' ? handleFilter(selectedColumn,e.target.value) :
                                    ''} style={{ width: '50%' }}></input>}
                           </>
                        )}
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="table-responsive">
                    <table className="table table-borderless">
                        <thead>
                            <tr>
                                <td>Actions</td>
                                <td>ID</td>
                                <td>Customer_name</td>
                                <td>Customer_address</td>
                                <td>KindAttention</td>
                                <td>QuotationNo</td>
                                <td>QuotationDate</td>
                                <td>EnquiryRef</td>
                                <td>Payment</td>
                                <td>Delivery</td>
                                <td>Taxes</td>
                                <td>Transport</td>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.length > 0 ? (
                                data.map((quotation) => (
                                    <tr key={quotation.id}>
                                        <td>
                                            <button onClick={() => handleButtonClick(quotation.id)}>Actions</button>
                                            {selectedId === quotation.id && (
                                                <div>
                                                    <NavLink to={`/quotation`} state={quotation} >
                                                        <button>Update</button>
                                                    </NavLink>
                                                    <NavLink to={`/print`} state={quotation} >
                                                        <button>Print</button>
                                                    </NavLink>
                                                    <button onClick={() => handleDelete(quotation.id)}>Delete</button>
                                                </div>
                                            )}
                                        </td>
                                        <td>{quotation.id}</td>
                                        <td>{quotation.customer_name}</td>
                                        <td>{quotation.customer_address}</td>
                                        <td>{quotation.kindAttention}</td>
                                        <td>{quotation.quotationNo}</td>
                                        <td>{formatDate(quotation.quotationDate)}</td>
                                        <td>{quotation.enquiryRef}</td>
                                        <td>{quotation.payment}</td>
                                        <td>{quotation.delivery}</td>
                                        <td>{quotation.taxes}</td>
                                        <td>{quotation.transport}</td>
                                    </tr>
                                ))) : (
                                <tr>
                                    <td col="12">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;