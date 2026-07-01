const day = $input.first().json.campaign_day;

const baseURL = "https://order.theutopiadeli.com";

const images = {
  logo: 'https://order.theutopiadeli.com/images/logo.png',

  // Meal prep photos (existing rotation — photos we actually have)
  mealprep: {
    mediterranean: 'https://order.theutopiadeli.com/catering/images/meal-mediterranean-harvest.jpg',
    thaiPeanut: 'https://order.theutopiadeli.com/catering/images/meal-thai-peanut-crunch.jpg',
    eggplantParm: 'https://order.theutopiadeli.com/catering/images/meal-eggplant-parm.jpg',
    cajunBeans: 'https://order.theutopiadeli.com/catering/images/meal-cajun-northern-beans.jpg',
    juice: 'https://order.theutopiadeli.com/catering/images/cold_pressed_juice_v2.jpg',
    mousse: 'https://order.theutopiadeli.com/catering/images/dessert-raspberry-mousse.jpg',
    plateHero: 'https://raw.githubusercontent.com/Phillip-Lowe/utopia-deli/refs/heads/main/Deli%20Meal%20Prep%20Plate%201.jpg',
  },

  // Order page item photos (spotlight items)
  orderPage: {
    buffaloSliders: 'https://order.theutopiadeli.com/images/buffalo_chikn_slider.jpg',
    rocktownSliders: 'https://order.theutopiadeli.com/images/rocktown_bourbon_slider.jpg',
    poppers: 'https://order.theutopiadeli.com/images/chicken_poppers_v3.jpg',
    stekPhilly: 'https://order.theutopiadeli.com/images/stek%20Philly.jpg',
    loadedBaconFry: 'https://order.theutopiadeli.com/images/loaded_bacon_fry.jpg',
    chiknFriedSub: 'https://order.theutopiadeli.com/images/chicken_fried_chikn_sub.png',
    cowboySandwich: 'https://order.theutopiadeli.com/images/cowboy_chicken.webp',
    clubSub: 'https://order.theutopiadeli.com/images/chicken_club.webp',
  },

  // Catering photos
  catering: [
    'https://raw.githubusercontent.com/Phillip-Lowe/utopia-deli/refs/heads/main/email-campaign/catering-3.jpg',
    'https://raw.githubusercontent.com/Phillip-Lowe/utopia-deli/refs/heads/main/email-campaign/catering-1.jpg',
    'https://raw.githubusercontent.com/Phillip-Lowe/utopia-deli/refs/heads/main/email-campaign/catering-4.jpg',
    'https://raw.githubusercontent.com/Phillip-Lowe/utopia-deli/refs/heads/main/email-campaign/catering-2.jpg',
  ],
};

// ── Meal prep item catalog (all meals we offer, mixed per day) ──
const meals = [
  { name: 'Mediterranean Harvest Bowl', desc: 'Lemon herb quinoa, crispy oregano chickpeas, cucumber tomato salad, hummus, tahini drizzle, pickled red onion — 500 cal', img: images.mealprep.mediterranean },
  { name: 'Thai Peanut Crunch Bowl', desc: 'Jasmine rice, crispy peanut tofu, sesame cabbage slaw, sweet chili peanut drizzle — 490 cal', img: images.mealprep.thaiPeanut },
  { name: 'Eggplant Parmesan', desc: 'Parmesan crusted eggplant layered with homemade marinara, topped with fresh basil — 530 cal', img: images.mealprep.eggplantParm },
  { name: 'Cajun Red Beans & Dirty Rice', desc: 'Dirty rice, Cajun beans, peppers & onions, green onion garnish — 460 cal', img: images.mealprep.cajunBeans },
  { name: 'Lemon Chickpea Orzo', desc: 'Tender orzo tossed with roasted chickpeas, wilted spinach, garlic, fresh lemon, herbs, and a light lemon buttery sauce — 480 cal', img: images.mealprep.plateHero },
  { name: 'Creamy Mushroom Wild Rice', desc: 'Wild rice, sautéed mushrooms, caramelized onions, garlic, and spinach folded into a silky herb cream sauce — 510 cal', img: images.mealprep.plateHero },
  { name: 'Mediterranean Pasta Salad', desc: 'Rotini pasta tossed with crisp cucumbers, juicy tomatoes, red onion, chickpeas, fresh herbs, and a vibrant lemon vinaigrette — 450 cal', img: images.mealprep.mediterranean },
  { name: 'Buffalo Chickpea Caesar Wrap', desc: 'Crispy buffalo chickpeas layered with crisp romaine, shaved parmesan-style cheeze, crunchy onions, and creamy Caesar dressing — 530 cal', img: images.mealprep.plateHero },
  { name: 'Baked Vegetable Lasagna Roll-Ups', desc: 'Lasagna noodles rolled around a creamy tofu ricotta with spinach, roasted vegetables, herbs, and marinara — 550 cal', img: images.mealprep.eggplantParm },
  { name: 'Bourbon BBQ Lentil Meatloaf', desc: 'Smoky lentil meatloaf glazed with sweet bourbon-style BBQ sauce, creamy garlic mashed potatoes, roasted green beans — 520 cal', img: images.mealprep.plateHero },
  { name: 'Sweet & Sticky Orange Tofu', desc: 'Crispy tofu tossed in a house-made orange garlic glaze with fresh ginger, citrus zest, and chili, served with jasmine rice and charred vegetables — 490 cal', img: images.mealprep.thaiPeanut },
];

