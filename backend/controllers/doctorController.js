import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const docData = await doctorModel.findById(doctorId);
    await doctorModel.findByIdAndUpdate(doctorId, {
      available: !docData.available,
    });
    res.json({
      success: true,
      message: "Doctor availability changed successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
//API For doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({
        success: true,
        token,
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
//API to get doctor appointments for a doctor
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.user.userId;
    const appointments = await appointmentModel.find({ docId });
    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
//API to mark apppointment as completed for doctor panel
const appointmentCompleted = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      // Validate appointment datetime before marking as completed
      const [day, month, year] = appointmentData.slotDate
        .split("_")
        .map(Number);
      const [hour, minute] = appointmentData.slotTime.split(":").map(Number);

      // Create appointment datetime
      const appointmentDateTime = new Date(year, month - 1, day, hour, minute);
      const now = new Date();

      // Check if current time is before appointment time
      if (now < appointmentDateTime) {
        return res.json({
          success: false,
          message:
            "Cannot mark appointment as completed before the scheduled time!",
        });
      }

      // If validation passes, mark as completed
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });

      res.json({
        success: true,
        message: "Appointment completed",
      });
    } else {
      res.json({
        success: false,
        message: "Marked Failed",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
//API to cancel appointement for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      res.json({
        success: true,
        message: "Appointment cancelled",
      });
    } else {
      res.json({
        success: false,
        message: "Cancellation Failed",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
//API to get doctor dashboard data
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.user.userId;
    const appointments = await appointmentModel.find({ docId });
    let earning = 0;
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earning += item.amount;
      }
    });
    let patients = [];
    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });
    const dashData = {
      earning,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    res.json({
      success: true,
      dashData,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
//API to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
  try {
    const docId = req.user.userId;
    const profileData = await doctorModel.findById(docId).select("-password");
    res.json({
      success: true,
      profileData,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
//API to update doctor profile data from doctor panel
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.user.userId;
    const { fees, address, available } = req.body;
    await doctorModel.findByIdAndUpdate(docId, {
      fees,
      address,
      available,
    });
    res.json({
      success: true,
      message: "Profile updated",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentCompleted,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
};
