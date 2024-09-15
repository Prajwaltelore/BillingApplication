import { useState } from "react";

function Header() {
    const [details, SetDetails] = useState({
        name: 'PIONEER ENTERPRISES (1) Pvt. Ltd.',
        address: 'Gat No. 943, Sanaswadi, Tal. Shirur Sanaswadi, Pune - 412 208.',
        telefax: '02137-253372/73/74',
        email: 'ranjan1962@gmail.com',
        website: 'www.pioneerentp.com / www.pioneerentp.in'
    })
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6 col-lg-6 col-sm-12 col-sm-12">
                        <h1 className="text-start text-white quotation ps-3">QUOTATION</h1>
                        <div>
                            <h4>{details.name}</h4>
                            <p>
                                {details.address} <br />
                                Telefax - {details.telefax} <br />
                                Email - {details.email} <br />
                                Website - {details.website}
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-sm-12 d-flex flex-column align-items-end justify-content-end equal-height">
                        <div className="d-flex align-items-end justify-content-end mb-3">
                            <img
                                src="1668442188062.jpeg"
                                className="header-logo"
                                alt="Company Logo"
                            />
                        </div>
                        <div className="row d-flex align-items-end" style={{width : "300px"}}>
                            <div className="col-2">
                                <img
                                    src="images (1).png"
                                    className="quality-icon"
                                    alt="Quality Icon"
                                />
                            </div>
                            <div className="col-10 text-start">
                                <b>quality</b> austria
                            </div>
                            <div className="col-12 bg-danger text-white m-1 p-1 rounded text-center">
                                SYSTEM CERTIFIED
                            </div>
                            <div className="col-6 text-start">
                                <b>ISO 9001:2015</b>
                                <br />
                                <b>IATF 16949:2016</b>
                            </div>
                            <div className="col-6 text-end">
                                <b>No.27280/0</b>
                                <br />
                                <b>No.12999/0</b>
                            </div>
                        </div>
                    </div>
                </div>
                <hr></hr>
            </div>
        </>
    )
}

export default Header;