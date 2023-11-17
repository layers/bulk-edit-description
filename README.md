# Bulk Edit Description

This tool requires [Node.js](https://nodejs.org) installed.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/layers/bulk-edit-description
   ```

2. **Install Dependencies:**

   ```bash
   cd bulk-edit-description
   npm install
   ```

3. **Configuration:**
   - Rename `config.example.json` inside the `src` folder to `config.json`.
   - Fill in the required Google API Client ID and Client Secret (see the next section for instructions).

## Setting Up Google API Credentials

1. **Access the Google Cloud Console:**

   - Log in to your Google Cloud Platform (GCP) account at [Google Cloud Console](https://console.cloud.google.com).

2. **Create a New Project (if necessary):**

   - If you haven’t already created a project, click on the project selector dropdown at the top of the page and select "New Project." Follow the prompts to set up a new project.

3. **Navigate to the API & Services Dashboard:**

   - Once in your project, go to the Navigation menu (☰) and select "APIs & Services" > "Credentials."

4. **Configure OAuth Consent Screen:**

   - If you haven’t configured a consent screen before, set it up by clicking on "OAuth consent screen" and filling out the required information about your application.

5. **Create OAuth Client ID:**

   - After setting up the consent screen, return to the Credentials page and click on "Create Credentials" > "OAuth client ID."

6. **Choose Application Type:**

   - Select the "Web application" type.

7. **Configure Authorized Redirect URIs:**

   - Default URI: `http://localhost:3000/oauthcallback`

8. **Obtain Client ID and Client Secret:**

   - Fill out necessary information and click "Create" to generate your OAuth client ID and client secret.

9. **Enable the YouTube Data API:**
   - Visit [YouTube Data API](https://console.cloud.google.com/marketplace/product/google/youtube.googleapis.com) and ensure it's enabled for your project.

## Running the Tool

- Start the tool:
  ```bash
  npm start
  ```
