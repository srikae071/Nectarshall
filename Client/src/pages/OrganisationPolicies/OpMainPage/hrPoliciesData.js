export const hrPoliciesData = [
  {
    id: "pdf-1",
    title: "Guide to the Completion of Employment Application",
    subtitle: "Step-by-step guidance, contract signing diagrams, TFN declaration & superannuation forms",
    category: "Onboarding Guide",
    pagesCount: 5,
    fileSize: "1.4 MB",
    updatedDate: "June 2023",
    fileUrl: "/pdfs/guide-to-employment-application.pdf.pdf",
    fileName: "guide-to-employment-application.pdf",
    pdfUrl: "/pdfs/guide-to-employment-application.pdf.pdf",
    pages: [
      {
        pageNumber: 1,
        title: "SIGNING THE CONTRACT & CONFIDENTIALITY AGREEMENT",
        sections: [
          {
            heading: "GUIDE TO THE COMPLETION OF EMPLOYMENT APPLICATION",
            text: "This guide will assist you in completing the employment documentation required for employment. Please contact the HR team on 1800 236 426 for further guidance if needed."
          },
          {
            heading: "SIGNING THE CONTRACT",
            diagramType: "CONTRACT_SIGNING",
            callouts: [
              { label: "SIGNED BY AN AUTHORISED OFFICER OF THE EMPLOYER", instruction: "Leave this blank for a company person to sign." },
              { label: "SIGNED BY YOU", instruction: "The applicant is to sign here. The applicant is to also write their own name and title (e.g. Dr. Fredd Bear)." },
              { label: "WITNESS SIGNATURE", instruction: "A witness is required ... it can be anyone who knows the applicant. The witness signs here and also writes their own name and title (e.g. Ms. Mary Smith)." }
            ]
          },
          {
            heading: "SIGNING THE CONFIDENTIALITY AGREEMENT",
            diagramType: "CONFIDENTIALITY_SIGNING",
            callouts: [
              { label: "SIGNED BY AN AUTHORISED OFFICER OF THE EMPLOYER", instruction: "Leave this blank for a company person to sign." },
              { label: "SIGNED BY YOU", instruction: "The applicant is to sign here and write name & title." },
              { label: "WITNESS SIGNATURE", instruction: "Witness signs here and writes name & title." }
            ]
          },
          {
            heading: "ACKNOWLEDGING THE EMPLOYEE HANDBOOK",
            diagramType: "HANDBOOK_ACK",
            note: "Note: only page 34 of the handbook is to be returned to the company. It can be scanned and sent without the rest of the handbook.",
            callouts: [
              { label: "20 EMPLOYEE HANDBOOK ACKNOWLEDGEMENT FORM", instruction: "The applicant is to write (not sign) their name here. The applicant is to sign and date here." }
            ]
          }
        ]
      },
      {
        pageNumber: 2,
        title: "ACKNOWLEDGING HEALTH & SAFETY HANDBOOK & TFN DECLARATION",
        sections: [
          {
            heading: "ACKNOWLEDGING THE HEALTH AND SAFETY HANDBOOK",
            diagramType: "OHS_CHECKLIST",
            callouts: [
              { label: "39 HEALTH AND SAFETY HANDBOOK CHECKLIST AND ACKNOWLEDGEMENT FORM", instruction: "The applicant is to answer every one of these questions (True / False)." },
              { label: "NAME PRINT", instruction: "The applicant is to print name here." },
              { label: "SIGNATURE & DATE", instruction: "The applicant is to sign and date here." }
            ]
          },
          {
            heading: "COMPLETING THE TAX FILE NUMBER DECLARATION FORM",
            diagramType: "TFN_FORM_GUIDE",
            text: "The applicant is to complete Section A entirely. Take great care to write in plain letters and make them clear and neat so the company can act in your interests quickly."
          }
        ]
      },
      {
        pageNumber: 3,
        title: "SUPERANNUATION STANDARD CHOICE FORM",
        sections: [
          {
            heading: "COMPLETING THE SUPERANNUATION STANDARD CHOICE FORM",
            text: "It is of great importance that this form is properly completed. Your superannuation must be paid in accordance with the law. If you cannot provide the correct superannuation details then your employment will be in jeopardy. If you do not have a superannuation then you must find a superannuation fund yourself before starting work.",
            diagramType: "SUPER_FORM_GUIDE",
            callouts: [
              { label: "Section A: To be completed by PAYEE", instruction: "The applicant is to complete entirely all of Section A." },
              { label: "Employment Status", instruction: "Ensure that you correctly identify your employment status." },
              { label: "Current Address", instruction: "Current address to be used." },
              { label: "Section A: Employee to complete", instruction: "According to your Superannuation situation, complete the sections of the document as directed. Everyone is to complete section 2." }
            ]
          }
        ]
      },
      {
        pageNumber: 4,
        title: "SUPPLYING BANK DETAILS & EMERGENCY CONTACT",
        sections: [
          {
            heading: "SUPPLYING YOUR BANK DETAILS",
            text: "In order for funds to be sent to your bank account we need your bank details urgently. Please email your bank account details by replying to your Offer Of Employment email and writing in your bank details:",
            bullets: [
              "Bank Name: eg CBA, Commonwealth, ANZ, Westpac, BOM, Bendigo etc",
              "Account Name: This is your name or other title of your bank account.",
              "BSB: This a six-digit number that identifies your bank",
              "Account Number: This number identifies your personal account."
            ],
            diagramType: "SMSF_NOMINATION",
            callouts: [
              { label: "Item 3: Nominating APRA fund or RSA", instruction: "Make sure all information is supplied." },
              { label: "Item 4: Nominating self-managed super fund (SMSF)", instruction: "If you have a SMSF then complete this section." },
              { label: "Signature & Date", instruction: "Every applicant is to complete this section." }
            ]
          },
          {
            heading: "NOMINATING YOUR EMERGENCY CONTACT PERSON",
            text: "In the unfortunate case that you are in a situation that requires us to inform someone of your situation, we need to be able to tell someone who can help you beyond what the company can do.",
            bullets: [
              "We need to know the following:",
              "The name of the contact person: eg Fredd Smith",
              "Relationship: eg friend, wife, brother etc.",
              "Contact Number: A mobile phone number is required."
            ]
          }
        ]
      },
      {
        pageNumber: 5,
        title: "MANDATORY CERTIFICATIONS & EVIDENCE REQUIREMENTS",
        sections: [
          {
            heading: "SUPPLYING EVIDENCE OF BEING LEGALLY ALLOWED TO WORK IN AUSTRALIA",
            text: "We only hire people who are lawfully allowed to work in Australia and seek employment of their own volition. If either of these conditions do not apply your application will be voided. You must demonstrate that you are legally allowed to work in Australia by sending to the company an image of a document that meets this requirement. Documents that can demonstrate this include: birth certificate, citizenship certificate, passport, VISA."
          },
          {
            heading: "SUPPLYING A RESIDENTIAL ADDRESS",
            text: "You will only be asked this if you have already supplied a TFN Declaration but we need to confirm that your residential address if the TFN form is old or we understand that you have changed address."
          },
          {
            heading: "SUPPLYING A WORKING WITH CHILDREN CHECK",
            text: "You may supply this if you have a current WWCC. You only need to supply this if specifically asked. If you are asked to supply a WWCC, then send an image (front only) by email."
          },
          {
            heading: "SUPPLYING EVIDENCE OF FIRST AID CURRENCY",
            text: "You may supply this if you have a current First Aid Certificate and a Current CPR certificate. You only need to supply these if specifically asked. If you are asked to supply this information, then send an image (front only) by email to the company."
          }
        ]
      }
    ]
  },
  {
    id: "pdf-2",
    title: "Confidentiality Agreement",
    subtitle: "Non-Disclosure Agreement between Excell Protective Group Pty Ltd and Security Officer",
    category: "Legal Agreement",
    pagesCount: 3,
    fileSize: "950 KB",
    updatedDate: "June 2023",
    fileUrl: "/pdfs/confidentiality-agreement.pdf.pdf",
    fileName: "confidentiality-agreement.pdf",
    pdfUrl: "/pdfs/confidentiality-agreement.pdf.pdf",
    pages: [
      {
        pageNumber: 1,
        title: "DISCLOSURE AND USE OF CONFIDENTIAL INFORMATION",
        sections: [
          {
            heading: "CONFIDENTIALITY AGREEMENT",
            subheading: "Between Excell Protective Group Pty Ltd ABN 68 138 977 090 trading as Excell Security (the Company) And Employee (Adjin Sabanoski)",
            text: "BACKGROUND: You agree that during employment you will have access to confidential information belonging to Company and clients.\n1. Refrain from directly or indirectly disclosing confidential information."
          }
        ]
      },
      {
        pageNumber: 2,
        title: "SECURITY CONTROL & INDEMNITY",
        sections: [
          {
            heading: "2. SECURITY AND CONTROL & 3. INDEMNITY",
            text: "Maintain effective security measures to safeguard confidential information. Indemnify Company against losses, damages, and legal costs."
          }
        ]
      },
      {
        pageNumber: 3,
        title: "POST-TERMINATION & EXECUTION SIGNATURES",
        sections: [
          {
            heading: "EXECUTION SIGNATURES",
            diagramType: "EXECUTION_SIGNATURES",
            callouts: [
              { label: "SIGNED BY AN AUTHORISED OFFICER OF THE EMPLOYER", instruction: "Signature of Authorised Officer & Signature of Witness" },
              { label: "SIGNED BY YOU", instruction: "Signature of Employee & Signature of Witness" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "pdf-3",
    title: "Employment Contract Full Time (Award)",
    subtitle: "Standard Full-Time Security Officer Contract under Security Services Industry Award 2020",
    category: "Employment Contract",
    pagesCount: 10,
    fileSize: "2.8 MB",
    updatedDate: "June 2023",
    fileUrl: "/pdfs/employment-contract-full-time.pdf.pdf",
    fileName: "employment-contract-full-time.pdf",
    pdfUrl: "/pdfs/employment-contract-full-time.pdf.pdf",
    pages: [
      {
        pageNumber: 1,
        title: "FULL TIME EMPLOYMENT CONTRACT COVER PAGE",
        sections: [
          {
            heading: "EMPLOYMENT CONTRACT - FULL TIME (AWARD)",
            subheading: "EXCELL PROTECTIVE GROUP PTY LTD (ABN 33 150 159 701) Trading as EXCELL SECURITY",
            text: "And Employee [Name: Security Officer]"
          }
        ]
      },
      {
        pageNumber: 10,
        title: "SCHEDULE TO CONTRACT & SIGNATURES",
        sections: [
          {
            heading: "SCHEDULE TO EMPLOYMENT CONTRACT",
            diagramType: "CONTRACT_SCHEDULE_TABLE",
            tableRows: [
              { item: "Item 1", key: "Employer Name", val: "Excell Protective Group Pty Ltd trading as Excell Security (ABN 33 150 159 701)" },
              { item: "Item 2", key: "Employee Name", val: "[Name of Security Officer]" },
              { item: "Item 3", key: "Position", val: "Security Officer" },
              { item: "Item 4", key: "Commencement Date", val: "TBC" },
              { item: "Item 5", key: "Industrial Instrument", val: "Security Services Industry Award 2020" },
              { item: "Item 6", key: "Location", val: "4 Blackwood Drive, Altona North VIC 3025 & Client Sites" },
              { item: "Item 7", key: "Normal Span of Hours", val: "0600 to 1800 weekdays" },
              { item: "Item 8", key: "Hours of Work", val: "38 hours per week as agreed with Employer" },
              { item: "Item 9", key: "Pay", val: "As per the relevant Award" },
              { item: "Item 10", key: "Governing Law", val: "Victoria, Australia" }
            ]
          },
          {
            heading: "EXECUTION SIGNATURES",
            diagramType: "CONTRACT_EXECUTION_SIGNATURES",
            callouts: [
              { label: "SIGNED BY AN AUTHORISED OFFICER OF THE EMPLOYER", instruction: "Signature of Authorised Officer & Signature of Witness" },
              { label: "SIGNED BY YOU", instruction: "Signature of Employee & Signature of Witness" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "pdf-4",
    title: "Employee Handbook V1.0",
    subtitle: "Excell Security Employee Handbook V1.0 - Expectations, Attendance, Policies & Code",
    category: "Employee Handbook",
    pagesCount: 34,
    fileSize: "5.2 MB",
    updatedDate: "June 2023",
    fileUrl: "/pdfs/employee-handbook.pdf.pdf",
    fileName: "employee-handbook.pdf",
    pdfUrl: "/pdfs/employee-handbook.pdf.pdf",
    pages: [
      {
        pageNumber: 1,
        title: "EXCELL PROTECTIVE GROUP - EMPLOYEE HANDBOOK COVER PAGE",
        sections: [
          {
            heading: "EXCELL PROTECTIVE GROUP - EMPLOYEE HANDBOOK V1.0",
            subheading: "Issue June 2023 Rev 1.0",
            text: "This handbook remains the property of Excell Security. It is to be stored safely and returned at the end of employment.\nExcell Protective Group Trading as Excell Security (ABN 33 150 159 701)\n4 Blackwood Drive, Altona North VIC 3025"
          }
        ]
      },
      {
        pageNumber: 34,
        title: "EMPLOYEE HANDBOOK ACKNOWLEDGEMENT FORM",
        sections: [
          {
            heading: "ACKNOWLEDGEMENT FORM (PAGE 34)",
            diagramType: "HANDBOOK_ACK_FORM",
            callouts: [
              { label: "ACKNOWLEDGEMENT", instruction: "I acknowledge that I received a copy of this Excell Security Employee Handbook V1.0 and that I have read and understood it." },
              { label: "SIGNATURE", instruction: "___________________________ (please sign)" },
              { label: "PRINT NAME", instruction: "___________________________ (please print name)" },
              { label: "DATE", instruction: "___________________________ (date of acknowledgement)" }
            ]
          }
        ]
      }
    ]
  }
];
