import { message, Modal, notification, Tooltip } from 'antd';
import axios from 'axios';
import { motion, stagger } from 'framer-motion';
import React, { useContext, useEffect, useState } from 'react';
import { IoMdEye } from 'react-icons/io';
import { MdDownload } from 'react-icons/md';
import { SearchContext } from '../../Contexts/Search/SearchContext';
import { useNavigate } from 'react-router-dom';
import {
  ReportContext,
  ReportType,
} from '../../Contexts/ReportContext/ReportContext';

interface Client {
  email: string;
  location: string;
  name: string;
  phone: number;
  pincode: number;
  _id: string;
}

interface SupplyType {
  date: string;
  bottleType: string;
  price: number;
  quantity: number;
  _id: string;
  clientId: Client | null;
}

const Report = () => {
  const [report, setReport] = useState<SupplyType[]>([]);
  const [isQuery, setIsQuery]=useState<boolean>(false)
  const { searchQuery } = useContext(SearchContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { month, year, setMonth, setYear }: any = useContext<ReportType | null>(
    ReportContext,
  );

  const date = new Date(Number(year), Number(month) - 1);
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1); // month is 0-indexed
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

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
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getReport = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/report/get-monthly-report?${isQuery&&`startDate=${startDate}&endDate=${endDate}`}`,
      );
      console.log(res.data.data);
      setReport(res.data.data);
      handleCancel();
    } catch (error: any) {
      console.log(error);
    }
  };
  console.log(startDate, endDate);
  useEffect(() => {
    // showModal();
    setIsQuery(false)
    getReport()
  }, []);

  const queryLower = searchQuery.toLowerCase();
  // console.log(queryLower);
  const queryNumber = parseFloat(searchQuery);
  // console.log(queryNumber);

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
      return Object.values(value).some((nestedValue) =>
        matchesQuery(nestedValue),
      );
    }
    return false;
  };
  const filteredSupply = report.filter((item) =>
    Object.values(item).some((value) => matchesQuery(value)),
  );

  const navigate = useNavigate();
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // view(invId);
    getReport();
  };

  const downloadReport = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/report/download-report?startDate=${startDate}&endDate=${endDate}`,
        { responseType: 'blob' }, // Important: set the response type to 'blob'
      );

      // Create a new Blob object using the response data
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);

      // Create an anchor element and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${startDate.toISOString()}_${endDate.toISOString()}.xlsx`; // Set the file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Release the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      notification.error({message:"Please select a month"})
      console.log(error);
    }
  };
  // const monthChange=(e:any)=>{
  //   setMonth(e.target.value)
  //   console.log(month)
  //   getReport()
  // }
  // const yearChange=(e:any)=>{
  //   setYear(e.target.value)
  //   console.log(year)
  //   getReport()
  // }
  const addQuery=()=>{
    setIsQuery(true)
    showModal()
  }
  return (
    <div>
      <div className="flex items-center justify-between my-4">
        <Tooltip title="Download">

        <button
          onClick={downloadReport}
          className="flex items-center gap-2  transition-all active:scale-[.98]"
        >
          <div className="text-xl">
            <MdDownload />
          </div>
          <span>Download Report</span>
        </button>
        </Tooltip>

        <div className="flex items-center gap-4">
          <button onClick={addQuery} className='px-4 py-3 bg-blue-500 transition-all active:scale-[.99] text-white font-semibold rounded-lg'>
            Select Month
          </button>
        </div>
      </div>
      <div className="rounded-sm border border-stroke bg-white  px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex max-w-full px-6 py-5.5 bg-[#F6F9FC] dark:bg-meta-4 items-center justify-between">
          <div className="min-w-[150px]  font-medium text-black dark:text-white xl:pl-11">
            <h1>Date</h1>
          </div>
          <div className="min-w-[150px]  font-medium text-black dark:text-white xl:pl-11">
            <h1>Name</h1>
          </div>
          <div className="min-w-[150px]  font-medium text-black dark:text-white xl:pl-11">
            <h1>Supplies</h1>
          </div>
          <div className="min-w-[150px]  font-medium text-black dark:text-white xl:pl-11">
            <h1>Price Per Bottle</h1>
          </div>
          <div className="min-w-[130px]  font-medium text-black dark:text-white xl:pl-11">
            <h1>Quantity</h1>
          </div>
          <div className="min-w-[150px]  font-medium text-black dark:text-white xl:pl-11">
            <h1>Actions</h1>
          </div>
        </div>
        <motion.div variants={listContainer} initial="hidden" animate={'show'}>
          {filteredSupply && filteredSupply.length > 0 ? (
            filteredSupply.map((s, i) => (
              <motion.div
                key={i}
                variants={listItem}
                className="border-b flex items-center justify-between border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
              >
                <div className="min-w-[150px]  font-medium text-black dark:text-white ">
                  <h1>{s.date.toString().split('T')[0]}</h1>
                </div>
                <div className="min-w-[150px]  font-medium text-black dark:text-white ">
                  <h1>{s.clientId?.name.toLocaleUpperCase()}</h1>
                </div>
                <div className="min-w-[150px]  font-medium text-black dark:text-white ">
                  <h1>{s.bottleType}</h1>
                </div>
                <div className="min-w-[150px]  font-medium text-black dark:text-white ">
                  <h1>{s.price}</h1>
                </div>
                <div className="min-w-[80px]  font-medium text-black dark:text-white ">
                  <h1>{s.quantity}</h1>
                </div>
                <div className="min-w-[80px]  font-medium text-black dark:text-white ">
                  <Tooltip title="View Supply">
                    <button
                      onClick={() => navigate(`/supplies/${s.clientId?._id}`)}
                    >
                      <IoMdEye />
                    </button>
                  </Tooltip>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex items-center justify-center p-12">
              <h1 className="font-bold text-[3vw]">No Data Here...</h1>
            </div>
          )}
        </motion.div>

        <Modal
          title={'View Report'}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col w-full my-4 items-center gap-3">
                <label className="self-start font-semibold">Select Month</label>
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
              <div className="flex flex-col w-full my-4 items-center gap-3">
                <label className="self-start font-semibold">Select Year</label>
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
                  className="px-4 py-2 rounded-md text-white font-semibold my-3 bg-blue-500"
                >
                  View
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Report;
