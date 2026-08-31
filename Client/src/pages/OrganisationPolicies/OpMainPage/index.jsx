import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../images/logo.png";
import leaveImg from "../../../images/leavemanagement.jfif";
import payrollImg from "../../../images/payrools.jfif";
import rosterImg from "../../../images/roster.jfif";
import { hrPoliciesData } from "./hrPoliciesData";
import {
  FiFileText,
  FiDownload,
  FiPrinter,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiBookOpen,
  FiShield,
  FiDollarSign,
  FiCalendar,
  FiExternalLink
} from "react-icons/fi";
import "./index.css";

function OpMainPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("HR_POLICIES"); 
  const [selectedPdf, setSelectedPdf] = useState(null); // pdf object for viewer modal
  const [activePageNum, setActivePageNum] = useState(1);

  const openPdfViewer = (pdf) => {
    setSelectedPdf(pdf);
    setActivePageNum(1);
  };

  const closePdfViewer = () => {
    setSelectedPdf(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (pdf) => {
    if (!pdf) return;
    const url = pdf.fileUrl || pdf.pdfUrl;
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = pdf.fileName || `${pdf.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // EXACT PDF PAGE RENDERER
  const renderExactPdfPage = (pdf, pageNum) => {
    if (!pdf) return null;
    const targetUrl = pdf.fileUrl || pdf.pdfUrl;
    if (targetUrl) {
      return (
        <iframe
          src={targetUrl}
          title={pdf.title}
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      );
    }

    const pageIndex = pageNum - 1;
    const pageData = (pdf.pages || [])[pageIndex] || (pdf.pages || [])[0];

    return (
      <div className="pdfExactPageSheet">
        <div className="pdfExactHeader">
          <div className="pdfHeaderLogoArea">
            <img src={logo} alt="Excell Security Logo" className="pdfLogoImg" />
          </div>
          <div className="pdfHeaderConfidential">PERSONNEL - IN - CONFIDENCE</div>
        </div>

        <div className="pdfPageBodyContent">
          <span className="pdfTagBadge">{pdf.category}</span>
          <h2 className="pdfRedTitle" style={{ fontSize: "20px", marginTop: "8px" }}>{pdf.title}</h2>
          <div className="pdfPageHeaderTitle">
            PAGE {pageNum}: {pageData?.title || "DOCUMENT SECTION"}
          </div>

          <div className="pdfVisualContent" style={{ marginTop: "20px" }}>
            {(pageData?.sections || []).map((sec, sIdx) => (
              <div key={sIdx} className="pdfSectionBlock">
                {sec.heading && <h3 className="pdfSecHeading">{sec.heading}</h3>}
                {sec.subheading && <h4 className="pdfSecSubheading">{sec.subheading}</h4>}
                {sec.text && <p className="pdfSecText">{sec.text}</p>}

                {sec.bullets && (
                  <ul className="pdfSecBullets">
                    {sec.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pdfExactFooter">
          <span>Page {pageNum} of {pdf.pagesCount}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="OPPage">
      {/* HEADER NAVBAR */}
      <div className="navbar">
        <div className="logo">
          <img
            src={logo}
            className="logoimage"
            alt="Logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="navTitle">ORGANIZATION POLICIES</div>
      </div>

      {/* TOP CATEGORY NAVIGATION TABS */}
      <div className="opTopTabRibbon">
        <div className="opTabContainer">
          <button
            type="button"
            className={`opTabItem ${activeCategory === "HR_POLICIES" ? "active" : ""}`}
            onClick={() => setActiveCategory("HR_POLICIES")}
          >
            <FiShield size={16} />
            <span>HR Policies (4 PDFs)</span>
          </button>

          <button
            type="button"
            className="opTabItem"
            onClick={() => navigate("/payroll")}
          >
            <FiDollarSign size={16} />
            <span>Payroll</span>
          </button>

          <button
            type="button"
            className="opTabItem"
            onClick={() => navigate("/roster-shifts")}
          >
            <FiCalendar size={16} />
            <span>Shift & Roster</span>
          </button>
        </div>
      </div>

      <div className="opContentContainer">
        {/* --- HR POLICIES 4 PDF LIST VIEW --- */}
        {activeCategory === "HR_POLICIES" && (
          <div className="hrPoliciesSection">
            <div className="opHeaderBlock">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FiShield size={24} style={{ color: "#0284c7" }} />
                <h2 style={{ margin: 0 }}>HR Policies & Official Documents (4 PDFs)</h2>
              </div>
              <p style={{ marginTop: "6px" }}>
                Click any of the 4 official HR policy PDF documents below to open and view the exact PDF file directly.
              </p>
            </div>

            <div className="pdfCardsGrid">
              {hrPoliciesData.map((pdf, idx) => (
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
                    <span>View PDF Document</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- DIRECT NATIVE PDF VIEWER MODAL --- */}
      {selectedPdf && (
        <div className="pdfModalBackdrop" onClick={closePdfViewer}>
          <div className="pdfModalContainer" onClick={(e) => e.stopPropagation()}>
            {/* MODAL HEADER TOOLBAR */}
            <div className="pdfViewerHeader">
              <div className="pdfHeaderLeft">
                <FiFileText size={20} style={{ color: "#0284c7" }} />
                <div>
                  <h3 className="pdfModalTitle">{selectedPdf.title}</h3>
                  <span className="pdfModalSub">
                    {selectedPdf.subtitle} • Page {activePageNum} of {selectedPdf.pagesCount}
                  </span>
                </div>
              </div>

              <div className="pdfHeaderActions">
                <a
                  href={selectedPdf.fileUrl || selectedPdf.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pdfActionBtn"
                  title="Open PDF in New Window"
                >
                  <FiExternalLink size={14} />
                  <span>Open Full Window</span>
                </a>

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

                <button
                  type="button"
                  className="pdfCloseBtn"
                  onClick={closePdfViewer}
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* EXACT PDF PAGE RENDERER AREA */}
            <div className="pdfBodyScrollArea" style={{ height: "calc(100% - 60px)", padding: 0 }}>
              {renderExactPdfPage(selectedPdf, activePageNum)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OpMainPage;
