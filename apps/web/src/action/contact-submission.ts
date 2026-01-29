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

    const toEmail =
      process.env.CONTACT_EMAIL || "contact@spiritoflifechurch.com";
    const fromEmail =
      process.env.SENDGRID_FROM_EMAIL || "noreply@spiritoflifechurch.com";

    console.log("Sending contact email from:", fromEmail, "to:", toEmail);

    const msg = {
      to: toEmail,
      from: fromEmail,
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
  } catch (error: unknown) {
    console.error("Error sending contact email:", error);
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "body" in error.response
    ) {
      console.error("SendGrid response:", error.response.body);
    }
    return {
      success: false,
      message:
        "There was an error sending your message. Please try again later.",
    };
  }
}
