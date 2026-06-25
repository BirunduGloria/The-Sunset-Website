function Contact() {
  return (
    <div className="min-h-screen bg-gray-100 py-20">

      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-lg">

        <h1 className="text-5xl font-bold text-center mb-6">
          Contact Us
        </h1>

        <p className="text-center text-gray-600 mb-10">
          We'd love to hear from you.
        </p>

        <form className="space-y-6">

          <input
            type="text"
            placeholder="Your Name"
            className="w-full border p-4 rounded-lg"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border p-4 rounded-lg"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full border p-4 rounded-lg"
          />

          <textarea
            rows="6"
            placeholder="Your Message"
            className="w-full border p-4 rounded-lg"
          />

          <button
            className="w-full bg-orange-500 text-white py-4 rounded-lg"
          >
            Send Message
          </button>

        </form>

      </div>
    </div>
  );
}

export default Contact;