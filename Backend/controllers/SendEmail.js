
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "../.env")
});

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (message) => {
    if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not configured");
    }

    const from =
        process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    const { data, error } = await resend.emails.send({
        from,
        ...message
    });

    if (error) {
        console.error("RESEND_ERROR:", error);
        throw new Error(error.message || "Email sending failed");
    }

    console.log("RESEND_EMAIL_SENT:", data.id);

    return data;
};

const sendOtpEmail = async (email, otp) => {
    return sendEmail({
        to: email,
        subject: "Findora - Email Verification OTP",
        text: `Your Findora verification OTP is: ${otp}. It expires in 5 minutes. Never share your OTP with anyone.`
    });
};

const sendMatchFoundEmail = async ({
    email,
    lostItem,
    foundItem,
    similarity,
    matchId
}) => {
    const appUrl = (
        process.env.FRONTEND_URL || "http://localhost:5173"
    ).replace(/\/+$/, "");

    return sendEmail({
        to: email,
        subject: "A Possible Match Has Been Found for Your Lost Item – Findora",
        text: [
            "Hello,",
            "",
            "Good news! A possible match has been found for your lost item on Findora.",
            "",
            `Your lost item: ${lostItem.name}`,
            `Possible found item: ${foundItem.name}`,
            `Match similarity: ${similarity}%`,
            "",
            `Review the match: ${appUrl}/my-reports?match=${matchId}`,
            "",
            "Thank you for using Findora!"
        ].join("\n")
    });
};

const sendClaimEmail = async ({
    email,
    finderName,
    claimantName,
    claimantEmail,
    foundItem
}) => {
    return sendEmail({
        to: email,
        subject: "Someone Has Claimed Your Found Item – Findora",
        text: [
            `Hello ${finderName || "Finder"},`,
            "",
            "Someone has submitted a claim for an item you reported as found on Findora.",
            "",
            `Claimant name: ${claimantName}`,
            `Claimant email: ${claimantEmail}`,
            `Found item: ${foundItem.name}`,
            "",
            "Please contact the claimant to verify ownership and coordinate the return.",
            "",
            "Thank you for helping reunite people with their belongings!"
        ].join("\n")
    });
};

module.exports = {
    sendOtpEmail,
    sendMatchFoundEmail,
    sendClaimEmail
};
