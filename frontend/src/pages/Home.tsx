import { Link } from "react-router-dom";

function Home() {

  return (
    <div>
      <div className="bg-white flex flex-col items-center justify-center">
        <div className="flex flex-row items-center justify-center flex-wrap">
          <div className="flex flex-col items-center justify-center p-8 animate-fade-up animate-delay-[300ms]">
            <h1 className="text-6xl font-bold mb-4">
              <span className="text-green-500">ASL</span>
              <span className="text-gray-700">Translator</span>
            </h1>
            <p className="text-lg text-center mb-8">
              Our product translates sign language in real time, making communication easier for everyone.
            </p>
            <Link
              to="/asl_translator"
              className="bg-green-500 hover:bg-green-300 hover:-translate-y-1 transform transition duration-3 shadow-lg hover:shadow-2xl text-white font-bold p-4 text-xl rounded-full"
            >
              Get Started
            </Link>
          </div>
          <img className="m-8 max-w-prose" src="./person.jpg" alt="person" />
        </div>
      </div>
      <div className="bg-green-500 flex items-center justify-center">
        <div className="flex flex-row items-center justify-center flex-wrap">
          <img className="m-8 max-w-xl" src="./person2.jpeg" alt="person2" />
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Real-time Translation
            </h2>
            <div className="max-w-prose">
              <p className="text-lg text-center mb-8 text-white">
                Our product uses advanced machine learning algorithms to translate sign language in real time, making communication easier for everyone.
              </p>
            </div>
            <Link
              to="/asl_translator"
              className="bg-white hover:bg-gray-300 hover:-translate-y-1 transform transition duration-3 shadow-lg hover:shadow-2xl text-green-500 font-bold p-4 text-xl rounded-full"
            >
              Try it now
            </Link>
          </div>
        </div>

      </div>
      <div className="h-96 flex items-center justify-center">
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