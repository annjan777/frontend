// components/CampaignDetails.js
import React from "react";

const CampaignDetails = ({ campaigns, formData, handleFormChange }) => {
  return (
    <div className="white-box">
      <h2>Campaign Details</h2>
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="campaign-row">
          <h3>
            {campaign.id}. {campaign.name}
          </h3>
          <div className="campaign-inputs">
            <input
              type="number"
              min="0"
              placeholder="Quantity"
              value={formData.campaignsData[campaign.id]?.quantity || ""}
              onChange={(e) => handleFormChange(e, campaign.id, "quantity")}
            />
            <input
              type="number"
              min="0"
              placeholder="Amount"
              value={formData.campaignsData[campaign.id]?.amount || ""}
              onChange={(e) => handleFormChange(e, campaign.id, "amount")}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampaignDetails;
