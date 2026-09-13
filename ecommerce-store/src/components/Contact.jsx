const Contact = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start justify-center mt-8 px-4 md:px-12">
      {/* Left: Contact Info */}
      <div className="md:w-1/2 w-full text-base md:pl-8 mt-8 mb-8">
        <p className="text-4xl md:text-3xl font-semibold text-black mb-3">
          Get In Touch With US!
        </p>
        <p className="text-base md:text-lg leading-relaxed mb-6 flex md:block justify-center md:mr-0 mr-4">
          For any issue or any enquiry please contact us using the given details
          below or else fill out the form next to this and leave a message, we
          will connect with you as soon as possible. Thank you!
        </p>
        <h2 className="text-3xl md:text-3xl font-semibold text-blue-700 mb-4">
          Contact Details
        </h2>
        <p className="text-lg md:text-xl font-semibold text-blue-700 mb-2">
          <strong>Email:</strong> Info@SewaSansar.com.np
        </p>
        <p className="text-lg md:text-xl font-semibold text-blue-700 mb-2">
          <strong>Phone:</strong> +977-9763673802
        </p>
        <p className="text-lg md:text-xl font-semibold text-blue-700 mb-2 flex flex-wrap items-center">
          <strong>Follow us:</strong>
          <a
            href="https://www.linkedin.com/in/krishna-chaudhary-2b30a0358?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            className="text-blue-600 ml-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/Krishna191919"
            className="text-blue-600 ml-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </div>
      {/* Right: Contact Form */}
      <div className="md:w-1/2 w-full bg-white p-4 md:p-8 rounded-lg shadow-md mt-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">
          Contact Us
        </h1>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          <input
            type="text"
            placeholder="Your Name"
            className="border p-3 rounded shadow-sm w-full"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border p-3 rounded shadow-sm w-full"
          />
          <input
            type="text"
            placeholder="Subject"
            className="col-span-full border p-3 rounded shadow-sm w-full"
          />
          <textarea
            placeholder="Message"
            className="col-span-full border p-3 rounded shadow-sm h-32 md:h-40 w-full resize-none"
          ></textarea>
          <button className="col-span-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium transition w-full">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};
export default Contact;
