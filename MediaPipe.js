const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

var state = {
  fpsCount: 0,
  fpsLastTime: Date.now(),
  //
  isDrawPoseKeypoints: document.getElementById('isDrawPoseKeypoints').checked,
  isDrawFaceKeypoints: document.getElementById('isDrawFaceKeypoints').checked,
  isDrawHandsKeypoints: document.getElementById('isDrawHandsKeypoints').checked,
  isShowPoseTable: document.getElementById('isShowPoseTable').checked,
  isShowFaceTable: document.getElementById('isShowFaceTable').checked,
  isShowHandsTable: document.getElementById('isShowHandsTable').checked,
  //
  mpModelComplexity: 0,
  mpSmoothLandmarks: true,
  mpEnableSegmentation: false,
  mpSmoothSegmentation: false,
  mpRefineFaceLandmarks: true,
  mpMinDetectionConfidence: 0.5,
  mpMinTrackingConfidence: 0.5,
  mpSelfieMode: true
}

export function setIsDrawPoseKeypointsCheckbox(val){
  state.isDrawPoseKeypoints = val;
}
export function setIsDrawFaceKeypointsCheckbox(val){
  state.isDrawFaceKeypoints = val;
}
export function setIsDrawHandsKeypointsCheckbox(val){
  state.isDrawHandsKeypoints = val;
}

export function setIsShowPoseTableCheckbox(val){
  state.isShowPoseTable = val;
}
export function setIsShowFaceTableCheckbox(val){
  state.isShowFaceTable = val;
}
export function setIsShowHandsTableCheckbox(val){
  state.isShowHandsTable = val;
}

export function setMpModelComplexity(val){
  console.log('setMpModelComplexity('+val+')')
  state.mpModelComplexity = parseInt(val);
  refreshMpOption();
}
export function setMpSmoothLandmarks(val){
  console.log('setMpSmoothLandmarks('+val+')')
  state.mpSmoothLandmarks = val;
  refreshMpOption();
}
export function setMpEnableSegmentation(val){
  console.log('setMpEnableSegmentation('+val+')')
  state.mpEnableSegmentation = val;
  refreshMpOption();
}
export function setMpSmoothSegmentation(val){
  console.log('setMpSmoothSegmentation('+val+')')
  state.mpSmoothSegmentation = val;
  refreshMpOption();
}
export function setMpRefineFaceLandmarks(val){
  console.log('setMpRefineFaceLandmarks('+val+')')
  state.mpRefineFaceLandmarks = val;
  refreshMpOption();
}
export function setMpMinDetectionConfidence(val){
  console.log('setMpMinDetectionConfidence('+val+')')
  state.mpMinDetectionConfidence = parseFloat(val);
  refreshMpOption();
}
export function setMpMinTrackingConfidence(val){
  console.log('setMpMinTrackingConfidence('+val+')')
  state.mpMinTrackingConfidence = parseFloat(val);
  refreshMpOption();
}
export function setMpSelfieMode(val){
  console.log('setMpSelfieMode('+val+')')
  state.mpSelfieMode = val;
  refreshMpOption();
}

