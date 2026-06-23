# Unsubscribe Workflow Fix Plan

## Current Problem
The "Utopia Deli — Email Unsubscribe" workflow exists and is ACTIVE, but:
- Success Page node has empty `options: {}` → user sees blank page
- Error Page node has empty `options: {}` → user sees blank page

## What the Workflow Does (Correctly)
1. Receives webhook at `/webhook/unsubscribe?email=xxx`
2. Extracts email parameter
3. Validates email has @ symbol
4. Runs Postgres UPDATE: `SET unsubscribed_email = true`
5. Logs to message_logs table

## What Needs Fixing
Add response HTML to the Success Page and Error Page nodes.

## HTML Templates Needed

### Success Page
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed — The Utopia Deli</title>
  <style>
    body { font-family: Georgia, serif; background: #f8f6f4; margin: 0; padding: 40px 20px; text-align: center; }
    .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; }
    h1 { color: #590B3F; margin-bottom: 20px; }
    p { color: #333; font-size: 16px; line-height: 1.6; }
    .logo { max-height: 60px; margin-bottom: 20px; }
    .btn { display: inline-block; background: #AF3D4B; color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://raw.githubusercontent.com/Phillip-Lowe/utopia-deli/main/TheUtopiaDeliLogo.png" alt="The Utopia Deli" class="logo">
    <h1>You're Unsubscribed</h1>
    <p>We've removed you from our email list. You won't receive any more marketing emails from The Utopia Deli.</p>
    <p>Changed your mind? <a href="https://order.theutopiadeli.com">Visit our website</a> or contact us anytime.</p>
    <a href="https://order.theutopiadeli.com" class="btn">Order Online</a>
  </div>
</body>
</html>
```

### Error Page
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error — The Utopia Deli</title>
  <style>
    body { font-family: Georgia, serif; background: #f8f6f4; margin: 0; padding: 40px 20px; text-align: center; }
    .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; }
    h1 { color: #590B3F; margin-bottom: 20px; }
    p { color: #333; font-size: 16px; line-height: 1.6; }
    .logo { max-height: 60px; margin-bottom: 20px; }
    .btn { display: inline-block; background: #AF3D4B; color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://raw.githubusercontent.com/Phillip-Lowe/utopia-deli/main/TheUtopiaDeliLogo.png" alt="The Utopia Deli" class="logo">
    <h1>Something Went Wrong</h1>
    <p>We couldn't process your unsubscribe request. This might be because:</p>
    <ul style="text-align: left; color: #666;">
      <li>The link expired</li>
      <li>The email address was missing</li>
      <li>There was a technical issue</li>
    </ul>
    <p>Please contact us directly and we'll remove you manually:</p>
    <p><strong>Email:</strong> theutopiadeli@gmail.com<br>
    <strong>Phone:</strong> (501) 555-0198</p>
    <a href="mailto:theutopiadeli@gmail.com" class="btn">Email Us</a>
  </div>
</body>
</html>
```

## How to Fix in n8n UI
1. Go to https://n8n.systack.net
2. Open workflow "Utopia Deli — Email Unsubscribe"
3. Click "Success Page" node
4. Set:
   - Status Code: 200
   - Response Body: [Paste Success HTML above]
   - Content-Type: text/html
5. Click "Error Page" node
6. Set:
   - Status Code: 200
   - Response Body: [Paste Error HTML above]
   - Content-Type: text/html
7. Click "Save" then "Activate"
