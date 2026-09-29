"use client";

import { useState } from "react";
import Hero from "./hero";
import Nav from "../../nav";
import Footer from "../../footer";
import Loader from "../../loader";
import { AnimatePresence } from "framer-motion";
import { Filter } from "../../filter";
import { useFilter } from "@/app/stores/zustand";

const HomePage = ({ data = [] }) => {
  const [loading, setLoading] = useState(true);
  const { filterModal, setFilterModal } = useFilter();
  const [sort, setSort] = useState("az");
  const [year, setYear] = useState("all");
  const [stack, setStack] = useState("all");
 
  const years = [...new Set(data.map((d) => d.year))].sort();
  const stacks = [...new Set(data.map((d) => d.stack))].sort();

  const filteredData = data
    .filter((item) => (year === "all" ? true : item.year === year))
    .filter((item) => (stack === "all" ? true : item.stack === stack))
    .sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      if (sort === "za") return b.title.localeCompare(a.title);
      return 0;
    });

  return (
    <>
      {loading && <Loader onFinish={() => setLoading(false)} />}

      {!loading && (
        <>
          <Nav />
          <main className="w-full h-screen overflow-hidden">
            <Hero filteredData={filteredData}   />
          </main>
          <AnimatePresence mode="wait">
            {filterModal && (
              <Filter
                sort={sort}
                setSort={setSort}
                year={year}
                setYear={setYear}
                stack={stack}
                setStack={setStack}
                years={years}
                stacks={stacks}
             
                setFilterModal={setFilterModal}
              />
            )}
          </AnimatePresence>
       {/*    <Footer /> */}
        </>
      )}
    </>
  );
};

export default HomePage;
