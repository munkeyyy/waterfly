import React, { useContext, useEffect, useState } from 'react';
import TableThree from '../Tables/TableThree';
import axios from 'axios';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { FaFileInvoiceDollar, FaPlus } from 'react-icons/fa6';
import { Modal, Tooltip, notification } from 'antd';
import { Formik, FormikErrors } from 'formik';
import Loader from '../../common/Loader';
import { FaPencilAlt } from 'react-icons/fa';
import { motion, stagger } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IoMdEye } from 'react-icons/io';
import { SearchContext } from '../../Contexts/Search/SearchContext';
import ViewInvoice from '../Invoice/ViewInvoice';
import type { PopconfirmProps } from 'antd';
import { Popconfirm } from 'antd';

interface Client {
  email: string;
  location: string;
  name: string;
  phone: number;
  pincode: number;
  _id: string;
}

interface FormValues {
  name: string;
  email: string;
  location: string;
  pincode: number | null;
  phone: number | null;
  avatar?: string;
}
interface SupplyValues {
  clientId: string;
  date: Date | string;
  quantity: number | null;
  bottleType: string;
  price: number | null;
}
interface SingleClient {
  name: string;
  email: string;
  location: string;
  pincode: number | null;
  phone: number | null;
  avatar?: string;
  _id: string;
}

