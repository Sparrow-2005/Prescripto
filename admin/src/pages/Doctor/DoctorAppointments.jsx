import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    let interval;

    if (dToken) {
      getAppointments(); // Initial fetch

      interval = setInterval(() => {
        getAppointments(); // Poll every 5 seconds
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dToken]);

  const filterAppointmentsFromToday = (appointments) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments.filter(({ slotDate }) => {
      const [day, month, year] = slotDate.split('_').map(Number);
      const appointmentDate = new Date(year, month - 1, day);
      return appointmentDate >= today;
    });
  };

  const filteredAppointments = filterAppointmentsFromToday(appointments);

  const handleCompleteAppointment = (appointmentId, docId) => {
    completeAppointment(appointmentId, docId);
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-2xl text-gray-500">
        All <span className="text-gray-700 font-semibold">Appointments</span>
        <span className="text-sm text-gray-400 ml-2">
          (From today onwards - {filteredAppointments.length} appointments)
        </span>
      </p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b border-gray-400">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No appointments from today onwards
          </div>
        ) : (
          filteredAppointments.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b border-gray-300 hover:bg-gray-200"
            >
              <p className="max-sm:hidden">{index + 1}</p>
              <div className="flex items-center gap-2">
                <img className="w-8 rounded-full" src={item.userData.image} alt="" />
                <p>{item.userData.name}</p>
              </div>
              <div>
                <p className="text-xs inline border border-[#5F6FFF] px-2 rounded-full">
                  {item.payment ? "Online" : "Cash"}
                </p>
              </div>
              <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <p>{currency}{item.amount}</p>

              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">Completed</p>
              ) : (
                <div className="flex">
                  <img
                    onClick={() => cancelAppointment(item._id, item.docId)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
                  <img
                    onClick={() => handleCompleteAppointment(item._id, item.docId)}
                    className="w-10 cursor-pointer"
                    src={assets.tick_icon}
                    alt="Complete"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;