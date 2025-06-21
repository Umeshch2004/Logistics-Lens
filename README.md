# Logistics Lens - Military Asset Management System

Logistics Lens is a modern, web-based application designed to streamline the tracking and management of military assets. It provides a comprehensive dashboard for real-time visibility into inventory, purchases, transfers, and personnel assignments across multiple bases.

## Tech Stack

This project is built with a modern, performant, and type-safe technology stack:

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **UI Library**: [React](https://react.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Component Library**: [ShadCN/UI](https://ui.shadcn.com/)
-   **AI Integration**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation
-   **Charts**: [Recharts](https://recharts.org/)

## Getting Started

To get the development server running locally, follow these steps:

1.  **Install Dependencies**:
    Open your terminal and run the following command to install all the necessary packages:
    ```bash
    npm install
    ```

2.  **Run the Development Server**:
    Once the installation is complete, start the Next.js development server:
    ```bash
    npm run dev
    ```

The application should now be running on your local development server.

## Key Features & Pages

-   **/dashboard**: An overview of key metrics, including asset distribution and recent activity logs.
-   **/purchases**: A dedicated section to record new asset purchases and view historical procurement data.
-   **/transfers**: Manage and track the movement of assets between different bases.
-   **/assignments**: Assign equipment to personnel and monitor the status of assigned assets.

## Project Structure

The project is organized following Next.js App Router conventions:

-   `src/app/(app)`: Contains the main application pages and layouts.
-   `src/components`: Reusable React components, organized by feature (e.g., `dashboard`, `purchases`) and UI elements (`ui`, `shared`).
-   `src/lib`: Contains utility functions (`utils.ts`), constant definitions (`constants.ts`), and validation schemas (`schemas.ts`).
-   `src/ai`: Houses the Genkit AI flows for any generative AI features.
-   `src/app/globals.css`: Global styles and Tailwind CSS configuration.
-   `src/types`: TypeScript type definitions for the application's data structures.
