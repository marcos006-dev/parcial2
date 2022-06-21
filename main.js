//import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

//const URL = 'https://teachablemachine.withgoogle.com/models/olTB9cjtI/';

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam

const iniciar = async () => {
  // const modelURL = URL + 'model.json';
  // const metadataURL = URL + 'metadata.json';

  const modelURL = './modelo/model.json';
  const metadataURL = './modelo/metadata.json';
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  document.getElementById('webcam-container').appendChild(webcam.canvas);
  labelContainer = document.getElementById('label-container');
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement('div'));
  }
};

const loop = async () => {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
};

// run the webcam image through the image model
const predict = async () => {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
};

document.getElementById('comenzar').addEventListener('click', iniciar);
