let editorAreaBackgroundColor = "white";
let editorAreaDrawColor = "black";
let editorAreaDrawFontSize = "3";
let drawingEnabled = false;
let drawingShape = "line";
let restoreArray = [];
let index = -1;
let mouseStartingX,mouseStartingY;
let textStarting=0;
let canvasScreenShot;
let eraserEnabled = false;

//Text Widget Handling
const textList = [];
let isDragging = false;
let dragOffsetX, dragOffsetY;
let selectedText = null;
let textEnabled = false;
let hidePreviouText = false;
//Text Widget Handling

const editorArea = document.getElementById('editor-area');
editorArea.width = window.innerWidth;
editorArea.height = window.innerHeight;

// const editorArea = document.getElementById('editor-area-for-text');
// editorArea.width = window.innerWidth;
// editorArea.height = window.innerHeight;

const drawColorsBtn = document.querySelectorAll('.draw-color');
const customFontColor = document.getElementById('custom-font-color');
const customFontSize = document.getElementById('custom-font-size');
const saveCanvasBtn = document.getElementById('save-canvas-btn');
const clearCanvasBtn = document.getElementById('clear-canvas-btn');
const undoCanvasBtn = document.getElementById('undo-canvas-btn');
const eraseCanvasBtn = document.getElementById('erase-canvas-btn');
const shapeBtn = document.querySelectorAll('.shape');

let context = editorArea.getContext("2d");
context.imageSmoothingEnabled = true
context.fillStyle=editorAreaBackgroundColor;
context.imageSmoothingEnabled = true;
context.fillRect(0,0,window.innerWidth,window.innerHeight);

//Text Widget Handling
const editTextEditor = document.getElementById('editTextEditor');
const editTextInput = document.getElementById('editTextInput');
const editSaveButton = document.getElementById('editSaveButton');
const addTextEditor = document.getElementById('addTextEditor');
const addTextInput = document.getElementById('addTextInput');
const addSaveButton = document.getElementById('addSaveButton');
const editCutButton = document.getElementById('editCutButton');
editCutButton.addEventListener('click',function(){
    addTextEditor.style.display = 'none';
    textEnabled = false;
})
// let context = editorArea.getContext("2d");
// context.fillStyle=editorAreaBackgroundColor;
// context.fillRect(0,0,window.innerWidth,window.innerHeight);
//Text Widget Handling Stop Here




const calculateDistance = (x1, y1, x2, y2) => {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return distance;
}

const setCursorPointer = (cursorName) =>{
    editorArea.style.cursor=cursorName;
};

const enableDrawing = (event)=>{
    drawingEnabled = true;
    mouseStartingX = event.clientX;
    mouseStartingY = event.clientY;
    textStarting = mouseStartingX;
    context.beginPath();
    context.moveTo(mouseStartingX,mouseStartingY);
    canvasScreenShot = context.getImageData(0,0,editorArea.width,editorArea.height);
    event.preventDefault();
};

const disableDrawing = (event)=>{
    isDragging = false;
    if(!drawingEnabled) return;
    context.stroke();
    context.closePath();
    drawingEnabled = false;
    event.preventDefault();
    if(event.Type != 'mouseout'){
        restoreArray.push(context.getImageData(0,0,editorArea.width,editorArea.height));
        index+=1;
    }
};

const drawLine =(event)=>{
    
    context.strokeStyle = eraserEnabled ? editorAreaBackgroundColor :editorAreaDrawColor;
    context.lineWidth = editorAreaDrawFontSize;
    context.lineTo(event.clientX,event.clientY);
    context.linCap = "round";
    context.lineJoin= "round";
    event.preventDefault();
    context.stroke();
};

const drawRectangle =(event)=>{
    context.beginPath();
    const rectWidth = event.clientX - mouseStartingX;
    const rectHeight = event.clientY - mouseStartingY;
    // context.fillStyle = 'blue'; // Set the fill color
    // context.fillRect(mouseStartingX, mouseStartingY, event.clientX,event.clientY);
    context.strokeStyle = editorAreaDrawColor; // Set the border color
    context.lineWidth = editorAreaDrawFontSize;
    context.strokeRect(mouseStartingX, mouseStartingY, rectWidth, rectHeight);
    event.preventDefault();
    context.stroke();
};

const drawCircle =(event)=>{
    context.beginPath();

    let radius=calculateDistance(mouseStartingX,mouseStartingY,event.clientX,event.clientY);

    context.lineWidth = editorAreaDrawFontSize;
    context.strokeStyle = editorAreaDrawColor;
    context.arc(mouseStartingX, mouseStartingY, radius, 0, 2 * Math.PI);
    // context.fillStyle = 'blue'; // Set the fill color
    // context.fill();
    context.stroke();
};

