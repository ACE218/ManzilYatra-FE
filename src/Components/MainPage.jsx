import React from "react";
import { motion } from "framer-motion";
import Hero from "./Hero";
import Service from "./Service";
import Recommendation from "./Recommendation";
import Testimonials from "./Testimonials";
import Footer from "./Footer";

function MainPage() {
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="main-page"
    >
      <Hero />
      <Service />
      <Recommendation />
      <Testimonials />
      <Footer />
    </motion.div>
  );
}

export default MainPage;