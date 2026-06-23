// ============================================
// TUESDAY — Catering Push
// ============================================
// IMAGE TRACKING:
// images.tuesday[0] = Deli Catering Salad.jpg → "Full-Service Catering" ✅ Verified
// images.tuesday[1] = Deli Catering Fruit Salad.jpg → "Corporate & Office" ✅ Verified
// images.tuesday[2] = Deli Meal Prep Plate 1.jpg → "Meal Prep & Bowls" ✅ Verified
//
// DESCRIPTION TRACKING:
// - Full-Service Catering: Generic OK
// - Corporate & Office: Generic OK
// - Meal Prep & Bowls: Updated to match meal prep image

const { baseRepoURL, baseURL, wrapEmail } = require('./shared-template');

const images = {
  logo: `${baseRepoURL}/TheUtopiaDeliLogo.png`,
  hero: `${baseRepoURL}/Deli%20Catering%20Salad.jpg`,
  cards: [
    { img: `${baseRepoURL}/Deli%20Catering%20Salad.jpg`, title: "Full-Service Catering", desc: "Drop-off, staffed buffet, or plated service for any occasion" },
    { img: `${baseRepoURL}/Deli%20Catering%20Fruit%20Salad.jpg`, title: "Corporate & Office", desc: "Team lunches, client meetings, recurring weekly orders" },
    { img: `${baseRepoURL}/Deli%20Meal%20Prep%20Plate%201.jpg`, title: "Meal Prep & Bowls", desc: "Fresh, chef-crafted bowls — perfect for individual meals or group orders" }
  ]
};

const email_subject = "🎉 Planning an Event? Let's Cater It";

const email_body = wrapEmail(`
<tr>
<td>
<img src="${images.hero}" alt="Utopia Deli Catering" class="hero-img" style="width:100%;height:320px;object-fit:cover;display:block;">
</td>
</tr>

<tr>
<td style="padding:32px 28px 20px;">
<h1 style="margin:0 0 16px;color:#590B3F;font-size:28px;line-height:1.2;">Planning an Event? Let's Make It Delicious 🎉</h1>
<p style="margin:0 0 20px;color:#333;font-size:16px;line-height:1.6;">
Weddings, birthdays, celebrations — we cater events of all sizes. From intimate gatherings to full-scale celebrations, Utopia Deli brings bold, plant-forward flavors that everyone remembers.
</p>
<p style="margin:0 0 24px;color:#AF3D4B;font-size:15px;font-weight:bold;">
Minimum 10 guests · 3 days advance notice
</p>
<a href="${baseURL}/catering/?utm_source=email&utm_medium=campaign&utm_campaign=tuesday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
Get a Catering Quote
</a>
</td>
</tr>

<tr>
<td style="padding:0 28px 24px;">
<h2 style="margin:0 0 16px;color:#590B3F;font-size:20px;">Catering Options</h2>
<div class="dish-grid" style="display:flex;gap:16px;flex-wrap:wrap;">

${images.cards.map(card => `
<div class="dish-card" style="flex:1;min-width:160px;background:#f8f6f4;border-radius:12px;overflow:hidden;">
<img src="${card.img}" style="width:100%;height:140px;object-fit:cover;display:block;">
<div style="padding:12px;">
<p style="margin:0 0 4px;color:#590B3F;font-weight:bold;font-size:14px;">${card.title}</p>
<p style="margin:0;color:#888;font-size:12px;">${card.desc}</p>
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
<h3 style="margin:0 0 12px;color:#590B3F;font-size:16px;">How Catering Works</h3>
<p style="margin:0 0 8px;color:#333;font-size:14px;line-height:1.5;">① Fill out our quick catering form</p>
<p style="margin:0 0 8px;color:#333;font-size:14px;line-height:1.5;">② We'll follow up with a custom quote within 24 hours</p>
<p style="margin:0;color:#333;font-size:14px;line-height:1.5;">③ Confirm, and we handle the rest — food, setup, everything</p>
</td></tr>
</table>
</td>
</tr>

<tr>
<td style="padding:0 28px 32px;text-align:center;">
<a href="${baseURL}/catering/?utm_source=email&utm_medium=campaign&utm_campaign=tuesday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
Start Your Catering Order
</a>
</td>
</tr>
`, images.logo);

const sms_body = "Planning an event? 🎉 Catering from Utopia Deli. order.theutopiadeli.com/catering/";

module.exports = { email_subject, email_body, sms_body, images };
