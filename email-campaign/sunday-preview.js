// ============================================
// SUNDAY — This Week's Menu Preview + Monday Lunch
// ============================================
// IMAGE TRACKING:
// images.sunday[0] = Deli Meal Prep Plate 1.jpg → "This Week's Menu" ✅ Verified
// images.sunday[1] = chicken_philly.jpg → "Monday Lunch Feature" ⚠️ VERIFY
// images.sunday[2] = chicken_poppers_v3.jpg → "Monday Lunch Item" ⚠️ VERIFY
//
// DESCRIPTION TRACKING:
// - This week's bowls: Need actual lineup
// - Monday lunch items: Need to verify what's featured

const { baseRepoURL, baseURL, wrapEmail } = require('./shared-template');

const images = {
  logo: `${baseRepoURL}/TheUtopiaDeliLogo.png`,
  hero: `${baseRepoURL}/Deli%20Meal%20Prep%20Plate%201.jpg`,
  mondayItems: [
    { img: `${baseRepoURL}/chicken_philly.jpg`, name: "Stek Philly", desc: "Monday lunch special" },
    { img: `${baseRepoURL}/chicken_poppers_v3.jpg`, name: "Chicken Poppers", desc: "Perfect for sharing" }
  ]
};

const email_subject = "📋 This Week's Menu + Monday Lunch";

const email_body = wrapEmail(`
<tr>
<td>
<img src="${images.hero}" alt="This Week's Menu" class="hero-img" style="width:100%;height:300px;object-fit:cover;display:block;">
</td>
</tr>

<tr>
<td style="padding:32px 28px 20px;">
<h1 style="margin:0 0 16px;color:#590B3F;font-size:28px;line-height:1.2;">This Week's Menu 📋</h1>
<p style="margin:0 0 20px;color:#333;font-size:16px;line-height:1.6;">
Meal prep orders open tomorrow at 9:00 AM. Here's what's cooking this week.
</p>
<p style="margin:0 0 24px;color:#AF3D4B;font-size:15px;font-weight:bold;">
🍱 Meal prep opens Monday 9:00 AM · Closes Wednesday noon
</p>
<a href="${baseURL}/catering/?utm_source=email&utm_medium=campaign&utm_campaign=sunday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
View Full Menu
</a>
</td>
</tr>

<tr>
<td style="padding:0 28px 24px;">
<h2 style="margin:0 0 16px;color:#590B3F;font-size:20px;">🍱 Meal Prep Bowls This Week</h2>
<p style="margin:0 0 16px;color:#666;font-size:14px;">
📝 Bowl lineup will be updated here once confirmed.
</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f4;border-radius:12px;padding:20px;">
<tr><td>
<p style="margin:0;color:#666;font-size:14px;">Check back tomorrow morning for the full bowl lineup!</p>
</td></tr>
</table>
</td>
</tr>

<tr>
<td style="padding:0 28px 24px;">
<h2 style="margin:0 0 16px;color:#590B3F;font-size:20px;">Monday Lunch Specials 🍽️</h2>
<div class="dish-grid" style="display:flex;gap:16px;flex-wrap:wrap;">

${images.mondayItems.map(item => `
<div class="dish-card" style="flex:1;min-width:160px;background:#f8f6f4;border-radius:12px;overflow:hidden;">
<img src="${item.img}" style="width:100%;height:140px;object-fit:cover;display:block;">
<div style="padding:12px;">
<p style="margin:0 0 4px;color:#590B3F;font-weight:bold;font-size:14px;">${item.name}</p>
<p style="margin:0;color:#888;font-size:12px;">${item.desc}</p>
</div>
</div>
`).join('')}

</div>
</td>
</tr>

<tr>
<td style="padding:0 28px 32px;text-align:center;">
<a href="${baseURL}/pickup-order/?utm_source=email&utm_medium=campaign&utm_campaign=sunday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
Order Monday Lunch
</a>
</td>
</tr>
`, images.logo);

const sms_body = "This week's menu drops tomorrow at 9AM! order.theutopiadeli.com/catering/";

module.exports = { email_subject, email_body, sms_body, images };