const desserts = [
  { name: 'Apple Pie', desc: 'Classic spiced apple pie — sugar free', img: 'https://order.theutopiadeli.com/catering/images/apple-pie.jpg' },
  { name: 'Cold-Pressed Juice', desc: 'Fresh 10oz juice — Pineapple, Honeycrisp Apple, Lemon', img: images.mealprep.juice },
];

// Helper: build a dish card
const dishCard = (img, name, desc) => `
<div class="dish-card" style="flex:1;min-width:160px;background:#f8f6f4;border-radius:12px;overflow:hidden;">
<img src="${img}" style="width:100%;height:140px;object-fit:cover;display:block;">
<div style="padding:12px;">
<p style="margin:0 0 4px;color:#590B3F;font-weight:bold;font-size:14px;">${name}</p>
<p style="margin:0;color:#888;font-size:12px;">${desc}</p>
</div>
</div>`;

// Helper: build the "How Meal Prep Works" block
const howMealPrepWorks = () => `
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
</tr>`;

// Helper: build the "We're Open" info bar
const openTodayBar = () => `
<tr>
<td style="padding:0 28px 24px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#590B3F;border-radius:12px;padding:20px;">
<tr><td style="text-align:center;">
<p style="margin:0 0 4px;color:#fff;font-size:16px;font-weight:bold;">We're Open Today 🍽️</p>
<p style="margin:0;color:#fff;font-size:14px;">Order online for pickup 12:30PM–7:30PM · 801 S Chester St</p>
</td></tr>
</table>
</td>
</tr>`;

// Helper: catering CTA block
const cateringCTA = (campaign) => `
<tr>
<td style="padding:0 28px 24px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f4;border-radius:12px;padding:20px;">
<tr><td>
<h3 style="margin:0 0 12px;color:#590B3F;font-size:16px;">Planning an Event?</h3>
<p style="margin:0 0 8px;color:#333;font-size:14px;line-height:1.5;">We cater parties, meetings, weddings — 10 to 500 guests. Drop-off, staffed buffet, or full-service.</p>
<p style="margin:0;color:#333;font-size:14px;line-height:1.5;"><a href="${baseURL}/catering/?utm_source=email&utm_medium=campaign&utm_campaign=${campaign}" style="color:#AF3D4B;font-weight:bold;">Request a catering quote →</a></p>
</td></tr>
</table>
</td>
</tr>`;

const buildHeader = () => `
<tr>
<td style="background:#590B3F;padding:20px 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="vertical-align:middle;">
        <img src="${images.logo}" alt="The Utopia Deli" style="height:56px;display:block;">
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

const wrapEmail = (content) => `
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
${buildHeader()}
${content}
${buildFooter()}
</table>
</td></tr>
</table>
</body>
</html>
`;

const templates = {

  // ═══════════════════════════════════════════
  // MONDAY — We're Open + Meal Prep (variety showcase) + Order Page Spotlight
  // ═══════════════════════════════════════════
  monday: {
    email_subject: "🍽️ We're Open — Meal Prep + Fresh Picks Today",
    email_body: wrapEmail(`
