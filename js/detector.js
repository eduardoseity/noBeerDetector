let mobilenet;
let testImage;
let classifier;
let classified;
let detector;
let videoLoaded;
let modelLoaded;
let img;
let canvasW;
let canvasH;
let video;
let cupLevel;

function getFrame() {
    let frame = loadImage("http://192.168.0.101:8080/shot.jpg", () => {
        image(frame, 0, 0, 300, 300);
        getFrame();
    },
    () => {
        console.log("Image failed!!!");
    });
}

function preload() {
    detector = ml5.objectDetector("MobileNet");
}

function modelReady() {
    span = select("#modelSpan");
    span.html("Modelo carregado!!!");
    console.log("Model is Ready!!!");
    classify();
}

function predict() {
    mobilenet.predict(video, (err, results) => {
        console.log(results);
    });
}

function gotResults(err, results) {
    if (err) {
        console.log(err);
    }
    else {
        cupLevel = results;
        classify();
    }
}

function classifyReady(err, result) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
    }
}

function classify() {
    mobilenet.classify(video,gotResults);
}

function gotDetections(err, results) {
    if (err) {
        // console.log(err);
    }
    else {
        if (results[0].label === "cup") {
            drawSquare(results[0].x,results[0].y,results[0].width,results[0].height);
        }
    }
}

// Draw square around the cup
function drawSquare(x, y, w, h) {
    let level = checkLevel();
    let textString = "";
    strokeWeight(5);
    noFill();
    textSize(40);
    switch (level) {
        case 0:
            stroke(255,0,0);
            textString = "😱";
            break;

        case 1:
            stroke(255,255,0);
            textString = "😧";
            break;

        case 2:
            stroke(0,255,0);
            textString = "🍺👍";
            break;
            
        default:
            break;
        }
        text(textString, x, y-45, 100, 50);
        rect(x, y, w, h);
    }
    
    // Check the level of the cup 0: Empty, 1: Almost empty, 2: Full
    function checkLevel() {
        if (cupLevel[0].label === "vazio") {
            return 0;
        }
        else if (cupLevel[0].label === "cheio") {
            return 2;
        }
    }
    
    function setup() {
        // Create initial canvas
        webcamCanvas = createCanvas(500,500);
        // webcamCanvas.parent("canvasDiv");
        // Use pre-trained neural network to recognize the image
        mobilenet = ml5.imageClassifier("./model.json", modelReady);
        // getFrame();
        video = createCapture(VIDEO);
        video.hide();
    }
    
    function draw() {
        image(video, 0, 0);
        detector.detect(video,gotDetections);
        
    // image(loadImage("http://192.168.0.101:8080/shot.jpg"), 0, 0, 300, 300);
    // canvasW = select("#browserVideo").width;
    // canvasH = select("#browserVideo").height;
    // resizeCanvas(canvasW,canvasH);
    // stroke(255,0,0);
    // noFill();
    // strokeWeight(4);
    // rect(0,0,canvasW,canvasH);

    // im = loadImage("http://192.168.0.101:8080/shot.jpg");
    // im2 = image(im, 0, 0, canvasW, canvasH);

    // detector.detect(im,gotDetections);
}