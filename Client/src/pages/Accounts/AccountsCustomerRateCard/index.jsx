import React, { useState } from "react";
import "./index.css";

export const DEFAULT_CUSTOMER_RATE_CARD = {
  level1: {
    levelName: "GL1 (Level 1 Billing)",
    hourlyRate: 35.0,
    weeklyRate: 1330,
    mealBreakRate: 48,
    publicHolidayRate: 85,
  },
  level2: {
    levelName: "GL2 (Level 2 Billing)",
    hourlyRate: 42.0,
    weeklyRate: 1596,
    mealBreakRate: 58,
    publicHolidayRate: 102,
  },
  level3: {
    levelName: "GL3 (Level 3 Billing)",
    hourlyRate: 50.0,
    weeklyRate: 1900,
    mealBreakRate: 68,
    publicHolidayRate: 120,
  },
};

function AccountsCustomerRateCard() {
  const [rateCard, setRateCard] = useState(() => {
    const saved = localStorage.getItem("accountsCustomerRateCard");
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMER_RATE_CARD;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleInputChange = (levelKey, fieldKey, val) => {
    const numVal = parseFloat(val) || 0;
    setRateCard((prev) => ({
      ...prev,
      [levelKey]: {
        ...prev[levelKey],
        [fieldKey]: numVal,
      },
    }));
    setSavedSuccess(false);
  };

  const handleSave = () => {
    localStorage.setItem("accountsCustomerRateCard", JSON.stringify(rateCard));
    window.dispatchEvent(new Event("accountsCustomerRateCardUpdated"));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset all GL1, GL2, GL3 customer billing rates to default values?")) {
      setRateCard(DEFAULT_CUSTOMER_RATE_CARD);
      localStorage.setItem("accountsCustomerRateCard", JSON.stringify(DEFAULT_CUSTOMER_RATE_CARD));
      window.dispatchEvent(new Event("accountsCustomerRateCardUpdated"));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(val || 0);

  return (
    <div className="rateCardContainer">
      <div className="rateCardHeader">
        <div>
          <h2>💳 Customer Billing Rate Card (GL1, GL2, GL3)</h2>
          <p className="rateCardSubtext">
            Configure customer billing rates, weekly rates, meal break rates, and public holiday billing rates for GL1, GL2, and GL3 service placements.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button className="resetBtn" onClick={handleResetDefaults}>
            ↺ Reset Defaults
          </button>
          <button className="saveRateCardBtn" onClick={handleSave}>
            💾 Save Customer Rate Card
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="rateCardAlertSuccess">
          ✓ Customer Rate Card Saved Successfully! Customer Billing rates have been updated.
        </div>
      )}

      {/* RATE CARDS GRID */}
      <div className="rateCardGrid">
        {/* GL1 CARD */}
        <div className="levelCard">
          <div className="levelCardHeader level1Header">
            <span className="levelBadge">GL1</span>
            <h3>GL1 Customer Billing (Level 1)</h3>
          </div>

          <div className="levelCardBody">
            <div className="rateInputGroup">
              <label>Hourly Billing Rate ($/hr):</label>
              <div className="inputCurrencyWrap">
                <span>$</span>
                <input
                  type="number"
                  step="0.1"
                  value={rateCard.level1.hourlyRate}
                  onChange={(e) =>
                    handleInputChange("level1", "hourlyRate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="rateInputGroup">
              <label>Weekly Billing Rate ($/wk):</label>
              <div className="inputCurrencyWrap">
                <span>$</span>
                <input
                  type="number"
                  step="1"
                  value={rateCard.level1.weeklyRate}
                  onChange={(e) =>
                    handleInputChange("level1", "weeklyRate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="rateInputGroup">
              <label>Working in Meal Break Billing Rate ($/hr):</label>
              <div className="inputCurrencyWrap">
                <span>$</span>
                <input
                  type="number"
                  step="0.5"
                  value={rateCard.level1.mealBreakRate}
                  onChange={(e) =>
                    handleInputChange("level1", "mealBreakRate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="rateInputGroup">
              <label>Public Holiday Billing Rate ($/hr):</label>
              <div className="inputCurrencyWrap">
                <span>$</span>
                <input
                  type="number"
                  step="0.5"
                  value={rateCard.level1.publicHolidayRate}
                  onChange={(e) =>
                    handleInputChange("level1", "publicHolidayRate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="levelSummaryBox">
              <span>GL1 Customer Hourly Rate:</span>
              <strong className="greenText">{formatCurrency(rateCard.level1.hourlyRate)} / hr</strong>
            </div>
          </div>
        </div>

        {/* GL2 CARD */}
        <div className="levelCard">
          <div className="levelCardHeader level2Header">
            <span className="levelBadge">GL2</span>
            <h3>GL2 Customer Billing (Level 2)</h3>
          </div>

          <div className="levelCardBody">
            <div className="rateInputGroup">
              <label>Hourly Billing Rate ($/hr):</label>
              <div className="inputCurrencyWrap">
                <span>$</span>
                <input
                  type="number"
                  step="0.1"
                  value={rateCard.level2.hourlyRate}
                  onChange={(e) =>
                    handleInputChange("level2", "hourlyRate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="rateInputGroup">
              <label>Weekly Billing Rate ($/wk):</label>
              <div className="inputCurrencyWrap">
                <span>$</span>
                <input
                  type="number"
                  step="1"
                  value={rateCard.level2.weeklyRate}
                  onChange={(e) =>
                    handleInputChange("level2", "weeklyRate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="rateInputGroup">
              <label>Working in Meal Break Billing Rate ($/hr):</label>
              <div className="inputCurrencyWrap">
                <span>$</span>
                <input
                  type="number"
                  step="0.5"
                  value={rateCard.level2.mealBreakRate}
                  onChange={(e) =>
                    handleInputChange("level2", "mealBreakRate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="rateInputGroup">
              <label>Public Holiday Billing Rate ($/hr):</label>
              <div className="inputCurrencyWrap">
                <span>$</span>
                <input
                  type="number"
                  step="0.5"
                  value={rateCard.level2.publicHolidayRate}
                  onChange={(e) =>
                    handleInputChange("level2", "publicHolidayRate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="levelSummaryBox">
              <span>GL2 Customer Hourly Rate:</span>
              <strong className="greenText">{formatCurrency(rateCard.level2.hourlyRate)} / hr</strong>
            </div>
          </div>
        </div>

        {/* GL3 CARD */}
        <div className="levelCard">
          <div className="levelCardHeader level3Header">
            <span className="levelBadge">GL3</span>
            <h3>GL3 Customer Billing (Level 3)</h3>
          </div>

          <div className="levelCardBody">
            <div className="rateInputGroup">
              <label>Hourly Billing Rate ($/hr):</label>
              <div className="inputCurrencyWrap">
                <span>$</span>
                <input
                  type="number"
                  step="0.1"
                  value={rateCard.level3.hourlyRate}
                  onChange={(e) =>
                    handleInputChange("level3", "hourlyRate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="rateInputGroup">
              <label>Weekly Billing Rate ($/wk):</label>
              <div className="inputCurrencyWrap">
                <span>$</span>
                <input
                  type="number"
                  step="1"
                  value={rateCard.level3.weeklyRate}
                  onChange={(e) =>
                    handleInputChange("level3", "weeklyRate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="rateInputGroup">
              <label>Working in Meal Break Billing Rate ($/hr):</label>
              <div className="inputCurrencyWrap">
                <span>$</span>
                <input
                  type="number"
                  step="0.5"
                  value={rateCard.level3.mealBreakRate}
                  onChange={(e) =>
                    handleInputChange("level3", "mealBreakRate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="rateInputGroup">
              <label>Public Holiday Billing Rate ($/hr):</label>
              <div className="inputCurrencyWrap">
                <span>$</span>
                <input
                  type="number"
                  step="0.5"
                  value={rateCard.level3.publicHolidayRate}
                  onChange={(e) =>
                    handleInputChange("level3", "publicHolidayRate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="levelSummaryBox">
              <span>GL3 Customer Hourly Rate:</span>
              <strong className="greenText">{formatCurrency(rateCard.level3.hourlyRate)} / hr</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountsCustomerRateCard;