const drawTriangle = (event)=>{
    context.beginPath();
    context.lineWidth = editorAreaDrawFontSize;
    context.strokeStyle = editorAreaDrawColor;

    const deltaX = event.clientX - mouseStartingX;
    const deltaY = event.clientY - mouseStartingY;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY)/2;
    const angle = Math.atan2(deltaY, deltaX);

    const angle1 = angle + (2 * Math.PI / 3);
    const angle2 = angle - (2 * Math.PI / 3);

    const x1 = event.clientX + Math.cos(angle1) * length;
    const y1 = event.clientY + Math.sin(angle1) * length;
    const x2 = event.clientX + Math.cos(angle2) * length;
    const y2 = event.clientY + Math.sin(angle2) * length;

    context.moveTo(mouseStartingX, mouseStartingY);
    context.lineTo(x1, y1);
    context.lineTo(x2, y2);
    // context.fillStyle = 'blue'; // Set the fill color
    // context.fill();
    context.closePath();
    context.stroke();

};

const drawArrow = (event)=>{
    context.beginPath();
    context.strokeStyle = editorAreaDrawColor;
    context.lineWidth = editorAreaDrawFontSize;
    let angle = Math.atan2(event.clientY - mouseStartingY, event.clientX - mouseStartingX);
    let gapDifferenceInArrowOpening = 20;
    
    let arrowHeadX1 = event.clientX - gapDifferenceInArrowOpening * Math.cos(angle - Math.PI / 4);
    let arrowHeadY1 = event.clientY - gapDifferenceInArrowOpening * Math.sin(angle - Math.PI / 4);
    
    let arrowHeadX2 = event.clientX - gapDifferenceInArrowOpening * Math.cos(angle + Math.PI / 4);
    let arrowHeadY2 = event.clientY - gapDifferenceInArrowOpening * Math.sin(angle + Math.PI / 4);
    
    context.moveTo(mouseStartingX, mouseStartingY); 
    context.lineTo(event.clientX, event.clientY); 
    context.lineTo(arrowHeadX1, arrowHeadY1);
    context.moveTo(event.clientX, event.clientY);
    context.lineTo(arrowHeadX2, arrowHeadY2);
    context.stroke();
};

const drawNormalLine = (event)=>{
    context.beginPath();
    context.strokeStyle = editorAreaDrawColor;
    context.lineWidth = editorAreaDrawFontSize;
    context.moveTo(mouseStartingX, mouseStartingY); 
    context.lineTo(event.clientX, event.clientY); 
    context.stroke();
};

const drawOnEditorArea = (event)=>{
    if(!drawingEnabled){return}
    context.putImageData(canvasScreenShot,0,0)
    switch (drawingShape) {
        case 'line':
            drawLine(event);
            break;
        case 'eraser':
            drawLine(event);
            break;
        case 'rectangle':
            drawRectangle(event);
            break;
        case 'circle':
            drawCircle(event);
            break;
        case 'triangle':
            drawTriangle(event);
            break;
        case 'arrow':
            drawArrow(event);
            break;
        case 'textWidget':
            // textEnabled = true;
            // textStarting=0;
            break;
        case 'normalLine':
            drawNormalLine(event);
            break;
        default:
            break;
    }
};

const setDrawColor = (fontColor) => {
    editorAreaDrawColor = fontColor;
};

const setDrawFontSize = (fontSize) =>{
    editorAreaDrawFontSize = fontSize;
};

const setShape = (event)=>{
    const shape = event.target.getAttribute('shape');
    drawingShape = shape;
};

//Handling Text Wedigit

const drawText = () => {
    context.font = '16px Arial';
    for (const textItem of textList) {
        context.fillStyle = textItem.color;
        const lines = textItem.text.split('<br>');
        let yOffset = 0;
        for (const line of lines) {
            context.fillText(line, textItem.x, textItem.y + yOffset);
            yOffset += 20;
        }
        // context.fillText(textItem.text, textItem.x, textItem.y);
    }
    if(isDragging){return};
    restoreArray.push(context.getImageData(0,0,editorArea.width,editorArea.height));
    index+=1;
}

const handleAddTextButtonClick = (event)=>{
    setCursorPointer('default');
    mouseStartingX=event.clientX;
    mouseStartingY=event.clientY;
    addTextInput.value = '';
    addTextInput.focus();
    addTextEditor.style.left = `${mouseStartingX}px`;
    addTextEditor.style.top =  `${mouseStartingY}px`;
    addTextEditor.style.display = 'flex';
}

