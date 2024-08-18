const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());


const delay = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

app.get('/scrape', async (req, res) => {
  const vin = req.query.vin;
  if (!vin) {
    return res.status(400).json({ error: 'VIN is required' });
  }

  const url = process.env.VIN_CHECK_URL;

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
    const page = await browser.newPage();
    
    await page.goto(`${url}`, { waitUntil: 'networkidle2' });
    await page.type('#VIN', vin);
    await page.click('#btnSubmit');
    await delay(3000);

    const result = await page.evaluate(() => {
      const errorElement = document.querySelector('.panel.panel-warning');
      if (errorElement) {
        const errorText = errorElement.innerText.trim();
        return { error: errorText.split(' - ')[1] || errorText };
      } 

      const getTextByLabel = (label) => {
        const labelElement = [...document.querySelectorAll('label')].find(el => el.innerText.includes(label));
        if (labelElement && labelElement.nextSibling) {
          return labelElement.nextElementSibling ? labelElement.nextElementSibling.textContent.trim() : labelElement.nextSibling.textContent.trim();
        }
        return null;
      };

      const dataObject = {
        manufacturer: getTextByLabel('Manufacturer:'),
        vehicleType: getTextByLabel('Vehicle Type:'),
        modelYear: document.querySelector('#decodedModelYear')?.innerText.trim(),
        make: document.querySelector('#decodedMake')?.innerText.trim(),
        model: document.querySelector('#decodedModel')?.innerText.trim(),
        bodyClass: getTextByLabel('Body Class:'),
        otherInformation: {
          series: getTextByLabel('Series:'),
          trim: getTextByLabel('Trim:'),
          grossVehicleWeightRating: getTextByLabel('Gross Vehicle Weight Rating:'),
          driveType: getTextByLabel('Drive Type:'),
          cylinders: getTextByLabel('Cylinders:'),
          primaryFuelType: getTextByLabel('Primary Fuel Type:'),
          electrificationLevel: getTextByLabel('Electrification Level:'),
          secondaryFuelType: getTextByLabel('Secondary Fuel Type:'),
          engineModel: getTextByLabel('Engine Model:'),
          engineBrakeHP: getTextByLabel('Engine Brake (HP):'),
          engineManufacturer: getTextByLabel('Engine Manufacturer:'),
          transmissionSpeed: getTextByLabel('Transmission Speed:'),
          transmissionStyle: getTextByLabel('Transmission Style:'),
          engineDisplacementL: getTextByLabel('Engine Displacement (L):'),
          airbags: {
            front: getTextByLabel('Front:'),
            knee: getTextByLabel('Knee:'),
            side: getTextByLabel('Side:'),
            curtain: getTextByLabel('Curtain:'),
            seatCushion: getTextByLabel('Seat Cushion:'),
            otherRestraintInfo: getTextByLabel('Other Restraint Info:')
          },
          plantInformation: getTextByLabel('Plant Information:')
        }
      };

      return dataObject;
    });

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
