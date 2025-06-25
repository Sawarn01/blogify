# **App Name**: Blogify AI

## Core Features:

- Landing Page: Landing page showcasing app features, pricing, and benefits.
- User Authentication: Secure sign-up and login functionality using Firebase Authentication, including Google sign-in.
- User Dashboard: Dashboard displaying personalized welcome message, blog post generation options, and a list of generated posts.
- AI Idea Generation: AI-powered blog post idea generation with topic and audience inputs; uses the Gemini API tool to provide title and outline suggestions.
- AI Content Generation: AI content generation based on selected title and outline. Including relevant keywords. Leverages the Gemini API tool to provide full post content.
- Account Settings: Account settings page for managing profile information and subscription status.
- Subscription Management: Premium subscription management with PayPal integration for monthly or annual payments; managed by Cloud Functions and webhooks.

## Style Guidelines:

- Primary color: Soft Blue (#A0D2EB) to inspire trust and clarity in content generation.
- Background color: Very light blue (#F0F8FF), creating a clean and airy feel.
- Accent color: Pale Violet (#D0B4DE) for interactive elements.
- Headline font: 'Belleza', sans-serif, to lend an artsy flair and support readability
- Body font: 'Alegreya', serif, to lend a professional but readable look for long-form text
- Use a consistent set of minimalistic icons to represent different features and actions.
- Clean and responsive layout optimized for various screen sizes using Tailwind CSS.
- Subtle loading animations and transitions to provide visual feedback during AI processing.