import React from 'react';
import { TrendingUp, PiggyBank, BarChart3, Shield } from 'lucide-react';
import Button from './Button';

type OnboardingScreenProps = {
  onGetStarted: () => void;
};

export default function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-between p-8 bg-gradient-to-b from-[#F6F8FF] to-white">
      {/* Illustration Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-64 h-64">
          {/* Decorative circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#2F80ED]/20 to-[#5B9FED]/10 animate-pulse" />
          </div>
          
          {/* Icons arranged in a circle */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2">
            <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
              <PiggyBank size={32} className="text-[#2F80ED]" />
            </div>
          </div>
          
          <div className="absolute bottom-8 left-8">
            <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center">
              <TrendingUp size={28} className="text-[#10B981]" />
            </div>
          </div>
          
          <div className="absolute bottom-8 right-8">
            <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center">
              <BarChart3 size={28} className="text-[#F59E0B]" />
            </div>
          </div>
          
          {/* Center element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 rounded-[20px] bg-gradient-to-br from-[#2F80ED] to-[#5B9FED] shadow-2xl flex items-center justify-center transform rotate-12">
              <div className="transform -rotate-12">
                <span className="text-4xl">₹</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-[#1A1A1A]">
            Manage Your Expenses Easily
          </h1>
          <p className="text-[#6B7280]">
            Track spending, set budgets, and take control of your student life.
          </p>
        </div>

        {/* CTA Button */}
        <Button variant="primary" size="large" fullWidth onClick={onGetStarted}>
          Get Started
        </Button>

        {/* Privacy notice */}
        <div className="flex items-center justify-center gap-2 text-[#9CA3AF] text-sm">
          <Shield size={16} />
          <span>Your data stays on this device only.</span>
        </div>
      </div>
    </div>
  );
}
