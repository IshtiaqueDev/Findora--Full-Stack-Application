import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import AuthLayout from "./AuthLayout";
import Field from "./Field";
import OtpInput from "./OtpInput";
import { UserIcon, MailIcon, LockIcon, ArrowIcon } from "./Icons";

// true  = fake OTP in the browser (the code shows in a toast), so you can test the design now.
// false = calls your backend routes below. Set it to false once those routes exist.
const DEMO_MODE = true;

const API = "http://localhost:5000/user";
const KHP_EMAIL = /^[^\s@]*khp@iba-suk\.edu\.pk$/i; // must end with khp@iba-suk.edu.pk
const RESEND_SECONDS = 30;
const mmss = (s) => `0:${String(s).padStart(2, "0")}`;
let demoCode = "";

function SignupPage(){
    const navigate=useNavigate();

    const[formData,setFormData]=useState({
        username:"",
        email:"",
        password:"",
    })
    const [confirm, setConfirm] = useState("");
    const [agree, setAgree] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // OTP state
    const [otpSentTo, setOtpSentTo] = useState("");
    const [otpRound, setOtpRound] = useState(0); // changes on each send so the boxes clear
    const [otpError, setOtpError] = useState("");
    const [verified, setVerified] = useState(false);
    const [sending, setSending] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);

    // 30 second countdown
    useEffect(() => {
        if (secondsLeft <= 0) return;
        const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [secondsLeft]);

    const emailValid = KHP_EMAIL.test(formData.email.trim());

    const onChange=(e)=>{
        setFormData((prevData)=>({
            ...prevData,
            [e.target.name]:e.target.value
        }))
    }

    const resetOtp = () => {
        setOtpSentTo("");
        setVerified(false);
        setSecondsLeft(0);
        setOtpError("");
    };

    const onEmailChange = (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, email: value }));
        if (otpSentTo && value.trim() !== otpSentTo) resetOtp(); // email changed, start over
    };

    const sendCode = async () => {
        const email = formData.email.trim();
        setSending(true);
        setOtpError("");
        setErrors((er) => ({ ...er, otp: undefined }));
        try {
            const res = await axios.post(`${API}/user/send-otp`, { email });
            toast.success(res.data.message || "Code sent to your email");
            setVerified(false);
            setSecondsLeft(RESEND_SECONDS);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setSending(false);
        }
    };

    const checkCode = async (code) => {
        if (code.length < 6) return;
        try {
            await axios.post(`${API}/verify-otp`, { email: otpSentTo, otp: code });
            setVerified(true);
            setSecondsLeft(0);
        } catch (err) {
            setOtpError(err.response?.data?.message || "That code is incorrect. Try again.");
        }
    };

    const validate = () => {
        const e = {};
        if (!/^[a-zA-Z0-9_.]{3,20}$/.test(formData.username)) e.username = "3 to 20 letters, numbers, _ or .";
        if (!emailValid) e.email = "Use your campus email ending in khp@iba-suk.edu.pk.";
        else if (!verified) e.otp = "Send a code to your email and enter it.";
        if (formData.password.length < 8) e.password = "Use at least 8 characters.";
        if (confirm !== formData.password) e.confirm = "Passwords don't match.";
        if (!agree) e.agree = "Accept the terms to continue.";
        return e;
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const found = validate();
        setErrors(found);
        if (Object.keys(found).length) return;

        setLoading(true);
        try{
            if (DEMO_MODE) {
                await new Promise((r) => setTimeout(r, 800));
                toast.success("Demo: account would be created now");
            } else {
                const response = await axios.post(`${API}/signup`, formData, { withCredentials: true });
                toast.success(response.data.message);
                navigate("/");
            }
        }catch(err){
            toast.error(err.response?.data?.message || err.message);
        }finally{
            setLoading(false);
        }
    }

    const sendLabel = sending
        ? "Sending..."
        : secondsLeft > 0
        ? `Resend ${mmss(secondsLeft)}`
        : otpSentTo
        ? "Resend OTP"
        : "Send OTP";

    const sendButton =
        emailValid && !verified ? (
            <button type="button" className="send" onClick={sendCode} disabled={sending || secondsLeft > 0}>
                {sendLabel}
            </button>
        ) : null;

    const otpMessage = otpError || errors.otp;

    return(
        <AuthLayout
            title="Create your account"
            subtitle="Join Findora and make campus life a little easier."
            footer={<>Already signed up? <Link className="link" to="/">Login here</Link></>}
        >
            <form onSubmit={handleSubmit} noValidate>
                <Field
                    id="username" name="username" label="Username" icon={<UserIcon />}
                    placeholder="Choose a username" autoComplete="username"
                    value={formData.username} onChange={onChange} error={errors.username}
                />

                <Field
                    id="email" name="email" label="University Email" type="email" icon={<MailIcon />}
                    placeholder="you.khp@iba-suk.edu.pk" autoComplete="email"
                    value={formData.email} onChange={onEmailChange} error={errors.email} suffix={sendButton}
                />

                {otpSentTo && (
                    <div className={`field ${otpMessage ? "field--error" : ""}`}>
                        <div className="otp">
                            <label htmlFor="otp-0">Verification code</label>
                            <OtpInput
                                key={otpRound}
                                onChange={checkCode}
                                disabled={verified}
                                status={verified ? "ok" : otpError ? "bad" : ""}
                            />
                            <div className={`otp__meta ${verified ? "verified" : ""}`}>
                                {verified
                                    ? "Email verified."
                                    : secondsLeft > 0
                                    ? `Code sent to ${otpSentTo}. You can request a new one in ${mmss(secondsLeft)}.`
                                    : "Didn't get it? Tap Resend OTP."}
                            </div>
                        </div>
                    </div>
                )}
                {otpMessage && <p className="field__error" style={{ marginTop: -8, marginBottom: 14 }}>{otpMessage}</p>}

                <Field
                    id="password" name="password" label="Password" type="password" icon={<LockIcon />}
                    placeholder="Create a strong password" autoComplete="new-password"
                    value={formData.password} onChange={onChange} error={errors.password}
                />
                <Field
                    id="confirm" name="confirm" label="Confirm Password" type="password" icon={<LockIcon />}
                    placeholder="Re-enter your password" autoComplete="new-password"
                    value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm}
                />

                <div style={{ marginBottom: 14 }}>
                    <label className="check">
                        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                        <span>I agree to Findora's <a className="link" href="/terms">Terms of Service</a> and <a className="link" href="/privacy">Privacy Policy</a>.</span>
                    </label>
                    {errors.agree && <p className="field__error">{errors.agree}</p>}
                </div>

                <button className="btn" type="submit" disabled={loading}>
                    {loading ? "Creating..." : <>Create account <ArrowIcon /></>}
                </button>
            </form>
        </AuthLayout>
    )
}

export default SignupPage;