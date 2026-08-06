import { sendApiData } from "./apiClient";

const MAILS_KEY = "app_mails_store";

export const SYSTEM_SENDER_EMAIL = "srikar071@gmail.com";
export const ADMIN_EMAIL = "sumit@enhanceservices.com.au";

export const getUserEmailByName = (nameStr) => {
  if (!nameStr) return "srikarnsdc@gmail.com";
  const name = String(nameStr).trim().toLowerCase();
  if (name.includes("srikar") || name.includes("sreekar")) {
    return "srikarnsdc@gmail.com";
  }
  if (name.includes("karan")) {
    return "Karanmandal9654@gmail.com";
  }
  if (name.includes("sumit")) {
    return "sumit@enhanceservices.com.au";
  }
  return `${name.replace(/\s+/g, "")}@gmail.com`;
};

export const getStoredMails = () => {
  try {
    const data = localStorage.getItem(MAILS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading mails from storage:", err);
  }
  return [];
};

export const saveMailsToStore = (mails) => {
  try {
    localStorage.setItem(MAILS_KEY, JSON.stringify(mails));
  } catch (err) {
    console.error("Error saving mails to storage:", err);
  }
};

export const sendMailNotification = async ({
  to,
  toName = "",
  from = SYSTEM_SENDER_EMAIL,
  fromName = "srikar071@gmail.com",
  subject,
  body,
  type = "Notification",
}) => {
  const currentMails = getStoredMails();
  const newMail = {
    id: `mail_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    to: (to || "").trim(),
    toName: (toName || to || "").trim(),
    from: SYSTEM_SENDER_EMAIL,
    fromName: (fromName || "srikar071@gmail.com").trim(),
    subject: subject || "Notification",
    body: body || "",
    type,
    createdAt: new Date().toISOString(),
    isRead: false,
  };

  const updatedMails = [newMail, ...currentMails];
  saveMailsToStore(updatedMails);

  try {
    await sendApiData("/api/mail/send-notification", {
      to: newMail.to,
      toName: newMail.toName,
      subject: newMail.subject,
      body: newMail.body,
    });
  } catch (err) {
    console.warn("Backend SMTP delivery result:", err);
  }

  return newMail;
};

export const getMailsForUser = (userIdentifier) => {
  if (!userIdentifier) return [];
  const query = String(userIdentifier).trim().toLowerCase();
  const userEmail = getUserEmailByName(query).toLowerCase();

  const allMails = getStoredMails();
  return allMails.filter((mail) => {
    const mailTo = String(mail.to || "").toLowerCase();
    const mailToName = String(mail.toName || "").toLowerCase();

    if (
      query.includes("srikar") ||
      query.includes("sreekar") ||
      query.includes("srikarnsdc") ||
      query.includes("srikar071")
    ) {
      return (
        mailTo.includes("srikarnsdc") ||
        mailTo.includes("srikar071") ||
        mailTo.includes("srikar") ||
        mailTo.includes("sreekar") ||
        mailToName.includes("srikar") ||
        mailToName.includes("sreekar")
      );
    }

    if (query.includes("karan")) {
      return (
        mailTo.includes("karanmandal9654") ||
        mailTo.includes("karan") ||
        mailToName.includes("karan")
      );
    }

    if (query.includes("sumit")) {
      return (
        mailTo.includes("sumit@enhanceservices.com.au") ||
        mailTo.includes("sumit") ||
        mailToName.includes("sumit")
      );
    }

    return (
      mailTo.includes(query) ||
      mailToName.includes(query) ||
      mailTo.includes(userEmail)
    );
  });
};
