import axios from 'axios';
import { motion, stagger } from 'framer-motion';
import React, { useContext, useEffect, useState } from 'react';
import Logo from '../../images/logo/images.png';
import { Tooltip } from 'antd';
import { TbMailDollar } from 'react-icons/tb';
import { SearchContext } from '../../Contexts/Search/SearchContext';
import { TbEyeDollar } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

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
  supplies: Supply[];
  totalAmount: number;
  _id: string;
}

const Invoice = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const { searchQuery } = useContext(SearchContext);
const navigate= useNavigate()
  const getInvoices = async () => {
    try {
      const res = await axios.get('http://localhost:8000/invoice/get-all-invoices');
      console.log(res.data.data);
      setInvoices(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInvoices();
  }, []);

  const queryLower = searchQuery.toLowerCase();
  console.log(queryLower);
  const queryNumber = parseFloat(searchQuery);
  console.log(queryNumber);

  const matchesQuery = (value: any): boolean => {
    if (typeof value === 'string') {
      console.log(value);
      return value.toLowerCase().includes(queryLower);
    }
    if (typeof value === 'number') {
      console.log(value);
      return value === queryNumber;
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some((nestedValue) => matchesQuery(nestedValue));
    }
    return false;
  };

  const filteredInvoices = invoices.filter((item) =>
    Object.values(item).some((value) => matchesQuery(value)),
  );

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

  console.log(invoices);

  const calculateGrandTotal = (supplies: Supply[]) => {
    return supplies.reduce(
      (total, supply) => total + supply.quantity * supply.price,
      0,
    );
  };
  

  return (
    <div>
      {filteredInvoices.map((invoice, i) => {
        const formattedSuppliesDates = invoice.supplies
          .map((supply) => new Date(supply.date).toISOString().split('T')[0])
          .sort();
        const fromDate = formattedSuppliesDates[0];
        const toDate = formattedSuppliesDates[formattedSuppliesDates.length - 1];

        return (
          <div
            key={i}
            className="rounded-xl relative my-4 border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
          >
            <div className='absolute top-5 right-6'>
              <Tooltip placement='bottom' title="View Invoice">

                <button onClick={()=>navigate(`/singleInvoice/${invoice._id}`)} className='hover:text-primary flex items-center gap-1'>
                  <span className='text-xl'>

                    <TbEyeDollar/>
                  </span>
                    <span>View Invoice</span>
                </button>
              </Tooltip>
            </div>
            <div>
              <div className="flex items-center justify-center">
                <div className="w-[6vw]">
                  <img src={Logo} alt="logo" className="h-full w-full" />
                </div>
              </div>

              <div className="my-4">
                <div className="flex items-center justify-between">
                  <div className="client Info">
                    <p>
                      <span className="font-medium text-black">
                        Client Id :-&nbsp;
                      </span>
                      {invoice.clientId._id}
                    </p>
                    <p>
                      <span className="font-medium text-black">Name:-&nbsp;</span>
                      {invoice.clientId.name.toUpperCase()}
                    </p>
                    <p>
                      <span className="font-medium text-black">
                        Email:-&nbsp;
                      </span>
                      {invoice.clientId.email}
                    </p>
                  </div>
                  <div className="invoice Info">
                    <p>
                      <span className="font-medium text-black">
                        Invoice Id :-&nbsp;
                      </span>
                      {invoice._id}
                    </p>
                    <p>
                      <span className="font-medium text-black">Date:-&nbsp;</span>
                    {fromDate} - {toDate}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex max-w-full px-6 py-5.5 bg-[#F6F9FC] dark:bg-meta-4 items-center justify-between">
                <div className="min-w-[150px] font-medium text-black dark:text-white xl:pl-11">
                  <h1 className="text-center">Date</h1>
                </div>
                <div className="min-w-[150px] font-medium text-black dark:text-white xl:pl-11">
                  <h1 className="text-center">Supplies</h1>
                </div>
                <div className="min-w-[150px] font-medium text-black dark:text-white xl:pl-11">
                  <h1 className="text-center">Price Per Bottle</h1>
                </div>
                <div className="min-w-[80px] font-medium text-black dark:text-white xl:pl-11">
                  <h1 className="text-center">Status</h1>
                </div>
                <div className="min-w-[80px] font-medium text-black dark:text-white xl:pl-11">
                  <h1 className="text-center">Quantity</h1>
                </div>
                <div className="min-w-[90px] font-medium text-black dark:text-white xl:pl-11">
                  <h1 className="text-center">Total</h1>
                </div>
              </div>
              <motion.div variants={listContainer} initial="hidden" animate={'show'}>
                {invoice.supplies && invoice.supplies.length > 0 ? (
                  invoice.supplies.map((s, i) => (
                    <motion.div
                      key={i}
                      variants={listItem}
                      className="border-b flex items-center justify-between border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
                    >
                      <div className="min-w-[150px] font-medium text-black dark:text-white">
                        <h1 className="text-center">{s.date.toString().split('T')[0]}</h1>
                      </div>
                      <div className="min-w-[150px] font-medium text-black dark:text-white">
                        <h1 className="text-center">{s.bottleType}</h1>
                      </div>
                      <div className="min-w-[150px] font-medium text-black dark:text-white">
                        <h1 className="text-center">{s.price}</h1>
                      </div>
                      <div className="min-w-[80px] font-medium text-black dark:text-white">
                        <h1 className="text-center">{invoice.status}</h1>
                      </div>
                      <div className="min-w-[80px]">
                        <h1 className="text-center">{s.quantity}</h1>
                      </div>
                      <div className="min-w-[90px]">
                        <h1 className="text-center">
                          {(s.quantity * s.price)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </h1>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex items-center justify-center p-12">
                    <h1 className="font-bold text-[3vw]">No Data Here...</h1>
                  </div>
                )}
              </motion.div>
              <div className="flex items-center justify-end p-6">
                <h1 className="font-bold text-black dark:text-white">
                  Grand Total: ₹
                  {calculateGrandTotal(invoice.supplies)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </h1>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Invoice;
