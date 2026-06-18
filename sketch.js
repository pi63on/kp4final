let leafletMap;
let canvas;
let agent;
let memories = [];
let currentPlace;
let currentIndex = 0;
let lastInteraction = 0;
let newMoverFlag = true;
let lastBranch = 0;

let locations =
    [
        ['nemocnica Antolská',
            48.10125317077472,
            17.11823888362016
        ],
        ['škôlka',
            48.12803883034353,
            17.127250079904318
        ],
        ['starkí',
            48.81384805358053,
            18.58504178154544
        ],
        ['babka a dedo',
            48.03926741758357,
            17.253236688832732
        ],
        ['základka',
            48.155810774380136,
            17.103221981751478
        ],
        ['GJH',
            48.145977255109365,
            17.133986794901165
        ],
        ['Neusiedl Gymnasium',
            47.94212904213112,
            16.844485660390102
        ],
        ['ISAK',
            36.35918613940393,
            138.55678605088914
        ],
        ['Fakultät für Physik',
            48.22169854347237,
            16.355807109217295
        ],
        ['Fakultät für Physik',
            52.4330241810532,
            13.530088922340802
        ],
        ['Lab Arbeit',
            48.18806564480984,
            16.402134102036896
        ],
        ['VŠVU',
            48.155578445858836,
            17.08578943635347
        ]
    ]

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("p5-layer");

    leafletMap = L.map("map").setView([48.1486, 17.1077], 13);

    var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    }).addTo(leafletMap);

    agent = new Mover(width / 2, height / 2);

    textAlign(LEFT);
    rectMode(CORNER);
    angleMode(RADIANS);
}

function draw() {
    noFill(), noStroke();
    clear();

    currentPlace = NaN;
    for (let i = 0; i < locations.length; i++) {
        place = locations[i]
        let myPoint = latLngToScreen(place[1], place[2]);
        let myDist = dist(myPoint.x, myPoint.y, mouseX, mouseY);

        stroke('blue');
        drawPlace(myPoint.x, myPoint.y, place);

        if (lastInteraction - frameCount == 0) {
        }

        // left pane backdrop
        noStroke();
        //memory box
        stroke('white');
        rect(width * 0.01, height * 0.5, width * 0.3, height * 0.45);
        // line(0, height/2, width, height/2);
        // line(100, 0, 100, height);

        //add a new memory point as menu switches
        if (newMoverFlag) {
            newMoverFlag = false;

            memories.push(new Mover(random(0.01 * width, width * 0.3), random(height * 0.6, height * 0.9)));
        }

        //draw and go through mover updates
        for (mover of memories) {
            mover.update();
            mover.show();

            for (mover2 of memories) {
                if (mover2 != mover) {
                    mover.applyForce(mover.seek(createVector(mover2.position.x, mover2.position.y))); // move marker to glob
                    let diff = p5.Vector.sub(mover.position, mover2.position).mag();
                    if ((diff < 1) && (mover.age > 100)) {
                        mover.size++;
                        memories.pop(mover2);
                        if (depthLimit < 11) {
                            depthLimit++;
                            lastBranch = frameCount;
                        }
                    }
                }
            }
        }
    }

    drawFractal();

    drawMenu();

    // dissapearing circle around the spot on the map
    if (frameCount - lastInteraction < 100) {
        push();
        translate(width / 2, height / 2);
        let r = map(frameCount - lastInteraction, 0, 100, 100, 0, true);
        let mycolor = color(255, 255, 255);
        mycolor.setAlpha(map(frameCount - lastInteraction, 0, 100, 255, 0, true));
        stroke(mycolor);
        noFill();
        circle(0, 0, r);
        pop();
    }

    if (frameCount - lastBranch > 150) {
        lastBranch = frameCount;
        if (depthLimit > 0) {
            depthLimit--;
        }
    }
}


function latLngToScreen(lat, lng) {
    return leafletMap.latLngToContainerPoint([lat, lng]);
}

function drawPlace(x, y, place) {
    let r = 6;

    push();
    stroke('white');
    noFill();
    circle(x, y, r);

    pop();
}

