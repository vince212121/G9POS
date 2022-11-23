import React from "react";

type Props = {};

// TODO: Refer to terms and conditions for layout
// TODO: either make a form with email and content or put text to send to a generic email ex. "donotuse@someemail.com"
const ContactUs = (props: Props) => {
  return (
    <div className="lg:mx-4 my-8 w-screen flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">Contact Us</h2>
    </div>
  );
};

export default ContactUs;
