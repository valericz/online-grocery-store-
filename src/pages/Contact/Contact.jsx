import React from 'react'
import './Contact.css'

const Contact = () => {
    return (
        <div className='contact'>
            <h1>Contact Us</h1>
            <div className='contact-content'>
                <div className='contact-info'>
                    <h2>Get in Touch</h2>
                    <p>Email: valerieznb@gmail.com</p>
                    <p>Phone: +61-047-182-016</p>
                </div>
                <div className='contact-form'>
                    <h2>Send us a Message</h2>
                    <form>
                        <input type="text" placeholder="Your Name" />
                        <input type="email" placeholder="Your Email" />
                        <textarea placeholder="Your Message"></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contact 