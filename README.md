To Draft.js Custom Editor Project

Introduction

This project is a custom text editor built with React and Draft.js, supporting markdown-style formatting (#, \*, **, \***) and local storage for content persistence.

Prerequisites

Node.js (16 or above)

npm or yarn

# Install dependencies

npm install # or yarn install

# Start the development server

npm start # or yarn start

The app runs at http://localhost:3000.

Features

Markdown-style triggers:

# + Space → Heading Style

- - Space → Bold Text

\*\* + Space → Redline Style

\*\*\* + Space → Underline Style

Local storage for content persistence.

Manual save via Save button.

Dependencies

react

react-dom

draft-js

react-toastify
