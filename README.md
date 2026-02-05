# Fullstack monorepo template feat. Expo, Turbo, Next.js, Convex, Clerk

This is a modern TypeScript monorepo template with AI web and native apps
featuring:

- Turborepo: Monorepo management
- React 19: Latest React with concurrent features
- Next.js 15: Web app & marketing page with App Router
- Tailwind CSS v4: Modern CSS-first configuration
- React Native [Expo](https://expo.dev/): Mobile/native app with New Architecture
- [Convex](https://convex.dev): Backend, database, server functions
- [Clerk](https://clerk.dev): User authentication
- OpenAI: Text summarization (optional)
   
## Project Overview

nAgents is an outbound AI voice assistant platform designed to automate and scale human-like phone interactions using intelligent, task-oriented agents.

The system enables organizations to deploy AI agents that can place outbound calls, engage users in natural conversations, follow predefined scripts or goals, and dynamically adapt based on user responses. These agents are built to handle real-world workflows such as lead outreach, follow-ups, reminders, and information collection—reducing manual labor while maintaining a conversational, human tone.

nAgents is architected as a full-stack, cross-platform system:

- A web dashboard for managing agents, workflows, and call activity

- A native mobile app for real-time monitoring and interaction

- A shared backend that coordinates conversation logic, state, and data persistence across platforms

The platform emphasizes:

- Scalable agent orchestration
- Realtime data synchronization
- End-to-end type safety
- Extensible AI behavior and conversation flows

This project was developed as part of an internship and reflects production-oriented engineering practices, including monorepo architecture, shared APIs, authentication, and realtime backend infrastructure.

## What's inside? 

This monorepo template includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js 15](https://nextjs.org/) app with Tailwind CSS and Clerk
- `native`: a [React Native](https://reactnative.dev/) app built with
  [expo](https://docs.expo.dev/)
- `packages/backend`: a [Convex](https://www.convex.dev/) folder with the
  database schema and shared functions

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).
