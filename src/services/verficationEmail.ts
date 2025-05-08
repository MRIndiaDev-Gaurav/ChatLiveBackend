import nodemailer from "nodemailer";

const transports = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "api",
    pass: "d18cffd236da37a8777e2456fdf1dbc1",
  },
});

export default async (
  { email, subject, link } = { email: "", subject: "", link: "" }
) => {
  if (!email || !subject || !link) {
    console.error("Missing email, subject or link");
    return;
  }

  const mailOptions = {
    from: "gauravrana@gmail.com",
    to: email,
    subject,
    html: `<body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: Arial, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f7fa; padding: 40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <tr>
              <td style="padding: 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; color: #333;">Welcome to [Your Company Name]</h1>
                <p style="color: #666; font-size: 16px;">We're excited to have you on board. Please verify your email address to get started.</p>
                <p style="margin: 30px 0;">
                  <a href="{{verification_link}}" style="padding: 14px 24px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 6px; font-size: 16px;">Verify Email</a>
                </p>
                <p style="color: #999; font-size: 14px;">If you did not create an account, no further action is required.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; background-color: #f0f2f5; border-radius: 0 0 8px 8px; text-align: center;">
                <p style="margin: 0; color: #999; font-size: 12px;">&copy; 2025 [Your Company Name]. All rights reserved.</p>
                <p style="margin: 4px 0 0;"><a href="#" style="color: #007bff; text-decoration: none; font-size: 12px;">Privacy Policy</a> | <a href="#" style="color: #007bff; text-decoration: none; font-size: 12px;">Contact Support</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
Instructions:
Replace Rana It Consultant with your brand or business name.

Replace {{verification_link}} with the actual verification URL using a server-side template engine or code.

You can customize colors and branding to match your theme.

Would you like a version that includes your logo and social media icons?







You said:
add some grident in that and make it more coll and add some message theme in that this is for the chat application.


ChatGPT said:
Here's an updated professional and visually appealing HTML email verification template with a modern gradient background, a chat-themed design, and a friendly messaging tone, perfect for a chat application:

html
Copy
Edit
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email</title>
  </head>
  <body style="margin: 0; padding: 0; background: linear-gradient(to right, #6a11cb, #2575fc); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 50px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(to right, #6a11cb, #2575fc); padding: 30px; text-align: center; color: #fff;">
                <h1 style="margin: 0; font-size: 28px;">🔐 Verify Your Email</h1>
                <p style="margin: 10px 0 0; font-size: 16px;">Let’s get you chatting in no time!</p>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding: 40px 30px 30px; text-align: center;">
                <p style="font-size: 16px; color: #444;">Hey there! 👋</p>
                <p style="font-size: 16px; color: #555; max-width: 480px; margin: 10px auto;">
                  Thanks for signing up for <strong>[Your Chat App]</strong>. We just need to confirm that this email is really yours.
                </p>

                <!-- Call to Action Button -->
                <p style="margin: 30px 0;">
                  <a href="http://localhost:3000/api/auth/verify?token=${link}" style="background: linear-gradient(to right, #6a11cb, #2575fc); padding: 14px 28px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 30px; display: inline-block;">✅ Verify Email</a>
                </p>

                <!-- Friendly Message Box -->
                <div style="margin-top: 20px; background-color: #f0f4ff; border-radius: 12px; padding: 20px; color: #333; max-width: 500px; margin-left: auto; margin-right: auto;">
                  💬 You’re one step away from connecting with friends, teams, and communities. Let’s make conversations awesome.
                </div>

                <!-- Footer Text -->
                <p style="font-size: 13px; color: #999; margin-top: 30px;">
                  Didn’t sign up? Just ignore this email and nothing will happen.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 20px; background-color: #f9f9f9; text-align: center; font-size: 12px; color: #888;">
                © 2025 [Your Chat App Name] • <a href="#" style="color: #6a11cb; text-decoration: none;">Privacy Policy</a> • <a href="#" style="color: #6a11cb; text-decoration: none;">Support</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>`,
  };
  const sendEmail = await transports.sendMail(mailOptions);
  console.log("Email sent:", sendEmail);
};
