import React, { useEffect, useState } from "react";
import { CheckCircle, QrCode, UserCheck } from "lucide-react";
// import { motion, AnimatePresence } from 'motion/react';

interface ScanAlertProps {
  isVisible: boolean;
  message: string;
  type?: "scan" | "attendance";
  onClose: () => void;
  duration?: number;
}

export function ScanAlert({
  isVisible,
  message,
  type = "scan",
  onClose,
  duration = 3000,
}: ScanAlertProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Allow animation to complete
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "attendance":
        return <UserCheck className="h-8 w-8" />;
      default:
        return <QrCode className="h-8 w-8" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "attendance":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-800",
          icon: "text-green-600 dark:text-green-400",
          text: "text-green-800 dark:text-green-200",
          accent: "bg-green-600 dark:bg-green-500",
        };
      default:
        return {
          bg: "bg-orange-50 dark:bg-orange-900/20",
          border: "border-orange-200 dark:border-orange-800",
          icon: "text-orange-600 dark:text-orange-400",
          text: "text-orange-800 dark:text-orange-200",
          accent: "bg-orange-600 dark:bg-orange-500",
        };
    }
  };

  const colors = getColors();

  return (
    // <AnimatePresence>
    //   {show && (
    //     <motion.div
    //       initial={{ opacity: 0 }}
    //       animate={{ opacity: 1 }}
    //       exit={{ opacity: 0 }}
    //       className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
    //       onClick={() => {
    //         setShow(false);
    //         setTimeout(onClose, 300);
    //       }}
    //     >
    //       <motion.div
    //         initial={{ scale: 0.8, opacity: 0, y: 20 }}
    //         animate={{ scale: 1, opacity: 1, y: 0 }}
    //         exit={{ scale: 0.8, opacity: 0, y: 20 }}
    //         transition={{
    //           type: "spring",
    //           stiffness: 300,
    //           damping: 25
    //         }}
    //         className={`
    //           relative mx-4 max-w-sm w-full p-6 rounded-2xl border-2 shadow-2xl
    //           ${colors.bg} ${colors.border}
    //         `}
    //         onClick={(e) => e.stopPropagation()}
    //       >
    //         {/* Top accent bar */}
    //         <div className={`absolute top-0 left-4 right-4 h-1 ${colors.accent} rounded-b-full`} />

    //         {/* Success check animation */}
    //         <div className="flex items-center justify-center mb-4">
    //           <motion.div
    //             initial={{ scale: 0 }}
    //             animate={{ scale: 1 }}
    //             transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
    //             className={`
    //               relative p-3 rounded-full ${colors.bg} border-2 ${colors.border}
    //             `}
    //           >
    //             <motion.div
    //               initial={{ scale: 0 }}
    //               animate={{ scale: 1 }}
    //               transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
    //               className={colors.icon}
    //             >
    //               {getIcon()}
    //             </motion.div>

    //             {/* Success checkmark overlay */}
    //             <motion.div
    //               initial={{ scale: 0, opacity: 0 }}
    //               animate={{ scale: 1, opacity: 1 }}
    //               transition={{ delay: 0.6, type: "spring", stiffness: 400 }}
    //               className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1"
    //             >
    //               <CheckCircle className="h-4 w-4" />
    //             </motion.div>
    //           </motion.div>
    //         </div>

    //         {/* Message */}
    //         <motion.div
    //           initial={{ opacity: 0, y: 10 }}
    //           animate={{ opacity: 1, y: 0 }}
    //           transition={{ delay: 0.3 }}
    //           className="text-center"
    //         >
    //           <h3 className={`text-lg font-semibold mb-2 ${colors.text}`}>
    //             {message}
    //           </h3>
    //           <p className={`text-sm ${colors.text} opacity-75`}>
    //             {type === 'attendance' ? 'Your attendance has been logged' : 'QR code processed successfully'}
    //           </p>
    //         </motion.div>

    //         {/* Progress bar */}
    //         <motion.div
    //           className={`mt-4 h-1 ${colors.bg} rounded-full overflow-hidden`}
    //         >
    //           <motion.div
    //             initial={{ width: "100%" }}
    //             animate={{ width: "0%" }}
    //             transition={{ duration: duration / 1000, ease: "linear" }}
    //             className={`h-full ${colors.accent} rounded-full`}
    //           />
    //         </motion.div>

    //         {/* Tap to dismiss hint */}
    //         <motion.p
    //           initial={{ opacity: 0 }}
    //           animate={{ opacity: 1 }}
    //           transition={{ delay: 1 }}
    //           className={`text-xs text-center mt-2 ${colors.text} opacity-50`}
    //         >
    //           Tap to dismiss
    //         </motion.p>
    //       </motion.div>
    //     </motion.div>
    //   )}
    // </AnimatePresence>
    <div></div>
  );
}