// https://github.com/google/mediapipe/blob/master/mediapipe/python/solutions/hands.py
const HAND_LANDMARKS = {
  WRIST: 0,
  THUMB_CMC: 1,
  THUMB_MCP: 2,
  THUMB_IP: 3,
  THUMB_TIP: 4,
  INDEX_FINGER_MCP: 5,
  INDEX_FINGER_PIP: 6,
  INDEX_FINGER_DIP: 7,
  INDEX_FINGER_TIP: 8,
  MIDDLE_FINGER_MCP: 9,
  MIDDLE_FINGER_PIP: 10,
  MIDDLE_FINGER_DIP: 11,
  MIDDLE_FINGER_TIP: 12,
  RING_FINGER_MCP: 13,
  RING_FINGER_PIP: 14,
  RING_FINGER_DIP: 15,
  RING_FINGER_TIP: 16,
  PINKY_MCP: 17,
  PINKY_PIP: 18,
  PINKY_DIP: 19,
  PINKY_TIP: 20,
}
// https://github.com/tensorflow/tfjs-models/blob/838611c02f51159afdd77469ce67f0e26b7bbb23/face-landmarks-detection/src/mediapipe-facemesh/keypoints.ts
const MESH_ANNOTATIONS = {
  silhouette: [
    10,  338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
    397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
    172, 58,  132, 93,  234, 127, 162, 21,  54,  103, 67,  109
  ],

  lipsUpperOuter: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291],
  lipsLowerOuter: [146, 91, 181, 84, 17, 314, 405, 321, 375, 291],
  lipsUpperInner: [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308],
  lipsLowerInner: [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308],

  rightEyeUpper0: [246, 161, 160, 159, 158, 157, 173],
  rightEyeLower0: [33, 7, 163, 144, 145, 153, 154, 155, 133],
  rightEyeUpper1: [247, 30, 29, 27, 28, 56, 190],
  rightEyeLower1: [130, 25, 110, 24, 23, 22, 26, 112, 243],
  rightEyeUpper2: [113, 225, 224, 223, 222, 221, 189],
  rightEyeLower2: [226, 31, 228, 229, 230, 231, 232, 233, 244],
  rightEyeLower3: [143, 111, 117, 118, 119, 120, 121, 128, 245],

  rightEyebrowUpper: [156, 70, 63, 105, 66, 107, 55, 193],
  rightEyebrowLower: [35, 124, 46, 53, 52, 65],

  // rightEyeIris: [473, 474, 475, 476, 477],

  leftEyeUpper0: [466, 388, 387, 386, 385, 384, 398],
  leftEyeLower0: [263, 249, 390, 373, 374, 380, 381, 382, 362],
  leftEyeUpper1: [467, 260, 259, 257, 258, 286, 414],
  leftEyeLower1: [359, 255, 339, 254, 253, 252, 256, 341, 463],
  leftEyeUpper2: [342, 445, 444, 443, 442, 441, 413],
  leftEyeLower2: [446, 261, 448, 449, 450, 451, 452, 453, 464],
  leftEyeLower3: [372, 340, 346, 347, 348, 349, 350, 357, 465],

  leftEyebrowUpper: [383, 300, 293, 334, 296, 336, 285, 417],
  leftEyebrowLower: [265, 353, 276, 283, 282, 295],

  // leftEyeIris: [468, 469, 470, 471, 472],

  midwayBetweenEyes: [168],

  noseTip: [1],
  noseBottom: [2],
  noseRightCorner: [98],
  noseLeftCorner: [327],

  rightCheek: [205],
  leftCheek: [425]
};

