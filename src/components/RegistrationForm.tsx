import Link from 'next/link';
import { useState, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  Building,
  CreditCard,
  Copy,
  Check,
  Upload,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { EVENT_INFO } from '@/lib/constants';

type Step = 1 | 2 | 3;

interface FormData {
  name: string;
  email: string;
  phone: string;
  roll_college: string;
  utr: string;
  screenshot: File | null;
}

export default function RegistrationForm() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    roll_college: '',
    utr: '',
    screenshot: null,
  });
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (stepRef.current) {
      const children = stepRef.current.children[0]?.children;
      if (children) {
        gsap.fromTo(
          children,
          { opacity: 0, y: 20, filter: 'blur(10px)' },
          { 
            opacity: 1, 
            y: 0, 
            filter: 'blur(0px)', 
            duration: 0.6, 
            stagger: 0.1, 
            ease: 'power3.out',
            clearProps: 'all'
          }
        );
      }
    }
  }, [step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, screenshot: e.target.files![0] }));
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(EVENT_INFO.upi_id);
    setCopied(true);
    toast.success('UPI ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email');
      return false;
    }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!formData.roll_college.trim()) {
      toast.error('Please enter your roll number / college');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.utr.trim()) {
      toast.error('Please enter UTR / Transaction ID');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('email', formData.email);
      formPayload.append('phone', formData.phone);
      formPayload.append('roll_college', formData.roll_college);
      formPayload.append('utr', formData.utr);
      if (formData.screenshot) {
        formPayload.append('screenshot', formData.screenshot);
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        body: formPayload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setRegistrationId(data.registrationId);
      setStep(3);
      toast.success('Registration submitted successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={formRef} className="w-full max-w-xl mx-auto">
      {/* Progress Steps - Enhanced for Mobile */}
      <div className="flex items-center justify-between mb-12 px-2 max-w-sm mx-auto">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center last:flex-none">
            <div className="relative flex flex-col items-center">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-sm md:text-lg transition-all duration-700 ${
                  step >= s
                    ? 'bg-gold text-navy shadow-[0_0_30px_rgba(212,175,55,0.4)]'
                    : 'bg-navy-light/50 text-gold/20 border border-gold/10'
                }`}
              >
                {step > s ? <Check className="w-5 h-5 md:w-6 md:h-6" /> : s}
              </div>
              <span className={`absolute -bottom-6 whitespace-nowrap text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${step >= s ? 'text-gold' : 'text-gold/20'}`}>
                {s === 1 ? 'Ident' : s === 2 ? 'Remit' : 'Auth'}
              </span>
            </div>
            {s < 3 && (
              <div className="w-12 sm:w-20 md:w-24 h-px mx-2 md:mx-4 relative overflow-hidden bg-gold/10">
                <div
                  className="absolute inset-0 bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)] transition-transform duration-1000 ease-in-out origin-left"
                  style={{ transform: `scaleX(${step > s ? 1 : 0})` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div ref={stepRef}>
        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="award-card rounded-3xl p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <User className="w-32 h-32 text-gold" />
            </div>
            
            <h2 className="text-3xl font-black tracking-tight text-gradient-gold mb-2 uppercase italic">Registration</h2>
            <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.4em] mb-10">Credentials & Information</p>

            <div className="space-y-6">
              <div className="group/input relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                  <User className="w-4 h-4 text-gold/30 group-focus-within/input:text-gold group-focus-within/input:scale-110 transition-all duration-300" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="input-elegant w-full pl-14 pr-6 py-5 rounded-2xl text-base font-bold tracking-tight bg-navy-light/30 border-gold/10 focus:border-gold/40 focus:bg-navy-light/50 transition-all duration-500"
                />
              </div>

              <div className="group/input relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gold/30 group-focus-within/input:text-gold group-focus-within/input:scale-110 transition-all duration-300" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="input-elegant w-full pl-14 pr-6 py-5 rounded-2xl text-base font-bold tracking-tight bg-navy-light/30 border-gold/10 focus:border-gold/40 focus:bg-navy-light/50 transition-all duration-500"
                />
              </div>

              <div className="group/input relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-gold/30 group-focus-within/input:text-gold group-focus-within/input:scale-110 transition-all duration-300" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="input-elegant w-full pl-14 pr-6 py-5 rounded-2xl text-base font-bold tracking-tight bg-navy-light/30 border-gold/10 focus:border-gold/40 focus:bg-navy-light/50 transition-all duration-500"
                />
              </div>

              <div className="group/input relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                  <Building className="w-4 h-4 text-gold/30 group-focus-within/input:text-gold group-focus-within/input:scale-110 transition-all duration-300" />
                </div>
                <input
                  type="text"
                  name="roll_college"
                  value={formData.roll_college}
                  onChange={handleInputChange}
                  placeholder="Roll No. / College"
                  className="input-elegant w-full pl-14 pr-6 py-5 rounded-2xl text-base font-bold tracking-tight bg-navy-light/30 border-gold/10 focus:border-gold/40 focus:bg-navy-light/50 transition-all duration-500"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              className="btn-gold w-full mt-12 py-5 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.2em] shadow-2xl group/btn overflow-hidden"
            >
              <span className="relative z-10">Proceed to Payment</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        )}

        {/* Step 2: Payment Instructions */}
        {step === 2 && (
          <div className="award-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <CreditCard className="w-32 h-32 text-gold -rotate-12" />
            </div>

            <h2 className="text-3xl font-black tracking-tight text-gradient-gold mb-2 uppercase italic">Payment</h2>
            <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.4em] mb-10">Verification & Access</p>

            {/* Fee display */}
            <div className="bg-navy-light/40 rounded-[2rem] p-8 mb-10 text-center border border-gold/10 relative overflow-hidden group/fee">
              <div className="absolute inset-0 bg-gold/5 -translate-x-full group-hover/fee:translate-x-full transition-transform duration-1000 ease-in-out" />
              <p className="text-gold/40 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Amount to Remit</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-gold/60 text-2xl font-light">₹</span>
                <p className="text-6xl font-black text-gradient-gold tracking-tighter">{EVENT_INFO.fee}</p>
              </div>
            </div>

            {/* UPI QR Code */}
            <div className="flex flex-col items-center mb-10">
              <div className="bg-white p-5 rounded-[2.5rem] mb-6 shadow-2xl group/qr transition-all duration-700 hover:scale-105 hover:rotate-1">
                <div className="relative">
                  <Image
                    src={EVENT_INFO.upi_qr_url}
                    alt="UPI QR Code"
                    width={200}
                    height={200}
                    className="w-44 h-44 rounded-2xl"
                  />
                  <div className="absolute inset-0 border-2 border-navy/5 rounded-2xl" />
                </div>
              </div>
              <p className="text-foreground/40 text-[9px] font-black uppercase tracking-[0.4em] mb-8">Scan for Instant Transfer</p>
              
              <div className="w-full flex items-center gap-3">
                <div className="flex-1 bg-navy-light/30 rounded-2xl px-6 py-4 flex items-center justify-between border border-gold/5 group/upi transition-all duration-500 hover:border-gold/20">
                  <div className="flex flex-col">
                    <span className="text-gold/40 text-[8px] font-black uppercase tracking-widest mb-1">UPI ID</span>
                    <span className="text-foreground/80 font-mono text-sm font-bold tracking-tight">{EVENT_INFO.upi_id}</span>
                  </div>
                  <button
                    onClick={copyUpiId}
                    className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold/40 hover:text-gold hover:bg-gold/20 transition-all duration-300"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* UTR Input */}
            <div className="space-y-6 mb-10">
              <div className="group/input relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                  <Check className="w-4 h-4 text-gold/30 group-focus-within/input:text-gold transition-all duration-300" />
                </div>
                <input
                  type="text"
                  name="utr"
                  value={formData.utr}
                  onChange={handleInputChange}
                  placeholder="Enter Transaction ID / UTR"
                  className="input-elegant w-full pl-14 pr-6 py-5 rounded-2xl text-base font-bold tracking-tight bg-navy-light/30 border-gold/10 focus:border-gold/40 transition-all duration-500"
                />
              </div>

              {/* Screenshot upload */}
              <label className="block group/upload cursor-pointer">
                <div className="border border-dashed border-gold/20 rounded-2xl p-6 text-center transition-all duration-500 bg-gold/0 group-hover/upload:bg-gold/5 group-hover/upload:border-gold/40">
                  <Upload className="w-6 h-6 text-gold/20 mx-auto mb-3 group-hover/upload:scale-110 group-hover/upload:text-gold/40 transition-all duration-500" />
                  <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.2em]">
                    {formData.screenshot
                      ? formData.screenshot.name
                      : 'Upload Evidence (Optional)'}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Verification Note */}
            <div className="bg-gold/5 rounded-2xl p-6 mb-10 border border-gold/10 flex gap-4 items-start">
              <AlertCircle className="w-5 h-5 text-gold/40 shrink-0 mt-0.5" />
              <p className="text-[11px] text-foreground/50 leading-relaxed font-medium">
                Verification takes <span className="text-gold font-bold">2-4 hours</span>. 
                Your digital pass will be dispatched to your registered email immediately upon confirmation.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="w-16 h-16 rounded-2xl bg-navy-light/30 border border-gold/10 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold/40 transition-all duration-300"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-gold flex-1 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.2em] shadow-2xl disabled:opacity-50 relative overflow-hidden group/btn"
              >
                <span className="relative z-10">{loading ? 'Processing...' : 'Complete RSVP'}</span>
                {!loading && <Sparkles className="w-4 h-4 transition-transform group-hover/btn:rotate-12 relative z-10" />}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && registrationId && (
          <div className="award-card rounded-[3rem] p-12 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-radial-gradient from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative z-10">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-12 animate-float">
                <Trophy className="w-12 h-12 text-navy -rotate-12" />
              </div>

              <h2 className="text-4xl font-black tracking-tighter text-gradient-gold mb-4 uppercase italic">
                Awaiting
              </h2>
              <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Entry Submission Recorded</p>

              <div className="bg-navy-light/30 rounded-[2.5rem] p-10 mb-10 border border-gold/10 relative overflow-hidden group/id">
                <div className="absolute top-0 left-0 w-full h-1 bg-gold scale-x-0 group-hover/id:scale-x-100 transition-transform duration-700 origin-left" />
                <p className="text-gold/30 text-[9px] font-black uppercase tracking-[0.4em] mb-4">Reference Protocol</p>
                <p className="text-4xl font-black text-white font-mono tracking-tighter">
                  #{registrationId.substring(0, 8).toUpperCase()}
                </p>
              </div>

              <div className="bg-gold/5 rounded-2xl p-8 mb-12 border border-gold/10">
                <p className="text-sm text-foreground/60 leading-relaxed font-medium">
                  Protocol initiated. Verification for <strong className="text-gold font-black">{formData.email}</strong> is in progress.
                </p>
              </div>

              <Link
                href="/"
                className="btn-outline-gold inline-flex items-center gap-3 px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-gold hover:text-navy transition-all duration-500"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Command
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

