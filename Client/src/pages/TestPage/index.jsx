import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

function TestPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Active HUD Tab
  const [activeTab, setActiveTab] = useState("command"); // "command" | "tickets" | "mails" | "payroll" | "leave" | "settings"

  // Interactive Terminal State
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState([
    "> [00:00:01] INITIALIZING QUANTUM ACCOUNT CENTER CORE v9.4...",
    "> [00:00:02] ESTABLISHING ENCRYPTED SATELLITE HANDSHAKE... CONNECTED.",
    "> [00:00:03] SYNCHRONIZING HRMS LEAVE MANAGEMENT NODE... OK.",
    "> [00:00:04] QUANTUM PAYROLL LEDGER CHECK: 100% INTEGRITY MATCHED.",
    "> [00:00:05] SYSTEM READY :: COMMAND TERMINAL AWAITING DIRECTIVES...",
  ]);

  // Interactive Control States
  const [securityLevel, setSecurityLevel] = useState("MAXIMUM_OVERDRIVE");
  const [selectedBatch, setSelectedBatch] = useState("BATCH_A901");
  const [autoApproveLeaves, setAutoApproveLeaves] = useState(true);
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState("ALL");
  const [mailFilter, setMailFilter] = useState("INBOX");
  const [systemAlerts, setSystemAlerts] = useState([
    { id: 1, type: "CRITICAL", msg: "Unusual Traffic Burst on Node #7 - Defended", time: "10:42 AM" },
    { id: 2, type: "INFO", msg: "Weekly PayRun Automated Audit Completed", time: "10:30 AM" },
    { id: 3, type: "SUCCESS", msg: "Leave Management Node Synced with Central HR", time: "10:15 AM" },
  ]);

  // Real-time Clock
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Matrix Rain Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight || 600;
    };
    window.addEventListener("resize", handleResize);

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*<>{}[]~/\\";
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -100));

    const draw = () => {
      ctx.fillStyle = "rgba(5, 8, 17, 0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#00ff66";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = characters.charAt(Math.floor(Math.random() * characters.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Alternate colors for matrix aesthetic
        if (Math.random() > 0.95) {
          ctx.fillStyle = "#00f0ff";
        } else if (Math.random() > 0.9) {
          ctx.fillStyle = "#ffffff";
        } else {
          ctx.fillStyle = "#00ff66";
        }

        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Auto-scroll terminal log
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Terminal Command Handler
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    const timestamp = new Date().toLocaleTimeString();
    const newLogs = [...terminalLogs, `> [${timestamp}] USER_CMD: ${terminalInput}`];

    if (cmd === "help") {
      newLogs.push(
        "> AVAILABLE COMMANDS: help, status, payroll, leave, tickets, mails, override, clear, hack",
      );
    } else if (cmd === "status") {
      newLogs.push("> CORE STATUS: ALL SYSTEMS 100% OPERATIONAL. QUANTUM FIREWALL ACTIVE.");
    } else if (cmd === "payroll") {
      newLogs.push("> QUANTUM PAYROLL LEDGER: BATCH_A901 PROCESSED. TOTAL: $482,910.00 USD.");
    } else if (cmd === "leave") {
      newLogs.push("> LEAVE MANAGEMENT NODE: 3 ACTIVE REQUESTS (SUMIT: APPROVED, SHREEKAR: PENDING).");
    } else if (cmd === "tickets") {
      newLogs.push("> TICKETS MATRIX: 42 ACTIVE TICKETS | 7 CRITICAL DISPATCHES.");
    } else if (cmd === "mails") {
      newLogs.push("> SATELLITE COMMS: 12 ENCRYPTED MAILS IN BUFFER. ALL CIPHERS VERIFIED.");
    } else if (cmd === "hack") {
      newLogs.push("> ⚠️ HACK PROTOCOL ENGAGED... BYPASSING MAINFRAME... ACCESS GRANTED.");
    } else if (cmd === "override") {
      newLogs.push("> ⚡ SECURITY OVERDRIVE ACTIVATED :: ADMIN FULL ACCESS AUTHORIZED.");
    } else if (cmd === "clear") {
      setTerminalLogs([`> [${timestamp}] TERMINAL BUFFER FLUSHED.`]);
      setTerminalInput("");
      return;
    } else {
      newLogs.push(`> UNKNOWN DIRECTIVE: '${cmd}'. TYPE 'help' FOR LIST OF COMMANDS.`);
    }

    setTerminalLogs(newLogs);
    setTerminalInput("");
  };

  return (
    <div className="cyberContainer">
      {/* BACKGROUND MATRIX CANVAS */}
      <div className="matrixCanvasWrapper">
        <canvas ref={canvasRef} />
      </div>

      {/* SCANLINES OVERLAY */}
      <div className="scanlinesOverlay" />

      {/* TOP CYBER HUD HEADER */}
      <div className="cyberHeader">
        <div className="cyberLogoSection">
          <div className="cyberGlowBadge">⚡ CONTROL CENTER</div>
          <h2>QUANTUM COMMAND TERMINAL</h2>
          <span className="cyberSubtext">
            SYSTEM NODE: ACCOUNT_CENTER_X99 // CLASSIFIED ADMIN MATRIX
          </span>
        </div>

        <div className="cyberHeaderRight">
          <div className="cyberStatusIndicator">
            <span className="statusDotPulse" />
            <span style={{ color: "#00ff66", fontWeight: "700" }}>
              SECURITY OVERDRIVE: {securityLevel}
            </span>
          </div>
          <div className="cyberClockDisplay">🕒 {currentTime}</div>
          <button className="cyberExitBtn" onClick={() => navigate("/")}>
            ✖ EXIT COMMAND TERMINAL
          </button>
        </div>
      </div>

      {/* HUD NAVIGATION TABS */}
      <div className="cyberNavTabs">
        <button
          className={`cyberTabBtn ${activeTab === "command" ? "active" : ""}`}
          onClick={() => setActiveTab("command")}
        >
          ⚡ CENTRAL COMMAND
        </button>
        <button
          className={`cyberTabBtn ${activeTab === "tickets" ? "active" : ""}`}
          onClick={() => setActiveTab("tickets")}
        >
          📁 TASKS & TICKETS MATRIX
        </button>
        <button
          className={`cyberTabBtn ${activeTab === "mails" ? "active" : ""}`}
          onClick={() => setActiveTab("mails")}
        >
          ✉️ ENCRYPTED MAILS RELAY
        </button>
        <button
          className={`cyberTabBtn ${activeTab === "payroll" ? "active" : ""}`}
          onClick={() => setActiveTab("payroll")}
        >
          📊 PAYROLL QUANTUM TERMINAL
        </button>
        <button
          className={`cyberTabBtn ${activeTab === "leave" ? "active" : ""}`}
          onClick={() => setActiveTab("leave")}
        >
          🌴 LEAVE MANAGEMENT NODE
        </button>
        <button
          className={`cyberTabBtn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️ MATRIX SETTINGS
        </button>
      </div>

      {/* MAIN DASHBOARD CONTENT AREA */}
      <div className="cyberMainContent">
        {/* TAB 1: CENTRAL COMMAND CONTROL */}
        {activeTab === "command" && (
          <div className="cyberGrid2Col">
            {/* LEFT COL: TERMINAL STREAM */}
            <div className="cyberCard">
              <div className="cyberCardHeader">
                <h3>🖥️ LIVE SYSTEM DIAGNOSTIC TERMINAL</h3>
                <span className="cyberBadgeCyan">REAL-TIME STREAM</span>
              </div>
              <div className="terminalBox">
                {terminalLogs.map((log, index) => (
                  <div key={index} className="terminalLogLine">
                    {log}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>
              <form onSubmit={handleTerminalSubmit} className="terminalForm">
                <span className="terminalPrompt">&gt; _</span>
                <input
                  type="text"
                  className="terminalInput"
                  placeholder="Enter directive (e.g. 'help', 'payroll', 'hack', 'override')..."
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                />
                <button type="submit" className="terminalSendBtn">
                  EXECUTE
                </button>
              </form>
            </div>

            {/* RIGHT COL: QUICK ACTION NODES & METRICS */}
            <div className="cyberFlexCol">
              <div className="cyberCard">
                <div className="cyberCardHeader">
                  <h3>📊 SYSTEM PERFORMANCE MATRIX</h3>
                  <span className="cyberBadgeGreen">100% HEALTH</span>
                </div>
                <div className="metricsGrid">
                  <div className="metricBox">
                    <div className="metricLabel">PAYROLL PROCESSING</div>
                    <div className="metricValueVal green">$482,910.00</div>
                    <div className="metricSub">Batch A901 Verified</div>
                  </div>
                  <div className="metricBox">
                    <div className="metricLabel">ACTIVE TICKETS</div>
                    <div className="metricValueVal cyan">42 OPEN</div>
                    <div className="metricSub">7 Critical Dispatches</div>
                  </div>
                  <div className="metricBox">
                    <div className="metricLabel">LEAVE NODE STATUS</div>
                    <div className="metricValueVal purple">3 PENDING</div>
                    <div className="metricSub">Auto-Approval Enabled</div>
                  </div>
                  <div className="metricBox">
                    <div className="metricLabel">QUANTUM FIREWALL</div>
                    <div className="metricValueVal orange">AES-4096-GCM</div>
                    <div className="metricSub">0 Intrusions Detected</div>
                  </div>
                </div>
              </div>

              {/* LIVE SECURITY ALERTS */}
              <div className="cyberCard">
                <div className="cyberCardHeader">
                  <h3>🚨 REAL-TIME SYSTEM ALERTS</h3>
                  <button
                    className="cyberActionBtnSmall"
                    onClick={() =>
                      setSystemAlerts([
                        ...systemAlerts,
                        {
                          id: Date.now(),
                          type: "INFO",
                          msg: "Manual Diagnostic Pulse Executed",
                          time: new Date().toLocaleTimeString(),
                        },
                      ])
                    }
                  >
                    + PULSE DIAGNOSTIC
                  </button>
                </div>
                <div className="alertList">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className={`alertRow ${alert.type.toLowerCase()}`}>
                      <span className="alertBadge">{alert.type}</span>
                      <span className="alertMsg">{alert.msg}</span>
                      <span className="alertTime">{alert.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TASKS & TICKETS MATRIX */}
        {activeTab === "tickets" && (
          <div className="cyberCard">
            <div className="cyberCardHeader">
              <h3>📁 TASKS & TICKETS DISPATCH MATRIX</h3>
              <div style={{ display: "flex", gap: "10px" }}>
                <select
                  className="cyberSelect"
                  value={ticketPriorityFilter}
                  onChange={(e) => setTicketPriorityFilter(e.target.value)}
                >
                  <option value="ALL">All Priorities</option>
                  <option value="CRITICAL">Critical Only</option>
                  <option value="HIGH">High Priority</option>
                  <option value="ROUTINE">Routine</option>
                </select>
                <button
                  className="cyberActionBtn"
                  onClick={() => alert("Simulated Ticket Override Dispatched!")}
                >
                  ⚡ DISPATCH OVERRIDE
                </button>
              </div>
            </div>
            <table className="cyberTable">
              <thead>
                <tr>
                  <th>TICKET ID</th>
                  <th>REQUESTER</th>
                  <th>CATEGORY</th>
                  <th>PRIORITY</th>
                  <th>DISPATCH NODE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "TCK-9901", requester: "Rahul S.", category: "IT Infrastructure", priority: "CRITICAL", node: "Node #4", status: "DISPATCHED" },
                  { id: "TCK-9902", requester: "Sumit P.", category: "Payroll Discrepancy", priority: "HIGH", node: "Node #1", status: "IN_REVIEW" },
                  { id: "TCK-9903", requester: "Karan M.", category: "Leave Allocation", priority: "ROUTINE", node: "Node #2", status: "RESOLVED" },
                  { id: "TCK-9904", requester: "Shreekar N.", category: "Security Access", priority: "CRITICAL", node: "Node #9", status: "ACTIVE" },
                ]
                  .filter((t) => ticketPriorityFilter === "ALL" || t.priority === ticketPriorityFilter)
                  .map((row) => (
                    <tr key={row.id}>
                      <td className="cyanText fontBold">{row.id}</td>
                      <td>👤 {row.requester}</td>
                      <td>{row.category}</td>
                      <td>
                        <span className={`priorityTag ${row.priority.toLowerCase()}`}>
                          {row.priority}
                        </span>
                      </td>
                      <td>📡 {row.node}</td>
                      <td>
                        <span className="cyberBadgeGreen">{row.status}</span>
                      </td>
                      <td>
                        <button
                          className="cyberTableBtn"
                          onClick={() => alert(`Rerouted ${row.id} to Admin Terminal.`)}
                        >
                          REROUTE
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: ENCRYPTED MAILS RELAY */}
        {activeTab === "mails" && (
          <div className="cyberCard">
            <div className="cyberCardHeader">
              <h3>✉️ ENCRYPTED SATELLITE MAILS RELAY</h3>
              <div style={{ display: "flex", gap: "10px" }}>
                <select
                  className="cyberSelect"
                  value={mailFilter}
                  onChange={(e) => setMailFilter(e.target.value)}
                >
                  <option value="INBOX">Inbox (Decrypted)</option>
                  <option value="SENT">Outbound Sat-Relay</option>
                  <option value="ARCHIVE">Encrypted Vault</option>
                </select>
                <button
                  className="cyberActionBtn"
                  onClick={() => alert("Satellite Communications Buffer Flushed!")}
                >
                  📡 FLUSH COMMS BUFFER
                </button>
              </div>
            </div>
            <div className="mailList">
              {[
                { id: 1, sender: "Directorate Core", subject: "Quarterly Quantum Payroll Audit Approved", time: "10:40 AM", cipher: "AES-4096" },
                { id: 2, sender: "HRMS Node", subject: "Leave Status Matrix Synchronized for Shreekar & Sumit", time: "09:15 AM", cipher: "RSA-2048" },
                { id: 3, sender: "IT Ops Terminal", subject: "Satellite Relay Firewall Upgrade Complete", time: "08:30 AM", cipher: "ECC-521" },
              ].map((mail) => (
                <div key={mail.id} className="mailRow">
                  <div className="mailLeft">
                    <span className="mailIcon">🔒</span>
                    <div>
                      <div className="mailSender">{mail.sender}</div>
                      <div className="mailSubject">{mail.subject}</div>
                    </div>
                  </div>
                  <div className="mailRight">
                    <span className="cipherTag">{mail.cipher}</span>
                    <span className="mailTime">{mail.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PAYROLL QUANTUM TERMINAL */}
        {activeTab === "payroll" && (
          <div className="cyberGrid2Col">
            <div className="cyberCard">
              <div className="cyberCardHeader">
                <h3>📊 QUANTUM PAYROLL LEDGER TERMINAL</h3>
                <select
                  className="cyberSelect"
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                >
                  <option value="BATCH_A901">Batch #A-901 (Current Active)</option>
                  <option value="BATCH_A902">Batch #A-902 (Pending Verification)</option>
                  <option value="BATCH_A903">Batch #A-903 (Archived Ledger)</option>
                </select>
              </div>
              <div style={{ padding: "12px 0" }}>
                <div className="payrollBigStat">
                  <span className="payrollStatLabel">TOTAL BATCH DISBURSEMENT</span>
                  <span className="payrollStatVal">$482,910.00 USD</span>
                </div>
                <div className="payrollRowInfo">
                  <span>BASE HOURLY RATE OVERRIDE:</span>
                  <strong className="greenText">$39.66 / HR</strong>
                </div>
                <div className="payrollRowInfo">
                  <span>MEAL BREAK DEDUCTION RATE:</span>
                  <strong className="cyanText">30 MINS DEDUCTION</strong>
                </div>
                <div className="payrollRowInfo">
                  <span>AUDIT STATUS:</span>
                  <strong className="greenText">✓ 100% VERIFIED BY QUANTUM CORE</strong>
                </div>
              </div>
              <button
                className="cyberActionBtnFull"
                onClick={() => alert(`Payroll ${selectedBatch} Executed Successfully!`)}
              >
                ⚡ AUTHORIZE & EXECUTE PAYROLL BATCH
              </button>
            </div>

            <div className="cyberCard">
              <div className="cyberCardHeader">
                <h3>👥 WORKER WAGE CALCULATION SUMMARY</h3>
              </div>
              <table className="cyberTable">
                <thead>
                  <tr>
                    <th>WORKER</th>
                    <th>COMPANIES WORKED</th>
                    <th>HOURS</th>
                    <th>TOTAL WAGE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="greenText fontBold">👤 Karan M.</td>
                    <td>Orange Ltd & Apple Inc</td>
                    <td>17 hrs</td>
                    <td className="cyanText fontBold">$674.22</td>
                  </tr>
                  <tr>
                    <td className="greenText fontBold">👤 Rahul S.</td>
                    <td>Dell Logistics</td>
                    <td>40 hrs</td>
                    <td className="cyanText fontBold">$1,586.40</td>
                  </tr>
                  <tr>
                    <td className="greenText fontBold">👤 Sumit P.</td>
                    <td>Alpha Tech Solutions</td>
                    <td>38 hrs</td>
                    <td className="cyanText fontBold">$1,507.08</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: LEAVE MANAGEMENT NODE */}
        {activeTab === "leave" && (
          <div className="cyberCard">
            <div className="cyberCardHeader">
              <h3>🌴 LEAVE MANAGEMENT CONTROL NODE</h3>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <label className="cyberToggleLabel">
                  <input
                    type="checkbox"
                    checked={autoApproveLeaves}
                    onChange={(e) => setAutoApproveLeaves(e.target.checked)}
                  />
                  <span>AUTO-APPROVE OVERRIDE</span>
                </label>
                <button
                  className="cyberActionBtn"
                  onClick={() => alert("Synchronized Leave Status across all worker profiles!")}
                >
                  🔄 RE-SYNC LEAVES
                </button>
              </div>
            </div>
            <table className="cyberTable">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>LEAVE TYPE</th>
                  <th>START DATE</th>
                  <th>END DATE</th>
                  <th>STATUS</th>
                  <th>ACTION OVERRIDE</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { emp: "Sumit P.", type: "Annual Leave", start: "2026-08-10", end: "2026-08-14", status: "APPROVED" },
                  { emp: "Shreekar N.", type: "Sick Leave", start: "2026-08-12", end: "2026-08-13", status: "PENDING" },
                  { emp: "Karan M.", type: "Casual Leave", start: "2026-08-15", end: "2026-08-16", status: "APPROVED" },
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="fontBold greenText">👤 {row.emp}</td>
                    <td>🌴 {row.type}</td>
                    <td>📅 {row.start}</td>
                    <td>📅 {row.end}</td>
                    <td>
                      <span className={row.status === "APPROVED" ? "cyberBadgeGreen" : "cyberBadgeOrange"}>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="cyberTableBtn"
                        onClick={() => alert(`Status for ${row.emp} overridden to APPROVED.`)}
                      >
                        OVERRIDE APPROVE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 6: MATRIX SETTINGS */}
        {activeTab === "settings" && (
          <div className="cyberGrid2Col">
            <div className="cyberCard">
              <div className="cyberCardHeader">
                <h3>⚙️ SECURITY MATRIX CONFIGURATION</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "10px 0" }}>
                <div>
                  <label className="cyberLabel">QUANTUM FIREWALL LEVEL</label>
                  <select
                    className="cyberSelectFull"
                    value={securityLevel}
                    onChange={(e) => setSecurityLevel(e.target.value)}
                  >
                    <option value="MAXIMUM_OVERDRIVE">MAXIMUM OVERDRIVE (Level 5 Encryption)</option>
                    <option value="STEALTH_MODE">STEALTH MODE (Zero Trace Routing)</option>
                    <option value="MAINFRAME_LOCKDOWN">MAINFRAME LOCKDOWN (Emergency Only)</option>
                  </select>
                </div>
                <div>
                  <label className="cyberLabel">CENTRAL ACCOUNT CENTER SYNC</label>
                  <div style={{ fontSize: "13px", color: "#00ff66", fontWeight: "700" }}>
                    ✓ FRONTEND & BACKEND NODES 100% SYNCHRONIZED
                  </div>
                </div>
              </div>
            </div>

            <div className="cyberCard">
              <div className="cyberCardHeader">
                <h3>🛠️ DUMMY CONTROL CENTER CREDENTIALS</h3>
              </div>
              <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.6" }}>
                This Classified Command Control Terminal is a standalone demonstration page representing the central account management, ticket dispatch, payroll ledger, and leave node operations.
              </div>
              <button
                className="cyberActionBtnFull"
                style={{ marginTop: "20px" }}
                onClick={() => alert("Cyber Matrix Configuration Saved Successfully!")}
              >
                💾 SAVE MATRIX SETTINGS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestPage;
