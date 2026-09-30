"use client";

import { useState } from "react";
import Hero from "./hero";
import Nav from "../../nav";
 
import Loader from "../../loader";

const HomePage = ({ data = [] }) => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loader onFinish={() => setLoading(false)} />}

      <Nav />
      <main className="w-full h-screen overflow-hidden">
        <Hero loading={loading} />
      </main>

   
    </>
  );
};

export default HomePage;