interface SingleSupply {
  clientId: string;
  date: string;
  quantity: number | null;
  bottleType: string;
  price: number | null;
}
const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsId, setClientsId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string>('');
  const [invoiceId, setInvoiceId] = useState<string>('');
  const navigate = useNavigate();
  const [editSupply, setEditSupply] = useState<boolean>(false);
  const [singleSupply, setSingleSupply] = useState<SingleSupply[]>([]);
  const [singleClient, setSingleClient] = useState<SingleClient>({
    name: '',
    email: '',
    location: '',
    pincode: null,
    phone: null,
    _id: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [supply, setSupply] = useState<boolean>(false);
  const [invoice, setInvoice] = useState<boolean>(false);
  const { searchQuery } = useContext(SearchContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleEdit = async (id: any) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/clients/get-clients/${id}`,
      );
      setSingleClient(res.data.data);
      setEdit(true);
      setInvoice(false);
      showModal();
      setSupply(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSupply = (id: string) => {
    setSupply(true);
    setEdit(false);
    setInvoice(false);
    showModal();
    setClientsId(id);
  };
  // console.log(singleClient);
  const handleEditSupply = async (id: string) => {
    navigate(`/supplies/${id}`);
  };
  const getClients = async () => {
    try {
      const res = await axios.get('http://localhost:8000/clients/get-clients');
      console.log(res.data.data);
      setClients(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getClients();
  }, []);
  const deleteByClient = async (id: string) => {
    try {
      console.log(`Attempting to delete supplies for client ID: ${id}`);
      const res = await axios.delete(
        `http://localhost:8000/supplies/delete-by-client/${id}`,
      );
      console.log(res.data.message);
      console.log('supplyId', id);
      // notification.success({message:res.data.message})
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleDelete = async (id: string) => {
    
  };

  const handleViewInvoice = (id: string) => {
    setInvoice(true);
    setEdit(false);
    setSupply(false);
    showModal();
    setInvoiceId(id);
  };
  // useEffect(() => {
  //   handleEdit(singleClient._id)
  // }, [singleClient]);

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
  const filteredClients = clients.filter((item) =>
    Object.values(item).some((value) => matchesQuery(value)),
  );
  console.log('filtered', filteredClients);
  const confirm: PopconfirmProps['onConfirm'] =async (e) => {
    console.log(e);
    try {
      console.log(`Attempting to delete client ID: ${deleteId}`);
      const res = await axios.delete(
        `http://localhost:8000/clients/delete-client/${deleteId}`,
      );
      console.log('clinetId', deleteId);
      console.log(res.data.message);
      notification.success({ message: res.data.message });
      setClients(clients.filter((client) => client._id !==deleteId));
      deleteByClient(deleteId);
    } catch (error) {
      console.log(error);
    }
  };

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    console.log(e);
  };
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Clients
        </h1>
        <button
          onClick={() => {
            showModal();
            setEdit(false);
            setSupply(false);
          }}
          className="flex gap-1 text-sm font-semibold text-white transition-all px-6 py-3 bg-[#1C2434] rounded-md items-center active:scale-[.95]"
        >
          <span className="font-bold">
            <FaPlus />
          </span>{' '}
          ADD
        </button>
      </div>
      <Modal
        title={
          invoice
            ? 'View Invoice'
            : edit
            ? 'Edit Client'
            : supply
            ? 'What have you supplied?'
            : 'Add Client'
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {invoice ? (
          <ViewInvoice handleCancel={handleCancel} invId={invoiceId} />
        ) : (
          <div>
            {supply ? (
              <div>
                <Formik
                  enableReinitialize
                  initialValues={{
                    clientId: clientsId,
                    date: '',
                    quantity: null,
                    bottleType: '',
                    price: null,
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
                      .post(`http://localhost:8000/supplies/add-supply`, values)
                      .then((res) => {
                        console.log(res.data.data);
                        // setClients([...clients, res.data.data]);

                        getClients();

                        handleCancel();
                        notification.success({ message: res.data.message });
                      })
                      .catch((err) => console.log(err));

                    console.log(singleClient._id);
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
                            <input
                              type="date"
                              name="date"
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
                                <input
                                  type="number"
                                  placeholder="Quantity"
                                  name="quantity"
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
                                <input
                                  type="text"
                                  name="bottleType"
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
                                <input
                                  type="number"
                                  name="price"
                                  placeholder="Price"
                                  className="border-black border px-2 py-3 w-full rounded-md focus-visible:outline-none focus-visible:border-2 focus-visible:border-black"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={
                                    values.price !== null ? values.price : ''
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
                          className="font-semibold mx-auto text-white transition-all px-6 py-3 bg-[#1C2434] rounded-md  active:scale-[.95]"
                        >
                          Add
                        </button>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            ) : (
              <div>
                {edit ? (
                  <Formik
                    enableReinitialize
                    initialValues={{
                      name: singleClient.name || '',
                      email: singleClient.email || '',

                      location: singleClient.location || '',
                      pincode: singleClient.pincode || null,
                      phone: singleClient.phone || null,
                    }}
                    validate={(values: FormValues) => {
                      const errors: FormikErrors<FormValues> = {};
                      if (!values.email) {
                        errors.email = 'Required';
                      } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                          values.email,
                        )
                      ) {
                        errors.email = 'Invalid email address';
                      }

                      if (!values.name) {
                        errors.name = 'Name is required';
                      }

                      if (!values.phone) {
                        errors.phone = 'Phone Number is required';
                      } else if (values.phone < 10) {
                        errors.phone =
                          'Phone number should contain atleast 10 characters';
                      }
                      if (!values.location) {
                        errors.location = 'Location is required';
                      }

                      if (!values.pincode) {
                        errors.pincode = 'Pincode is required';
                      }
                      return errors;
                    }}
                    onSubmit={(values: FormValues) => {
                      // console.log(values);
                      // console.log(user._id);
                      //   const formData = new FormData();
                      //   formData.append('name', values.name);
                      //   formData.append('email', values.email);
                      //   formData.append('phone', values.phone);
                      // Append image file

                      axios
                        .put(
                          `http://localhost:8000/clients/update-client/${singleClient._id}`,
                          values,
                        )
                        .then((res) => {
                          // console.log(res);
                          // setClients([...clients, res.data.data]);
                          getClients();

                          handleCancel();
                          notification.success({ message: res.data.message });
                        })
                        .catch((err) => console.log(err));

                      console.log(singleClient._id);
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
                            Client Infromation
                          </h2>
                          <div className="flex  items-center md:items-start gap-2 md:gap-6">
                            <div className="flex flex-col w-full  my-2">
                              <input
                                type="text"
                                name="name"
                                className="border-black border w-full px-2 py-3 rounded-md focus-visible:outline-none focus-visible:border-2 focus-visible:border-black"
                                placeholder="Name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                              />
                              <span className="text-red-600 text-[.8vw] text-center">
                                {errors.name && touched.name && errors.name}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div>
                              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-6">
                                <div className="flex flex-col my-2 w-full ">
                                  <input
                                    type="number"
                                    placeholder="Phone number"
                                    name="phone"
                                    className="border-black border px-2 py-3 w-full rounded-md focus-visible:outline-none focus-visible:border-2 focus-visible:border-black"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={
                                      values.phone !== null ? values.phone : ''
                                    }
                                  />
                                  <span className="text-red-600 text-[.8vw] text-center">
                                    {errors.phone &&
                                      touched.phone &&
                                      errors.phone}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-6">
                                <div className="flex flex-col my-2 w-full">
                                  <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="border-black border px-2 py-3 w-full rounded-md focus-visible:outline-none focus-visible:border-2 focus-visible:border-black"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                  />
                                  <span className="text-red-600 text-[.8vw] text-center">
                                    {errors.email &&
                                      touched.email &&
                                      errors.email}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div>
                              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-6">
                                <div className="flex flex-col my-2 w-full ">
                                  <input
                                    type="text"
                                    placeholder="Location"
                                    name="location"
                                    className="border-black border px-2 py-3 w-full rounded-md focus-visible:outline-none focus-visible:border-2 focus-visible:border-black"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.location}
                                  />
                                  <span className="text-red-600 text-[.8vw] text-center">
                                    {errors.location &&
                                      touched.location &&
                                      errors.location}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-6">
                                <div className="flex flex-col my-2 w-full">
                                  <input
                                    type="number"
                                    name="pincode"
                                    placeholder="Pincode"
                                    className="border-black border px-2 py-3 w-full rounded-md focus-visible:outline-none focus-visible:border-2 focus-visible:border-black"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={
                                      values.pincode !== null
                                        ? values.pincode
                                        : ''
                                    }
                                  />
                                  <span className="text-red-600 text-[.8vw] text-center">
                                    {errors.pincode &&
                                      touched.pincode &&
                                      errors.pincode}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="font-semibold mx-auto text-white transition-all px-6 py-3 bg-[#1C2434] rounded-md  active:scale-[.95]"
                          >
                            Add
                          </button>
                        </div>
                      </form>
                    )}
                  </Formik>
                ) : (
                  <Formik
                    enableReinitialize
                    initialValues={{
                      name: '',
                      email: '',
                      location: '',
                      pincode: null,
                      phone: null,
                    }}
                    validate={(values: FormValues) => {
                      const errors: FormikErrors<FormValues> = {};
                      if (!values.email) {
                        errors.email = 'Required';
                      } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                          values.email,
                        )
                      ) {
                        errors.email = 'Invalid email address';
                      }

                      if (!values.name) {
                        errors.name = 'Name is required';
                      }

                      if (!values.phone) {
                        errors.phone = 'Phone Number is required';
                      } else if (values.phone < 10) {
                        errors.phone =
                          'Phone number should contain atleast 10 characters';
                      }
                      if (!values.location) {
                        errors.location = 'Location is required';
                      }

                      if (!values.pincode) {
                        errors.pincode = 'Pincode is required';
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
                        .post(
                          'http://localhost:8000/clients/add-client',
                          values,
                        )
                        .then((res) => {
                          // console.log(res);
                          setClients([...clients, res.data.data]);
                          // setClients([...clients, res.data.data]);
                          // getClients()
                          handleCancel();
                          notification.success({ message: res.data.message });
                        })
                        .catch((err) => console.log(err));
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
                            Client Information
                          </h2>
                          <div className="flex  items-center md:items-start gap-2 md:gap-6">
                            <div className="flex flex-col w-full  my-2">
                              <input
                                type="text"
                                name="name"
                                className="border-black border w-full px-2 py-3 rounded-md focus-visible:outline-none focus-visible:border-2 focus-visible:border-black"
                                placeholder="Name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                              />
                              <span className="text-red-600 text-[.8vw] text-center">
                                {errors.name && touched.name && errors.name}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div>
                              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-6">
                                <div className="flex flex-col my-2 w-full ">
                                  <input
                                    type="number"
                                    placeholder="Phone number"
                                    name="phone"
                                    className="border-black border px-2 py-3 w-full rounded-md focus-visible:outline-none focus-visible:border-2 focus-visible:border-black"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={
                                      values.phone !== null ? values.phone : ''
                                    }
                                  />
                                  <span className="text-red-600 text-[.8vw] text-center">
                                    {errors.phone &&
                                      touched.phone &&
                                      errors.phone}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-6">
                                <div className="flex flex-col my-2 w-full">
                                  <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="border-black border px-2 py-3 w-full rounded-md focus-visible:outline-none focus-visible:border-2 focus-visible:border-black"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                  />
                                  <span className="text-red-600 text-[.8vw] text-center">
                                    {errors.email &&
                                      touched.email &&
                                      errors.email}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div>
                              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-6">
                                <div className="flex flex-col my-2 w-full ">
                                  <input
                                    type="text"
                                    placeholder="Location"
                                    name="location"
                                    className="border-black border px-2 py-3 w-full rounded-md focus-visible:outline-none focus-visible:border-2 focus-visible:border-black"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.location}
                                  />
                                  <span className="text-red-600 text-[.8vw] text-center">
                                    {errors.location &&
                                      touched.location &&
                                      errors.location}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-6">
                                <div className="flex flex-col my-2 w-full">
                                  <input
                                    type="number"
                                    name="pincode"
                                    placeholder="Pincode"
                                    className="border-black border px-2 py-3 w-full rounded-md focus-visible:outline-none focus-visible:border-2 focus-visible:border-black"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={
                                      values.pincode !== null
                                        ? values.pincode
                                        : ''
                                    }
                                  />
                                  <span className="text-red-600 text-[.8vw] text-center">
                                    {errors.pincode &&
                                      touched.pincode &&
                                      errors.pincode}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="font-semibold mx-auto text-white transition-all px-6 py-3 bg-[#1C2434] rounded-md  active:scale-[.95]"
                          >
                            Add
                          </button>
                        </div>
                      </form>
                    )}
                  </Formik>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
      <div className="rounded-sm border border-stroke bg-white  px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex max-w-full px-6 py-5.5 bg-[#F6F9FC] dark:bg-meta-4 items-center justify-between">
          <div className="min-w-[150px]  font-medium text-black dark:text-white xl:pl-11">
            <h1>Name</h1>
          </div>
          <div className="min-w-[220px]  font-medium text-black dark:text-white xl:pl-11">
            <h1>Email</h1>
          </div>
          <div className="min-w-[100px]  font-medium text-black dark:text-white xl:pl-11">
            <h1>Supply</h1>
          </div>
          <div className="min-w-[120px]  font-medium text-black dark:text-white xl:pl-11">
            <h1>Actions</h1>
          </div>
        </div>
        <motion.div variants={listContainer} initial="hidden" animate={'show'}>
          {filteredClients && filteredClients.length > 0 ? (
            filteredClients.map((client, i) => (
              <motion.div
                key={i}
                variants={listItem}
                className="border-b flex items-center justify-between border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
              >
                <div className="min-w-[150px]  font-medium text-black dark:text-white ">
                  <h1 className="capitalize">{client?.name}</h1>
                </div>
                <div className="min-w-[220px]  font-medium text-black dark:text-white ">
                  <h1>{client?.email}</h1>
                </div>
                <div className="min-w-[100px]  font-medium text-black dark:text-white ">
                  <div className="flex items-center space-x-3.5">
                    <Tooltip title="Add Supply">
                      <button
                        onClick={() => handleSupply(client?._id)}
                        className="hover:text-primary  transition-all   active:scale-[.95]"
                      >
                        <FaPlus />
                      </button>
                    </Tooltip>
                    <Tooltip title="View Supply">
                      <button
                        onClick={() => handleEditSupply(client?._id)}
                        className="hover:text-primary  transition-all  active:scale-[.95]"
                      >
                        <IoMdEye />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <div className="flex items-center space-x-3.5">
                  <Tooltip title="Edit Client">
                    <button
                      onClick={() => handleEdit(client._id)}
                      className="hover:text-primary"
                    >
                      <FaPencilAlt />
                    </button>
                  </Tooltip>
                  <Tooltip title="Delete Client">
                    <Popconfirm
                    placement='bottomLeft'
                      title="Delete Client"
                      description="Are you sure to delete this client?, This will delete all the supplies related to this client "
                      onConfirm={confirm}
                      onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >

                    <button
                      onClick={() => setDeleteId(client._id)}
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
                    </Popconfirm>
                  </Tooltip>
                  <Tooltip title="Generate Invoice">
                    <button
                      onClick={() => handleViewInvoice(client._id)}
                      className="hover:text-primary"
                    >
                      <FaFileInvoiceDollar />
                    </button>
                  </Tooltip>
                </div>
              </motion.div>
            ))
          ) : (
            <Loader />
          )}
        </motion.div>
        {/* <TableThree/> */}
      </div>
    </>
  );
};

export default Clients;
