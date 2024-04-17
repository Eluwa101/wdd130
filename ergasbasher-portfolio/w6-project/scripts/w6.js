
const userDataApiUrl = 'https://run.mocky.io/v3/ebea2918-645f-4f82-b4f7-96829040c0f3';

// Function to fetch user data from the API
async function fetchUserData() {
  try {
    const response = await fetch(userDataApiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return [];
  }
}

// Function to calculate BMR using BMR formular
function calculateBMR(age, gender, weight, height) {
  if (gender === 'female') {
    return 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
  } else {
    return 66.5 + (13.8 * weight) + (5 * height) - (6.8 * age);
  }
}

// Function to calculate BMI
function calculateBMI(weight, height) {
  return weight / Math.pow(height / 100, 2);
}

// Function to provide health advice based on BMI of a user
function getHealthAdvice(bmi) {
  if (bmi < 18.5) {
    return 'Underweight - Consider consulting with a nutritionist for a balanced diet.';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal weight - Maintain a healthy lifestyle and regular exercise.';
  } else if (bmi >= 25 && bmi < 30) {
    return 'Overweight - Consider adopting a healthier diet and exercise routine.';
  } else {
    return 'Obese - It is advisable to consult with a healthcare professional for personalized advice.';
  }
}

// Function to fetch user data, so as to calculate BMR and BMI, and display the result
async function calculateBMRandBMI() {
  console.log("test working")
  const nameInput = document.getElementById('name');
  const ageInput = document.getElementById('age');
  const genderInput = document.getElementById('gender');
  const weightInput = document.getElementById('weight');
  const heightInput = document.getElementById('height');
  const useMemberBox = document.getElementById('useApiData');
  const resultDiv = document.getElementById('result');
  const healthPanel = document.getElementById('health-panel');

  const name = nameInput.value;
  const age = parseInt(ageInput.value, 10);
  const gender = genderInput.value.toLowerCase();
  const weight = parseFloat(weightInput.value);
  const height = parseFloat(heightInput.value);
  const useApiData = useMemberBox.checked;

  let userData;

  if (useApiData) {
    try {
      // Fetch user data from the API
      userData = await fetchUserData();
    } 
    catch (error) {
      console.error('Error fetching user data from API:', error);
      userData = [];
    }
  } else {

    // data manually entered by the user
    userData = [
      { "name": name, "age": age, "gender": gender, "weight": weight, "height": height }
    ];
  }

  // here i'm using user data from JSON based on the entered name only
  const user = userData.find(usr => usr.name.toLowerCase() === name.toLowerCase());

  if (user) {
    const userBMR = calculateBMR(user.age, user.gender, user.weight, user.height);
    const userBMI = calculateBMI(user.weight, user.height);
    const advice = getHealthAdvice(userBMI);

    // this block displays the result in the result window for you to see
    resultDiv.innerHTML = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Age:</strong> ${user.age}</p>
      <p><strong>Gender:</strong> ${user.gender}</p>
      <p><strong>Weight:</strong> ${user.weight} kg</p>
      <p><strong>Height:</strong> ${user.height} cm</p>
      <p><strong>BMR:</strong> ${userBMR.toFixed(2)} calories/day</p>
      <p><strong>BMI:</strong> ${userBMI.toFixed(2)}</p>
    `;

    //  this block displays health advice in the health panel
    healthPanel.innerHTML = `<p><strong>Health Advice:</strong> ${advice}</p>`;
  } else {
    resultDiv.innerHTML = `<p>${name} is not in member list, do manual data entry instead</p>`;
    healthPanel.innerHTML = '';
  }
}
