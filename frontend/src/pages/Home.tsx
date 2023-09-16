import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {useEffect, useState} from "react";
import { motion, AnimatePresence } from "framer-motion";

const imageList = ["E.png","R.png","E.png","H.png","blank.png","M.png","A.png","blank.png","I.png","blank.png","O.png", "L.png", "L.png","E.png", "H.png"];
interface DivContent1Props {
  handleClick: () => void;
}
const DivContent1: React.FC<DivContent1Props> = ({ handleClick }) => (<div className="bg-maroon flex items-center justify-center" data-aos="flip-left">
  <div className="flex flex-row items-center justify-center flex-wrap">
    <img className="m-8 max-w-xl" src="./person2.jpeg" alt="person2" />
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-gold mb-4">
        Real-time Translation
      </h2>
      <div className="max-w-prose">
        <p className="text-lg text-center mb-8 text-gold">
          Our product uses advanced machine learning algorithms to translate sign language in real time, making communication easier for everyone.
        </p>
      </div>
      <div>
        <button
            onClick={handleClick}
            className="bg-orange hover:bg-light-orange hover:-translate-y-1 transform transition duration-3 shadow-lg hover:shadow-2xl text-gold font-bold p-4 text-xl rounded-full"
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
const DivContent2: React.FC<DivContent2Props> = ({ trigger,handleClick }) => (
    <div className="bg-maroon flex items-center justify-center">
      <div style={{ position: 'relative', width: '100vw', height: '200px' }}>
          {imageList.map((src, index) => (
              <AnimatePresence key={src}>
                {trigger && (
                    <motion.div
                        initial={{ x: '100%' , y:'50%'}}
                        animate={{ x: `-${index * 100}px` }}
                        transition={{ duration: 1, delay: index * 0.5 }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                        }}
                        exit={{ x: '100%' }}
                    >
                      <img src={src} alt={`image-${index}`} />
                    </motion.div>
                )}
              </AnimatePresence>
          ))}
        </div>
      <div>
        <button
            onClick={handleClick}
            className="bg-orange hover:bg-light-orange hover:-translate-y-1 transform transition duration-3 shadow-lg hover:shadow-2xl text-gold font-bold p-4 text-xl rounded-full"
        >
          Animation
        </button>
      </div>
   </div>
);

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
              <img src="./logo-orange.png" alt="logo" className="w-16 h-16 mr-2" />
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
          <img className="m-8 max-w-prose" src="./person.jpg" alt="person" />
        </div>
      </div>
      {showDiv1 ? <DivContent1 handleClick={handleClick} /> : <DivContent2 trigger={trigger} handleClick={handleClick}/>}
      <div className="h-96 flex items-center justify-center" data-aos="flip-right">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-green-500 mb-4">
            Meet our team
          </h2>
          <p className="text-lg text-center mb-8">
            We are a team of students from Virginia Tech who are passionate about making the world a better place.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;