import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData, backendUrl } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: editData.address,
        fees: editData.fees,
        available: editData.available,
      };

      const { data } = await axios.post(
        backendUrl + "/api/doctors/update-profile",
        updateData,
        { headers: { Authorization: dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  useEffect(() => {
    let interval;

    if (dToken) {
      getProfileData(); // Initial fetch
      interval = setInterval(() => {
        getProfileData(); // Poll every 5 seconds
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dToken]);

  useEffect(() => {
    // Initialize editData from profileData when it's loaded
    if (profileData) {
      setEditData({ ...profileData });
    }
  }, [profileData]);

  if (!profileData || !profileData.address || !editData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <div className="fkex flex-col gap-4 m-5">
        <div className="mb-2">
          <img
            className="bg-[#5F6FFF]/80 w-full sm:max-w-64 rounded-lg"
            src={profileData.image}
            alt=""
          />
        </div>
        <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {profileData.name}
          </p>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>
              {profileData.degree} - {profileData.speciality}
            </p>
            <button className="mt-1 py-0.5 px-2 text-xs rounded-full border border-[#5F6FFF]">
              {profileData.experience}
            </button>
          </div>
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
              About:
            </p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">
              {profileData.about}
            </p>
          </div>

          <p className="text-gray-600 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-800">
              {currency}{" "}
              {isEdit ? (
                <input
                  type="number"
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      fees: e.target.value,
                    }))
                  }
                  value={editData.fees}
                />
              ) : (
                profileData.fees
              )}
            </span>
          </p>

          <div className="flex gap-2 py-2">
            <p>Address:</p>
            <p className="text-sm">
              {isEdit ? (
                <input
                  type="text"
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  value={editData.address.line1}
                />
              ) : (
                profileData.address.line1
              )}
              <br />
              {isEdit ? (
                <input
                  type="text"
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  value={editData.address.line2}
                />
              ) : (
                profileData.address.line2
              )}
            </p>
          </div>

          <div className="flex gap-1 pt-2">
            <input
              onChange={() =>
                isEdit &&
                setEditData((prev) => ({
                  ...prev,
                  available: !prev.available,
                }))
              }
              checked={editData.available}
              type="checkbox"
              name=""
              id=""
            />
            <label htmlFor="">Available</label>
          </div>

          {isEdit ? (
            <button
              onClick={updateProfile}
              className="px-4 py-1 border border-[#5F6FFF] text-sm rounded-full mt-5 hover:bg-[#5F6FFF] hover:text-white transition-all"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-4 py-1 border border-[#5F6FFF] text-sm rounded-full mt-5 hover:bg-[#5F6FFF] hover:text-white transition-all"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
