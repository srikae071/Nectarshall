import React, { useState, useEffect } from "react";
import MyMailsNavBar from "./MyMailsNavBar";
import { useAuth } from "../../../context/AuthContext";
import { getMailsForUser, sendMailNotification } from "../../../utils/mailService";
import "./index.css";

function MyMails() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const [userMails, setUserMails] = useState([]);
  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const currentUserName = user?.username || "User";
  const currentUserEmail = user?.email || `${currentUserName.toLowerCase().replace(/\s+/g, "")}@gmail.com`;

  useEffect(() => {
    loadUserMails();
  }, [currentUserName, currentUserEmail]);

  const loadUserMails = () => {
    const fetched = getMailsForUser(currentUserName) || [];
    setUserMails(fetched);
  };

  const handleComposeSend = (e) => {
    e.preventDefault();
    if (!composeData.to || !composeData.subject) {
      alert("Please fill in recipient and subject.");
      return;
    }

    sendMailNotification({
      to: composeData.to,
      from: currentUserEmail,
      fromName: currentUserName,
      subject: composeData.subject,
      body: composeData.message,
      type: "User Email",
    });

    alert(`Mail sent successfully to ${composeData.to}!`);
    setComposeData({ to: "", subject: "", message: "" });
    setShowComposeModal(false);
    loadUserMails();
  };

  const filteredMails = userMails.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (m.subject || "").toLowerCase().includes(q) ||
      (m.from || "").toLowerCase().includes(q) ||
      (m.fromName || "").toLowerCase().includes(q) ||
      (m.body || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="myMailsPage">
      <MyMailsNavBar />

      <div className="myMailsContainer">
        {/* SIDEBAR NAVIGATION */}
        <div className="myMailsSidebar">
          <button
            className="composeBtn"
            onClick={() => setShowComposeModal(true)}
          >
            Compose Mail
          </button>

          <div className="myMailsNavList">
            <button
              className={`mailNavTab ${activeTab === "inbox" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("inbox");
                setSelectedMail(null);
              }}
            >
              Inbox <span className="mailBadge">{userMails.length}</span>
            </button>
            <button
              className={`mailNavTab ${activeTab === "sent" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("sent");
                setSelectedMail(null);
              }}
            >
              Sent Items
            </button>
            <button
              className={`mailNavTab ${activeTab === "drafts" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("drafts");
                setSelectedMail(null);
              }}
            >
              Drafts
            </button>
          </div>

          <div className="userMailboxInfo">
            <p className="mailboxUserLabel">Mailbox Portal for:</p>
            <p className="mailboxUserName">{currentUserName}</p>
            <p className="mailboxUserEmail" style={{ fontSize: "11px", color: "#64748b", margin: "2px 0 0 0" }}>
              {currentUserEmail}
            </p>
          </div>
        </div>

        {/* MAIN MAILBOX CONTENT AREA */}
        <div className="myMailsMain">
          <div className="myMailsHeader">
            <h2>
              {activeTab === "inbox" && `📥 Inbox (${userMails.length})`}
              {activeTab === "sent" && "📤 Sent Mails"}
              {activeTab === "drafts" && "📝 Drafts"}
            </h2>

            <div className="mailSearchWrapper">
              <input
                type="text"
                placeholder="Search mails by subject or sender..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mailSearchInput"
              />
            </div>
          </div>

          {/* MAIL DETAIL VIEW OR MAIL LIST */}
          <div className="mailListWrapper">
            {selectedMail ? (
              <div className="mailDetailCard" style={{ padding: "20px", width: "100%" }}>
                <button
                  className="backToMailsBtn"
                  onClick={() => setSelectedMail(null)}
                  style={{ marginBottom: "15px", padding: "6px 14px", background: "#1e293b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
                >
                  ← Back to Inbox
                </button>
                <div style={{ borderBottom: "1.5px solid #cbd5e1", paddingBottom: "12px", marginBottom: "16px" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", color: "#0f172a" }}>{selectedMail.subject}</h3>
                  <div style={{ fontSize: "13px", color: "#475569", display: "flex", justifyContent: "space-between" }}>
                    <span><strong>From:</strong> {selectedMail.fromName || selectedMail.from} ({selectedMail.from})</span>
                    <span>{new Date(selectedMail.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#475569", marginTop: "4px" }}>
                    <span><strong>To:</strong> {selectedMail.toName || selectedMail.to}</span>
                  </div>
                </div>
                <div style={{ fontSize: "14px", color: "#334155", whiteSpace: "pre-wrap", lineHeight: "1.6", minHeight: "150px" }}>
                  {selectedMail.body}
                </div>
              </div>
            ) : filteredMails.length === 0 ? (
              <div className="emptyMailbox">
                <div className="emptyMailboxIcon">📬</div>
                <h3>No mails found for {currentUserName}</h3>
                <p>Your inbox is empty. Incoming leave notifications and emails will appear here.</p>
              </div>
            ) : (
              <div className="mailItemsList" style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                {filteredMails.map((mail) => (
                  <div
                    key={mail.id}
                    className="mailItemCard"
                    onClick={() => setSelectedMail(mail)}
                    style={{
                      padding: "14px 18px",
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.2s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontWeight: "700", color: "#0f172a", fontSize: "14px" }}>
                          ✉️ {mail.fromName || mail.from}
                        </span>
                        <span style={{ fontSize: "11px", background: "#e2e8f0", padding: "2px 8px", borderRadius: "10px", fontWeight: "600", color: "#475569" }}>
                          {mail.type || "Notification"}
                        </span>
                      </div>
                      <div style={{ fontWeight: "600", color: "#008075", fontSize: "13.5px" }}>
                        {mail.subject}
                      </div>
                      <div style={{ fontSize: "12.5px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "600px" }}>
                        {mail.body}
                      </div>
                    </div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500", marginLeft: "15px" }}>
                      {new Date(mail.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COMPOSE MAIL MODAL */}
      {showComposeModal && (
        <div className="composeModalOverlay">
          <div className="composeModalCard">
            <div className="composeModalHeader">
              <h3>New Message</h3>
              <button
                className="closeModalBtn"
                onClick={() => setShowComposeModal(false)}
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleComposeSend} className="composeForm">
              <div className="composeField">
                <label>To:</label>
                <input
                  type="email"
                  placeholder="Recipient email (e.g. sumit@gmail.com, srikar@gmail.com)..."
                  value={composeData.to}
                  onChange={(e) =>
                    setComposeData({ ...composeData, to: e.target.value })
                  }
                  required
                />
              </div>

              <div className="composeField">
                <label>Subject:</label>
                <input
                  type="text"
                  placeholder="Subject..."
                  value={composeData.subject}
                  onChange={(e) =>
                    setComposeData({ ...composeData, subject: e.target.value })
                  }
                  required
                />
              </div>

              <div className="composeField">
                <textarea
                  rows={8}
                  placeholder="Write your email message here..."
                  value={composeData.message}
                  onChange={(e) =>
                    setComposeData({ ...composeData, message: e.target.value })
                  }
                />
              </div>

              <div className="composeActions">
                <button type="submit" className="sendMailBtn">
                  Send
                </button>
                <button
                  type="button"
                  className="cancelMailBtn"
                  onClick={() => setShowComposeModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyMails;