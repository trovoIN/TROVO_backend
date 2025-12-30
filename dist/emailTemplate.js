export const welcomeEmailTemplate = () => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Trovo Early Access</title>
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #0b0b0b;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #e6e6e6;
">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="
            max-width: 520px;
            background-color: #111111;
            border-radius: 12px;
            padding: 32px;
          "
        >
          <tr>
            <td style="padding-bottom: 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                  <td style="padding-right: 12px;">
                    <img src="https://trovofi.in/trovo.png" alt="trovofi" width="28" height="28" style="display: block; width: 28px; height: 28px;" />
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="
                      font-size: 18px;
                      font-weight: 700;
                      color: #61dca3;
                      letter-spacing: 0.3px;
                    ">
                      trovofi
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="font-size: 15px; line-height: 1.6; color: #e6e6e6;">
              <p style="margin: 0 0 16px 0;">Hi,</p>
              <p style="margin: 0 0 16px 0;">Thanks for joining Trovo early access.</p>
              <p style="margin: 0 0 16px 0;">We’re building Trovo to make rewards, cashback, and everyday payments clearer and more useful — without hidden conditions or confusing rules.</p>
              <p style="margin: 0 0 16px 0;">You’re now on our early access list. We’ll reach out when Trovo is ready for you.</p>
              <p style="margin: 0;">Your email stays private. No spam. No selling data.</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 0;">
              <div style="height: 1px; background-color: #1f1f1f; width: 100%;"></div>
            </td>
          </tr>

          <tr>
            <td style="font-size: 13px; line-height: 1.5; color: #9a9a9a;">
              <p style="margin: 0;">— Team trovofi</p>
              <p style="margin: 8px 0 0 0;">You're receiving this email because you signed up for trovofi early access.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`.trim();
    const text = `Hi,

Thanks for joining trovofi early access.

We're building trovofi to make rewards, cashback, and everyday payments clearer and more useful — without hidden conditions or confusing rules.

You're now on our early access list. We'll reach out when trovofi is ready for you.

Your email stays private. No spam. No selling data.

— Team Trovo`.trim();
    return {
        subject: 'You are on the trovofi early access list',
        html,
        text,
    };
};
export const confirmationEmailTemplate = (data) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Trovo Email Confirmed</title>
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #0b0b0b;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #e6e6e6;
">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="
            max-width: 520px;
            background-color: #111111;
            border-radius: 12px;
            padding: 32px;
          "
        >
          <tr>
            <td style="padding-bottom: 16px;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                  <td style="padding-right: 12px;">
                    <img src="https://trovofi.in/trovo.png" alt="trovofi" width="28" height="28" style="display: block; width: 28px; height: 28px;" />
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="
                      font-size: 18px;
                      font-weight: 700;
                      color: #61dca3;
                      letter-spacing: 0.3px;
                    ">
                      trovofi
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="font-size: 15px; line-height: 1.6; color: #e6e6e6;">
              <p style="margin: 0 0 16px 0;">Hi,</p>
              <p style="margin: 0 0 16px 0;">Your email ${data.email} is confirmed for trovofi early access.</p>
              <p style="margin: 0 0 16px 0;">We'll reach out when trovofi is ready for you.
              <p style="margin: 0;">Your email stays private. No spam. No selling data.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 0;">
              <div style="height: 1px; background-color: #1f1f1f; width: 100%;"></div>
            </td>
          </tr>
          <tr>
            <td style="font-size: 13px; line-height: 1.5; color: #9a9a9a;">
              <p style="margin: 0;">— Team trovofi</p>
              <p style="margin: 8px 0 0 0;">You're receiving this email because you signed up for trovofi early access.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`.trim();
    const text = `Hi,

Your email ${data.email} is confirmed for trovofi early access.
We'll reach out when trovofi is ready for you.

Your email stays private. No spam. No selling data.

— Team trovofi`.trim();
    return {
        subject: 'Your trovofi email is confirmed',
        html,
        text,
    };
};
