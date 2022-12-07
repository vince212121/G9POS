import React from "react";
import Accordion from "../../components/accordion";

type Props = {};

const FAQ = (props: Props) => {
  return (
    <div className="lg:mx-4 my-8 w-screen h-screen flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">FAQ</h2>
      <h1> Freqently Asked Question</h1>
      <Accordion title="Question">
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam labore,
          accusamus possimus dicta provident repellendus fuga id itaque vel aut
          ipsa suscipit quasi alias sint totam quibusdam maiores veniam facere.
        </p>
      </Accordion>
      <Accordion title="Question">
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam labore,
          accusamus possimus dicta provident repellendus fuga id itaque vel aut
          ipsa suscipit quasi alias sint totam quibusdam maiores veniam facere.
        </p>
      </Accordion>
      <Accordion title="Question">
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam labore,
          accusamus possimus dicta provident repellendus fuga id itaque vel aut
          ipsa suscipit quasi alias sint totam quibusdam maiores veniam facere.
        </p>
      </Accordion>
    </div>
  );
};

export default FAQ;