const handleAddSaveButtonClick = ()=>{
    textEnabled = false;
    const newText = addTextInput.value.replace(/\n/g, '<br>');
    if (newText.trim() !== '') {
        const posX = mouseStartingX;
        const posY = mouseStartingY;
        const id = restoreArray.length;
        textList.push({ text: newText, x: posX, y: posY ,id ,color:editorAreaDrawColor});
        drawText();
        addTextEditor.style.display = 'none';
    }
}

const getSelectedTextWidthAndHeight=(textItem)=>{
    const lines = textItem.text.split('<br>');
    let numberOfTextLine = lines.length;
    let textWidth =  lines.reduce((maxLength, current) => Math.max(maxLength, context.measureText(current).width), 0);
    let textHeight = lines.length*20;
    return {textWidth,textHeight,numberOfTextLine};
};

const hitTestText = (x, y) => {
    for (const textItem of textList) {
        context.font = '16px Arial';
        const {textWidth,textHeight} = getSelectedTextWidthAndHeight(textItem);
        if (x >= textItem.x && x <= textItem.x + textWidth &&
            y <= textItem.y + textHeight -20 && y >= textItem.y -20) {
            return textItem;
        }
    }
    return null;
}

const handleDoubleClick = (event)=>{
    const mouseX = event.clientX - editorArea.getBoundingClientRect().left;
    const mouseY = event.clientY - editorArea.getBoundingClientRect().top;

    selectedText = hitTestText(mouseX, mouseY);
    if (selectedText) {
        let {textWidth,textHeight,numberOfTextLine}=getSelectedTextWidthAndHeight(selectedText);
        let originalText = selectedText.text.replace(/<br>/g, '\n');
        editTextInput.value = originalText;//selectedText.text;
        editTextEditor.style.left = `${selectedText.x}px`;
        editTextEditor.style.top = `${selectedText.y}px`;
        editTextInput.style.width = `${textWidth+20}px`;

        //Cover Previous Text
        context.fillStyle = editorAreaBackgroundColor;
        context.fillRect(selectedText.x, selectedText.y-20, textWidth,textHeight+20);
        
        editTextInput.style.height = `${textHeight}px`;
        editTextEditor.style.display = 'flex';
        editTextInput.focus();
    }
}

const handleEditSaveButtonClick = ()=>{
    if (selectedText) {
        context.font = '16px Arial';
        context.fillStyle = editorAreaBackgroundColor;
        const newText = editTextInput.value.replace(/\n/g, '<br>');;
        // context.fillText(newText, selectedText.x, selectedText.y);
        selectedText.text = newText;
        drawText();
        editTextEditor.style.display = 'none';
    }
}

const handleMouseDown = (event) => {
    const mouseX = event.clientX - editorArea.getBoundingClientRect().left;
    const mouseY = event.clientY - editorArea.getBoundingClientRect().top;

    selectedText = hitTestText(mouseX, mouseY);
    if (selectedText) {
        hidePreviouText =true;
        isDragging = true;
        dragOffsetX = mouseX - selectedText.x;
        dragOffsetY = mouseY - selectedText.y;
    }
}

const handleMouseMove = (event) => {
    if (isDragging && selectedText) {
        if(hidePreviouText){
            let {textWidth,textHeight,numberOfTextLine}=getSelectedTextWidthAndHeight(selectedText);
            //Cover Previous Text
            context.fillStyle = editorAreaBackgroundColor;
            context.fillRect(selectedText.x, selectedText.y-20, textWidth,textHeight+20);
            hidePreviouText=false;
            canvasScreenShot = context.getImageData(0,0,editorArea.width,editorArea.height);
        }
        const mouseX = event.clientX - editorArea.getBoundingClientRect().left;
        const mouseY = event.clientY - editorArea.getBoundingClientRect().top;
        selectedText.x = mouseX - dragOffsetX;
        selectedText.y = mouseY - dragOffsetY;
        drawText();
    }
}

//Handling Text widget Ends here

const clearCanvas = ()=>{
    context.fillStyle = editorAreaBackgroundColor;
    context.clearRect(0,0,editorArea.width,editorArea.height);
    context.fillRect(0,0,editorArea.width,editorArea.height);
    restoreArray=[];
    index = 0;
};

