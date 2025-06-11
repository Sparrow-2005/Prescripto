import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  const navigate = useNavigate();

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', {
        headers: { 'Authorization': token }
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, {
        headers: { 'Authorization': token }
      });
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Payment for appointment booking',
      order_id: order.id, //This is the id created by Razorpay
      reciept: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(backendUrl + '/api/user/verifyRazorpay', response, {
            headers: { 'Authorization': token }
          });
          if (data.success) {
            getUserAppointments();
            navigate('/my-appointments');
          }
        } catch (error) {
          console.error(error);
          toast.error(error.message);
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, {
        headers: { 'Authorization': token }
      });
      if (data.success) {
        initPay(data.order);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // NEW: Function to filter and sort upcoming appointments by date and time
  const getUpcomingSortedAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Midnight reset

    const toMinutes = (timeStr) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours !== 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    return appointments
      .filter((item) => {
        const [day, month, year] = item.slotDate.split('_').map(Number);
        const dateObj = new Date(year, month - 1, day);
        dateObj.setHours(0, 0, 0, 0);
        return dateObj >= today;
      })
      .sort((a, b) => {
        const [ad, am, ay] = a.slotDate.split('_').map(Number);
        const [bd, bm, by] = b.slotDate.split('_').map(Number);

        const dateA = new Date(ay, am - 1, ad);
        const dateB = new Date(by, bm - 1, bd);

        if (dateA.getTime() === dateB.getTime()) {
          return toMinutes(a.slotTime) - toMinutes(b.slotTime);
        }
        return dateA - dateB;
      });
  };

  useEffect(() => {
    let interval;
    if (token) {
      getUserAppointments();
      interval = setInterval(() => {
        getUserAppointments(); // Poll every 5 seconds 
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b border-zinc-200">My appointments</p>
      <div>
        {
          getUpcomingSortedAppointments().map((item, index) => (
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b border-zinc-200' key={item._id}>
              <div>
                <img className='w-32 bg-indigo-50 rounded' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.docData.address.line1}</p>
                <p className='text-xs'>{item.docData.address.line2}</p>
                <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>
              <div></div>
              <div className='flex flex-col justify-end'>
                {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 mb-2 py-2 border rounded border-gray-400 text-stone-500 bg-indigo-50'>Paid</button>}
                {!item.cancelled && !item.payment &&  !item.isCompleted && <button onClick={() => appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border border-gray-400 rounded mb-2 hover:bg-[#5f6fff] hover:text-white transition-all duration-300'>Pay Online</button>}
                {!item.cancelled &&  !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border border-gray-400 rounded mb-2 hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
                {item.cancelled &&  !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-400 rounded text-red-500'>Appointment cancelled</button>}
                {item.isCompleted && <button className='sm:min-w-48 py-2 border rounded border-green-500 text-green-500'>Appointment Completed</button>}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default MyAppointments;
