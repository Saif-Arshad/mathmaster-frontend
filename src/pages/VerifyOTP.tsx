
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Calculator } from 'lucide-react';

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const { verifyOTP, resendOTP, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
   
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [ navigate]);
  // useEffect(() => {
    
  //   if (error && error == "Email already in use." || error =="Username already taken."){
  //     toast.e
  //   }
    

  // }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    const success = await verifyOTP(otp);
    if (success) {
      toast({
        title: "Verification Successful",
        description: "Your account has been verified!",
      });
      navigate('/login');
    }
  };

  const handleResendOTP = async () => {
    await resendOTP();
    setTimeLeft(60);
    toast({
      title: "OTP Resent",
      description: "A new verification code has been sent to your email",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-start">
         
          <CardTitle className="text-2xl font-bold text-start">Verify Your Email</CardTitle>
          <CardDescription className="text-start">
            We've sent a verification code to your 
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-2">
                  Enter the 6-digit code below
                </p>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                />
              </div>
              
              {error && (
                <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
              )}
              
              <Button
                type="submit"
                className="w-full bg-mathpath-purple hover:bg-purple-600 mb-4"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify Account"}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendOTP}
                  disabled={timeLeft > 0 || isLoading}
                  className="text-mathpath-purple"
                >
                  {timeLeft > 0 ? `Resend OTP (${timeLeft}s)` : "Resend OTP"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOTP;
