import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../images/logo.png";
import leaveImg from "../../../images/leavemanagement.jfif";
import payrollImg from "../../../images/payrools.jfif";
import rosterImg from "../../../images/roster.jfif";
import Navbar from "../../../components/Navbar";
import { hrPoliciesData } from "./hrPoliciesData";
import {
  FiFileText,
  FiDownload,
  FiPrinter,
  FiX,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiBookOpen,
  FiShield,
  FiSearch
} from "react-icons/fi";
import "./index.css";

function OpMainPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null); // null | 'HR_POLICIES' | 'PAYROLL' | 'SHIFT_ROSTER'
  const [selectedPdf, setSelectedPdf] = useState(null); // pdf object for viewer modal
  const [activePageNum, setActivePageNum] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");

  const openPdfViewer = (pdf) => {
    setSelectedPdf(pdf);
    setActivePageNum(1);
    setZoomLevel(100);
  };

  const closePdfViewer = () => {
    setSelectedPdf(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (pdf) => {
    if (pdf.fileUrl) {
      const link = document.createElement("a");
      link.href = pdf.fileUrl;
      link.download = pdf.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const textContent = (pdf.pages || [])
      .map((p) => `--- PAGE ${p.pageNumber}: ${p.title} ---\n\n${p.content}`)
      .join("\n\n=========================================\n\n");
    const blob = new Blob([`${pdf.title}\n${pdf.subtitle}\n\n${textContent}`], {
      type: "application/pdf;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${pdf.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHrPolicies = hrPoliciesData.filter((pdf) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      pdf.title.toLowerCase().includes(q) ||
      pdf.category.toLowerCase().includes(q) ||
      pdf.subtitle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="OPPage">
      {/* HEADER NAVBAR */}
      <Navbar />

      <div className="opContentContainer">
        {/* BREADCRUMB / BACK NAVIGATION */}
        {activeCategory && (
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className="opBackButton"
          >
            <FiArrowLeft size={16} />
            <span>Back to Policy Categories</span>
          </button>
        )}

        {/* --- 1. MAIN CATEGORIES VIEW --- */}
        {!activeCategory && (
          <>
            <div className="opHeaderBlock">
              <h2>Organisation Policies & Key Services</h2>
              <p>Select a category below to explore organizational handbooks, HR policies, and guidelines.</p>
            </div>

            <div className="opGridContainer">
              {/* CATEGORY 1: HR POLICIES (Replaced Leave Management) */}
              <div
                className="opCategoryCard"
                onClick={() => setActiveCategory("HR_POLICIES")}
              >
                <div className="opCardImageWrap">
                  <img src={leaveImg} alt="HR Policies" />
                  <div className="opCardOverlayBadge">7 PDF Documents Available</div>
                </div>
                <div className="opCardBody">
                  <h3>HR Policies</h3>
                  <p>Comprehensive HR guidelines, employment handbooks, OHS manuals & code of conduct.</p>
                  <button type="button" className="opViewButton">
                    <FiBookOpen size={15} />
                    <span>View 7 HR Policy PDFs</span>
                  </button>
                </div>
              </div>

              {/* CATEGORY 2: PAYROLL */}
              <div
                className="opCategoryCard"
                onClick={() => navigate("/payroll")}
              >
                <div className="opCardImageWrap">
                  <img src={payrollImg} alt="Payroll" />
                </div>
                <div className="opCardBody">
                  <h3>Payroll</h3>
                  <p>Accurate weekly payroll management, payslips, tax declarations & superannuation.</p>
                  <button type="button" className="opViewButton">
                    <span>Access Payroll</span>
                  </button>
                </div>
              </div>

              {/* CATEGORY 3: SHIFT & ROSTER */}
              <div
                className="opCategoryCard"
                onClick={() => navigate("/roster-shifts")}
              >
                <div className="opCardImageWrap">
                  <img src={rosterImg} alt="Shift & Roster" />
                </div>
                <div className="opCardBody">
                  <h3>Shift & Roster</h3>
                  <p>Roster management, shift planning, site schedules & guard allocations.</p>
                  <button type="button" className="opViewButton">
                    <span>Access Shift & Roster</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* --- 2. HR POLICIES 7 PDF LIST VIEW --- */}
        {activeCategory === "HR_POLICIES" && (
          <div className="hrPoliciesSection">
            <div
              className="opHeaderBlock"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <FiShield size={24} style={{ color: "#0284c7" }} />
                  <h2 style={{ margin: 0 }}>HR Policies Documents & Handbooks</h2>
                </div>
                <p style={{ marginTop: "6px" }}>
                  Below are the official HR policy PDF documents for Excell Protective Group. Click on any document to view the full PDF content.
                </p>
              </div>

              {/* SEARCH INPUT BAR BEFORE RIGHT CORNER */}
              <div
                className="opSearchInputWrap"
                style={{
                  position: "relative",
                  minWidth: "280px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FiSearch
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    color: "#0284c7",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search HR policy (e.g. guide, A...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 36px 9px 36px",
                    borderRadius: "8px",
                    border: "1.5px solid #0284c7",
                    fontSize: "13.5px",
                    outline: "none",
                    background: "#ffffff",
                    boxShadow: "0 2px 6px rgba(2, 132, 199, 0.1)",
                    fontWeight: "500",
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: "10px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="pdfCardsGrid">
              {filteredHrPolicies.length > 0 ? (
                filteredHrPolicies.map((pdf, idx) => (
                  <div
                    key={pdf.id}
                    className="pdfDocumentCard"
                    onClick={() => openPdfViewer(pdf)}
                  >
                    <div className="pdfIconBadge">
                      <FiFileText size={28} />
                      <span className="pdfNum">PDF #{idx + 1}</span>
                    </div>

                    <div className="pdfMetaInfo">
                      <span className="pdfTag">{pdf.category}</span>
                      <h4 className="pdfTitle">{pdf.title}</h4>
                      <p className="pdfSubtitle">{pdf.subtitle}</p>

                      <div className="pdfFooterInfo">
                        <span>{pdf.pagesCount} Pages</span>
                        <span>•</span>
                        <span>{pdf.fileSize}</span>
                        <span>•</span>
                        <span>Updated {pdf.updatedDate}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="openPdfBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPdfViewer(pdf);
                      }}
                    >
                      <FiBookOpen size={14} />
                      <span>View PDF</span>
                    </button>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    padding: "40px 20px",
                    textAlign: "center",
                    background: "#ffffff",
                    borderRadius: "10px",
                    border: "1px dashed #cbd5e1",
                    color: "#64748b",
                    fontSize: "14.5px",
                  }}
                >
                  🔍 No HR policy documents matching "<strong>{searchQuery}</strong>".
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- 3. FULL INTERACTIVE PDF VIEWER MODAL --- */}
      {selectedPdf && (
        <div className="pdfModalBackdrop" onClick={closePdfViewer}>
          <div className="pdfModalContainer" onClick={(e) => e.stopPropagation()}>
            {/* MODAL HEADER TOOLBAR */}
            <div className="pdfViewerHeader">
              <div className="pdfHeaderLeft">
                <FiFileText size={20} style={{ color: "#0284c7" }} />
                <div>
                  <h3 className="pdfModalTitle">{selectedPdf.title}</h3>
                  <span className="pdfModalSub">{selectedPdf.subtitle} • Page {activePageNum} of {selectedPdf.pagesCount}</span>
                </div>
              </div>

              <div className="pdfHeaderActions">
                {!selectedPdf.fileUrl && (
                  <>
                    <button
                      type="button"
                      title="Zoom Out"
                      onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                      className="pdfActionBtn"
                    >
                      -
                    </button>
                    <span className="zoomLabel">{zoomLevel}%</span>
                    <button
                      type="button"
                      title="Zoom In"
                      onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                      className="pdfActionBtn"
                    >
                      +
                    </button>

                    <button
                      type="button"
                      className="pdfActionBtn highlightBtn"
                      onClick={() => handleDownload(selectedPdf)}
                    >
                      <FiDownload size={14} />
                      <span>Download PDF</span>
                    </button>

                    <button
                      type="button"
                      className="pdfActionBtn"
                      onClick={handlePrint}
                    >
                      <FiPrinter size={14} />
                      <span>Print</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className="pdfCloseBtn"
                  onClick={closePdfViewer}
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* PAGE NAVIGATOR RIBBON */}
            {!selectedPdf.fileUrl && <div className="pdfPageNavRibbon">
              <button
                type="button"
                disabled={activePageNum <= 1}
                onClick={() => setActivePageNum((p) => Math.max(1, p - 1))}
                className="pageNavBtn"
              >
                <FiChevronLeft size={16} />
                <span>Prev Page</span>
              </button>

              <div className="pageTabsList">
                {(selectedPdf.pages || []).map((p) => (
                  <button
                    key={p.pageNumber}
                    type="button"
                    className={`pageTabBtn ${activePageNum === p.pageNumber ? "active" : ""}`}
                    onClick={() => setActivePageNum(p.pageNumber)}
                  >
                    Page {p.pageNumber}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={activePageNum >= (selectedPdf.pagesCount || selectedPdf.pages.length)}
                onClick={() =>
                  setActivePageNum((p) =>
                    Math.min(selectedPdf.pagesCount || selectedPdf.pages.length, p + 1)
                  )
                }
                className="pageNavBtn"
              >
                <span>Next Page</span>
                <FiChevronRight size={16} />
              </button>
            </div>}

            {/* DOCUMENT BODY PAPER VIEW */}
            <div className="pdfBodyScrollArea">
              {selectedPdf.fileUrl ? (
                <iframe
                  className="nativePdfViewer"
                  src={selectedPdf.fileUrl}
                  title={selectedPdf.title}
                />
              ) : <div
                className="pdfPaperSheet"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
              >
                <div className="pdfPaperHeader">
                  <div className="paperCompany">EXCELL PROTECTIVE GROUP</div>
                  <div className="paperConfidential">PERSONNEL - IN - CONFIDENCE</div>
                </div>

                <div className="pdfPaperTitleArea">
                  <span className="pdfBadgeTag">{selectedPdf.category}</span>
                  <h2>{selectedPdf.title}</h2>
                  <div className="pdfPageHeaderTitle">
                    PAGE {activePageNum}: {selectedPdf.pages[activePageNum - 1]?.title || "DOCUMENT SECTION"}
                  </div>
                </div>

                <div className="pdfPaperContent">
                  <pre className="pdfTextContent">
                    {selectedPdf.pages[activePageNum - 1]?.content || selectedPdf.pages[0]?.content}
                  </pre>
                </div>

                <div className="pdfPaperFooter">
                  <span>Excell Security © 2026 - All Rights Reserved</span>
                  <span>Page {activePageNum} of {selectedPdf.pagesCount}</span>
                </div>
              </div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OpMainPage;
