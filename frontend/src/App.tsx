import React from "react";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";

/*
  SVG icons:
    https://heroicons.dev/
  SVG cleaner:
    https://jakearchibald.github.io/svgomg/
  tailwindcss:
    https://tailwindcss.com/
*/

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {/* TODO: Create the other routes for the pages */}
      </Route>
    </Routes>
  );
};

export default App;
