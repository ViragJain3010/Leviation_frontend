# Invoice Generator Frontend

This is the frontend for the Invoice Generator application. It is built using React.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Dependencies](#dependencies)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/ViragJain3010/Leviation_frontend
    cd Leviation_frontend
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

## Configuration

Create a `.env` file in the root directory and add the following environment variables:

```env
VITE_SERVER_URL=http://localhost:5000
```

Running the Application
To start the application in development mode, run:

```sh
npm run dev
```

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   ├── API/
│   ├── store/
│   ├── Slice/
│   ├── pages/
│   ├── App.js
│   ├── index.js
│   └── ...
├── .env
├── package.json
└── README.md
```

## Dependencies

- React
- React Router
- Redux-toolkit
- TailwindCSS
- Shadcn UI