import React, { useState, useEffect } from "react";
import "./index.css";

export const DEFAULT_RATE_CARD = {
  level1: {
    levelName: "GL1 (Level 1)",
    hourlyRate: 26.5,
    weeklyRate: 1004,
    mealBreakRate: 36,
    publicHolidayRate: 64,
  },
  level2: {
    levelName: "GL2 (Level 2)",
    hourlyRate: 30,
    weeklyRate: 1140,
    mealBreakRate: 42,
    publicHolidayRate: 75,
  },
  level3: {
    levelName: "GL3 (Level 3)",
    hourlyRate: 35,
    weeklyRate: 1330,
    mealBreakRate: 48,
    publicHolidayRate: 88,
  },
};

function AccountsRateCard() {
  const [rateCard, setRateCard] = useState(() => {
    const saved = localStorage.getItem("accountsRateCard");
    return saved ? JSON.parse(saved) : DEFAULT_RATE_CARD;
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
    localStorage.setItem("accountsRateCard", JSON.stringify(rateCard));
    // Dispatch custom storage event so other components update immediately
    window.dispatchEvent(new Event("accountsRateCardUpdated"));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset all GL1, GL2, GL3 rates to default values?")) {
      setRateCard(DEFAULT_RATE_CARD);
      localStorage.setItem("accountsRateCard", JSON.stringify(DEFAULT_RATE_CARD));
      window.dispatchEvent(new Event("accountsRateCardUpdated"));
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
          <h2>🏷️ Accounts Rate Card (GL1, GL2, GL3)</h2>
          <p className="rateCardSubtext">
            Configure hourly rates, weekly rates, meal break rates, and public holiday rates for GL1, GL2, and GL3 positions. Rates dynamically sync with PayRun calculations.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button className="resetBtn" onClick={handleResetDefaults}>
            ↺ Reset Defaults
          </button>
          <button className="saveRateCardBtn" onClick={handleSave}>
            💾 Save Rate Card
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="rateCardAlertSuccess">
          ✓ Rate Card Saved Successfully! All PayRun calculations for GL1, GL2, GL3 & backend rates have been updated.
        </div>
      )}

      {/* RATE CARDS GRID */}
      <div className="rateCardGrid">
        {/* GL1 CARD */}
        <div className="levelCard">
          <div className="levelCardHeader level1Header">
            <span className="levelBadge">GL1</span>
            <h3>GL1 Position (Level 1)</h3>
          </div>

          <div className="levelCardBody">
            <div className="rateInputGroup">
              <label>Hourly Rate ($/hr):</label>
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
              <label>Weekly Rate ($/wk):</label>
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
              <label>Working in Meal Break Rate ($/hr):</label>
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
              <label>Public Holiday Rate ($/hr):</label>
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
              <span>GL1 PayRun Hourly Rate:</span>
              <strong className="greenText">{formatCurrency(rateCard.level1.hourlyRate)} / hr</strong>
            </div>
          </div>
        </div>

        {/* GL2 CARD */}
        <div className="levelCard">
          <div className="levelCardHeader level2Header">
            <span className="levelBadge">GL2</span>
            <h3>GL2 Position (Level 2)</h3>
          </div>

          <div className="levelCardBody">
            <div className="rateInputGroup">
              <label>Hourly Rate ($/hr):</label>
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
              <label>Weekly Rate ($/wk):</label>
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
              <label>Working in Meal Break Rate ($/hr):</label>
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
              <label>Public Holiday Rate ($/hr):</label>
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
              <span>GL2 PayRun Hourly Rate:</span>
              <strong className="greenText">{formatCurrency(rateCard.level2.hourlyRate)} / hr</strong>
            </div>
          </div>
        </div>

        {/* GL3 CARD */}
        <div className="levelCard">
          <div className="levelCardHeader level3Header">
            <span className="levelBadge">GL3</span>
            <h3>GL3 Position (Level 3)</h3>
          </div>

          <div className="levelCardBody">
            <div className="rateInputGroup">
              <label>Hourly Rate ($/hr):</label>
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
              <label>Weekly Rate ($/wk):</label>
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
              <label>Working in Meal Break Rate ($/hr):</label>
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
              <label>Public Holiday Rate ($/hr):</label>
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
              <span>GL3 PayRun Hourly Rate:</span>
              <strong className="greenText">{formatCurrency(rateCard.level3.hourlyRate)} / hr</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountsRateCard;
