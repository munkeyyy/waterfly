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
  console.log("Supppliess", filteredSupply)

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
  const handleDelete=async(id:string)=>{
    try {
      const res = await axios.delete(`http://localhost:8000/supplies/delete-supply/${id}`)
      alert(res.data.message)
      getReport()
      // notification.success({message:res.data.message})
    } catch (error:any) {
      console.log(error)
    }
  }
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
          <button onClick={addQuery} className='px-4 py-3 bg-[#40B26E] transition-all active:scale-[.99] text-white font-semibold rounded-lg'>
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
                <div className="min-w-[80px] flex gap-3  font-medium text-black dark:text-white ">
                  <Tooltip title="View Supply">
                    <button
                      onClick={() => navigate(`/supplies/${s.clientId?._id}`)}
                    >
                      <IoMdEye />
                    </button>
                  </Tooltip>
                  <Tooltip title="Delete Client">
                    
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="hover:text-primary"
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                        <path
                          d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          fill=""
                        />
                        <path
                          d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                          fill=""
                        />
                        <path
                          d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                          fill=""
                        />
                      </svg>
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
                  className="px-4 py-2 rounded-md text-white font-semibold my-3 bg-[#40B26E]"
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
