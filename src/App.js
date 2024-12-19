import React, { useState, useEffect } from 'react';
import axios from 'axios';
import campaigns from './campaigns';
import statesDistricts from './statesDistricts.json';
import './App.css';
import Login from './components/Login';
import AdminPage from './components/AdminPage';
import LocationDetails from './components/LocationDetails';
import CampaignDetails from './components/CampaignDetails';
import './components/login.css';

const App = () => {
  const [formData, setFormData] = useState({
    month: '',
    state: '',
    district: '',
    village: '',
    customVillage: '',
    block: '',
    campaignsData: {},
  });

  const [states, setStates] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const uniqueStates = [
      ...new Set(statesDistricts.map((item) => item.STATE.toLowerCase())),
    ];
    setStates(uniqueStates.sort());

    const initialCampaignsData = {};
    campaigns.forEach((campaign) => {
      initialCampaignsData[campaign.id] = { quantity: '', amount: '' };
    });
    setFormData((prev) => ({ ...prev, campaignsData: initialCampaignsData }));

    // Check if user is already logged in from localStorage
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
      setIsLoggedIn(true);
      const userRole = JSON.parse(localStorage.getItem('user'))?.role;
      if (userRole) {
        setIsAdmin(userRole === 'admin');
      }
    }
  }, []);

  const handleStateChange = (e) => {
    const selectedState = e.target.value.toLowerCase();
    setFormData({ ...formData, state: selectedState, district: '', village: '' });

    const filteredDistricts = [
      ...new Set(
        statesDistricts
          .filter((item) => item.STATE.toLowerCase() === selectedState)
          .map((item) => item.DISTRICT.toLowerCase())
      ),
    ].sort();

    const districtOptions = filteredDistricts.map((district) => ({
      value: district,
      label: district.charAt(0).toUpperCase() + district.slice(1),
    }));
    setDistrictOptions(districtOptions);
  };

  const handleDistrictChange = (selectedOption) => {
    const selectedDistrict = selectedOption.value;
    setFormData({ ...formData, district: selectedDistrict, village: '' });

    const filteredVillages = [
      ...new Set(
        statesDistricts
          .filter((item) => item.DISTRICT.toLowerCase() === selectedDistrict)
          .map((item) => (typeof item.Village === 'string' ? item.Village.toLowerCase() : ''))
      ),
    ].sort();

    const villageOptions = filteredVillages.map((village) => ({
      value: village,
      label: village.charAt(0).toUpperCase() + village.slice(1),
    }));

    villageOptions.push({ value: 'other', label: 'Other' });
    setVillageOptions(villageOptions);
  };

  const handleVillageChange = (selectedOption) => {
    const selectedVillage = selectedOption.value;
    setFormData({ ...formData, village: selectedVillage, customVillage: '' });

    if (selectedVillage === 'other') {
      setFormData({ ...formData, village: 'other' });
    }
  };

  const handleCustomVillageChange = (e) => {
    setFormData({ ...formData, customVillage: e.target.value });
  };

  const handleFormChange = (e, campaignId, field) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      campaignsData: {
        ...prev.campaignsData,
        [campaignId]: {
          ...prev.campaignsData[campaignId],
          [field]: value !== '' ? value : prev.campaignsData[campaignId][field],
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData(formData);

    const contactNumber = localStorage.getItem('user_id'); // Retrieve user_id (contact number)
    const dataToSubmit = { ...formData, user_id: contactNumber }; // Use contact number as user_id
    setSubmittedData(dataToSubmit);
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    try {
      const dataToSubmit = { ...submittedData }; // Include form data with user_id (contact number)

      const response = await axios.put('http://65.1.92.135:8001/update', dataToSubmit); // Send data to backend
      alert(response.data.message);

      // Reset form after successful submission
      setFormData({
        month: '',
        state: '',
        district: '',
        village: '',
        customVillage: '',
        block: '',
        campaignsData: campaigns.reduce((acc, campaign) => {
          acc[campaign.id] = { quantity: '', amount: '' };
          return acc;
        }, {}),
      });
      setShowPopup(false);
    } catch (error) {
      console.error('Error updating the data:', error);
      alert('Failed to update the data.');
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const getFilteredData = (data) => {
    const filteredCampaigns = Object.entries(data.campaignsData || {}).filter(
      ([_, details]) => details.quantity || details.amount
    );

    return {
      ...data,
      campaignsData: Object.fromEntries(filteredCampaigns),
    };
  };

  const filteredData = submittedData ? getFilteredData(submittedData) : null;

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setIsAdmin(role === 'admin');
  };

  const handleLogout = () => {
    // Clear localStorage data
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <div className='container'>
      <div className="header">
        <h1>Service Campaign Form</h1>
        <h1>Year: 2025</h1>
        {isLoggedIn && <h3>Logged in as: {localStorage.getItem('user_id')}</h3>}
        {isLoggedIn && <button onClick={handleLogout}>Logout</button>} {/* Logout button at the top */}
      </div>

      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : isAdmin ? (
        <AdminPage />
      ) : (
        <form onSubmit={handleSubmit}>
          <LocationDetails
            formData={formData}
            setFormData={setFormData}
            states={states}
            districtOptions={districtOptions}
            villageOptions={villageOptions}
            handleStateChange={handleStateChange}
            handleDistrictChange={handleDistrictChange}
            handleVillageChange={handleVillageChange}
            handleCustomVillageChange={handleCustomVillageChange}
          />
          <CampaignDetails
            campaigns={campaigns}
            formData={formData}
            handleFormChange={handleFormChange}
          />
          <button type='submit'>Submit</button>
        </form>
      )}

      {showPopup && filteredData && (
        <div className='popup'>
          <div className='popup-content'>
            <h3>Confirm Submission</h3>

            <table border='1' cellPadding='5' style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <th>Month</th>
                  <td>{filteredData.month}</td>
                </tr>
                <tr>
                  <th>State</th>
                  <td>{filteredData.state}</td>
                </tr>
                <tr>
                  <th>District</th>
                  <td>{filteredData.district}</td>
                </tr>
                <tr>
                  <th>Village</th>
                  <td>
                    {filteredData.village === 'other'
                      ? filteredData.customVillage
                      : filteredData.village}
                  </td>
                </tr>
                <tr>
                  <th>Block</th>
                  <td>{filteredData.block}</td>
                </tr>
              </tbody>
            </table>

            <h3>Campaign Details</h3>
            <table border='1' cellPadding='5' style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Campaign Name</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(filteredData.campaignsData).map(([campaignId, details]) => {
                  const campaign = campaigns.find((c) => c.id === parseInt(campaignId));
                  const totalAmount = details.quantity * details.amount;
                  return (
                    <tr key={campaignId}>
                      <td>{campaign ? campaign.name : 'Unknown Campaign'}</td>
                      <td>{details.quantity}</td>
                      <td>{details.amount}</td>
                      <td>{totalAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{ textAlign: 'right', marginTop: '10px', fontSize: '18px' }}>
              <strong>Grand Total:</strong>{' '}
              {Object.entries(filteredData.campaignsData).reduce((total, [_, details]) => {
                const totalAmount = details.quantity * details.amount;
                return total + totalAmount;
              }, 0)}
            </div>

            <div className='popup-actions'>
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={handleCancel}>Edit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
