# Event tracking report

This document lists all PostHog events that have been automatically added to your Next.js application.

## Events by File

### src/app/page.tsx

- **contribution_questionnaire_opened**: User clicked on a 'Contribute' or 'Start contributing' button to open the questionnaire form.
- **section_navigated**: User clicked a navigation link in the header to scroll to a specific section of the page.

### src/components/BuiltWithSection.tsx

- **tool_card_clicked**: Fired when a user clicks on a tool card in the 'Built with the best tools' section.

### src/components/ContributeSection.tsx

- **contribute_button_clicked**: User clicked the 'Contribute' button in the contribution section.

### src/components/LandingChatDemo.tsx

- **landing_chat_message_sent**: Fired when a user sends a message in the landing page chat demo.
- **landing_chat_model_selected**: Fired when a user selects a different AI model in the landing page chat demo.

### src/components/MeetTheTeamSection.tsx

- **join-us-clicked**: User clicked the 'Join Us' button in the Meet the Team section.
- **team-member-social-link-clicked**: User clicked on a social media link for a team member.

### src/components/TryNowSection.tsx

- **download_button_clicked**: Fired when a user clicks the 'Download' button in the footer section.

### src/components/questionnaire.tsx

- **questionnaire-submitted**: Fired when a user successfully submits the questionnaire.
- **questionnaire-closed**: Fired when a user closes the questionnaire modal before completing it.


## Events still awaiting implementation
- (human: you can fill these in)
---

## Next Steps

1. Review the changes made to your files
2. Test that events are being captured correctly
3. Create insights and dashboards in PostHog
4. Make a list of events we missed above. Knock them out yourself, or give this file to an agent.

Learn more about what to measure with PostHog and why: https://posthog.com/docs/new-to-posthog/getting-hogpilled
