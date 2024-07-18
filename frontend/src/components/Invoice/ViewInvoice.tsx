import { Modal, message, notification } from 'antd';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvoiceContext, InvoiceType } from '../../Contexts/InvoiceContext/InvoiceContext';

interface Props {
  invId: string;
  handleCancel: () => void;
}

const ViewInvoice: React.FC<Props> = ({ invId, handleCancel }) => {
  const { month, year, setMonth, setYear }:any = useContext<InvoiceType|null>(InvoiceContext);
// console.log("invContext",invoiceContext)
  // if (!invoiceContext) {
  //   throw new Error(
  //     'SomeComponent must be used within UserProvider and LoginProvider',
  //   );
  // }
  // = invoiceContext;
  const navigate = useNavigate();
  const date = new Date(Number(year), Number(month) - 1);
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1); // month is 0-indexed
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const view = async (id: any) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/invoice/client/${id}/invoice/generate-monthly?month=${startDate}&year=${endDate}`,
        {},
      );
      console.log(res.data.data);
      // getClientInvoice();
      navigate(`/singleInvoice/${res.data.data._id}`);
      message.success({ content: res.data.message });
      // notification.success({ message: res.data.message });
    } catch (error: any) {
      console.log(error);
      message.error({ content: error.response.data.message });
      // notification.error({message:error.response.data.message})
      handleCancel();
    }
  };

  const options = [
    { month: 'Jan', val: '01' },
    { month: 'Feb', val: '02' },
    { month: 'March', val: '03' },
    { month: 'Apr', val: '04' },
    { month: 'May', val: '05' },
    { month: 'June', val: '06' },
    { month: 'July', val: '07' },
    { month: 'Aug', val: '08' },
    { month: 'Sept', val: '09' },
    { month: 'Oct', val: '10' },
    { month: 'Nov', val: '11' },
    { month: 'Dec', val: '12' },
  ];

  const years = [
    '2001',
    '2002',
    '2003',
    '2004',
    '2005',
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024',
    '2025',
    '2026',
    '2027',
    '2028',
    '2029',
    '2030',
    '2031',
    '2032',
    '2033',
    '2034',
    '2035',
    '2036',
    '2037',
    '2038',
    '2039',
    '2040',
    '2041',
    '2042',
    '2043',
    '2044',
    '2045',
    '2046',
    '2047',
    '2048',
    '2049',
    '2050',
  ];

  const handleSubmit = (e: any) => {
    e.preventDefault();
    view(invId);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-full my-2 items-center gap-3">
          <label className="self-start">Select Month</label>
          <select
            className="w-full border rounded-sm p-2"
            onChange={(e) => setMonth(e.target.value)}
            value={month}
          >
            {options.map((option, i) => (
              <option key={i} value={option.val}>
                {option.month}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-full my-2 items-center gap-3">
          <label className="self-start">Select Year</label>
          <select
            className="w-full border rounded-sm p-2"
            onChange={(e) => setYear(e.target.value)}
            value={year}
          >
            {years.map((y, i) => (
              <option key={i} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center items-center">
          <button
            type="submit"
            className="px-4 py-2 rounded-md text-white font-semibold my-3 bg-[#1C2434]"
          >
            Generate
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewInvoice;
