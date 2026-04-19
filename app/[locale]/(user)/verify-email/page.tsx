"use client"

import { useEffect, useState } from "react"
import { HiOutlineLockClosed } from "react-icons/hi"
import { motion } from "framer-motion"
import axios from "axios"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
const VerifyCode = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""])
    const [time, setTime] = useState<number>(2)
    const router = useRouter()
    const handleChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return

        const newCode = [...code]
        newCode[index] = value.slice(-1)
        setCode(newCode)

        // auto focus next input
        if (value && index < 5) {
            const next = document.getElementById(`otp-${index + 1}`)
            next?.focus()
        }
    }
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()

        const pasted = e.clipboardData.getData("text").replace("/\D/g", "")
        const newCode = [...code]
        pasted.split("").forEach((digit, i) => {
            if (i < 6) {
                newCode[i] = digit
            }
        })
        setCode(newCode)

        const nextIndex = Math.min(pasted.length, 5)
        const next = document.getElementById(`opt-${nextIndex}`)
        next?.focus()
    }
    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {

        if (e.code === "ArrowRight") {
            const next = document.getElementById(`otp-${i + 1}`)
            next?.focus()

        }
        else if (e.code === "ArrowLeft") {

            const prev = document.getElementById(`otp-${i - 1}`)
            prev?.focus()

        }

    }
    const verifyCode = async () => {

        try {

            const isfiled = code.some(item => item === "")
            if (isfiled) return toast.error("Please enter all the digits")

            await axios.post("/api/auth/verify", {
                code: code.join(""),
            })

            toast.success("تم التحقق من البريد الإلكتروني بنجاح")
            router.push("/")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "حدث خطأ أثناء التحقق من البريد الإلكتروني")
            } else {
                toast.error("حدث خطأ أثناء التحقق من البريد الإلكتروني")
            }
            console.log(error);

        }
    }

    const resendCode = async () => {
        try {
            toast.loading("جاري ارسال رمز تحقق جديد")
            await axios.post("/api/auth/verify/resend")
            setTime(30)
            toast.dismiss()
            toast.success("تم ارسال رمز تحقق اخر بنجاح راجع بريدك الالكتروني")

        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "حدث خطأ أثناء التحقق من البريد الإلكتروني")
            } else {
                toast.error("حدث خطأ أثناء التحقق من البريد الإلكتروني")
            }
            console.log(error);

        }
    }
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prev => prev - 1)
            if (time <= 0) {
                clearInterval(interval)
            }

        }, 1000);
        return () => clearInterval(interval)
    }, [time])
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950 overflow-hidden">

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl grid md:grid-cols-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >

                {/* LEFT SIDE */}
                <div className="p-10 bg-gradient-to-br from-indigo-600/20 to-purple-600/10 flex flex-col justify-center">
                    <HiOutlineLockClosed className="text-indigo-400 text-5xl mb-6" />

                    <h1 className="text-3xl font-bold text-white mb-4">
                        Verify your email
                    </h1>

                    <p className="text-white/60 leading-relaxed">
                        We sent a 6-digit verification code to your email.
                        Please enter it below to activate your account.
                    </p>

                    <div className="mt-6 text-sm text-white/40">
                        Didn’t receive the code? You can resend it after 30 seconds.
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="p-10 flex flex-col justify-center">

                    <h2 className="text-white text-xl font-bold mb-6">
                        Enter verification code
                    </h2>

                    {/* OTP INPUTS */}
                    <div className="flex gap-3 justify-center mb-8">
                        {code.map((digit, i) => (
                            <input
                                key={i}
                                onKeyDown={e => handleKey(e, i)}
                                id={`otp-${i}`}
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, i)}
                                onPaste={handlePaste}
                                className="w-12 h-14 text-center text-xl font-bold bg-white/5 border border-white/10 text-white rounded-xl focus:border-indigo-500 outline-none transition"
                                maxLength={1}
                            />
                        ))}
                    </div>

                    {/* BUTTON */}
                    <button
                        disabled={code.some(item => item === "")}
                        onClick={verifyCode}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed">
                        Verify Code
                    </button>

                    {/* RESEND */}
                    <p className="text-center text-white/40 text-sm mt-6">
                        Didn’t get code?{" "}
                        {time <= 0 ? (
                            <button onClick={resendCode} disabled={time > 0} className="text-indigo-400 hover:text-indigo-300">
                                Resend
                            </button>
                        ) : (
                            <span className="text-indigo-400 hover:text-indigo-300" >
                                00:{time > 9 ? time : `0${time}`}
                            </span>
                        )}
                    </p>

                </div>

            </motion.div>
        </div>
    )
}

export default VerifyCode