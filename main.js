import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

let model, webcam, labelContainer, maxPredictions;

const iniciar = async () => {
  document.getElementById('comenzar').style.display = "none";
  const modelURL = './modelo/model.json';
  const metadataURL = './modelo/metadata.json';
  document.getElementById('spinner').style.display = 'block';
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  const flip = true;
  webcam = new tmImage.Webcam(400, 400, flip);
  await webcam.setup();
  await webcam.play();
  document.getElementById('spinner').style.display = "none";
  window.requestAnimationFrame(loop);

  document.getElementById('webcam-container').appendChild(webcam.canvas);
  labelContainer = document.getElementById('label-container');
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement('div'));
  }
};

const loop = async () => {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
};

const predict = async () => {
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
};

document.getElementById('comenzar').addEventListener('click', iniciar);
