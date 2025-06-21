
# Logistics Lens - Project Documentation

## 1. Project Overview

### Description

Logistics Lens is a modern, web-based application designed to streamline the tracking and management of military assets. It provides a comprehensive dashboard for real-time visibility into inventory, purchases, transfers, and personnel assignments across multiple bases. The system aims to provide commanders and logistics officers with the data they need to make informed decisions quickly.

### Assumptions

*   **User Authorization**: Users accessing the system are assumed to be authenticated and have appropriate permissions for their roles.
*   **Data Integrity**: The data source (currently mock data) is assumed to be accurate and representative of real-world asset information.
*   **Internal Use**: The application is intended for use on a secure internal network and is not designed for public-facing internet access.
*   **Modern Browser**: Users are expected to access the application using a modern web browser that supports current web standards.

### Limitations

*   **No Persistent Database**: The current version of the application uses mock data generated in the browser. There is no backend database for data persistence. All changes are lost on page refresh.
*   **Simulated RBAC**: Role-Based Access Control (RBAC) is marked in the code with comments but is not functionally implemented. There is no live user authentication or role enforcement.
*   **No Real-time Updates**: The system does not currently support real-time data synchronization between different users or sessions.
*   **AI Features**: The foundation for AI integration with Genkit is in place, but no specific AI flows are implemented yet.

---

## 2. Tech Stack & Architecture

The project is built with a modern, performant, and type-safe technology stack.

### Frontend

*   **Framework**: **Next.js (App Router)** - Chosen for its high performance, hybrid server/client rendering model, file-based routing, and overall excellent developer experience.
*   **UI Library**: **React** - The industry standard for building dynamic and component-based user interfaces.
*   **Language**: **TypeScript** - Used to enforce type safety, improve code quality, and enhance developer productivity.
*   **Styling**: **Tailwind CSS** & **ShadCN/UI** - A utility-first CSS framework combined with a library of beautifully designed, accessible, and reusable components allows for rapid and consistent UI development.
*   **Form Management**: **React Hook Form** & **Zod** - Provides a powerful and efficient way to manage complex forms with robust, schema-based validation.

### Backend

*   **Runtime**: The backend logic is co-located with the frontend within the **Next.js** application, leveraging Server Components and Server Actions.
*   **AI Integration**: **Genkit (Google AI)** - A framework for building production-ready AI-powered features. It's configured to use Google's Gemini models.
*   **Architecture Choice**: This integrated, full-stack approach simplifies development, deployment, and maintenance by removing the need to manage separate frontend and backend services. Next.js Server Actions provide a seamless, RPC-like mechanism for the client to securely call server-side functions, eliminating the need for traditional REST or GraphQL API endpoints for many operations.

### Database

*   **Current State**: None. The application currently operates with static, in-memory mock data.
*   **Future Recommendation**: For a production environment, a database like **Firebase Firestore** (NoSQL) or **PostgreSQL** (SQL) would be an excellent choice. Firestore would integrate seamlessly with the Firebase ecosystem, while a SQL database would offer strong transactional integrity.

---

## 3. Data Models / Schema

The core data structures of the application are defined in `src/types/index.ts`.

*   **`Purchase`**: Represents a record of a new asset purchase.
    *   `id`, `date`, `assetTypeId`, `quantity`, `unitPrice`, `supplier`, `baseId`
*   **`Transfer`**: Tracks the movement of assets between two bases.
    *   `id`, `date`, `assetTypeId`, `quantity`, `sourceBaseId`, `destinationBaseId`, `status`
*   **`Assignment`**: Records an asset being assigned to a specific person.
    *   `id`, `dateAssigned`, `assetId`, `quantityAssigned`, `personnelId`, `baseId`, `status`
*   **`Expenditure`**: Represents the consumption of an asset (e.g., ammunition, rations).
    *   `id`, `date`, `assetId`, `quantityUsed`, `reason`, `personnelId`
*   **`Asset`**: A specific piece of equipment or a bulk item.
    *   `id`, `assetTypeId`, `name`, `baseId`, `status`
*   **`Base`**: A physical location or base of operations.
    *   `id`, `name`

**Relationships**:
*   Purchases, Transfers, Assignments, and Assets are all associated with a `Base`.
*   Assignments and Expenditures are associated with `Personnel`.
*   Purchases, Transfers, and Assignments are associated with an `AssetType`.

---

## 4. RBAC (Role-Based Access Control) Explanation

RBAC is designed but not yet implemented. The system defines three primary roles:

*   **`Admin`**: Has full access to all system features, including user management and system settings.
*   **`BaseCommander`**: Can view all data for their assigned base and manage assignments and expenditures.
*   **`LogisticsOfficer`**: Can record purchases and initiate transfers between bases.

**Enforcement Method**:
RBAC would be enforced by checking the user's role after authentication. This check would happen in the UI and on the server:
1.  **UI Enforcement**: Components or actions (like "Delete" or "Create Transfer" buttons) would be conditionally rendered or disabled based on the user's role.
2.  **Server Enforcement**: Any server-side function (e.g., a Server Action to create a purchase) would first validate that the calling user's role grants them permission for that action before proceeding.

---

## 5. API Logging

Currently, there is no explicit transaction or API logging implemented in the application.

**Recommended Approach**:
*   **Server Actions**: A higher-order function could be created to wrap Server Actions. This wrapper would log the action name, input arguments, and outcome (success or failure) before executing the function.
*   **Genkit Flows**: Genkit has built-in observability features. When enabled, it automatically logs flow invocations, inputs, outputs, and any errors that occur, providing a complete trace of AI-related operations.

---

## 6. Setup Instructions

Follow these steps to set up and run the project locally.

### Prerequisites
*   Node.js (LTS version recommended)
*   npm or another package manager

### 1. Install Dependencies
Open your terminal and navigate to the project root. Run the following command:
```bash
npm install
```

### 2. Set Up Environment Variables (Optional)
To enable the AI features, you will need a Google AI API key.
1.  Create a file named `.env` in the root of the project.
2.  Add your API key to the file:
    ```
    GOOGLE_API_KEY=your_api_key_here
    ```

### 3. Run the Development Server
Start the Next.js development server with the following command:
```bash
npm run dev
```
The application will be available at `http://localhost:3000` (or another port if 3000 is in use).

---

## 7. API Endpoints (Architectural Note)

This application primarily uses **Next.js Server Actions** instead of traditional REST or GraphQL API endpoints. Client components call server-side functions directly and securely. These functions handle data fetching, mutations, and business logic.

**Key Data Operations (Pseudo-Endpoints)**:

*   **`handleAddPurchase(newPurchase)`** in `src/app/(app)/purchases/page.tsx`:
    *   **Action**: Creates a new purchase record.
    *   **Trigger**: Called when the purchase form is submitted.
*   **`handleAddTransfer(newTransfer)`** in `src/app/(app)/transfers/page.tsx`:
    *   **Action**: Initiates a new asset transfer.
    *   **Trigger**: Called when the transfer form is submitted.
*   **`handleAddAssignment(newAssignment)`** in `src/app/(app)/assignments/page.tsx`:
    *   **Action**: Assigns an asset to personnel.
    *   **Trigger**: Called when the assignment form is submitted.

An example of a future **Genkit AI Flow** could be:

*   **`generatePurchaseOrder(details)`**:
    *   **Action**: Takes purchase details as input and uses an LLM to generate a formatted purchase order document.
    *   **Input**: `{ assetName: string, quantity: number, supplier: string }`
    *   **Output**: `{ purchaseOrderText: string }`

This modern, integrated architecture simplifies the codebase by co-locating client and server logic for related features.