<tr>
<td>
<img src="${images.mealprep.plateHero}" alt="Utopia Deli Meal Prep" class="hero-img" style="width:100%;height:320px;object-fit:cover;display:block;">
</td>
</tr>

<tr>
<td style="padding:32px 28px 20px;">
<h1 style="margin:0 0 16px;color:#590B3F;font-size:28px;line-height:1.2;">We're Open Today 🍽️</h1>
<p style="margin:0 0 20px;color:#333;font-size:16px;line-height:1.6;">
Order online for pickup — we're serving fresh from 12:30 to 7:30. Meal prep orders close Wednesday at noon.
</p>
<p style="margin:0 0 24px;color:#AF3D4B;font-size:15px;font-weight:bold;">
🕐 Open today 12:30PM–7:30PM · ⏰ Meal prep closes Wednesday 12:00 PM
</p>
<div style="text-align:center;">
<a href="${baseURL}/pickup-order/?utm_source=email&utm_medium=campaign&utm_campaign=monday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;margin-right:8px;">
Order Online
</a>
<a href="${baseURL}/catering/?utm_source=email&utm_medium=campaign&utm_campaign=monday"
style="display:inline-block;background:transparent;color:#AF3D4B;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;border:2px solid #AF3D4B;">
Order Meal Prep
</a>
</div>
</td>
</tr>

<tr>
<td style="padding:0 28px 24px;">
<h2 style="margin:0 0 16px;color:#590B3F;font-size:20px;">Meal Prep — What We Offer</h2>
<p style="margin:0 0 16px;color:#333;font-size:14px;line-height:1.5;">Our bowls rotate weekly — here's a taste of what's on the menu. Order by Wednesday noon for Thursday pickup.</p>
<div class="dish-grid" style="display:flex;gap:16px;flex-wrap:wrap;">
${dishCard(meals[0].img, meals[0].name, meals[0].desc)}
${dishCard(meals[1].img, meals[1].name, meals[1].desc)}
${dishCard(meals[5].img, meals[5].name, meals[5].desc)}
${dishCard(meals[9].img, meals[9].name, meals[9].desc)}
${dishCard(desserts[1].img, desserts[1].name, desserts[1].desc)}
</div>
</td>
</tr>

<tr>
<td style="padding:0 28px 24px;">
<h2 style="margin:0 0 16px;color:#590B3F;font-size:20px;">Today's Spotlight from the Menu 🥪</h2>
<div class="dish-grid" style="display:flex;gap:16px;flex-wrap:wrap;">
${dishCard(images.orderPage.buffaloSliders, 'Buffalo Chik\'n Sliders', 'Buffalo chik\'n sliders with fresh slaw and ranch on a garlic butter slider bun — $12')}
${dishCard(images.orderPage.poppers, 'Chik\'n Poppers', 'Crispy chik\'n dippers — BBQ, Garlic Parm, Jerk, Buffalo, Lemon Pepper Wet — $10')}
</div>
</td>
</tr>

${howMealPrepWorks()}

<tr>
<td style="padding:0 28px 32px;text-align:center;">
<a href="${baseURL}/catering/?utm_source=email&utm_medium=campaign&utm_campaign=monday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
Order Meal Prep — Closes Wednesday 12:00 PM
</a>
</td>
</tr>
`),
    sms_body: "We're open today 🍽️ Meal prep closes Wed noon. order.theutopiadeli.com"
  },

  // ═══════════════════════════════════════════
  // TUESDAY — Catering Push
  // ═══════════════════════════════════════════
  tuesday: {
    email_subject: "🎉 Planning an Event? Let's Cater It",
    email_body: wrapEmail(`
<tr>
<td>
<img src="${images.catering[0]}" alt="Utopia Deli Catering Spread" class="hero-img" style="width:100%;height:320px;object-fit:cover;display:block;">
</td>
</tr>

