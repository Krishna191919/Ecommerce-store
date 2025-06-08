import {
  FaLaptopCode,
  FaMobileAlt,
  FaPaintBrush,
  FaSearch,
} from "react-icons/fa";

export default function Services() {
  const services = [
    {
      icon: (
        <FaLaptopCode className="text-blue-500 text-4xl mb-3 animate-bounce" />
      ),
      title: "Web Development",
      description:
        "Fast, scalable, and modern websites using React, Node.js, and the latest web technologies.",
    },
    {
      icon: (
        <FaPaintBrush className="text-pink-500 text-4xl mb-3 animate-pulse" />
      ),
      title: "UI/UX Design",
      description:
        "Beautiful, user-friendly interfaces crafted with Figma and Adobe XD for a seamless experience.",
    },
    {
      icon: (
        <FaSearch className="text-green-500 text-4xl mb-3 animate-bounce" />
      ),
      title: "SEO Optimization",
      description:
        "Boost your visibility and rankings with modern SEO strategies and analytics.",
    },
    {
      icon: (
        <FaMobileAlt className="text-purple-500 text-4xl mb-3 animate-pulse" />
      ),
      title: "Mobile App Development",
      description:
        "Cross-platform iOS and Android apps using React Native and Flutter.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-700 text-center mb-8 animate-slide-down">
        Our Professional Services
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
          >
            {service.icon}
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">
              {service.title}
            </h2>
            <p className="text-gray-700">{service.description}</p>
          </div>
        ))}
      </div>
      <section className="mt-10 bg-blue-50 rounded-xl p-8 shadow-md animate-fade-in-up">
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-4 text-center">
          Why Choose Us?
        </h2>
        <ul className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 text-base">
          <li className="flex flex-col items-center">
            <span className="font-bold text-blue-700 animate-bounce">
              Experienced Team
            </span>
            <span className="text-gray-600 text-center mt-1">
              Proven results and deep expertise
            </span>
          </li>
          <li className="flex flex-col items-center">
            <span className="font-bold text-blue-700 animate-pulse">
              Transparent Pricing
            </span>
            <span className="text-gray-600 text-center mt-1">
              Affordable and clear cost structure
            </span>
          </li>
          <li className="flex flex-col items-center">
            <span className="font-bold text-blue-700 animate-bounce">
              Creative Solutions
            </span>
            <span className="text-gray-600 text-center mt-1">
              Custom strategies for your business
            </span>
          </li>
          <li className="flex flex-col items-center">
            <span className="font-bold text-blue-700 animate-pulse">
              Client Satisfaction
            </span>
            <span className="text-gray-600 text-center mt-1">
              We focus on your goals and success
            </span>
          </li>
        </ul>
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
}
// This code defines a React component that displays a list of services offered by a company, with enhanced animations and icon integration.