function drawMenu() {
    push();
    textSize(30);
    noFill(); stroke('white');
    text('welcome to my personal CV', width * 0.03, height * 0.05);
    text('(life in excel)', width * 0.03, height * 0.08);
    text('memories in cells', width * 0.03, height * 0.485);

    textSize(20);
    translate(width * 0.03, height * .1);
    for (let i = -4; i < 5; i++) {
        translate(0, height * 0.02);
        noStroke();
        let mycolor = color(255, 255, 255);
        mycolor.setAlpha(map(abs(i), 0, 4, 255, 100));
        // fill('yellow');
        fill(mycolor);

        let myind = (currentIndex + i + locations.length) % locations.length;
        // console.log('yom', myind)
        text(locations[myind][0], 0, 0);

    }
    translate(0, height * 0.06)
    noStroke(), fill('white');
    text(locations[currentIndex][1], 0, 0)
    translate(0, height * 0.015)
    text(locations[currentIndex][2], 0, 0)

    translate(-.02 * width, height * 0.615)
    text('Use the mouse to scroll through my CV. Each place has left behind memories that branch out and in.', 0, 0)

    pop();

}

function mousePressed() {
    if (currentPlace == NaN) {
    } else if (!(isNaN(currentPlace))) {
        let myAdder = currentPlace;
        document.getElementById('borderimage').src = 'images/' + myAdder + '.jpg';
        document.getElementById('imageText').innerHTML = locations[myAdder][0];
        openCenteredPopup('video-pages/' + myAdder + '.html', 500, 400, 'myNewWindow', myAdder);
    }
}

function mouseWheel(event) {
    lastInteraction = frameCount;

    // increase current index
    if (event.delta > 0) {
        currentIndex = (currentIndex + 1) % locations.length;
    } else if (event.delta < 0 && (currentIndex != 0)) {
        currentIndex = (currentIndex - 1) % locations.length;
    } else if (event.delta < 0 && (currentIndex == 0)) {
        currentIndex = locations.length - 1;
    }

    newMoverFlag = true;

    let place = locations[currentIndex];

    leafletMap.flyTo([place[1], place[2]]);
    leafletMap.panTo([place[1], place[2]]);
    return false
}

// popup details
function openCenteredPopup(url, width, height, windowName = "customPopup", vidIndex) {
    // Calculate left and top positions to center the popup
    const left = - screen.availWidth;
    const top = (screen.availHeight - height) / 2;

    // Define popup features (comma-separated, no spaces!)
    const features = [
        `width=${width}`,
        `height=${height}`,
        `left=${left}`,
        `top=${top}`,
        "toolbar=no", // Hide toolbar
        "location=no", // Hide address bar
        "status=no", // Hide status bar
        "menubar=no", // Hide menu bar
        "scrollbars=yes", // Show scrollbars if needed
        "resizable=yes" // Allow resizing
    ].join(",");

    // Open the popup
    return window.open(url, windowName, features);
}

let initialLength = 200; // Starting length of the trunk
let depthLimit = 0;      // How many times to recurse


function drawFractal() {
    push();
    stroke('white');
    translate(0.31 * width, height * 0.725);
    rotate(PI / 2)
    drawBranch(initialLength, 0);
    pop();

}

function drawBranch(len, depth) {
    // Base Case: Stop when the depth limit is reached
    if (depth < depthLimit) {
        // 1. Draw the current segment (the "trunk" or "branch")
        line(0, 0, 0, -len);

        // 2. Move to the end of the segment
        translate(0, -len);

        // 3. Branch 1: Right side
        push(); // Save the current position/rotation
        rotate(PI / 6); // Rotate 30 degrees (PI/6)
        drawBranch(len * 0.7, depth + 1); // Recurse with 70% of the length
        pop(); // Restore position/rotation

        // 4. Branch 2: Left side
        push(); // Save the current position/rotation
        rotate(-PI / 6); // Rotate -30 degrees
        drawBranch(len * 0.7, depth + 1); // Recurse with 70% of the length
        pop(); // Restore position/rotation
    }
}