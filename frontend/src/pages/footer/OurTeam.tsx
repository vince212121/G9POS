import React from "react";

type Props = {};

const OurTeam = (props: Props) => {
  return (
    <div className="lg:mx-4 my-8 w-screen flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">Our Team</h2>
      <div className="space-y-4 w-1/2">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a neque eu
          tortor ullamcorper dapibus. Curabitur id justo sit amet ante hendrerit
          porta non nec arcu. Pellentesque malesuada convallis pretium. Vivamus
          in neque scelerisque, rhoncus augue sed, ullamcorper urna. Cras
          fermentum id ligula ac rhoncus. Nam nec egestas erat, aliquet laoreet
          tortor. In aliquam pharetra ipsum a varius. In a turpis in eros
          pharetra dignissim. Mauris fringilla a leo et sollicitudin. Aenean
        </p>
        <img className="" alt="office" src="/images/office1.png" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a neque eu
          tortor ullamcorper dapibus. Curabitur id justo sit amet ante hendrerit
          porta non nec arcu. Pellentesque malesuada convallis pretium. Vivamus
          in neque scelerisque, rhoncus augue sed, ullamcorper urna. Cras
          fermentum id ligula ac rhoncus. Nam nec egestas erat, aliquet laoreet
          tortor. In aliquam pharetra ipsum a varius. In a turpis in eros
          pharetra dignissim. Mauris fringilla a leo et sollicitudin. Aenean
        </p>
        <img className="" alt="office" src="/images/office2.png" />
      </div>
    </div>
  );
};

export default OurTeam;
