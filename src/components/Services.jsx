export default function Services() {
  const services = [
    {
      title: "Web Development",
      description: "Fast, scalable websites using React and Node.js",
    },
    {
      title: "UI/UX Design",
      description:
        "Beautiful, user-friendly interfaces with Figma and Adobe XD",
    },
    {
      title: "SEO Optimization",
      description: "Improve visibility and rankings with modern SEO techniques",
    },
    {
      title: "Mobile App Development",
      description: "iOS and Android apps using React Native and Flutter",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-blue-700">Our Services</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              {service.title}
            </h2>
            <p className="text-gray-700">{service.description}</p>
          </div>
        ))}
      </div>
      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-2">
          Why Choose Us?
        </h2>
        <ul className="list-disc list-inside space-y-1 text-base">
          <li>Experienced team with proven results</li>
          <li>Affordable and transparent pricing</li>
          <li>Creative and custom solutions</li>
        </ul>
      </section>
    </div>
  );
}
// This code defines a React component that displays a list of services offered by a company.
