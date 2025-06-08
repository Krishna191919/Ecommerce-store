import { FaRocket, FaLightbulb, FaUsers, FaHandshake } from "react-icons/fa";

const features = [
  {
    icon: <FaRocket className="text-blue-500 text-3xl mb-2 animate-bounce" />,
    title: "Fast Delivery",
    desc: "We ensure quick and reliable delivery for all your orders.",
  },
  {
    icon: (
      <FaLightbulb className="text-yellow-400 text-3xl mb-2 animate-pulse" />
    ),
    title: "Innovative Solutions",
    desc: "We use the latest technology to provide the best shopping experience.",
  },
  {
    icon: <FaUsers className="text-green-500 text-3xl mb-2 animate-bounce" />,
    title: "Customer Focused",
    desc: "Our customers are at the heart of everything we do.",
  },
  {
    icon: (
      <FaHandshake className="text-purple-500 text-3xl mb-2 animate-pulse" />
    ),
    title: "Trusted Partner",
    desc: "100+ clients trust us to grow their business online.",
  },
];

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-700 text-center mb-4 animate-slide-down">
        About Us
      </h1>
      <p className="text-lg md:text-xl leading-relaxed text-gray-700 text-center animate-fade-in">
        We help businesses grow through powerful design and modern development.
        <br />
        Founded in 2023, we’ve helped 100+ clients build, scale, and optimize
        their digital presence.
      </p>
      <section className="bg-blue-50 rounded-xl p-6 md:p-10 shadow-lg animate-fade-in-up">
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-4 text-center">
          Core Values
        </h2>
        <ul className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
          <li className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-blue-700 animate-bounce">
              Integrity
            </span>
            <span className="text-gray-600 text-base text-center mt-1">
              We act with honesty and honor.
            </span>
          </li>
          <li className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-blue-700 animate-pulse">
              Innovation
            </span>
            <span className="text-gray-600 text-base text-center mt-1">
              We embrace creativity and new ideas.
            </span>
          </li>
          <li className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-blue-700 animate-bounce">
              Customer-first
            </span>
            <span className="text-gray-600 text-base text-center mt-1">
              We put our clients at the center.
            </span>
          </li>
        </ul>
      </section>
      <section className="mt-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-6 text-center">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 hover:scale-105 transition-transform duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1 + 0.2}s` }}
            >
              {feature.icon}
              <h3 className="text-xl font-semibold text-blue-700 mb-1">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <style>
        {`
          .animate-fade-in { animation: fadeIn 1s ease; }
          .animate-fade-in-up { animation: fadeInUp 1s ease; }
          .animate-slide-down { animation: slideDown 1s ease; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: translateY(0);} }
          @keyframes slideDown { from { opacity: 0; transform: translateY(-30px);} to { opacity: 1; transform: translateY(0);} }
        `}
      </style>
    </div>
  );
};

export default About;
