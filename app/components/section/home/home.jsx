"use client";

import { useState } from "react";
import Hero from "./hero";
import Nav from "../../nav";
import Loader from "../../loader";

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
   {/*    <Loader loading={loading} setLoading={setLoading} />
 */}
      <Nav />
      <main className="w-full h-screen overflow-hidden z-10">
        <Hero loading={loading} />
      </main>
    </div>
  );
};

export default HomePage;
