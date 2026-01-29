"use server";

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function contactSubmission(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !subject || !message) {
      return {
        success: false,
        message: "All fields are required.",
      };
    }

    const msg = {
      to: process.env.CONTACT_EMAIL || "contact@spiritoflifechurch.com", // Replace with your contact email
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@spiritoflifechurch.com", // Must be verified in SendGrid
      subject: `Contact Form: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Subject:</strong> ${subject}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, "<br>")}</p>`,
    };

    await sgMail.send(msg);

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    };
  } catch (error) {
    console.error("Error sending contact email:", error);
    return {
      success: false,
      message:
        "There was an error sending your message. Please try again later.",
    };
  }
}
