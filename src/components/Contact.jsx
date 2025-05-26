const Contact = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start justify-evenly mt-8">
      <div className="md:w-1/2 w-full text-base">
        <h2 className="text-4xl font-semibold text-blue-700 mb-4">
          Contact Details
        </h2>
        <p className="text-xl font-semibold text-blue-700 mb-2">
          <strong>Email:</strong> Info@SewaSansar.com.np
        </p>
        <p className="text-xl font-semibold text-blue-700 mb-2">
          <strong>Phone:</strong> +977-9763673802
        </p>
        <p className="text-xl font-semibold text-blue-700 mb-2">
          <strong>Follow us:</strong>
          <a
            href="https://www.linkedin.com/in/krishna-chaudhary-2b30a0358?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            className="text-blue-600 ml-2 hover:underline"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/Krishna191919"
            className="text-blue-600 ml-2 hover:underline"
          >
            GitHub
          </a>
        </p>
      </div>
      <div className="md:w-1/2 w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-blue-700">Contact Us</h1>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          <input
            type="text"
            placeholder="Your Name"
            className="border p-3 rounded shadow-sm"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border p-3 rounded shadow-sm"
          />
          <input
            type="text"
            placeholder="Subject"
            className="col-span-full border p-3 rounded shadow-sm"
          />
          <textarea
            placeholder="Message"
            className="col-span-full border p-3 rounded shadow-sm h-40"
          ></textarea>
          <button className="col-span-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium transition">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};
export default Contact;
