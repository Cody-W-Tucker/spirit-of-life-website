"use server";

import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY!,
  server: process.env.MAILCHIMP_SERVER_PREFIX!,
});

function validatePhoneNumber(phone: string): boolean {
  // Remove all non-numeric characters except + for international
  const cleaned = phone.replace(/[^\d+]/g, "");
  // Check for valid US phone format (10 digits or 11 with +1)
  const digitsOnly = cleaned.replace(/\D/g, "");
  return (
    digitsOnly.length === 10 ||
    (digitsOnly.length === 11 && digitsOnly.startsWith("1"))
  );
}

function formatPhoneForTextInChurch(phone: string): string {
  // Remove all non-numeric characters
  const digitsOnly = phone.replace(/\D/g, "");
  // Remove leading 1 if present (country code)
  if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
    return digitsOnly.slice(1);
  }
  return digitsOnly;
}

export async function newsletterSubmission(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;

    // Validate required fields (first and last name)
    if (!firstName || !lastName) {
      return {
        success: false,
        message: "First name and last name are required.",
      };
    }

    // Validate that at least one contact method is provided
    if (!email && !phone) {
      return {
        success: false,
        message: "Please provide either an email address or phone number.",
      };
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: "Please enter a valid email address.",
        };
      }
    }

    // Validate phone format if provided
    let formattedPhone: string | null = null;
    if (phone) {
      if (!validatePhoneNumber(phone)) {
        return {
          success: false,
          message: "Please enter a valid 10-digit phone number.",
        };
      }
      formattedPhone = formatPhoneForTextInChurch(phone);
    }

    let mailchimpSuccess = false;
    let textInChurchSuccess = false;

    // Subscribe to Mailchimp if email provided
    if (email) {
      try {
        await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID!, {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
          },
        });
        mailchimpSuccess = true;
      } catch (mailchimpError: unknown) {
        console.error("Error subscribing to Mailchimp:", mailchimpError);

        // Check for existing member error
        if (
          mailchimpError &&
          typeof mailchimpError === "object" &&
          "response" in mailchimpError &&
          mailchimpError.response &&
          typeof mailchimpError.response === "object" &&
          "body" in mailchimpError.response &&
          mailchimpError.response.body &&
          typeof mailchimpError.response.body === "object" &&
          "title" in mailchimpError.response.body &&
          mailchimpError.response.body.title === "Member Exists"
        ) {
          // Already subscribed - consider this success for our purposes
          mailchimpSuccess = true;
        }
      }
    }

    // Add to Text In Church if phone provided
    if (formattedPhone) {
      try {
        const apiKey = process.env.TEXT_IN_CHURCH_API_KEY;

        if (!apiKey) {
          console.error(
            "TEXT_IN_CHURCH_API_KEY environment variable is not set",
          );
          throw new Error("Text In Church API key not configured");
        }

        console.log("Calling Text In Church API with Bearer token...");

        // The OpenAPI spec indicates parameters must be passed in the QUERY string for the POST request
        const queryParams = new URLSearchParams();
        queryParams.append("contact_first_name", firstName);
        queryParams.append("contact_last_name", lastName);
        queryParams.append("primary_phone", formattedPhone); // 10 digits, no country code per spec
        queryParams.append("primary_country", "US");

        if (email) {
          queryParams.append("contact_email", email);
        }

        const url = `https://api.textinchurch.com/API/1_0/contact.php?${queryParams.toString()}`;
        console.log("Calling Text In Church API via URL params:", url);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Text In Church API error:", errorText);
        } else {
          textInChurchSuccess = true;
          console.log("Successfully added contact to Text In Church");
        }
      } catch (textInChurchError: unknown) {
        console.error("Error adding to Text In Church:", textInChurchError);
      }
    }

    // Determine success message based on what worked
    if (email && phone) {
      if (mailchimpSuccess && textInChurchSuccess) {
        return {
          success: true,
          message:
            "Thank you! You're now subscribed to our newsletter and text updates.",
        };
      } else if (mailchimpSuccess) {
        return {
          success: true,
          message:
            "Thank you for subscribing to our newsletter! (Text signup failed, but you can try again.)",
        };
      } else if (textInChurchSuccess) {
        return {
          success: true,
          message:
            "Thank you for signing up for text updates! (Email signup failed, but you can try again.)",
        };
      }
    } else if (email && mailchimpSuccess) {
      return {
        success: true,
        message: "Thank you for subscribing to our newsletter!",
      };
    } else if (phone && textInChurchSuccess) {
      return {
        success: true,
        message: "Thank you! You'll receive text updates from us.",
      };
    }

    // If we get here, both failed
    return {
      success: false,
      message: "There was an error subscribing. Please try again later.",
    };
  } catch (error: unknown) {
    console.error("Error in newsletter submission:", error);
    return {
      success: false,
      message: "There was an error subscribing. Please try again later.",
    };
  }
}
