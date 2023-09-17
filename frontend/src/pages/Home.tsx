import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {useEffect, useState} from "react";
import { motion, AnimatePresence} from "framer-motion";
import Cards from "../components/Cards";
import Footer from "../components/Footer";

const imageList1 = ["H.png","E.png","L.png","L.png","O.png","blank.png","I.png","blank.png","A.png","M.png"];
const imageList2 = ["H.png","E.png","R.png","E.png","blank.png","T.png","O.png","blank.png","H.png","E.png","L.png","P.png"];

interface DivContent1Props {
  handleClick: () => void;
}
const DivContent1: React.FC<DivContent1Props> = ({ handleClick }) => (<div className="bg-maroon flex items-center justify-center" data-aos="flip-left" data-aos-duration="1000">
  <div className="flex flex-row items-center justify-center flex-wrap">
    <img className="m-8 max-w-xl" src="./images/person2.png" alt="person2" />
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-light-gold mb-4">
        Real-time Translation
      </h2>
      <div className="max-w-prose">
        <p className="text-lg text-center mb-8 text-light-gold">
          Our product uses advanced machine learning algorithms to translate sign language in real time, making communication easier for everyone.
        </p>
      </div>
      <div>
        <button
            onClick={handleClick}
            className="bg-orange hover:bg-light-orange hover:-translate-y-1 transform transition duration-3 shadow-lg hover:shadow-2xl text-light-gold font-bold p-4 text-xl rounded-full"
        >
          Animation
        </button>
      </div>
    </div>
  </div>
</div>
);
interface DivContent2Props {
  trigger: boolean;
  handleClick: () => void;
}
const DivContent2: React.FC<DivContent2Props> = ({ trigger,handleClick }) => {
  return (
      <div className="bg-maroon flex flex-row items-center justify-center" data-aos="flip-right"
           data-aos-duration="1000">
        <div className="flex flex-col items-center justify-center flex-shrink-1 flex-grow-0 flex-basis-auto m-6">
          <img className="max-w-[450px] m-4" src="./images/person2.png" alt="person"/>
          <button
              onClick={handleClick}
              className="bg-orange m-6 hover:bg-light-orange hover:-translate-y-1 transform transition duration-3 shadow-lg hover:shadow-2xl text-light-gold font-bold p-4 text-xl rounded-full"
          >
            Back to description
          </button>
        </div>
        <div className="flex flex-col items-start justify-center flex-grow">
          <div style={{position: 'relative', width: '1000px', height: '200px', top: '0'}} className="mt-[-50px]">
            {imageList1.map((src, index) => (
                <AnimatePresence key={src}>
                  {trigger && (
                      <motion.div
                          initial={{x: '0%', y: '50%', opacity: 0}}
                          animate={{x: `${index * 80}px`, opacity: 1}}
                          transition={{duration: 0.3, delay: index * 0.3}}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: '0%',
                          }}
                          exit={{x: '100%', opacity: 0}}
                      >
                        <img
                            src={`./images/${src}`}
                            alt=''
                            style={{transform: 'scale(0.8)'}}
                        />
                      </motion.div>
                  )}
                </AnimatePresence>
            ))}
          </div>
          <div style={{position: 'relative', width: '1000px', height: '200px', top: '0'}} className="mt-[-50px]">
            {imageList2.map((src, index) => (
                <AnimatePresence key={src}>
                  {trigger && (
                      <motion.div
                          initial={{x: '0%', y: '50%', opacity: 0}}
                          animate={{x: `${index * 80}px`, opacity: 1}}
                          transition={{duration: 0.3, delay: index * 0.3}}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: '0%',
                          }}
                          exit={{x: '100%', opacity: 0}}
                      >
                        <img
                            src={`./images/${src}`}
                            alt=''
                            style={{transform: 'scale(0.8)'}}
                        />
                      </motion.div>
                  )}
                </AnimatePresence>
            ))}
          </div>
          <div style={{position: 'relative', width: '1000px', height: '100px', top: '0'}} className="mt-[0px]">
            <motion.div
                initial={{ x: '0px', y: '50%', opacity: 0 }}
                animate={{ x: '690px', opacity: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1,0,1,0] }}
                transition={{ duration: 7, delay: 0.3, opacity: { yoyo: Infinity, duration: 7.3 } }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '0%',
                }}
            >
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <div style={{ marginRight: '10px' }}>
                      <img
                          src="./images/dot.png" // Make sure this path is correct
                          alt={`dot-${index}`}
                          style={{ width: '30px', height: '30px', transform: 'scale(1)' }}
                      />
                    </div>
                ))}
              </div>
            </motion.div>
          </div>
          <div style={{position: 'relative', width: '1000px', height: '100px', top: '0'}} className="mt-[0px]">
            <motion.div
                initial={{ x: '0px', y: '50%', opacity: 0 }}
                animate={{ x: '850px', opacity: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1,0,1,0] }}
                transition={{ duration: 7, delay: 0.3, opacity: { yoyo: Infinity, duration: 7.3 } }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '0%',
                }}
            >
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <div style={{ marginRight: '10px' }}>
                      <img
                          src="./images/dot.png" // Make sure this path is correct
                          alt={`dot-${index}`}
                          style={{ width: '30px', height: '30px', transform: 'scale(1)' }}
                      />
                    </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
  );
};

function Home() {
  const [trigger, setTrigger] = useState(false);
  const [showDiv1, setShowDiv1] = useState(true);
  const handleClick = () => {
    setTrigger(!trigger);
    setShowDiv1(!showDiv1);
  };
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  return (
    <div>
      <div className="bg-gray-300 flex flex-col items-center justify-center" data-aos = "fade-up">
        <div className="flex flex-row items-center justify-center flex-wrap">
          <div className="flex flex-col items-center justify-center p-8 animate-fade-up animate-delay-[300ms]">
            <h1 className="text-6xl font-bold mb-4 flex flex-row items-center justify-center">
              <img src="./images/logo-orange.png" alt="logo" className="w-16 h-16 mr-2" />
              <span className="text-light-maroon">ASL</span>
              <span className="text-light-orange">Translator</span>
            </h1>
            <p className="text-lg text-maroon text-center mb-8">
              Our product translates sign language in real time, making communication easier for everyone.
            </p>
            <Link
              to="/asl_translator"
              className="bg-orange hover:bg-light-orange hover:-translate-y-1 transform transition duration-3 shadow-lg hover:shadow-2xl text-gray-300 font-bold p-4 text-xl rounded-full"
            >
              Get Started
            </Link>
          </div>
          <img className="m-8 max-w-prose" src="./images/person.png" alt="person" />
        </div>
      </div>
      {showDiv1 ? <DivContent1 handleClick={handleClick} /> : <DivContent2 trigger={trigger} handleClick={handleClick}/>}
      <div className="flex flex-col items-center justify-center overflow-y-auto bg-gray-300" data-aos="fade-up">
        <div className="flex flex-col items-center justify-center py-8 space-y-4 overflow-y-auto" data-aos="fade-up">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-3xl font-bold text-light-orange mb-2 px-4">
              Meet our team
            </h2>
            <p className="text-lg text-center text-maroon mb-2 px-4">
              We are a team of students from Virginia Tech who are passionate about making the world a better place.
            </p>
            <div className="flex-grow px-4">
              <Cards />
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Home;