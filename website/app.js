// api key for open waether api
const API_KEY = 'f5b5b7f705288e343539d63ae18130a3';
const spinner = document.querySelector('.spinner');

// util function to make api calls
const fetchData = async (url, payload = null, httpMethod = 'GET') => {
	const reqConfig = {
		method: httpMethod,
		headers: {
			'Content-Type': 'application/json'
		}
	};
	try {
		if (payload) {
			reqConfig.body = JSON.stringify(payload);
			const res = await fetch(url, reqConfig);
			const data = await res.json();
			return data;
		}
		let res = await fetch(url, reqConfig);
		let data = await res.json();
		return data;
	} catch (error) {
		console.log(error);
		document.querySelector('#error').innerHTML = `<p>Opps Error!</p>`;
		spinner.classList.remove('show-spinner');
	}
};

//  get users input
const getInputs = () => {
	const zip = document.querySelector('#zip').value;
	const feelings = document.querySelector('#feelings').value;
	return { zip, feelings };
};

// update ui
const updateUi = (payload = null) => {
	if (!payload) {
		document.querySelector('#date').innerHTML = '';
		document.querySelector('#temp').innerHTML = '';
		document.querySelector('#content').innerHTML = '';
		return;
	}
	const { temperature, date, userResponse } = payload;
	document.querySelector(
		'#date'
	).innerHTML = `<span>Date: <span class="value">${date}</span></span>`;

	document.querySelector(
		'#temp'
	).innerHTML = `<span>Temperature: <span class="value">${temperature}°F</span></span>`;

	document.querySelector('#content').innerHTML = `
    <span>Zip code: <span class="value">${userResponse.zip}</span></span>
    <br>
    <span>Feelings: <span class="value">${userResponse.feelings}<span></span>
  `;
};

const generateHandler = async () => {
	const { zip, feelings } = getInputs();

	// clear existing content;
	updateUi();

	// if no input show error
	if (zip === '' || feelings === '') {
		return (document.querySelector(
			'#error'
		).innerHTML = `<p class="error">Provide zip code and Feelings</p>`);
	}

	// Show the spinner
	spinner.classList.add('show-spinner');
	// clear any existing eror
	document.querySelector('#error').innerHTML = ``;

	// compose url, corsProxy is used due to cors error
	const corsProxy = 'https://cors-anywhere.herokuapp.com/';
	const weatherbaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
	const weatherFullUrl = `${corsProxy}${weatherbaseUrl}?zip=${zip}&appid=${API_KEY}`;

	// use util function to fetch weather data
	const weatherData = await fetchData(weatherFullUrl);

	// check data receive
	if (weatherData && weatherData.main) {
		const date = new Date().toLocaleDateString();
		const userDetails = {
			temperature: weatherData.main.temp,
			date,
			userResponse: { zip, feelings }
		};

		// local server url
		const localServerUrl = 'http://localhost:5000/data';

		// post user data to local server
		await fetchData(localServerUrl, userDetails, 'POST');

		// get user data
		const serverRes = await fetchData(localServerUrl);
		// hide the spinner
		spinner.classList.remove('show-spinner');

		// update ui with data received
		return updateUi(serverRes);
	}

	// if no data, then an invalid zip code was entered
	document.querySelector(
		'#error'
	).innerHTML = `<p class="error">Invalid zip code!</p>`;

	// hode spinner
	spinner.classList.remove('show-spinner');
};

// on click handler
const generateBtn = document.querySelector('#generate');
generateBtn.addEventListener('click', generateHandler);
