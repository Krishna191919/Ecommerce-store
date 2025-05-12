import { FaFacebook, FaLinkedin, FaInstagram, FaYoutube, FaXing } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; 2024 SewaSansar Company. All rights reserved.</p>
          <div className="flex justify-center mt-4 space-x-6">
            {/* Facebook Icon */}
            <a href="#" className="text-gray-400 hover:text-gray-200">
              <FaFacebook className="w-5 h-5" />
            </a>
            {/* LinkedIn Icon */}
            <a href="#" className="text-gray-400 hover:text-gray-200">
              <FaLinkedin className="w-5 h-5" />
            </a>
            {/* Instagram Icon */}
            <a href="#" className="text-gray-400 hover:text-gray-200">
              <FaInstagram className="w-5 h-5" />
            </a>
            {/* YouTube Icon */}
            <a href="#" className="text-gray-400 hover:text-gray-200">
              <FaYoutube className="w-5 h-5" />
            </a>
            {/* X (formerly Twitter) Icon */}
            <a href="#" className="text-gray-400 hover:text-gray-200">
              <FaXing className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
