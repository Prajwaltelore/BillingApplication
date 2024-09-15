import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useLocation,useNavigate } from "react-router-dom";
import axios from "axios";

function PrintPage() {
    const location = useLocation();
    const data = location.state;
    console.log(data);
    const navigate = useNavigate();
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    };
    const [productData, SetProductsData] = useState([]);
    const [termsData,SetTermsData] = useState({
        payment : data ? data.payment : '',
        delivery : data ? data.delivery : '',
        taxes : data ? data.taxes : '',
        transport : data ? data.transport : ''
    });
    useEffect(() => {
        axios.get(`http://localhost:4000/api/details/${data?.id}`)
            .then(response => {
                console.log(response.data);
                const productsData = response.data.products || data ? JSON.parse(data.products) : [];
                const parsedProducts = Array.isArray(productsData) ? productsData : JSON.parse(productsData);
                console.log(parsedProducts);
                SetProductsData(parsedProducts);
            })
            .catch(error => {
                console.error('There was an error fetching the products details!', error);
            });
    }, [data]);
    
    const handleChange = (field, value) => {
        SetTermsData({ ...termsData, [field]: value });
      };

    const updateTermsData = (id) => {
        if(id){
            axios.put(`http://localhost:4000/api/terms/${id}`,termsData)
            .then(response => {
                console.log('Terms and conditions updated,response.data',response.data);
                navigate(`/dashboard`);
            })
            .catch(error => {
                console.error('There was an error updating the terms and conditions', error);
            });
        }else{
            alert('Please provide id to update Terms And Conditions');
        }
    }

    return (
        <>
            <Header></Header>
            <div className="container-fluid mt-3">
                <div className="row">
                    <div className="col-6">
                        <h4>{data.customer_name}</h4>
                        <p>{data.customer_address}</p>
                    </div>
                    <div className="col-6 text-end">
                        <p>
                            Quotation No :&emsp;&emsp;&emsp;&emsp;&emsp;<b>{data.quotationNo}</b><br />
                            Quotation Date :&emsp;&emsp;<b>{formatDate(data.quotationDate)}</b><br />
                            Enq No :&emsp;&emsp;&emsp;&emsp;&emsp;<b>{data.enquiryRef}</b>
                        </p>
                    </div>
                    <div className="col-12 mt-2">
                        <p><b>Kind Attn -</b> {data.kindAttention}</p>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead className="border-top border-bottom border-dark">
                                    <tr>
                                        <td>Sr.No.</td>
                                        <td>Product</td>
                                        <td>Description</td>
                                        <td>Unit</td>
                                        <td>Rate</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productData.map((product, index) => (
                                        <tr key={product.id}>
                                            <td>{index + 1}</td>
                                            <td>{product.product}</td>
                                            <td>{product.description}</td>
                                            <td>{product.unit}</td>
                                            <td>{product.rate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        <hr></hr>
                        <p>
                            <b>Terms & Conditions*</b><br />
                            {/* 1.Payment: {data.payment}<br />
                            2.Delivery: {data.delivery}<br />
                            3.Taxes: {data.taxes}<br />
                            4.Transport: {data.transport} */}
                        </p>
                        <form className="w-50">
                            <div>
                                <div className="p-1">
                                    <label htmlFor="exampleInputPayment" className="form-label">Payment</label>
                                    <input type="text" className="form-control" value={termsData.payment} onChange={(e) => handleChange('payment', e.target.value)} onKeyDown={e => e.key === 'Enter' ? updateTermsData(data.id) : ''} id="exampleInputPayment" />
                                </div>
                                <div className="p-1">
                                    <label htmlFor="exampleInputDelivery" className="form-label">Delivery</label>
                                    <input type="text" className="form-control" value={termsData.delivery} onChange={(e) => handleChange('delivery', e.target.value)} onKeyDown={e => e.key === 'Enter' ? updateTermsData(data.id) : ''} id="exampleInputDelivery" />
                                </div>
                                <div className="p-1">
                                    <label htmlFor="exampleInputTaxes" className="form-label">Taxes</label>
                                    <input type="text" className="form-control" value={termsData.taxes} onChange={(e) => handleChange('taxes', e.target.value)} onKeyDown={e => e.key === 'Enter' ? updateTermsData(data.id) : ''} id="exampleInputTaxes" />
                                </div>
                                <div className="p-1">
                                    <label htmlFor="exampleInputTransport" className="form-label">Transport</label>
                                    <input type="text" className="form-control" value={termsData.transport} onChange={(e) => handleChange('transport', e.target.value)} onKeyDown={e => e.key === 'Enter' ? updateTermsData(data.id) : ''} id="exampleInputTransport" />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-12 mt-2 d-flex" style={{ alignItems: 'end', flexDirection: 'column' }}>
                        <p className="text-end">
                            For <b>PIONEER ENTERPRISES (1) Pvt Ltd</b><br></br>
                            RANJAN MUNSHI (9766640800)
                        </p>
                        <p className="mt-4">
                            Authorized Signatory
                        </p>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    )
}

export default PrintPage;