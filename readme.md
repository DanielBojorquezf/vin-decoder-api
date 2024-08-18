# VIN Decoder Scraper API

This project is a Node.js API built with Express and Puppeteer. The API takes a VIN (Vehicle Identification Number) as a query parameter, navigates to a specified webpage, inputs the VIN, submits the form, and then scrapes the resulting data.

## Features

- Input a VIN and scrape detailed vehicle information.
- Handles errors and returns descriptive error messages.
- Extracts data like manufacturer, vehicle type, model year, make, model, body class, and additional vehicle information including airbags and plant information.

## Requirements

- Node.js
- npm
- Puppeteer

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repo/vin-decoder-scraper.git
   cd vin-decoder-scraper

2. **Install the dependencies:**
    ```bash
    npm install

3. **Create a .env file:**

    In the root of your project, create a .env file and add the following:
    
    ```bash
    VIN_CHECK_URL=https://www.example.com/vin-check

4. **Run the application:**
    ```bash
    node index.js

5. **Usage:**

    Once the server is running, you can access the API by visiting:

    ```bash
    http://localhost:3000/scrape?vin=YOUR_VIN_HERE
    
## Security

    The URL used for scraping is kept private and should not be exposed.
    Ensure that the .env file is included in your .gitignore to prevent it
    from being committed to your version control system.

## License

    This project is licensed under the MIT License.

### Key Points:

- **Security**: The `.env` file is used to keep sensitive URLs private.
- **Modularity**: The `getTextByLabel` function is used to extract text values based on labels.
- **Error Handling**: Proper error handling ensures that any issues during the scraping process are communicated clearly via the API response.

This setup ensures that the code follows good practices and is ready for deployment or further development.