// ============================================
// WEDNESDAY — Meal Prep Deadline
// ============================================
// IMAGE TRACKING:
// images.wednesday[0] = mealprep-smokey-taco.jpg → "Smokey Taco Bowl" ⚠️ VERIFY THIS WEEK
// images.wednesday[1] = mealprep-chili-noodles.jpg → "Chili Garlic Noodles" ⚠️ VERIFY THIS WEEK
// images.wednesday[2] = mealprep-peanut-tofu.jpg → "Peanut Ginger Tofu" ⚠️ VERIFY THIS WEEK
//
// DESCRIPTION TRACKING:
// Bowl names change weekly — MUST UPDATE EACH WEEK
// Currently showing last week's bowls as placeholders

const { baseRepoURL, baseURL, wrapEmail } = require('./shared-template');

const images = {
  logo: `${baseRepoURL}/TheUtopiaDeliLogo.png`,
  bowls: [
    { img: `${baseRepoURL}/mealprep-smokey-taco.jpg`, name: "Smokey Taco Bowl" },
    { img: `${baseRepoURL}/mealprep-chili-noodles.jpg`, name: "Chili Garlic Noodles" },
    { img: `${baseRepoURL}/mealprep-peanut-tofu.jpg`, name: "Peanut Ginger Tofu" }
  ]
};

const email_subject = "⏰ Closes Today at Noon — Don't Miss This Week's Bowls";

const email_body = wrapEmail(`
<tr>
<td>
<img src="${images.bowls[0].img}" alt="${images.bowls[0].name}" class="hero-img" style="width:100%;height:280px;object-fit:cover;display:block;">
</td>
</tr>

<tr>
<td style="padding:32px 28px 20px;text-align:center;">
<h1 style="margin:0 0 16px;color:#AF3D4B;font-size:28px;line-height:1.2;">Closes Today at 12:00 PM ⏰</h1>
<p style="margin:0 0 20px;color:#333;font-size:16px;line-height:1.6;">
This is your last chance to grab this week's meal prep. Fresh bowls, ready Thursday.
</p>
<p style="margin:0 0 24px;color:#333;font-size:14px;">
<strong>Order before noon today</strong> — pickup Thursday 12:30 PM–7:30 PM
</p>
<a href="${baseURL}/catering/?utm_source=email&utm_medium=campaign&utm_campaign=wednesday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
Secure My Bowls
</a>
</td>
</tr>

<tr>
<td style="padding:0 28px 24px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f4;border-radius:12px;padding:20px;">
<tr><td style="text-align:center;">
<p style="margin:0 0 12px;color:#590B3F;font-size:18px;font-weight:bold;">Meal Prep Favorites</p>
<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">

${images.bowls.map(bowl => `
<div style="text-align:center;">
<img src="${bowl.img}" style="width:120px;height:100px;object-fit:cover;border-radius:8px;display:block;margin:0 auto 8px;">
<p style="margin:0;color:#333;font-size:13px;">${bowl.name}</p>
</div>
`).join('')}

</div>
</td></tr>
</table>
</td>
</tr>
`, images.logo);

const sms_body = "⏰ Meal prep closes today at noon! order.theutopiadeli.com/catering/";

module.exports = { email_subject, email_body, sms_body, images };
