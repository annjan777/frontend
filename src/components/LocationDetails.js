// components/LocationDetails.js
import React from "react";
import Select from "react-select";

const LocationDetails = ({
  formData,
  setFormData,
  states,
  districtOptions,
  villageOptions,
  handleStateChange,
  handleDistrictChange,
  handleVillageChange,
  handleCustomVillageChange,
}) => {
  const months = [
    "January '25", "February '25", "March '25", "April '25", "May '25", "June '25", "July '25", "August '25", "September '25", "October '25", "November '25", "December '24",
  ];

  return (
    <div className="white-box">
      <h2>Location Details</h2>

      <label>Month</label>
      <select
        value={formData.month}
        onChange={(e) => setFormData({ ...formData, month: e.target.value })}
        required
      >
        <option value="">Select a month</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>

      <label>State</label>
      <select value={formData.state} onChange={handleStateChange} required>
        <option value="">Select a state</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state.charAt(0).toUpperCase() + state.slice(1)}
          </option>
        ))}
      </select>

      <label>District</label>
      <div className="select-container">
        <Select
          options={districtOptions}
          onChange={handleDistrictChange}
          placeholder="Select a district"
          isSearchable
          value={districtOptions.find(
            (option) => option.value === formData.district
          )}
          required
        />
      </div>

      <label>Village/Zone</label>
      <div className="select-container">
        <Select
          options={villageOptions}
          onChange={handleVillageChange}
          placeholder="Select a village"
          isSearchable
          value={villageOptions.find(
            (option) => option.value === formData.village
          )}
          required
        />
      </div>
      {formData.village === "other" && (
        <div>
          <label>Enter Custom Village</label>
          <input
            type="text"
            value={formData.customVillage}
            onChange={handleCustomVillageChange}
            placeholder="Enter a custom village name"
            required
          />
        </div>
      )}

      <label>Block</label>
      <input
        type="text"
        value={formData.block}
        onChange={(e) => setFormData({ ...formData, block: e.target.value })}
        required
      />
    </div>
  );
};

export default LocationDetails;
