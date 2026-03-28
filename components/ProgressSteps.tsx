import React from "react";

interface ProgressStepsProps {
  currentStep: number;
}

export default function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const steps = ["Group", "Payment", "Gacha"];

  return (
    <div className="flex items-center gap-1 sm:gap-2 mb-6 w-full">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = currentStep > stepNum;
        const isCurrent = currentStep === stepNum;
        const isActive = isCompleted || isCurrent;

        return (
          <React.Fragment key={label}>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-300 shrink-0"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, #FF8FAB, #FFB7C5)"
                    : "rgba(255,183,197,0.3)",
                  color: isActive ? "white" : "#FFB7C5",
                  boxShadow: isCurrent ? "0 0 10px rgba(255, 143, 171, 0.5)" : "none",
                }}
              >
                {isCompleted ? "✓" : stepNum}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                  isActive ? "text-pink-400" : "text-gray-300"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-0.5 rounded-full transition-all duration-300"
                style={{
                  background: isCompleted ? "#FFB7C5" : "rgba(255,183,197,0.3)",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
