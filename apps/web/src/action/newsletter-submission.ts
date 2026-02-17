"use server";

import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY!,
  server: process.env.MAILCHIMP_SERVER_PREFIX!,
});

export async function newsletterSubmission(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    if (!email) {
      return {
        success: false,
        message: "Email is required.",
      };
    }

    if (!firstName || !lastName) {
      return {
        success: false,
        message: "First name and last name are required.",
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      };
    }

    await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID!, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    });

    return {
      success: true,
      message: "Thank you for subscribing to our newsletter!",
    };
  } catch (error: unknown) {
    console.error("Error subscribing to newsletter:", error);

    // Log more details for debugging
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object"
    ) {
      console.error("Mailchimp response:", error.response);
    }

    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "body" in error.response &&
      error.response.body &&
      typeof error.response.body === "object" &&
      "title" in error.response.body &&
      error.response.body.title === "Member Exists"
    ) {
      return {
        success: false,
        message: "This email is already subscribed to our newsletter.",
      };
    }
    return {
      success: false,
      message: "There was an error subscribing. Please try again later.",
    };
  }
}