<tr>
<td style="padding:32px 28px 20px;">
<h1 style="margin:0 0 16px;color:#590B3F;font-size:28px;line-height:1.2;">Planning an Event? Let's Make It Delicious 🎉</h1>
<p style="margin:0 0 20px;color:#333;font-size:16px;line-height:1.6;">
Weddings, birthdays, corporate lunches, graduation parties — we cater events from 10 to 500 guests. Drop-off, staffed buffet, or full-service. Bold, plant-forward flavors that everyone remembers.
</p>
<p style="margin:0 0 24px;color:#AF3D4B;font-size:15px;font-weight:bold;">
Minimum 10 guests · 3 days advance notice · 50% deposit to book
</p>
<a href="${baseURL}/catering/?utm_source=email&utm_medium=campaign&utm_campaign=tuesday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
Get a Catering Quote
</a>
</td>
</tr>

<tr>
<td style="padding:0 28px 24px;">
<h2 style="margin:0 0 16px;color:#590B3F;font-size:20px;">What We Bring to the Table</h2>
<div class="dish-grid" style="display:flex;gap:16px;flex-wrap:wrap;">
${dishCard(images.catering[0], 'Full-Service Catering', 'Pasta, garlic bread, fresh salad, sweet tea — complete buffet spread for any occasion')}
${dishCard(images.catering[1], 'Baked Ziti & Lasagna', 'Cheesy baked pasta casseroles with Italian herbs — crowd favorites')}
${dishCard(images.catering[2], 'Fresh Fruit Platters', 'Watermelon, cantaloupe, mango, pineapple — beautifully arranged on wooden boards')}
${dishCard(images.catering[3], 'Fresh Glazed Donuts', 'Old-fashioned cake donuts with crackly sugar glaze — perfect for morning meetings')}
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
`),
    sms_body: "Planning an event? 🎉 Catering from Utopia Deli. order.theutopiadeli.com/catering/"
  },

  // ═══════════════════════════════════════════
  // WEDNESDAY — Last Call Meal Prep + Order Page Spotlight
  // ═══════════════════════════════════════════
  wednesday: {
    email_subject: "⏰ Meal Prep Closes at Noon — Last Call",
    email_body: wrapEmail(`
<tr>
<td>
<img src="${images.mealprep.thaiPeanut}" alt="Thai Peanut Crunch Bowl" class="hero-img" style="width:100%;height:280px;object-fit:cover;display:block;">
</td>
</tr>

<tr>
<td style="padding:32px 28px 20px;text-align:center;">
<h1 style="margin:0 0 16px;color:#AF3D4B;font-size:28px;line-height:1.2;">Meal Prep Closes Today at Noon ⏰</h1>
<p style="margin:0 0 20px;color:#333;font-size:16px;line-height:1.6;">
Last chance to grab your bowls this week. Fresh, chef-crafted meals ready for pickup Thursday.
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
<p style="margin:0 0 12px;color:#590B3F;font-size:18px;font-weight:bold;">Bowls We Offer</p>
<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
<div style="text-align:center;">
<img src="${meals[2].img}" style="width:120px;height:100px;object-fit:cover;border-radius:8px;display:block;margin:0 auto 8px;">
<p style="margin:0;color:#333;font-size:12px;">Eggplant Parmesan</p>
</div>
<div style="text-align:center;">
<img src="${meals[3].img}" style="width:120px;height:100px;object-fit:cover;border-radius:8px;display:block;margin:0 auto 8px;">
<p style="margin:0;color:#333;font-size:12px;">Cajun Red Beans</p>
</div>
<div style="text-align:center;">
<img src="${meals[6].img}" style="width:120px;height:100px;object-fit:cover;border-radius:8px;display:block;margin:0 auto 8px;">
<p style="margin:0;color:#333;font-size:12px;">Mediterranean Pasta Salad</p>
</div>
<div style="text-align:center;">
<img src="${meals[7].img}" style="width:120px;height:100px;object-fit:cover;border-radius:8px;display:block;margin:0 auto 8px;">
<p style="margin:0;color:#333;font-size:12px;">Buffalo Chickpea Wrap</p>
</div>
</div>
</td></tr>
</table>
</td>
</tr>

