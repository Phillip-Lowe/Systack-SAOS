// ============================================
// FRIDAY — Weekend Kickoff
// ============================================
// IMAGE TRACKING:
// images.friday[0] = Deli Happy customer lady.jpg → "Weekend Vibes" ✅ Verified
// images.friday[1] = chicken_philly.jpg → "Stek Philly" ⚠️ VERIFY
// images.friday[2] = loaded_bacon_fry.jpg → "Loaded Bacon Fries" ⚠️ VERIFY
// images.friday[3] = chicken_poppers_v3.jpg → "Chicken Poppers" ⚠️ VERIFY
// images.friday[4] = cookies_v2.jpg → "Fresh Cookies" ⚠️ VERIFY
// images.friday[5] = cold_pressed_juice_v2.jpg → "Cold-Pressed Juice" ✅ Verified
//
// DESCRIPTION TRACKING:
// - Weekend items: Need to verify which are actually available

const { baseRepoURL, baseURL, wrapEmail } = require('./shared-template');

const images = {
  logo: `${baseRepoURL}/TheUtopiaDeliLogo.png`,
  hero: `${baseRepoURL}/Deli%20Happy%20customer%20lady.jpg`,
  weekendItems: [
    { img: `${baseRepoURL}/chicken_philly.jpg`, name: "Stek Philly", desc: "Thin-cut steak, peppers, onions, melted cheese" },
    { img: `${baseRepoURL}/loaded_bacon_fry.jpg`, name: "Loaded Bacon Fries", desc: "Crispy fries topped with bacon, cheese, green onions" },
    { img: `${baseRepoURL}/chicken_poppers_v3.jpg`, name: "Chicken Poppers", desc: "Crispy chicken bites with dipping sauce" },
    { img: `${baseRepoURL}/cookies_v2.jpg`, name: "Fresh Cookies", desc: "Warm, house-made cookies daily" },
    { img: `${baseRepoURL}/cold_pressed_juice_v2.jpg`, name: "Cold-Pressed Juice", desc: "Fresh 10oz juice" }
  ]
};

const email_subject = "🙌 Weekend at Utopia Deli";

const email_body = wrapEmail(`
<tr>
<td>
<img src="${images.hero}" alt="Weekend at Utopia Deli" class="hero-img" style="width:100%;height:320px;object-fit:cover;display:block;">
</td>
</tr>

<tr>
<td style="padding:32px 28px 20px;">
<h1 style="margin:0 0 16px;color:#590B3F;font-size:28px;line-height:1.2;">Weekend at Utopia Deli 🍽️</h1>
<p style="margin:0 0 20px;color:#333;font-size:16px;line-height:1.6;">
Friday feeling? We've got you covered. Walk-up orders, meal prep, and all your favorites are ready.
</p>
<p style="margin:0 0 24px;color:#AF3D4B;font-size:15px;font-weight:bold;">
🕐 Open today · Order online or walk up
</p>
<a href="${baseURL}/pickup-order/?utm_source=email&utm_medium=campaign&utm_campaign=friday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
Order Now
</a>
</td>
</tr>

<tr>
<td style="padding:0 28px 24px;">
<h2 style="margin:0 0 16px;color:#590B3F;font-size:20px;">Weekend Favorites</h2>
<div class="dish-grid" style="display:flex;gap:16px;flex-wrap:wrap;">

${images.weekendItems.map(item => `
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
<td style="padding:0 28px 24px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f4;border-radius:12px;padding:20px;">
<tr><td>
<h3 style="margin:0 0 12px;color:#590B3F;font-size:16px;">Meal Prep Update</h3>
<p style="margin:0;color:#333;font-size:14px;line-height:1.6;">
The meal prep portal is open! Next week's bowls are live — order before Wednesday noon for Thursday pickup.
</p>
<a href="${baseURL}/catering/?utm_source=email&utm_medium=campaign&utm_campaign=friday"
style="display:inline-block;background:#590B3F;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:bold;margin-top:12px;">
Pre-Order Meal Prep
</a>
</td></tr>
</table>
</td>
</tr>

<tr>
<td style="padding:0 28px 32px;text-align:center;">
<a href="${baseURL}/pickup-order/?utm_source=email&utm_medium=campaign&utm_campaign=friday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
Order for Pickup
</a>
</td>
</tr>
`, images.logo);

const sms_body = "Weekend at Utopia Deli 🍽️ Order online: order.theutopiadeli.com/pickup-order/";

module.exports = { email_subject, email_body, sms_body, images };
