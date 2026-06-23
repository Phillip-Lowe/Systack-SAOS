// ============================================
// THURSDAY — Meal Prep Reopens + Walk-Up Menu
// ============================================
// IMAGE TRACKING:
// images.thursday[0] = Deli Meal Prep Plate 1.jpg → "Next Week's Meal Prep Opens Tonight" ✅ Verified
// images.thursday[1] = chicken_philly.jpg → "Stek Philly" ⚠️ VERIFY
// images.thursday[2] = loaded_bacon_fry.jpg → "Loaded Bacon Fries" ⚠️ VERIFY
// images.thursday[3] = chicken_poppers_v3.jpg → "Chicken Poppers" ⚠️ VERIFY
//
// DESCRIPTION TRACKING:
// - Next Week's Bowls: Need actual bowl lineup
// - Walk-up items: Need to verify which are available

const { baseRepoURL, baseURL, wrapEmail } = require('./shared-template');

const images = {
  logo: `${baseRepoURL}/TheUtopiaDeliLogo.png`,
  hero: `${baseRepoURL}/Deli%20Meal%20Prep%20Plate%201.jpg`,
  menuItems: [
    { img: `${baseRepoURL}/chicken_philly.jpg`, name: "Stek Philly", desc: "Thin-cut steak, peppers, onions, melted cheese" },
    { img: `${baseRepoURL}/loaded_bacon_fry.jpg`, name: "Loaded Bacon Fries", desc: "Crispy fries topped with bacon, cheese, green onions" },
    { img: `${baseRepoURL}/chicken_poppers_v3.jpg`, name: "Chicken Poppers", desc: "Crispy chicken bites with dipping sauce" }
  ]
};

const email_subject = "🍱 Meal Prep Reopens at 8PM + We're Open Today";

const email_body = wrapEmail(`
<tr>
<td>
<img src="${images.hero}" alt="Next Week's Meal Prep" class="hero-img" style="width:100%;height:300px;object-fit:cover;display:block;">
</td>
</tr>

<tr>
<td style="padding:32px 28px 20px;">
<h1 style="margin:0 0 16px;color:#590B3F;font-size:28px;line-height:1.2;">Meal Prep Orders Reopen at 8PM 🍱</h1>
<p style="margin:0 0 20px;color:#333;font-size:16px;line-height:1.6;">
Tonight at 8:00 PM, the meal prep portal reopens for next week. Get your order in early and skip the line.
</p>
<p style="margin:0 0 24px;color:#AF3D4B;font-size:15px;font-weight:bold;">
🕐 Reopens 8:00 PM tonight · Closes Wednesday at noon
</p>
<a href="${baseURL}/catering/?utm_source=email&utm_medium=campaign&utm_campaign=thursday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
Pre-Order Next Week's Bowls
</a>
</td>
</tr>

<tr>
<td style="padding:0 28px 24px;">
<h2 style="margin:0 0 16px;color:#590B3F;font-size:20px;">Next Week's Bowls</h2>
<p style="margin:0 0 16px;color:#666;font-size:14px;">
📝 Bowl lineup will be updated here once confirmed. Check back at 8 PM for the full menu.
</p>
</td>
</tr>

<tr>
<td style="padding:0 28px 24px;">
<h2 style="margin:0 0 16px;color:#590B3F;font-size:20px;">Order Online Today 🍽️</h2>
<p style="margin:0 0 20px;color:#333;font-size:16px;line-height:1.6;">
We're open today for walk-up and online orders. Come grab lunch or dinner — or order ahead and skip the wait.
</p>
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
<td style="padding:0 28px 32px;text-align:center;">
<a href="${baseURL}/pickup-order/?utm_source=email&utm_medium=campaign&utm_campaign=thursday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
Order Online Now
</a>
</td>
</tr>
`, images.logo);

const sms_body = "Meal prep reopens at 8PM tonight! order.theutopiadeli.com/catering/";

module.exports = { email_subject, email_body, sms_body, images };
