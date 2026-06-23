// ============================================
// UTOPIA DELI EMAIL CAMPAIGN — COMBINED WORKFLOW
// ============================================
// This file imports all day modules and selects the correct one
// based on the campaign_day input from n8n
//
// USAGE:
//   Set campaign_day in your n8n workflow to: monday | tuesday | wednesday | thursday | friday | saturday | sunday
//   This script will return the correct email subject, body, and SMS for that day

const monday = require('./monday-meal-prep-open');
const tuesday = require('./tuesday-catering');
const wednesday = require('./wednesday-deadline');
const thursday = require('./thursday-reopen');
const friday = require('./friday-weekend');
const saturday = require('./saturday-open');
const sunday = require('./sunday-preview');

const dayModules = {
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday
};

// Get the day from n8n input
const day = $input.first().json.campaign_day;

// Validate day
if (!dayModules[day]) {
  throw new Error(`Invalid campaign_day: "${day}". Must be one of: ${Object.keys(dayModules).join(', ')}`);
}

// Get the module for this day
const module = dayModules[day];

// Return the email and SMS content
return [{
  json: {
    campaign_day: day,
    email_subject: module.email_subject,
    email_body: module.email_body,
    sms_body: module.sms_body
  }
}];
