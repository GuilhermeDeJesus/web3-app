import { Button, Container } from "react-bootstrap";
import { motion } from "framer-motion";
import AnimationTitles from "../components/functions/AnimationTitles";

function AboutUs() {
  return (
    <div className="about">
      <Container className="d-flex justify-content-between flex-wrap flex-md-nowrap">
        <motion.div
          initial={{ x: -200 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <AnimationTitles title="What is Renting-Platform?" className="title" />
          <p className="gray-50 mb-5">
            As new technologies like cryptocurrency develop, the real estate
            sector is changing drastically. It is important to understand both
            how these technologies and the traditional real estate market work.
            Governments are unable to comprehend the rapid advancement of
            technology and modify their legal frameworks to accommodate it fast
            enough.
          </p>
          <Button variant="primary ms-0">Read More</Button>
        </motion.div>
        <motion.div
          initial={{ x: 200 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 0.8 }}
          className="d-flex flex-column"
        >
          <div className="d-flex">
            <div>
              <img
                src={new URL("..//images/bohdan-d-fh6o-XkVQG8-unsplash.webp", import.meta.url).href}
                className="p-0 me-2 img"
                alt="img"
              />
            </div>
            <div>
              <img
                src={new URL("..//images/john-o-nolan-6f_ANCcbj3o-unsplash.webp", import.meta.url).href}
                className="p-0 img"
                alt="img"
              />
            </div>
          </div>
          <div className="d-flex">
            <div>
              <img
                src={new URL("..//images/julia-solonina-ci19YINguoc-unsplash.webp", import.meta.url).href}
                className="p-0 me-2 img"
                alt="img"
              />
            </div>
            <div>
              <img
                src={new URL("..//images/theater-amazonas-manaus.webp", import.meta.url).href}
                className="p-0 img"
                alt="img"
              />
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}

export default AboutUs;
