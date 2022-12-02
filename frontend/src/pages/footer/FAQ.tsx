import React from "react";
import Accordion from "../../components/accordion";


type Props = {};

// TODO: Refer to terms and conditions
const FAQ = (props: Props) => {
  return (
    <div className="lg:mx-4 my-8 w-screen flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">FAQ</h2>
      <h1> Freqently Asked Question</h1>
      <Accordion/>
      <Accordion/>
      <Accordion/>
    </div>
  );
};

export default FAQ;
