// ============================================
// SATURDAY — We're Open Today
// ============================================
// IMAGE TRACKING:
// images.saturday[0] = chicken_philly.jpg → "Stek Philly" ⚠️ VERIFY
// images.saturday[1] = chicken_poppers_v3.jpg → "Chicken Poppers" ⚠️ VERIFY
// images.saturday[2] = loaded_bacon_fry.jpg → "Loaded Bacon Fries" ⚠️ VERIFY
// images.saturday[3] = cold_pressed_juice_v2.jpg → "Cold-Pressed Juice" ✅ Verified
//
// DESCRIPTION TRACKING:
// - Saturday menu items: Need to verify which are available

const { baseRepoURL, baseURL, wrapEmail } = require('./shared-template');

const images = {
  logo: `${baseRepoURL}/TheUtopiaDeliLogo.png`,
  menuItems: [
    { img: `${baseRepoURL}/chicken_philly.jpg`, name: "Stek Philly", desc: "Thin-cut steak, peppers, onions, melted cheese" },
    { img: `${baseRepoURL}/chicken_poppers_v3.jpg`, name: "Chicken Poppers", desc: "Crispy chicken bites with dipping sauce" },
    { img: `${baseRepoURL}/loaded_bacon_fry.jpg`, name: "Loaded Bacon Fries", desc: "Crispy fries topped with bacon, cheese, green onions" },
    { img: `${baseRepoURL}/cold_pressed_juice_v2.jpg`, name: "Cold-Pressed Juice", desc: "Fresh 10oz juice" }
  ]
};

const email_subject = "🙌 We're Open Today — Come See Us!";

const email_body = wrapEmail(`
<tr>
<td style="padding:32px 28px 20px;text-align:center;">
<h1 style="margin:0 0 16px;color:#590B3F;font-size:28px;line-height:1.2;">We're Open Today! 🙌</h1>
<p style="margin:0 0 20px;color:#333;font-size:16px;line-height:1.6;">
Saturday at Utopia Deli — walk up or order online. Fresh food, good vibes, zero wait when you order ahead.
</p>
<p style="margin:0 0 24px;color:#AF3D4B;font-size:15px;font-weight:bold;">
🕐 Open today · Order online or walk up
</p>
<a href="${baseURL}/pickup-order/?utm_source=email&utm_medium=campaign&utm_campaign=saturday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
Order Ahead
</a>
</td>
</tr>

<tr>
<td style="padding:0 28px 24px;">
<h2 style="margin:0 0 16px;color:#590B3F;font-size:20px;">Today's Menu</h2>
<div class="dish-grid" style="display:flex;gap:16px;flex-wrap:wrap;">

${images.menuItems.map(item => `
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
<h3 style="margin:0 0 12px;color:#590B3F;font-size:16px;">Hours & Location</h3>
<p style="margin:0 0 8px;color:#333;font-size:14px;line-height:1.5;">📍 801 S Chester St, Little Rock, AR 72202</p>
<p style="margin:0;color:#333;font-size:14px;line-height:1.5;">🕐 Open · Order online for faster pickup</p>
</td></tr>
</table>
</td>
</tr>

<tr>
<td style="padding:0 28px 32px;text-align:center;">
<a href="${baseURL}/pickup-order/?utm_source=email&utm_medium=campaign&utm_campaign=saturday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
Place an Order
</a>
</td>
</tr>
`, images.logo);

const sms_body = "We're open today! 🙌 Order ahead: order.theutopiadeli.com/pickup-order/";

module.exports = { email_subject, email_body, sms_body, images };
