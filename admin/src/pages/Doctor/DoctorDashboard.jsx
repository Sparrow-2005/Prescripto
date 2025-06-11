import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
  const { dToken, dashData, setDashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext);
  const { slotDateFormat, currency } = useContext(AppContext);

  const handleCompleteAppointment = (appointmentId, docId) => {
    completeAppointment(appointmentId, docId);
  };

  const filterAppointmentsFromToday = (appointments) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments.filter(({ slotDate }) => {
      const [day, month, year] = slotDate.split('_').map(Number);
      const appointmentDate = new Date(year, month - 1, day);
      return appointmentDate >= today;
    });
  };

  useEffect(() => {
    let interval;

    if (dToken) {
      getDashData(); // Initial fetch

      interval = setInterval(() => {
        getDashData(); // Fetch every 5 seconds
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dToken]);

  const filteredAppointments = dashData?.latestAppointments
    ? filterAppointmentsFromToday(dashData.latestAppointments)
    : [];

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {currency} {dashData.earning}
              </p>
              <p className="text-gray-400">Earnings</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">
              Latest Bookings (From today onwards - {filteredAppointments.length})
            </p>
          </div>

          <div className="pt-4 border border-t-0">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No appointments from today onwards
              </div>
            ) : (
              filteredAppointments.map((item, index) => (
                <div
                  className="flex items-center px-6 py-3 gap-3 hover:bg-gray-200"
                  key={index}
                >
                  <img
                    className="rounded-full w-10"
                    src={item.userData.image}
                    alt=""
                  />
                  <div className="flex-1 text-sm">
                    <p className="text-gray-800 font-medium">
                      {item.userData.name}
                    </p>
                    <p className="text-gray-600">
                      {slotDateFormat(item.slotDate)}, {item.slotTime}
                    </p>
                  </div>

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
      </div>
    )
  );
};

export default DoctorDashboard;