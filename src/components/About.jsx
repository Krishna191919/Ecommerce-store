const About = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-blue-700">About Us</h1>
      <p className="text-lg leading-relaxed">
        We help businesses grow through powerful design and modern development.
        Founded in 2023, we’ve helped 100+ clients build, scale, and optimize
        their digital presence.
      </p>
      <section>
        <h2 className="text-2xl font-semibold text-blue-600 mb-2">
          Core Values
        </h2>
        <ul className="list-disc list-inside space-y-1 text-base">
          <li>Integrity</li>
          <li>Innovation</li>
          <li>Customer-first</li>
        </ul>
      </section>
    </div>
  );
};
export default About;
