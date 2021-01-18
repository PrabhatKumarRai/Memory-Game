//Generate Blocks
function generateBlocksWithOptions(){
    var blocksCount = Number($("#blocksCount").val());
    var randomNumber = 1;

    sessionStorage.setItem("startGame", '');   //Game not started.
    sessionStorage.setItem("hiddenBlocks(+1)", blocksCount+1);    //Total hidden boxes. +1 is for checking the condition that blocks count is > 0 in matchBlocks() function.    
    $(".generateBlocksContainer").css("display", "none");

    for(var i=1; i<= blocksCount; i++){

        randomNumber = Math.floor(Math.random() * 4) + 1;  // returns a random integer from 1 to blockCount

        $(".game").append(
            "<div class='gameBlock' id='block-" + i + "' onclick='matchBlocks(" + i + ", " + randomNumber + ")'>" +
                "<img src='images/" + randomNumber + ".jpg'>" +
                "<div class='greenOverlay' id='" + i + "'></div>" +
            "</div>"
        );
    }
    
    $(".game-options").css("display", "flex");
}


//Hide All Blocks
function showAllOverlay(){
    $(".greenOverlay").animate({height: "100%"});
}

//Show All Blocks
function hideAllOverlay(){
    $(".greenOverlay").animate({height: "0px"});
}


//Show Single Block
function hideSingleOverlay(overlayId){
    $("#" + overlayId).animate({height: "0px"});
}


//Start Game
//Show Hide All Overlay 
function showHideOverlayTimer(){    
    
    sessionStorage.setItem("startGame", true);
    sessionStorage.setItem("block1", '');
    sessionStorage.setItem("block2", '');

    $("#startGame").css("display", "none");
    $(".score-container").css("display", "block");
    $(".failed-attempts-container").css("display", "block");

    hideAllOverlay();
    setTimeout(showAllOverlay, 5000);    //Calls hideAllOverlay function after waiting for 5 seconds
        
}


//Store block values in session storage
function storeBlockValue(imageName){
    // Store Block 1 Value
    if(sessionStorage.getItem("block1") == ''){
        sessionStorage.setItem("block1", imageName);
    }
    // Store Block 2 Value
    else if(sessionStorage.getItem("block2") == ''){
        sessionStorage.setItem("block2", imageName);
    }
}

//Get Current Score
function getCurrentScore(){
    return currentScore = Number($("#score").text());
}

//Get Current Failed Attempts
function getCurrentFailedAttempts(){
    return currentScore = Number($("#failedAttempts").text());
}

//Increase Score
function increaseScore(){
    currentScore = getCurrentScore();
    $("#score").text(currentScore + 2);
}

//Increase Failed Attempts
function increaseFailedAttempts(){
    currentAttempts = getCurrentFailedAttempts();
    $("#failedAttempts").text(currentAttempts + 1);
}

//Update Hidden Blocks
function updateHiddenBlocks(){
    //Reading the total hidden blocks and then updating the hidden blocks value with -1
    var hiddenBlocks = sessionStorage.getItem("hiddenBlocks(+1)");
    if(hiddenBlocks > 0){
        sessionStorage.setItem("hiddenBlocks(+1)", --hiddenBlocks);
    }
    return hiddenBlocks;
}


//Match Blocks
function matchBlocks(overlayID, imageName){
   
    if(sessionStorage.getItem("startGame") == "true"){

        hideSingleOverlay(overlayID);   //Display the image
        storeBlockValue(imageName);     //Stores image name value in session storage
        var hiddenBlocks = updateHiddenBlocks();           //Decreases the total hidden blocks by -1 and returns the current hidden blocks

        if(hiddenBlocks > 0){
            if(sessionStorage.getItem("block1") != '' && sessionStorage.getItem("block2") != ''){
                // Matching Blocks
                if(sessionStorage.getItem("block1") == sessionStorage.getItem("block2")){
                    alert("Yeepee!!! Match Found");                
                    increaseScore();        //Adds 2 more points                
                    sessionStorage.setItem("block1", '');
                    sessionStorage.setItem("block2", '');
                }
                else{
                    alert("Oops!!! Match Not Found");
                    increaseFailedAttempts();    //Adds 1 failed attempt
                    sessionStorage.setItem("block1", '');
                    sessionStorage.setItem("block2", '');
                }
            }           

            if(hiddenBlocks == 1){
                endGame();
            }
        }

    }

    
}

//Game Ends
function endGame(){
    var score = getCurrentScore();
    var failedAttempts = getCurrentFailedAttempts();

    sessionStorage.setItem("startGame", '');
    alert("Game Over!!! \n" + "Total Score: " + score + "\nFailed Attempts: " + failedAttempts);
}
