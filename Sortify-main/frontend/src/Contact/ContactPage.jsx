// src/pages/ContactPage.jsx
import { useState } from 'react';
import './contact.css'; // Your styles

function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:Sortify2024@gmail.com?&subject=Sortify Feedback&body=${encodeURIComponent(form.message)}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Get in Touch</h1>
      <div className="contact-info">
        <p>Email: Sortify2024@gmail.com</p>
        <p>Feel free to reach out to us with any questions or comments!</p>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
        ></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default ContactPage;
