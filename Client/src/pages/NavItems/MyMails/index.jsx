import React, { useState } from "react";
import MyMailsNavBar from "./MyMailsNavBar";
import { useAuth } from "../../../context/AuthContext";
import "./index.css";

function MyMails() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const currentUserName = user?.username || "User";

  const handleComposeSend = (e) => {
    e.preventDefault();
    if (!composeData.to || !composeData.subject) {
      alert("Please fill in recipient and subject.");
      return;
    }
    alert(`Mail sent successfully to ${composeData.to}!`);
    setComposeData({ to: "", subject: "", message: "" });
    setShowComposeModal(false);
  };

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
            ✏️ Compose Mail
          </button>

          <div className="myMailsNavList">
            <button
              className={`mailNavTab ${activeTab === "inbox" ? "active" : ""}`}
              onClick={() => setActiveTab("inbox")}
            >
              📥 Inbox <span className="mailBadge">0</span>
            </button>
            <button
              className={`mailNavTab ${activeTab === "sent" ? "active" : ""}`}
              onClick={() => setActiveTab("sent")}
            >
              📤 Sent Items
            </button>
            <button
              className={`mailNavTab ${activeTab === "drafts" ? "active" : ""}`}
              onClick={() => setActiveTab("drafts")}
            >
              📝 Drafts
            </button>
          </div>

          <div className="userMailboxInfo">
            <p className="mailboxUserLabel">Mailbox Portal for:</p>
            <p className="mailboxUserName">👤 {currentUserName}</p>
          </div>
        </div>

        {/* MAIN MAILBOX CONTENT AREA */}
        <div className="myMailsMain">
          <div className="myMailsHeader">
            <h2>
              {activeTab === "inbox" && "📥 Inbox"}
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

          {/* MAIL LIST / EMPTY STATE */}
          <div className="mailListWrapper">
            <div className="emptyMailbox">
              <div className="emptyMailboxIcon">📬</div>
              <h3>No mails found for {currentUserName}</h3>
              <p>Your inbox is empty. Incoming messages and notifications will appear here.</p>
            </div>
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
                  placeholder="Recipient email or display name..."
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