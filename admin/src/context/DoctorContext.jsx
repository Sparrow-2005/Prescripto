import { createContext } from "react";
import { useState } from "react";
import {toast} from "react-toastify";
import axios from "axios";

export const DoctorContext = createContext();

const DoctorContextProvider=(props)=>{
    const backendUrl=import.meta.env.VITE_BACKEND_URL;
    const [dToken, setDToken] = useState(localStorage.getItem("dToken") ? localStorage.getItem("dToken") : "");
    const [appointments, setAppointments] = useState([]);
    const [docId, setDocId] = useState(""); // Add docId state
    const [dashData, setDashData] = useState(false);
    const [profileData, setProfileData] = useState(false);
    
    const getAppointments = async () => {
        try {
            const {data}=await axios.get(backendUrl+'/api/doctors/appointments',{headers: { Authorization: dToken }});
            if (data.success) {
                setAppointments(data.appointments.reverse());
                console.log(data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }        
    
    //function to mark appointment as completed
    const completeAppointment = async (appointmentId, docId) => {
        try {
            // Send both appointmentId and docId
            const {data}=await axios.post(backendUrl+'/api/doctors/complete-appointment',{
                appointmentId,
                docId
            },{headers: { Authorization: dToken }});
            
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }
    
    //function to mark appointment as cancelled
    const cancelAppointment = async (appointmentId, docId) => {
        try {
            // Send both appointmentId and docId
            const {data}=await axios.post(backendUrl+'/api/doctors/cancel-appointment',{
                appointmentId,
                docId
            },{headers: { Authorization: dToken }});
            
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }
    const getDashData = async () => {
        try {
            const {data}=await axios.get(backendUrl+'/api/doctors/dashboard',{headers: { Authorization: dToken }});
            if (data.success) {
                setDashData(data.dashData);
                console.log(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            
        }
    }
    const getProfileData = async () => {
        try {
            const {data}=await axios.get(backendUrl+'/api/doctors/profile',{headers: { Authorization: dToken }});
            if (data.success) {
                setProfileData(data.profileData);
                console.log(data.profileData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }
    const value={
        dToken,
        setDToken,
        backendUrl,
        appointments,
        setAppointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,
        docId,
        setDocId,
        getDashData,
        dashData,
        setDashData,
        profileData,
        setProfileData,
        getProfileData
    }
    
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider;