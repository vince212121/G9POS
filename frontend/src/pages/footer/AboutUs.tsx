import React from "react";

type Props = {};

const AboutUs = (props: Props) => {
  return (
    <div className="lg:mx-4 my-8 w-screen h-screen flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">About Us</h2>
      <div className="space-y-4 w-1/2">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a neque eu
          tortor ullamcorper dapibus. Curabitur id justo sit amet ante hendrerit
          porta non nec arcu. Pellentesque malesuada convallis pretium. Vivamus
          in neque scelerisque, rhoncus augue sed, ullamcorper urna. Cras
          fermentum id ligula ac rhoncus. Nam nec egestas erat, aliquet laoreet
          tortor. In aliquam pharetra ipsum a varius. In a turpis in eros
          pharetra dignissim. Mauris fringilla a leo et sollicitudin. Aenean
          auctor non tellus vel iaculis. Phasellus velit nisl, condimentum in
          magna a, vulputate pretium magna. Etiam ut nunc lacus. Mauris
          fringilla tortor eu scelerisque dapibus. Vivamus placerat dui eget
          sagittis sagittis. Sed lobortis velit vel risus volutpat, id
          pellentesque massa rutrum. Proin vehicula ac lorem vitae pulvinar.
          Pellentesque id turpis vel purus lobortis eleifend. Nulla dapibus,
          tellus nec egestas lacinia, orci tellus semper magna, id placerat quam
          dui in lorem. Quisque blandit quis eros sed imperdiet. Morbi et justo
          sed eros auctor suscipit non vel dui.
        </p>
      </div>
      <img className="w-1/4 h-1/2" alt="office" src="/images/logo.png" />
    </div>
  );
};

export default AboutUs;
