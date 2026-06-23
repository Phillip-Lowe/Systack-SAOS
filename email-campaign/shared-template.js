// ============================================
// UTOPIA DELI EMAIL CAMPAIGN — DAY MODULES
// ============================================
// Each day is a separate file for easier editing
// Images and descriptions are tracked below

const baseRepoURL = 'https://raw.githubusercontent.com/Phillip-Lowe/utopia-deli/main';
const baseURL = 'https://order.theutopiadeli.com';

// Shared components
const buildHeader = (logo) => `
<tr>
<td style="background:#590B3F;padding:20px 24px;">
 <table width="100%" cellpadding="0" cellspacing="0" border="0">
 <tr>
 <td style="vertical-align:middle;">
 <img src="${logo}" alt="The Utopia Deli" style="height:56px;display:block;">
 </td>
 <td style="vertical-align:middle;padding-left:16px;">
 <p style="margin:0;color:#fff;font-family:'Georgia','Times New Roman',serif;font-size:24px;font-weight:bold;letter-spacing:0.5px;">
 The Utopia Deli
 </p>
 </td>
 </tr>
 </table>
</td>
</tr>
`;

const buildFooter = () => `
<tr>
<td style="padding:20px;background:#f8f6f4;font-family:'Georgia','Times New Roman',serif;text-align:center;border-top:1px solid #e5e5e5;">
<p style="margin:0 0 6px;font-size:13px;color:#888;">
The Utopia Deli · 801 S Chester St · Little Rock, AR 72202
</p>
<p style="margin:0;font-size:12px;">
<a href="https://n8n.systack.net/webhook/unsubscribe?email=%%EMAIL%%&channel=email" style="color:#AF3D4B;text-decoration:underline;">Unsubscribe from emails</a>
</p>
</td>
</tr>
`;

const wrapEmail = (content, logo) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
@media only screen and (max-width: 600px) {
 .container { width: 100% !important; }
 .hero-img { height: 200px !important; }
 .dish-grid { display: block !important; }
 .dish-card { width: 100% !important; margin-bottom: 16px !important; }
}
</style>
</head>
<body style="margin:0;padding:0;background:#f8f6f4;font-family:'Georgia','Times New Roman',serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center" style="padding:24px 12px;">
<table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
${buildHeader(logo)}
${content}
${buildFooter()}
</table>
</td></tr>
</table>
</body>
</html>
`;

// Export for use in day modules
module.exports = { baseRepoURL, baseURL, wrapEmail };