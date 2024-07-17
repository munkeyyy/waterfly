import { Modal, notification } from 'antd';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../../common/Loader';
import { motion, stagger } from 'framer-motion';
import { FaPlus } from 'react-icons/fa6';
import { IoMdEye } from 'react-icons/io';
import { FaPencilAlt } from 'react-icons/fa';
import { SearchContext } from '../../Contexts/Search/SearchContext';
import { Formik, FormikErrors } from 'formik';
interface Supply {
  date: string;
  bottleType: string;
  price: number;
  quantity: number;
  _id:string
}
interface SupplyValues {
  _id:string,
  clientId:string,
  date: string;
  bottleType: string;
  price: number | null;
  quantity: number | null;
}
interface Client {
  name: string;
  email: string;
  location: string;
  pincode: number | null;
  phone: number | null;
  avatar?: string;
  _id: string;
}
const SingleSupply = () => {
  const { clientId } = useParams();
  const [singlebottle,setSingleBottle]=useState<SupplyValues>({
    date: "",
    bottleType: "",
    price: null,
    quantity: null,
    _id:"",
    clientId:""
  })
  const [supply, setSupply] = useState<Supply[]>([]);
  const [client, setClient] = useState<Client>({
    name: '',
    email: '',
    location: '',
    pincode: null,
    phone: null,
    _id: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchQuery } = useContext(SearchContext);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSingleSupply=async(id:any)=>{
    try {

      const res= await axios.get(`http://localhost:8000/supplies/get-supplies/${id}`)
      console.log(res.data.data)
      setSingleBottle(res.data.data)
      showModal()

    } catch (error) {
      console.log(error)
    }

  }
  const getClient = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/clients/get-clients/${clientId}`,
      );
      console.log(res.data.data);
      setClient(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getClientSupplies = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/supplies/client-supplies/${clientId}`,
      );
      console.log(res.data.data);
     

        setSupply(res.data.data);
      
      // notification.success({message:res.data.message})
    } catch (error) {
      console.log(error);
      notification.error({ message: 'Something went wrong' });
    }
  };
  console.log(supply);
  useEffect(() => {
    getClientSupplies();
    getClient();
  }, []);

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

  const queryLower = searchQuery.toLowerCase();
  const queryNumber = parseFloat(searchQuery);

  const matchesQuery = (value: any) => {
    if (typeof value === 'string') {
      return value.toLowerCase().includes(queryLower);
    }
    if (typeof value === 'number') {
      return value === queryNumber;
    }
    return false;
  };
  const filteredSupply = supply.filter((item) =>
    Object.values(item).some((value) => matchesQuery(value)),
  );
  const handleSupplyDelete=async(id:any)=>{
    const res=await axios.delete(`http://localhost:8000/supplies/delete-supply/${id}`)
    notification.success({message:res.data.message})
    filteredSupply.filter((supply)=>supply._id!==id)
    getClientSupplies()
    
  }

  console.log(filteredSupply);
  console.log("ssss",singlebottle.date)
  return (
    <div>
      <div className="my-4">
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Supplies for <span className="capitalize">{client?.name}</span>
        </h1>
      </div>
      <div className="rounded-sm border border-stroke bg-white  px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex max-w-full px-6 py-5.5 bg-[#F6F9FC] dark:bg-meta-4 items-center justify-between">
          <div className="min-w-[150px]  font-medium text-black dark:text-white xl:pl-11">
            <h1>Date</h1>
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
              console.log(s.date),
              <motion.div
                key={i}
                variants={listItem}
                className="border-b flex items-center justify-between border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
              >
                <div className="min-w-[150px]  font-medium text-black dark:text-white ">
                  <h1>{s.date}</h1>
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

                <div className="flex items-centermin-w-[150px] space-x-5.5">
                  <button onClick={()=>handleSingleSupply(s._id)} className="hover:text-primary">
                    <FaPencilAlt />
                  </button>
                  <button onClick={()=>handleSupplyDelete(s._id)} className="hover:text-primary">
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
                  {/* <button className="hover:text-primary">
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                        fill=""
                      />
                      <path
                        d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                        fill=""
                      />
                    </svg>
                  </button> */}
                </div>
                <Modal
                  title={'Edit Supply'}
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                >
                  <div>
                    <Formik
                      enableReinitialize
                      initialValues={{
                        date:singlebottle.date.toString().split('T')[0]|| '',
                        quantity:singlebottle.quantity|| null,
                        bottleType:singlebottle.bottleType|| '',
                        price:singlebottle.price|| null,
                        clientId:singlebottle.clientId||"",
                        _id:singlebottle._id
                      }}
                      validate={(values: SupplyValues) => {
                        const errors: FormikErrors<SupplyValues> = {};
                        if (!values.date) {
                          errors.date = 'Date is required';
                        }

                        if (!values.quantity) {
                          errors.quantity = 'quantity is required';
                        }

                        if (!values.bottleType) {
                          errors.bottleType = 'bottleType  is required';
                        }
                        if (!values.price) {
                          errors.price = 'price is required';
                        }

                        return errors;
                      }}
                      onSubmit={(values) => {
                        // console.log(values);
                        // console.log(user._id);
                        //   const formData = new FormData();
                        //   formData.append('name', values.name);
                        //   formData.append('email', values.email);
                        //   formData.append('phone', values.phone);
                        // Append image file

                        axios
                          .put(
                            `http://localhost:8000/supplies/update-supply/${s._id}`,
                            values,
                          )
                          .then((res) => {
                            console.log(res.data.data);
                            // setClients([...clients, res.data.data]);

                            // getClients();
                            getClientSupplies()
                            handleCancel();
                            notification.success({ message: res.data.message });
                          })
                          .catch((err) => console.log(err));

                        // console.log(singleClient._id);
                      }}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        /* and other goodies */
                      }) => (
                        <form onSubmit={handleSubmit}>
                          <div className="flex flex-col gap-3">
                            <h2 className="text-[5vw] md:text-[1.2vw] mt-4 font-semibold">
                              Supply Information
                            </h2>
                            <div className="flex  items-center md:items-start gap-2 md:gap-6">
                              <div className="flex flex-col w-full  my-2">
                                <label className='mb-2' htmlFor="date">Date</label>
                                <input
                                  type="date"
                                  name="date"
                                  id='date'
                                  className="border-black border w-full px-2 py-3 rounded-md focus-visible:outline-none focus-visible:border-2 focus-visible:border-black"
                                  placeholder="Date"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.date}
                                />
                                <span className="text-red-600 text-[.8vw] text-center">
                                  {errors.date && touched.date && errors.date}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-6">
                                  <div className="flex flex-col my-2 w-full ">
                                    <label className='mb-2' htmlFor="quantity">Quantity</label>
                                    <input
                                      type="number"
                                      placeholder="Quantity"
                                      name="quantity"
                                      id='quantity'
                                      className="border-black border px-2 py-3 w-full rounded-md focus-visible:outline-none focus-visible:border-2 focus-visible:border-black"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={
                                        values.quantity !== null
                                          ? values.quantity
                                          : ''
                                      }
                                    />
                                    <span className="text-red-600 text-[.8vw] text-center">
                                      {errors.quantity &&
                                        touched.quantity &&
                                        errors.quantity}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-6">
                                  <div className="flex flex-col my-2 w-full">
                                    <label className='mb-2' htmlFor="bottleType">Bottle Type</label>
                                    <input
                                      type="text"
                                      name="bottleType"
                                      id='bottleType'
                                      placeholder="Bottle Type"
                                      className="border-black border px-2 py-3 w-full rounded-md focus-visible:outline-none focus-visible:border-2 focus-visible:border-black"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.bottleType}
                                    />
                                    <span className="text-red-600 text-[.8vw] text-center">
                                      {errors.bottleType &&
                                        touched.bottleType &&
                                        errors.bottleType}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-6">
                                  <div className="flex flex-col my-2 w-full">
                                    <label className='mb-2' htmlFor='price'>Price</label>
                                    <input
                                      type="number"
                                      name="price"
                                      id='price'
                                      placeholder="Price"
                                      className="border-black border px-2 py-3 w-full rounded-md focus-visible:outline-none focus-visible:border-2 focus-visible:border-black"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={
                                        values.price !== null
                                          ? values.price
                                          : ''
                                      }
                                    />
                                    <span className="text-red-600 text-[.8vw] text-center">
                                      {errors.price &&
                                        touched.price &&
                                        errors.price}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="font-semibold mx-auto text-white transition-all px-6 py-3 bg-[#40B26E] rounded-md  active:scale-[.95]"
                            >
                              Add
                            </button>
                          </div>
                        </form>
                      )}
                    </Formik>
                  </div>
                </Modal>
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
            Total Price: ₹
            {supply.reduce((total, s) => total + s?.price * s?.quantity, 0)}
          </h1>
        </div>
        {/* <TableThree/> */}
      </div>
    </div>
  );
};

export default SingleSupply;
