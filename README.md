# Brain-storming on new applications around the stream of body, hands, face keypoints extracted from MediaPipe

Existing applications:
- video conference reactions (https://support.apple.com/guide/iphone/use-video-conferencing-features-iphaa0b5671d/ios): 8 gestures recognized
- Avatar animation
- online meeting camera focus for signers ("presenter" focus with signing instead of speech; forget which service has this)
- physical exercise: push-up, squat counter (https://developers.google.com/ml-kit/vision/pose-detection/classifying-poses)
- golf swing analysis

Potential applications:
- gesture-controlled smart home devices (with camera) / computer user interface in general (think "minority report")
- in-car driver monitor and gesture control
- sign language recognition (and communicating with non-signers)


MediaPipe issues to overcome:
- FPS varies from device to device (train-inference skew)
- incorrectly recognized keypoints between correctly recognized frames (smoothing? would it work well with fast movements?)
- holistic model is in the process of being updated


## TODO
- [x] Build client device-side data pipeline for processing both live webcam stream and recorded video
- [ ] Feature engineering: hand-crafted or latent representation (embedding) learning
- [ ] Models: sequence classification / sequence tagging / sequence-to-sequence generation
- [ ] Stream data decoding



# client-server data collection
- connection between client-server
  - websocket
- client
  - video, webcam modes
  - set client id
  - set server settings
  - video/webcam resolution
- server
  - asynchronous, multi-threaded
  - data format
    - client id
    - video source, dimension
    - keypoints, timestamp
    - mediapipe model version, config
    - (annotations)
  - database format