const undoLastChanges=()=>{
    if(index<=0){
        clearCanvas();
    }
    else{
        index-=1
        let idToDelete = restoreArray.length;
        const indexToDelete = textList.findIndex(element => element.id === idToDelete);
        if (indexToDelete !== -1) {
            textList.splice(indexToDelete, 1);
            console.log(`Element with id ${idToDelete} deleted successfully.`);
        }
        restoreArray.pop();
        context.putImageData(restoreArray[index],0,0);
    }
};

const saveCanvasData = () =>{
    let savedData = editorArea.toDataURL('imag/png');
    let saveAnchor = document.createElement("a");
    saveAnchor.href=savedData;
    saveAnchor.download="sketch.png";
    saveAnchor.click();
};

//For Mobile Enabling Drwaing

const handleEditorAreaClicked = (event) => {
    if(textEnabled && drawingShape === 'textWidget' && !isDragging){
        handleAddTextButtonClick(event);
    }
};

editorArea.addEventListener("touchstart",enableDrawing,false);
editorArea.addEventListener("touchmove",drawOnEditorArea,false);
//For DeskTop Enable Drawing
editorArea.addEventListener("mousedown",(event)=>{
    if(drawingShape === 'textWidget'){
        handleMouseDown(event);
    }
    enableDrawing(event);
},false);
editorArea.addEventListener("mousemove",(event)=>{
    drawOnEditorArea(event);
    if(drawingShape === 'textWidget'){
        handleMouseMove(event);
    }
},false);

//STOP Drawing 
editorArea.addEventListener("touchend",(event)=>{
    disableDrawing(event);
},false);
editorArea.addEventListener("mouseup",(event)=>{
    disableDrawing(event);
},false);
editorArea.addEventListener("mouseout",(event)=>{
    disableDrawing(event);
},false);


//
setCursorPointer('crosshair');
//Set Shape 
shapeBtn.forEach(shape=>{
    shape.addEventListener('click',(event)=>{
        textEnabled = false;
        setCursorPointer('crosshair');
        setShape(event);
        const currentlyActive = document.querySelector('.group-input .active-animation');
        if (currentlyActive) {
            currentlyActive.classList.remove('active-animation');
        }
        shape.classList.add('active-animation');
        if(shape.getAttribute('shape')==='textWidget'){
            textEnabled = true;
            setCursorPointer('text');
            shape.classList.remove('active-animation');
        }
    })
});

//Set Color
drawColorsBtn.forEach(button => {
    button.addEventListener('click',()=>{
        const currentlyActive = document.querySelector('.group-color-btn .active-animation');
        if (currentlyActive) {
            currentlyActive.classList.remove('active-animation');
        }
        button.classList.add('active-animation');
        setDrawColor(button.style.backgroundColor);
    });
});

customFontColor.addEventListener('input',function(){
    setDrawColor(this.value);
});

//Set Font size
customFontSize.addEventListener('input',function(){
    setDrawFontSize(this.value);
});

//Clear canvas
clearCanvasBtn.addEventListener('click',clearCanvas);

undoCanvasBtn.addEventListener('click',undoLastChanges);

saveCanvasBtn.addEventListener('click',saveCanvasData);

eraseCanvasBtn.addEventListener('click',(event)=>{
    eraserEnabled = !eraserEnabled;
    drawingShape='eraser';
});


//For writting text
// document.addEventListener('keydown',function(event){
//     console.log(restoreArray)
//     let skipKeyCode = [20,9,16,17];
//     if(drawingShape !== 'textWidget') {return};
//     if(skipKeyCode.indexOf(event.keyCode)!==-1){return}
//     let allowedCharacters = /^[a-zA-Z0-9!@#$%^&*() _+\-=\[\]{};':"\\|,.<>\/?]*$/;
//     if (!allowedCharacters.test(event.key)) {
//         event.preventDefault();
//         return;
//     }

//     context.fillStyle = editorAreaDrawColor;
//     context.font="20px Arial";
//     if(event.keyCode === 13){
//         mouseStartingY +=20;
//         mouseStartingX = textStarting;
//     }
//     else if(event.keyCode===8){
//         undoLastChanges();
//         return;
//     }
//     else{
//         context.fillText(event.key,mouseStartingX,mouseStartingY)
//         mouseStartingX+=context.measureText(event.key).width;
//     }
//     restoreArray.push(context.getImageData(0,0,editorArea.width,editorArea.height));
//     index+=1;
// },false);

//Text Widget Handling
addSaveButton.addEventListener('click', handleAddSaveButtonClick);
editSaveButton.addEventListener('click', handleEditSaveButtonClick);
editorArea.addEventListener('dblclick', handleDoubleClick);
editorArea.addEventListener('click',handleEditorAreaClicked);