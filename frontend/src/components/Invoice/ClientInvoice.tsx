import { Tooltip, notification } from 'antd';
import axios from 'axios';
import { motion, stagger } from 'framer-motion';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MdError } from 'react-icons/md';
import Logo from '../../images/logo/logo.png';
import { TbFileShredder, TbMailDollar } from 'react-icons/tb';
import { CgMailForward } from 'react-icons/cg';
import { InvoiceContext, InvoiceType } from '../../Contexts/InvoiceContext/InvoiceContext';

interface Client {
  email: string;
  location: string;
  name: string;
  phone: number | null;
  pincode: number | null;
  _id: string;
}
interface Supply {
  bottleType: string;
  clientId: string;
  date: string;
  price: number;
  quantity: number;

  _id: string;
}
interface InvoiceData {
  clientId: Client;
  date: string;
  status: string;
  supplies: any[]; // Adjust the type of supplies according to your needs
  totalAmount: number;
  _id: string;
}

const ClientInvoice = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { month, year}:any = useContext<InvoiceType|null>(InvoiceContext);
  const [err, setErr] = useState<string>('');
  useEffect(()=>{

    console.log("month",month )
    console.log("year",year)
  },[])
  const [invoice, setInvoice] = useState<InvoiceData>({
    clientId: {
      email: '',
      location: '',
      name: '',
      phone: null,
      pincode: null,
      _id: '',
    },
    date: '',
    status: '',
    supplies: [],
    totalAmount: 0,
    _id: '',
  });

  const getClientInvoice = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/invoice/get-client-invoice/${clientId}`,
      );
      console.log("getClientIn",res.data.data);
      if (res.status === 200) {
        setInvoice(res.data.data);
      } else {
        setErr('Client Invoice has not been generated');
      }
    } catch (err: any) {
      //   console.log(err);
      //   notification.error({ message: "Client Invoice Has not Been Generated" });
      setErr('Client Invoice has not been generated');
    }
  };

  useEffect(() => {
    getClientInvoice();
  }, [clientId]);

  const generateMonthlyInvoice = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/invoice/client/${clientId}/invoice/generate-monthly?month=7&year=2024`,
        {},
      );
      console.log(res.data.data);
      getClientInvoice();

      notification.success({ message: res.data.message });
    } catch (error: any) {
      console.log(error);
      notification.error({ message: error.response.data.message });
      setErr(error.response.data.message);
    }
  };

  const sendInvoice = async () => {
    try {
      console.log("month :", month)
      console.log("year :", year)
      const res = await axios.post('http://localhost:8000/mail/send-invoice', {
        clientId,
        email: invoice.clientId.email,
        month: month,
        year: year,
      });
      console.log(res.data.data);
      notification.success({
        message: `Invoice successfully sent to ${invoice.clientId.email}`,
      });
    } catch (error) {
      console.log(error);
    }
  };


  const handleDeleteInvoice=async(id:any)=>{
    try {
      const res= await axios.delete(`http://localhost:8000/invoice/delete-invoice/${id}`)
      console.log(res.data)
      notification.success({message:res.data.message})
      getClientInvoice()
    } catch (error) {
      console.log(error)
    }
  }
  const listContainer = {
    hidden: {
      opacity: 1,
      delay: stagger(0.5),
    },
    show: {
      opacity: 1,
      delay: stagger(0.5),
    },
  };

  const listItem = {
    hidden: { x: -120, opacity: 0, delay: stagger(0.5) },
    show: {
      x: 0,
      opacity: 1,
      delay: stagger(1),
      transition: {
        type: 'spring',
        stiffness: 102,
      },
    },
  };

  const calculateGrandTotal = (supplies: Supply[]) => {
    return supplies.reduce(
      (total, supply) => total + supply.quantity * supply.price,
      0,
    );
  };
  return (
    <div>
      {err === '' ? (
        <div>
          <div className="rounded-xl relative border border-stroke bg-white  px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="flex items-center justify-center">
              <div className="w-[6vw]">
                <img src={Logo} alt="logo" className="h-full w-full" />
              </div>
            </div>
            <div className=" absolute top-4 right-10 flex items-center gap-4">
              <Tooltip placement="bottom" title="Mail Invoice">
                <button
                  onClick={sendInvoice}
                  className="text-lg flex items-center gap-2 hover:text-primary transitaion-all active:scale-[0.97]"
                >
                  <span>
                    {/* <CgMailForward /> */}
                    <TbMailDollar />
                  </span>
                  Send Invoice
                </button>
              </Tooltip>
              <Tooltip placement="bottom" title="Delete Invoice">
                <button
                  onClick={()=>handleDeleteInvoice(invoice._id)}
                  className="text-lg flex items-center gap-2 hover:text-danger  transitaion-all active:scale-[0.97]"
                >
                  <span>
                    {/* <CgMailForward /> */}
                    <TbFileShredder />
                  </span>
                  Delete Invoice
                </button>
              </Tooltip>
            </div>
            <div className="my-4">
              <div className="flex items-center justify-between">
                <div className="client Info">
                  <p>
                    <span className="font-medium text-black">
                      Client Id :-&nbsp;
                    </span>{' '}
                    {invoice.clientId._id}
                  </p>
                  <p>
                    <span className="font-medium text-black">Name:-&nbsp;</span>{' '}
                    {invoice.clientId.name.toUpperCase()}
                  </p>
                  <p>
                    <span className="font-medium text-black">
                      Email:-&nbsp;
                    </span>{' '}
                    {invoice.clientId.email}
                  </p>
                </div>
                <div className="invoice Info">
                  <p>
                    <span className="font-medium text-black">
                      Invoice Id :-&nbsp;
                    </span>{' '}
                    {invoice._id}
                  </p>
                  <p>
                    <span className="font-medium text-black">Date:-&nbsp;</span>{' '}
                 
                    {
                      invoice.supplies
                        .map(
                          (supply) =>
                            new Date(supply.date).toISOString().split('T')[0],
                        )
                        .sort()[0]
                    }{' '}
                  &nbsp;-&nbsp;
                    {
                      invoice.supplies
                        .map(
                          (supply) =>
                            new Date(supply.date).toISOString().split('T')[0],
                        )
                        .sort()
                        .reverse()[0]
                    }{' '}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex max-w-full px-6 py-5.5 bg-[#F6F9FC] dark:bg-meta-4 items-center justify-between">
              <div className="min-w-[150px]  font-medium text-black dark:text-white xl:pl-11">
                <h1 className="text-center">Date</h1>
              </div>
              <div className="min-w-[150px]  font-medium text-black dark:text-white xl:pl-11">
                <h1 className="text-center">Supplies</h1>
              </div>
              <div className="min-w-[150px]  font-medium text-black dark:text-white xl:pl-11">
                <h1 className="text-center">Price Per Bottle</h1>
              </div>
              <div className="min-w-[80px]  font-medium text-black dark:text-white xl:pl-11">
                <h1 className="text-center">Status</h1>
              </div>
              <div className="min-w-[80px]  font-medium text-black dark:text-white xl:pl-11">
                <h1 className="text-center">Quantity</h1>
              </div>
              <div className="min-w-[90px]  font-medium text-black dark:text-white xl:pl-11">
                <h1 className="text-center">Total</h1>
              </div>
            </div>
            <motion.div
              variants={listContainer}
              initial="hidden"
              animate={'show'}
            >
              {invoice.supplies && invoice.supplies.length > 0 ? (
                invoice.supplies.map((s, i) => (
                  <motion.div
                    key={i}
                    variants={listItem}
                    className="border-b flex items-center justify-between border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
                  >
                    <div className="min-w-[150px]  font-medium text-black dark:text-white ">
                      <h1 className="text-center">
                        {s.date.toString().split('T')[0]}
                      </h1>
                    </div>
                    <div className="min-w-[150px]  font-medium text-black dark:text-white ">
                      <h1 className="text-center">{s.bottleType}</h1>
                    </div>
                    <div className="min-w-[150px]  font-medium text-black dark:text-white ">
                      <h1 className="text-center">{s.price}</h1>
                    </div>
                    <div className="min-w-[80px]  font-medium text-black dark:text-white ">
                      <h1 className="text-center">{invoice.status}</h1>
                    </div>
                    <div className="min-w-[80px]  ">
                      <h1 className="text-center">{s.quantity}</h1>
                    </div>
                    <div className="min-w-[90px]  ">
                      <h1 className="text-center">
                        {(s.quantity * s.price)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </h1>
                    </div>

                    {/* <div className="min-w-[150px] font-medium text-black dark:text-white ">
                  <h1>{s.}</h1>
                </div> */}
                  </motion.div>
                ))
              ) : (
                <div className="flex items-center justify-center p-12">
                  <h1 className="font-bold text-[3vw]">No Data Here...</h1>
                </div>
              )}
            </motion.div>
            <div className="flex items-center justify-end p-6">
              <h1 className="font-bold text-black dark:text-white ">
                Grand Total: ₹
                {calculateGrandTotal(invoice.supplies)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex mb-6 items-center flex-col gap-10 justify-center p-6 h-100">
            <h1 className="font-bold text-xl flex items-center gap">
              <span className="text-red-500 text-4xl">
                <MdError />
              </span>
              &nbsp;&nbsp; {err.toLocaleUpperCase()}
            </h1>
            <button
              onClick={generateMonthlyInvoice}
              className="flex gap-2 font-semibold text-white transition-all px-6 py-3 bg-blue-500 rounded-md items-center active:scale-[.95]"
            >
              Generate Monthly Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientInvoice;
