// ============================================
// MONDAY — Meal Prep is Open
// ============================================
// IMAGE TRACKING:
// images.monday[0] = Deli Meal Prep Plate 1.jpg → "Meal Prep Hero" ✅ Verified
// images.monday[1] = mealprep-mediterranean.jpg → "Mediterranean Harvest Bowl" ⚠️ NEEDS VERIFICATION
// images.monday[2] = mealprep-smokey-taco.jpg → "Smokey Taco Bowl" ⚠️ NEEDS VERIFICATION
// images.monday[3] = mealprep-bbq-mac.jpg → "BBQ Mac & Greens" ⚠️ NEEDS VERIFICATION
// images.monday[4] = cold_pressed_juice_v2.jpg → "Cold-Pressed Juice" ✅ Verified
// images.monday[5] = dessert-raspberry-mousse.jpg → "Raspberry Dark Chocolate Mousse" ⚠️ NEEDS VERIFICATION
//
// DESCRIPTION TRACKING:
// - "Mediterranean Harvest": Quinoa, roasted veg, falafel, tahini ⚠️ VERIFY ACTUAL INGREDIENTS
// - "Smokey Taco Bowl": Black beans, corn, jackfruit, chipotle crema ⚠️ VERIFY ACTUAL INGREDIENTS
// - "BBQ Mac & Greens": Smoked jackfruit, vegan mac, collards ⚠️ VERIFY ACTUAL INGREDIENTS
// - "Raspberry Dark Chocolate Mousse": Rich dark chocolate mousse topped with fresh raspberries — sugar free ⚠️ VERIFY
//
// MEAL PREP SCHEDULE: Orders close Wed 12:00 PM, pickup Thu 12:30-7:30 PM

const { baseRepoURL, baseURL, wrapEmail } = require('./shared-template');

const images = {
  logo: `${baseRepoURL}/TheUtopiaDeliLogo.png`,
  hero: `${baseRepoURL}/Deli%20Meal%20Prep%20Plate%201.jpg`,
  bowls: [
    { img: `${baseRepoURL}/mealprep-mediterranean.jpg`, name: "Mediterranean Harvest", desc: "Quinoa, roasted veg, falafel, tahini" },
    { img: `${baseRepoURL}/mealprep-smokey-taco.jpg`, name: "Smokey Taco Bowl", desc: "Black beans, corn, jackfruit, chipotle crema" },
    { img: `${baseRepoURL}/mealprep-bbq-mac.jpg`, name: "BBQ Mac & Greens", desc: "Smoked jackfruit, vegan mac, collards" },
  ],
  dessert: { img: `${baseRepoURL}/images/dessert-raspberry-mousse.jpg`, name: "Raspberry Dark Chocolate Mousse", desc: "Rich dark chocolate mousse topped with fresh raspberries — sugar free" },
  juice: { img: `${baseRepoURL}/cold_pressed_juice_v2.jpg`, name: "Cold-Pressed Juice", desc: "Fresh 10oz juice" }
};

const email_subject = "🍱 Meal Prep is Open — Fresh Bowls This Week";

const email_body = wrapEmail(`
<tr>
<td>
<img src="${images.hero}" alt="Utopia Deli Meal Prep Bowl" class="hero-img" style="width:100%;height:320px;object-fit:cover;display:block;">
</td>
</tr>

<tr>
<td style="padding:32px 28px 20px;">
<h1 style="margin:0 0 16px;color:#590B3F;font-size:28px;line-height:1.2;">This Week's Meal Prep is Open 🍱</h1>
<p style="margin:0 0 20px;color:#333;font-size:16px;line-height:1.6;">
Fresh, chef-crafted bowls ready for pickup. No cooking, no waiting — just heat and eat.
</p>
<p style="margin:0 0 24px;color:#AF3D4B;font-size:15px;font-weight:bold;">
⏰ Orders close Wednesday at 12:00 PM · Pickup Thursday
</p>
<a href="${baseURL}/catering/?utm_source=email&utm_medium=campaign&utm_campaign=monday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
Get Your Meals
</a>
</td>
</tr>

<tr>
<td style="padding:0 28px 24px;">
<h2 style="margin:0 0 16px;color:#590B3F;font-size:20px;">Meal Prep Favorites</h2>
<div class="dish-grid" style="display:flex;gap:16px;flex-wrap:wrap;">

${images.bowls.map(bowl => `
<div class="dish-card" style="flex:1;min-width:160px;background:#f8f6f4;border-radius:12px;overflow:hidden;">
<img src="${bowl.img}" style="width:100%;height:140px;object-fit:cover;display:block;">
<div style="padding:12px;">
<p style="margin:0 0 4px;color:#590B3F;font-weight:bold;font-size:14px;">${bowl.name}</p>
<p style="margin:0;color:#888;font-size:12px;">${bowl.desc}</p>
</div>
</div>
`).join('')}

<div class="dish-card" style="flex:1;min-width:160px;background:#f8f6f4;border-radius:12px;overflow:hidden;">
<img src="${images.dessert.img}" style="width:100%;height:140px;object-fit:cover;display:block;">
<div style="padding:12px;">
<p style="margin:0 0 4px;color:#590B3F;font-weight:bold;font-size:14px;">${images.dessert.name}</p>
<p style="margin:0;color:#888;font-size:12px;">${images.dessert.desc}</p>
</div>
</div>

<div class="dish-card" style="flex:1;min-width:160px;background:#f8f6f4;border-radius:12px;overflow:hidden;">
<img src="${images.juice.img}" style="width:100%;height:140px;object-fit:cover;display:block;">
<div style="padding:12px;">
<p style="margin:0 0 4px;color:#590B3F;font-weight:bold;font-size:14px;">${images.juice.name}</p>
<p style="margin:0;color:#888;font-size:12px;">${images.juice.desc}</p>
</div>
</div>

</div>
</td>
</tr>

<tr>
<td style="padding:0 28px 24px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f4;border-radius:12px;padding:20px;">
<tr><td>
<h3 style="margin:0 0 12px;color:#590B3F;font-size:16px;">How Meal Prep Works</h3>
<p style="margin:0 0 8px;color:#333;font-size:14px;line-height:1.5;">① Order online by Wednesday noon</p>
<p style="margin:0 0 8px;color:#333;font-size:14px;line-height:1.5;">② We prepare fresh Thursday morning</p>
<p style="margin:0;color:#333;font-size:14px;line-height:1.5;">③ Pick up Thursday 12:30PM–7:30PM at 801 S Chester St</p>
</td></tr>
</table>
</td>
</tr>

<tr>
<td style="padding:0 28px 32px;text-align:center;">
<a href="${baseURL}/catering/?utm_source=email&utm_medium=campaign&utm_campaign=monday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
Order Now — Closes Wednesday 12:00 PM
</a>
</td>
</tr>
`, images.logo);

const sms_body = "Meal prep is open 🍱 Orders close Wed 12:00 PM. order.theutopiadeli.com/catering/";

module.exports = { email_subject, email_body, sms_body, images };
