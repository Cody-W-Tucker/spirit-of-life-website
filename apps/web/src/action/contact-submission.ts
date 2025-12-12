"use server";

export async function contactSubmission(formData: FormData) {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  console.log("Contact Form Submission:", { name, email, subject, message });

  // In a real application, you would send an email here using a service like Resend, SendGrid, etc.
  // or save it to a database.

  return {
    success: true,
    message: "Thank you for your message! We'll get back to you soon.",
  };
}