function printKeypoints(result) {
  try {
    var buffer = '';

    // console.log(result);
    
    const pose = result.poseLandmarks; // 33 x 
    const poseWorld = result.za; //pose world; 33 x 
    const rightHand = result.rightHandLandmarks; // 21 x
    const leftHand = result.leftHandLandmarks; // 21 x
    const face = result.faceLandmarks; // 468 x

    // console.log(face);

    // selfie mode -> left right flipped
    buffer+=('<table><thead><tr>');
    if (state.isShowPoseTable){
      buffer+=('<th>Pose</th><th>Pose World</th>');
    }
    if (state.isShowHandsTable){
      if (state.mpSelfieMode){
        buffer+=('<th>Left hand</th><th>Right hand</th>');
      }
      else{
        buffer+=('<th>Right hand</th><th>Left hand</th>');
      }
    }
    buffer+=('</tr></thead><tbody><tr>');

    if (state.isShowPoseTable){
      buffer+=('<td valign="top"><table border="1"><thead><tr><th>Landmark</th><th>&emsp;x&emsp;</th><th>&emsp;y&emsp;</th><th>visibility</th></tr></thead><tbody>');
      for (const [landmark, lIdx] of Object.entries(POSE_LANDMARKS)) {
        buffer+=('<tr><td>');
        buffer+=(lIdx + ' ' + landmark);
        if (typeof pose !== 'undefined'){
          buffer+=('</td><td>');
          buffer+=(pose[lIdx].x.toFixed(3));
          buffer+=('</td><td>');
          buffer+=(pose[lIdx].y.toFixed(3));
          buffer+=('</td><td>');
          buffer+=(pose[lIdx].visibility.toFixed(3));
          buffer+=('</td></tr>');
        }
        else{
          buffer+=('</td><td></td><td></td><td></td></tr>');
        }
      }
      buffer+=('</tbody></table></td>');

      buffer+=('<td valign="top"><table border="1"><thead><tr><th>Landmark</th><th>&nbsp;&emsp;x&emsp;</th><th>&nbsp;&emsp;y&emsp;</th><th>&nbsp;&emsp;z&emsp;</th><th>visibility</th></tr></thead><tbody>');
      for (const [landmark, lIdx] of Object.entries(POSE_LANDMARKS)) {
        buffer+=('<tr><td>');
        buffer+=(lIdx + ' ' + landmark);
        if (typeof poseWorld !== 'undefined'){
          buffer+=('</td><td>');
          buffer+=(poseWorld[lIdx].x.toFixed(3));
          buffer+=('</td><td>');
          buffer+=(poseWorld[lIdx].y.toFixed(3));
          buffer+=('</td><td>');
          buffer+=(poseWorld[lIdx].z.toFixed(3));
          buffer+=('</td><td>');
          buffer+=(poseWorld[lIdx].visibility.toFixed(3));
          buffer+=('</td></tr>');
        }
        else{
          buffer+=('</td><td></td><td></td><td></td><td></td></tr>');
        }
      }
      buffer+=('</tbody></table></td>');
    }

    if (state.isShowHandsTable){
      buffer+=('<td valign="top"><table border="1"><thead><tr><th>Landmark</th><th>&nbsp;&emsp;x&emsp;</th><th>&nbsp;&emsp;y&emsp;</th><th>&nbsp;&emsp;z&emsp;</th></tr></thead><tbody>');
      for (const [landmark, lIdx] of Object.entries(HAND_LANDMARKS)) {
        buffer+=('<tr><td>');
        buffer+=(lIdx + ' ' + landmark);
        if (typeof rightHand !== 'undefined'){
          buffer+=('</td><td>');
          buffer+=(rightHand[lIdx].x.toFixed(3));
          buffer+=('</td><td>');
          buffer+=(rightHand[lIdx].y.toFixed(3));
          buffer+=('</td><td>');
          buffer+=(rightHand[lIdx].z.toFixed(3));
          buffer+=('</td></tr>');
        }
        else{
          buffer+=('</td><td></td><td></td><td></td></tr>');
        }
      }
      buffer+=('</tbody></table></td>');

      buffer+=('<td valign="top"><table border="1"><thead><tr><th>Landmark</th><th>&nbsp;&emsp;x&emsp;</th><th>&nbsp;&emsp;y&emsp;</th><th>&nbsp;&emsp;z&emsp;</th></tr></thead><tbody>');
      for (const [landmark, lIdx] of Object.entries(HAND_LANDMARKS)) {
        buffer+=('<tr><td>');
        buffer+=(lIdx + ' ' + landmark);
        if (typeof leftHand !== 'undefined'){
          buffer+=('</td><td>');
          buffer+=(leftHand[lIdx].x.toFixed(3));
          buffer+=('</td><td>');
          buffer+=(leftHand[lIdx].y.toFixed(3));
          buffer+=('</td><td>');
          buffer+=(leftHand[lIdx].z.toFixed(3));
          buffer+=('</td></tr>');
        }
        else{
          buffer+=('</td><td></td><td></td><td></td></tr>');
        }
      }
      buffer+=('</tbody></table></td>');
    }

    buffer+=('</tr></tbody></table>');

    if (state.isShowFaceTable){
      buffer+=('<table width="6400"><thead><tr><th align="left">Face</th></tr></thead><tbody><tr>');
      buffer+=('<td valign="top"><table border="1" width="6400"><thead><tr>');
      for (const [landmark, indices] of Object.entries(MESH_ANNOTATIONS)) {
        buffer+=('<th>');
        buffer+=(landmark);
        buffer+=('</th>');
      }
      buffer+=('</tr></thead><tbody><tr>');
      for (const [landmark, indices] of Object.entries(MESH_ANNOTATIONS)) {
        buffer+=('<td valign="top" width="100">');
        for (const lIdx of indices){
          if (typeof face !== 'undefined' && typeof face[lIdx] !== 'undefined') {
            buffer+=(lIdx)+': '+(face[lIdx].x.toFixed(3)+', '+face[lIdx].y.toFixed(3)+', '+face[lIdx].z.toFixed(3))+'<br>';
          }
        }
        buffer+=('</td>');
      }
      buffer+=('</tr></tbody></table></td>');
    }
    buffer+=('</tr></tbody></table>');

    return buffer;

  } catch(exception) {
    console.log('Exception thrown: printKeypoints(): ' + exception)
    return '';
  }
}

