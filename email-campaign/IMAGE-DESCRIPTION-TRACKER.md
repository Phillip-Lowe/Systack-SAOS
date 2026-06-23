# Utopia Deli Email Campaign — Image & Description Tracker

**Purpose:** Track which images match which descriptions so we don't send mismatched content.
**Last Updated:** 2026-06-22
**Status:** Images updated to GitHub repo URLs. Descriptions need weekly verification.

---

## 📸 IMAGE INVENTORY

### Available Images (GitHub Repo)
All images now use: `https://raw.githubusercontent.com/Phillip-Lowe/utopia-deli/main/`

| Filename | What It Shows | Status | Used In |
|----------|--------------|--------|---------|
| `Deli Meal Prep Plate 1.jpg` | Meal prep bowl hero shot | ✅ Verified | Mon, Tue, Thu, Sun heroes |
| `Deli Catering Salad.jpg` | Large catering salad bowl | ✅ Verified | Tuesday card 1 |
| `Deli Catering Fruit Salad.jpg` | Catering fruit salad | ✅ Verified | Tuesday card 2 |
| `Deli Happy customer lady.jpg` | Customer smiling with food | ✅ Verified | Friday hero |
| `Deli Nacho.jpg` | Nacho plate | ✅ Verified | Available |
| `mealprep-mediterranean.jpg` | Mediterranean bowl | ⚠️ Needs check | Monday |
| `mealprep-smokey-taco.jpg` | Smokey taco bowl | ⚠️ Needs check | Monday, Wednesday |
| `mealprep-bbq-mac.jpg` | BBQ Mac bowl | ⚠️ Needs check | Monday |
| `mealprep-chili-noodles.jpg` | Chili garlic noodles | ⚠️ Needs check | Wednesday |
| `mealprep-peanut-tofu.jpg` | Peanut ginger tofu | ⚠️ Needs check | Wednesday |
| `cold_pressed_juice_v2.jpg` | Cold-pressed juice bottle | ✅ Verified | Monday, Friday, Saturday |
| `images/dessert-raspberry-mousse.jpg` | Raspberry chocolate dessert | ⚠️ Needs check | Monday |
| `chicken_philly.jpg` | Steak Philly sandwich | ⚠️ Needs check | Thursday, Friday, Saturday, Sunday |
| `loaded_bacon_fry.jpg` | Loaded bacon fries | ⚠️ Needs check | Thursday, Friday, Saturday |
| `chicken_poppers_v3.jpg` | Chicken poppers | ⚠️ Needs check | Thursday, Friday, Saturday, Sunday |
| `cookies_v2.jpg` | Cookies | ⚠️ Needs check | Friday |

---

## 📝 DESCRIPTION TRACKING

### Monday — Meal Prep is Open
| Item | Current Description | Verified? | Notes |
|------|---------------------|-----------|-------|
| Mediterranean Harvest | Quinoa, roasted veg, falafel, tahini | ❌ | Need actual ingredients |
| Smokey Taco Bowl | Black beans, corn, jackfruit, chipotle crema | ❌ | Need actual ingredients |
| BBQ Mac & Greens | Smoked jackfruit, vegan mac, collards | ❌ | Need actual ingredients |
| Raspberry Dark Chocolate Mousse | Rich dark chocolate mousse topped with fresh raspberries — sugar free | ❌ | Verify sugar-free claim |
| Cold-Pressed Juice | Fresh 10oz juice | ✅ | Standard |

### Tuesday — Catering Push
| Item | Current Description | Verified? | Notes |
|------|---------------------|-----------|-------|
| Full-Service Catering | Drop-off, staffed buffet, or plated service for any occasion | ✅ | Generic OK |
| Corporate & Office | Team lunches, client meetings, recurring weekly orders | ✅ | Generic OK |
| Meal Prep & Bowls | Fresh, chef-crafted bowls — perfect for individual meals or group orders | ✅ | Updated to match image |

### Wednesday — Meal Prep Deadline
| Item | Current Description | Verified? | Notes |
|------|---------------------|-----------|-------|
| Smokey Taco Bowl | (name only in email) | ❌ | Need actual bowls for this week |
| Chili Garlic Noodles | (name only in email) | ❌ | Need actual bowls for this week |
| Peanut Ginger Tofu | (name only in email) | ❌ | Need actual bowls for this week |

### Thursday — Meal Prep Reopens
| Item | Current Description | Verified? | Notes |
|------|---------------------|-----------|-------|
| Next Week's Bowls | (hero only, no descriptions) | ❌ | Need actual next week lineup |
| Menu Items | Steak Philly, fries, poppers | ⚠️ | These are walk-up items, not meal prep |

### Friday — Weekend Kickoff
| Item | Current Description | Verified? | Notes |
|------|---------------------|-----------|-------|
| Weekend Vibes | Lifestyle/customer photo | ✅ | Generic OK |
| Menu Items | Steak Philly, fries, poppers, cookies, juice | ⚠️ | Need to verify which are available |

### Saturday — We're Open Today
| Item | Current Description | Verified? | Notes |
|------|---------------------|-----------|-------|
| Menu Items | Steak Philly, poppers, fries, juice | ⚠️ | Need to verify which are available |

### Sunday — This Week's Menu
| Item | Current Description | Verified? | Notes |
|------|---------------------|-----------|-------|
| Next Week Preview | (hero + 2 items) | ❌ | Need actual next week lineup |

---

## ✅ WEEKLY UPDATE CHECKLIST

Before sending each week:

- [ ] **Get photos from Jacqueline** (text/iCloud/email)
- [ ] **Identify each photo** — what dish is this?
- [ ] **Match to descriptions** — do descriptions match what's in the photo?
- [ ] **Update bowl names** — what are we calling them this week?
- [ ] **Update calorie counts** — if shown
- [ ] **Check add-ons** — desserts, juices in stock?
- [ ] **Verify schedule** — pickup times still correct?
- [ ] **Test send** — send to yourself first

---

## 🗂️ FILE STRUCTURE

```
email-campaign/
├── shared-template.js           # Header, footer, wrapper
├── IMAGE-DESCRIPTION-TRACKER.md # This file
├── monday-meal-prep-open.js     # Monday module
├── tuesday-catering.js          # Tuesday module
├── wednesday-deadline.js        # Wednesday module
├── thursday-reopen.js           # Thursday module
├── friday-weekend.js            # Friday module
├── saturday-open.js             # Saturday module
├── sunday-preview.js            # Sunday module
└── utopia-deli-all-days.js      # Combined (legacy)
```

---

**Next Steps:**
1. Get this week's actual meal prep photos from Jacqueline
2. Identify what each photo shows
3. Update descriptions to match
4. Replace any placeholder images
