import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

// TODO: Refer to terms and conditions for layout
// TODO: either make a form with email and content or put text to send to a generic email ex. "donotuse@someemail.com"
const EmailSent = (props: Props) => {
  const navigate = useNavigate();
  return (
    <div className="lg:mx-4 my-8 w-screen flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">Email Successfully Sent</h2>
      <h3>Thank you for opinion.</h3>
      <h3>Your inqurity just sent to our customer support team.</h3>
      <h3>We will reach you out as soon as possible!</h3>

    </div>
  );
};

export default EmailSent;