<tr>
<td style="padding:0 28px 24px;">
<h2 style="margin:0 0 16px;color:#590B3F;font-size:20px;">Today's Spotlight from the Menu 🥪</h2>
<div class="dish-grid" style="display:flex;gap:16px;flex-wrap:wrap;">
${dishCard(images.orderPage.stekPhilly, 'Philly Sub', 'Stek OR Chik\'n with sautéed onions & bell peppers — $13')}
${dishCard(images.orderPage.chiknFriedSub, 'Chik\'n Fried Chik\'n Sub', 'Crispy Fried Chik\'n on a hoagie with lettuce, tomato, ranch — $13')}
</div>
</td>
</tr>

${openTodayBar()}

<tr>
<td style="padding:0 28px 32px;text-align:center;">
<a href="${baseURL}/pickup-order/?utm_source=email&utm_medium=campaign&utm_campaign=wednesday"
style="display:inline-block;background:transparent;color:#AF3D4B;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;border:2px solid #AF3D4B;">
Order Online for Pickup
</a>
</td>
</tr>
`),
    sms_body: "⏰ Meal prep closes today at noon! order.theutopiadeli.com/catering/"
  },

  // ═══════════════════════════════════════════
  // THURSDAY — Pick Up Your Bowls + Order Page Spotlight
  // ═══════════════════════════════════════════
  thursday: {
    email_subject: "📦 Pick Up Your Bowls Today + We're Open",
    email_body: wrapEmail(`
<tr>
<td>
<img src="${images.mealprep.plateHero}" alt="Utopia Deli Meal Prep Pickup" class="hero-img" style="width:100%;height:300px;object-fit:cover;display:block;">
</td>
</tr>

<tr>
<td style="padding:32px 28px 20px;">
<h1 style="margin:0 0 16px;color:#590B3F;font-size:28px;line-height:1.2;">Pick Up Your Bowls Today 📦</h1>
<p style="margin:0 0 20px;color:#333;font-size:16px;line-height:1.6;">
Your meal prep is ready! Swing by 801 S Chester St between 12:30 and 7:30 PM. Have your name ready at the window.
</p>
<p style="margin:0 0 24px;color:#AF3D4B;font-size:15px;font-weight:bold;">
🕐 Pickup 12:30PM–7:30PM · 📍 801 S Chester St, Little Rock
</p>
</td>
</tr>

<tr>
<td style="padding:0 28px 24px;">
<h2 style="margin:0 0 16px;color:#590B3F;font-size:20px;">Order Online for Pickup — We're Open 🍽️</h2>
<div class="dish-grid" style="display:flex;gap:16px;flex-wrap:wrap;">
${dishCard(images.orderPage.stekPhilly, 'Philly Sub', 'Stek OR Chik\'n with sautéed onions & bell peppers — $13')}
${dishCard(images.orderPage.loadedBaconFry, 'Loaded Bac\'n Fry', 'Crinkle-cut fries loaded with bac\'n, cheeze sauce — $13')}
${dishCard(images.orderPage.poppers, 'Chik\'n Poppers', 'Crispy dippers — BBQ, Garlic Parm, Jerk, Buffalo, Lemon Pepper — $10')}
</div>
</td>
</tr>

${cateringCTA('thursday')}

<tr>
<td style="padding:0 28px 24px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#590B3F;border-radius:12px;padding:20px;">
<tr><td style="text-align:center;">
<p style="margin:0 0 4px;color:#fff;font-size:16px;font-weight:bold;">The Utopia Deli</p>
<p style="margin:0 0 4px;color:#fff;font-size:14px;">801 S Chester St, Little Rock, AR 72202</p>
<p style="margin:0;color:#fff;font-size:13px;opacity:0.8;">Monday–Saturday · 12:30PM–7:30PM</p>
</td></tr>
</table>
</td>
</tr>

<tr>
<td style="padding:0 28px 32px;text-align:center;">
<a href="${baseURL}/pickup-order/?utm_source=email&utm_medium=campaign&utm_campaign=thursday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
Order Online
</a>
</td>
</tr>
`),
    sms_body: "📦 Pick up your meal prep today 12:30–7:30PM at 801 S Chester St!"
  },

  // ═══════════════════════════════════════════
  // FRIDAY — Meal Prep Is Live + Order Page Spotlight
  // ═══════════════════════════════════════════
  friday: {
    email_subject: "🍱 Meal Prep Is Live — Fresh Bowls Every Week",
    email_body: wrapEmail(`
