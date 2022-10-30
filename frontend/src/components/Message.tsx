import React, { useEffect } from "react";

type Props = {
  message: string;
  error?: boolean;
  confirmation?: boolean;
  duration?: number;
  setMessage: any;
  showMessage: boolean;
};

const Message = ({
  message,
  error,
  confirmation,
  duration = 3000,
  showMessage,
  setMessage,
}: Props) => {
  useEffect(() => {
    setTimeout(() => setMessage(false), duration);
  });

  return showMessage ? (
    <div
      className={`fixed mb-8 bottom-0 right-5 flex items-center p-4 space-x-4 w-full max-w-xs rounded-lg border shadow z-10 ${
        error
          ? "bg-red-50 text-red-900 border-red-900"
          : confirmation
          ? "bg-green-50 text-green-900 border-green-900"
          : "bg-gray-100 text-gray-700 border-gray-700"
      }`}
    >
      <div className="pl-4 text-base font-normal">{message}</div>
    </div>
  ) : null;
};

export default Message;
