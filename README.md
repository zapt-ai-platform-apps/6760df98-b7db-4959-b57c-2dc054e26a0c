# Supper Ideas

## Description

This app helps you get personalized supper ideas after a brief set of questions about your preferences. You can select a meal from the generated ideas, and the app will generate and display an image of the selected meal.

## User Journey

1. **Sign In**

   - The user opens the app and is presented with a "Sign in with ZAPT" prompt.
   - The user clicks on one of the available social login providers: Google, Facebook, or Apple.
   - After successful authentication, the user is taken to the main app page.

2. **Answering Questions**

   - On the main page, the user is greeted and prompted to answer a few questions to help generate supper ideas.
   - The user is presented with input fields or selections for the following questions:
     - Dietary preferences (e.g., vegetarian, vegan, gluten-free, no preference).
     - Preferred cuisine types (e.g., Italian, Chinese, Mexican, etc.).
     - Any ingredients to include or exclude.
     - Cooking time available (e.g., 15 minutes, 30 minutes, 1 hour).
   - The user fills in their preferences.

3. **Generating Supper Ideas**

   - The user clicks on the "Get Supper Ideas" button.
   - The app shows a loading state while fetching ideas.
   - The app uses AI to generate personalized supper ideas based on the user's answers.
   - The AI ensures the response is in a JSON object with a property `meals` containing the array of meal ideas.
   - The ideas are displayed as a list of meals.

4. **Selecting a Meal and Viewing its Image**

   - The user selects a meal from the list by clicking on it.
   - The app shows a loading state while generating the image.
   - The app uses AI to generate an image of the selected meal.
   - Once ready, the image of the meal is displayed to the user.

5. **Saving and Sharing Supper Ideas**

   - The user can:
     - **Save as Word Document**: Click the "Save as Word" button to download the supper ideas as a Word document.
     - **Share**: Click the "Share" button to share the supper ideas using the device's sharing options (e.g., email, messaging apps).

6. **Signing Out**

   - The user can sign out of the app by clicking the "Sign Out" button.

## Additional Features

- The app now has a clean light theme with subtle accents for action elements, making it visually appealing and user-friendly.
- Responsive design ensures optimal experience across different screen sizes.
- Loading states are displayed during API calls to provide feedback to the user.
- Buttons are disabled during loading to prevent multiple submissions.
- The design is optimized to prevent any white space below the app on any screen size.
- All buttons have a pointer cursor to indicate interactivity.
- Input fields have consistent borders for a cohesive look.