<tr>
<td>
<img src="${images.mealprep.mediterranean}" alt="Utopia Deli Fresh Meal Prep" class="hero-img" style="width:100%;height:320px;object-fit:cover;display:block;">
</td>
</tr>

<tr>
<td style="padding:32px 28px 20px;">
<h1 style="margin:0 0 16px;color:#590B3F;font-size:28px;line-height:1.2;">Meal Prep Is Live — Fresh Bowls Every Week 🍱</h1>
<p style="margin:0 0 20px;color:#333;font-size:16px;line-height:1.6;">
Our bowls rotate weekly — always something different, always fresh. Chef-crafted, plant-forward, zero cooking on your end. Order now — closes Wednesday at noon.
</p>
<p style="margin:0 0 24px;color:#AF3D4B;font-size:15px;font-weight:bold;">
🟢 Orders open now · 🔴 Closes Wednesday 12:00 PM · 📦 Pickup Thursday
</p>
<a href="${baseURL}/catering/?utm_source=email&utm_medium=campaign&utm_campaign=friday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
Order Meal Prep
</a>
</td>
</tr>

<tr>
<td style="padding:0 28px 24px;">
<h2 style="margin:0 0 16px;color:#590B3F;font-size:20px;">Bowls We Offer</h2>
<p style="margin:0 0 16px;color:#333;font-size:14px;line-height:1.5;">Our menu rotates — here's a peek at what you might see this week.</p>
<div class="dish-grid" style="display:flex;gap:16px;flex-wrap:wrap;">
${dishCard(meals[2].img, meals[2].name, meals[2].desc)}
${dishCard(meals[7].img, meals[7].name, meals[7].desc)}
${dishCard(meals[8].img, meals[8].name, meals[8].desc)}
${dishCard(meals[10].img, meals[10].name, meals[10].desc)}
${dishCard(desserts[0].img, desserts[0].name, desserts[0].desc)}
${dishCard(desserts[1].img, desserts[1].name, desserts[1].desc)}
</div>
</td>
</tr>

<tr>
<td style="padding:0 28px 24px;">
<h2 style="margin:0 0 16px;color:#590B3F;font-size:20px;">Today's Spotlight from the Menu 🥪</h2>
<div class="dish-grid" style="display:flex;gap:16px;flex-wrap:wrap;">
${dishCard(images.orderPage.loadedBaconFry, 'Loaded Bac\'n Fry', 'Crinkle-cut fries loaded with bac\'n, cheeze sauce — $13')}
${dishCard(images.orderPage.clubSub, 'Chik\'n Club Sub', 'Grilled Chik\'n Bac\'n Cheese on a bed of Lettuce and Tomatoes — $15')}
</div>
</td>
</tr>

${howMealPrepWorks()}

<tr>
<td style="padding:0 28px 24px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#590B3F;border-radius:12px;padding:20px;">
<tr><td style="text-align:center;">
<p style="margin:0 0 4px;color:#fff;font-size:16px;font-weight:bold;">Weekend Hours</p>
<p style="margin:0 0 4px;color:#fff;font-size:14px;">Friday & Saturday · 12:30PM–7:30PM</p>
<p style="margin:0;color:#fff;font-size:13px;opacity:0.8;">Order online for pickup — we've got you</p>
</td></tr>
</table>
</td>
</tr>

<tr>
<td style="padding:0 28px 32px;text-align:center;">
<a href="${baseURL}/catering/?utm_source=email&utm_medium=campaign&utm_campaign=friday"
style="display:inline-block;background:#AF3D4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:bold;">
Order Meal Prep Now
</a>
</td>
</tr>
`),
    sms_body: "🍱 Meal prep is live! Order by Wed noon. order.theutopiadeli.com/catering/"
  }
};

const template = templates[day] || templates.monday;
const results = [];

for (const item of $input.all()) {
  const c = item.json;

  if (c.email && !c.unsubscribed_email) {
    results.push({
      json: {
        contact_id: c.id,
        channel: 'email',
        to: c.email,
        subject: template.email_subject,
        body: template.email_body.replace(/%%EMAIL%%/g, encodeURIComponent(c.email)),
        campaign_day: day
      }
    });
  }
}

return results;