//Generate Blocks
function generateBlocksWithOptions(){
    var blocksCount = Number($("#blocksCount").val());
    var randomNumber = 1;
    var imageNames = '';

    sessionStorage.setItem("startGame", '');   //Game not started.
    sessionStorage.setItem("hiddenBlocks(+1)", blocksCount+1);    //Total hidden boxes. +1 is for checking the condition that blocks count is > 0 in matchBlocks() function.    
    // sessionStorage.setItem("clicks", 0);    //Total Clicks
    $(".generateBlocksContainer").css("display", "none");
    $(".game-rules").css("display", "none");

    for(var i=1; i<= blocksCount; i++){

        randomNumber = Math.floor(Math.random() * 4) + 1;  // returns a random integer from 1 to blockCount
        imageNames = String(imageNames) + String(randomNumber);
        $(".game").append(
            "<div class='gameBlock' onclick='matchBlocks(" + i + ", " + randomNumber + ")'>" +
                "<img src='images/" + randomNumber + ".jpg'>" +
                "<div class='greenOverlay' id='" + i + "'></div>" +
            "</div>"
        );
    }
    sessionStorage.setItem("imageNames", imageNames);   //Storing Image Names in Session
    sessionStorage.setItem("clicks", 0);   //Storing Total Clicks in Session with initial value as 0
    
    setTotalClicksProcess();    //Calculates and Stores total clicks in session storage
    $("#totalClicks").text(sessionStorage.getItem("clicks"));
    //If no identical image is generated initially, then the game will restart automatically.
    if(sessionStorage.getItem("clicks") > 0){
        $(".game-options").css("display", "flex");
    }
    else{
        alert("No Identical Images Generated!!!\nClick OK to reload the Game...");
        location.reload();
    }
    
}

//Count total occurance of each identical image
function countOccuranceOfEachImage(str, character){
    var count = 0;
    
    for(var i=0; i<str.length; i++){
        if(str.charAt(i) == character){
            count++;
        }
    }
    return count;
}

//Count the number of clicks based on the quotient of the occurance of each image divided by 2
function countAndUpdateClicks(value, key){
    var newclicks = Math.floor(value/2);
    if(newclicks > 0){
        var currentClicks = sessionStorage.getItem("clicks");
        sessionStorage.setItem("clicks", parseInt(currentClicks) + newclicks);
    }
}

//Sets total clicks available
function setTotalClicksProcess(){
    var imageName = sessionStorage.getItem("imageNames");
    var imageOccurance = [];

    for(var i=0; i<imageName.length; i++){
        imageOccurance[imageName.charAt(i)] = countOccuranceOfEachImage(imageName, imageName.charAt(i));
    }
    imageOccurance.forEach(countAndUpdateClicks);
}


//Hide All Blocks
function showAllOverlay(){
    $(".greenOverlay").css("background-color", "green");
}

//Show All Blocks
function hideAllOverlay(){
    $(".greenOverlay").css("background-color", "transparent");
}


//Show Single Block
function hideSingleOverlay(overlayId){
    $("#" + overlayId).css("background-color", "transparent");
}


//Start Game
//Show Hide All Overlay 
function showHideOverlayTimer(){

    $("#startGame").css("display", "none");
    $("#endGame").css("display", "block");
    $(".score-container").css("display", "block");
    $(".failed-attempts-container").css("display", "block");
    
    hideAllOverlay();
    setTimeout(function(){
        showAllOverlay();
        
        sessionStorage.setItem("startGame", true);
        sessionStorage.setItem("block1", '');
        sessionStorage.setItem("block2", '');
        sessionStorage.setItem("clickedBlocks", '');
    }, 5000);    //Calls showAllOverlay function after waiting for 5 seconds

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

//Increase Score
function increaseScore(){
    currentScore = getCurrentScore();
    $("#score").text(currentScore + 2);
}

//Get Current Failed Attempts
function getCurrentFailedAttempts(){
    return currentAttempts = Number($("#failedAttempts").text());
}

//Increase Failed Attempts
function increaseFailedAttempts(){
    currentAttempts = getCurrentFailedAttempts();
    $("#failedAttempts").text(currentAttempts + 1);
}

//Get Current Clicks
function setCurrentClicks(){
    clicks = Number(sessionStorage.getItem("clicks")) - 1;
    sessionStorage.setItem("clicks", clicks);
    $("#totalClicks").text(clicks);
    if(clicks < 1){        
        endGame();
    }
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

//Update Clicked Blocks
function updateClickedBlocks(blockID){
    var clickedBlocks = sessionStorage.getItem("clickedBlocks");
    clickedBlocks = String(clickedBlocks) + String(blockID);
    sessionStorage.setItem("clickedBlocks", clickedBlocks);
    return clickedBlocks;
}


//Match Blocks
function matchBlocks(overlayID, imageName){
   
    if(sessionStorage.getItem("startGame") == "true"){

        var totalClicks = sessionStorage.getItem("clicks");

        if(totalClicks > 0){
            var clickedBlocks = String(sessionStorage.getItem("clickedBlocks"));    //Gets the previously clicked blocks

            if(clickedBlocks.indexOf(String(overlayID)) == -1){      //If the block is not previously clicked then proceed
                
                var hiddenBlocks = updateHiddenBlocks();     //Decreases the total hidden blocks by -1 and returns the current hidden blocks
                hideSingleOverlay(overlayID);   //Display the image
                storeBlockValue(imageName);     //Stores image name value in session storage (block1 or block2)
                updateClickedBlocks(overlayID);     //Update the session storage that the block is now clicked so that it can't be clicked/accepted again.

                if(hiddenBlocks > 0){
                    if(sessionStorage.getItem("block1") != '' && sessionStorage.getItem("block2") != ''){
                        // Matching Blocks
                        if(sessionStorage.getItem("block1") == sessionStorage.getItem("block2")){
                            //alert("Yeepee!!! Match Found");                
                            increaseScore();        //Adds 2 more points                
                            sessionStorage.setItem("block1", '');
                            sessionStorage.setItem("block2", '');
                        }
                        else{
                            //alert("Oops!!! Match Not Found");
                            increaseFailedAttempts();    //Adds 1 failed attempt
                            sessionStorage.setItem("block1", '');
                            sessionStorage.setItem("block2", '');
                        }
                        
                        setCurrentClicks();     //Updates current clicks in index page
                    }           
        
                    if(hiddenBlocks == 1){
                        endGame();
                    }

                }
            }
        }
        else{
            endGame();
        }

    }

    
}


//Delete Storage Items
function removeStorageItems(){
    sessionStorage.clear();
}
removeStorageItems();

//Game Ends
function endGame(){
    $("#endGame").css("display", "none");
    hideAllOverlay();
    removeStorageItems();

    var score = getCurrentScore();
    var failedAttempts = getCurrentFailedAttempts();

    //Clicks veriable coming from removeStorageItems()
    if(failedAttempts < 1 && clicks < 1){
        alert("Congratulations, You Won!!! \n" + "Total Score: " + score + "\nFailed Attempts: " + failedAttempts + "\nClicks Left: " + clicks);
    }
    else{
        alert("Game Over!!! \n" + "Total Score: " + score + "\nFailed Attempts: " + failedAttempts + "\nClicks Left: " + clicks);
    }
}