function onResults(results) {
  var fpsThisTime = Date.now();
  if (fpsThisTime - state.fpsLastTime > 1000){
    document.getElementById('frameRate').innerHTML = (state.fpsCount/(fpsThisTime-state.fpsLastTime)*1000).toFixed(2) + ' FPS';
    state.fpsLastTime = fpsThisTime;
    state.fpsCount = 0;
  }
  state.fpsCount += 1;

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  if (typeof results.segmentationMask !== 'undefined'){
    canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);
  }

  // Only overwrite existing pixels.
  canvasCtx.globalCompositeOperation = 'source-in';
  canvasCtx.fillStyle = '#00FF00';
  canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  // Only overwrite missing pixels.
  canvasCtx.globalCompositeOperation = 'destination-atop';
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.globalCompositeOperation = 'source-over';

  if (state.isDrawPoseKeypoints){
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {color: '#00FF00', lineWidth: 4});
    drawLandmarks(canvasCtx, results.poseLandmarks, {color: '#FF0000', lineWidth: 2});
  }
  if (state.isDrawFaceKeypoints){
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {color: '#C0C0C070', lineWidth: 1});
  }
  if (state.isDrawHandsKeypoints){
    drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {color: '#CC0000', lineWidth: 5});
    drawLandmarks(canvasCtx, results.leftHandLandmarks, {color: '#00FF00', lineWidth: 2});
    drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {color: '#00CC00', lineWidth: 5});
    drawLandmarks(canvasCtx, results.rightHandLandmarks, {color: '#FF0000', lineWidth: 2});
  }
  canvasCtx.restore();
  
  document.getElementById('keypoints').innerHTML = printKeypoints(results);
}

const holistic = new Holistic({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
}});

function refreshMpOption(){
  console.log('refreshMpOption(): ' + '\n' +
              '  modelComplexity: ' + state.mpModelComplexity + '\n' +
              '  smoothLandmarks: ' + state.mpSmoothLandmarks + '\n' +
              '  enableSegmentation: ' + state.mpEnableSegmentation + '\n' +
              '  smoothSegmentation: ' + state.mpSmoothSegmentation + '\n' +
              '  refineFaceLandmarks: ' + state.mpRefineFaceLandmarks + '\n' +
              '  minDetectionConfidence: ' + state.mpMinDetectionConfidence + '\n' +
              '  minTrackingConfidence: ' + state.mpMinTrackingConfidence + '\n' +
              '  selfieMode: ' + state.mpSelfieMode
              );
  holistic.setOptions({
    modelComplexity: state.mpModelComplexity,
    smoothLandmarks: state.mpSmoothLandmarks,
    enableSegmentation: state.mpEnableSegmentation,
    smoothSegmentation: state.mpSmoothSegmentation,
    refineFaceLandmarks: state.mpRefineFaceLandmarks,
    minDetectionConfidence: state.mpMinDetectionConfidence,
    minTrackingConfidence: state.mpMinTrackingConfidence,
    selfieMode: state.mpSelfieMode,
  });
}
refreshMpOption();
holistic.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await holistic.send({image: videoElement});
  },
  width: 640,
  height: 480
});
camera.start();