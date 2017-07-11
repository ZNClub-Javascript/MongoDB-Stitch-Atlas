document.addEventListener('DOMContentLoaded',() => {

const stitchClient = new stitch.StitchClient("test-stitch-kpnmk");
const mongoClient = stitchClient.service("mongodb", "mongodb-atlas");

const db = mongoClient.db("test-stitch");
const coll = db.collection("users");

 
const writeButton = document.getElementById('button-write');
const searchButton = document.getElementById('button-search');
const refreshButton = document.getElementById('button-refresh');



function doAnonymousAuth(){
        stitchClient.login().then( result => {
            console.log("authenticated");
            
        }).catch( err => {
            console.error("Error performing auth",err)
        });
    }

doAnonymousAuth()

function writeComment(comment, user_id) {
        var commentFeed = document.getElementById('commentFeed');
        
        var newDiv = document.createElement('div');
        var userName = document.createElement('p');
        var userComment = document.createElement('p');
        
        if (user_id === null){
            const query = {"name" : restaurantName};
            const update = {
                "$push" : {
                    "comments" : {
                        "comment" : comment, 
                        "user_id" : stitchClient.authedId()
                    }
                }
            }
            
            coll.updateOne(query,update).then( () => {
               refreshComments();
            }).catch( err => {
                console.error("Error while adding comment", err)
            });
        } else {
            userComment.appendChild(document.createTextNode(comment))
            userName.appendChild(document.createTextNode("-" + user_id));
        
            newDiv.appendChild(userComment);
            newDiv.appendChild(userName);
            commentFeed.appendChild(newDiv);
        }
    }

function refreshComments() {
        clearComments()
        
        coll.find({"name" : restaurantName}).then( payload => {
            const comments = payload[0].comments;
            for (var i = 0; i < comments.length; i++){
                writeComment(comments[i].comment, comments[i].user_id);
            }
        }).catch( err => { 
            console.error("error while submitting", err)
        });
    }
	
 function clearComments(){
        document.getElementById('commentFeed').innerText = "";
    }
	
writeButton.onclick = () => {
	
	doAnonymousAuth()
	
        if (restaurantName != ""){
            
            var inputVal = prompt("Enter your comment : ", "comment");
            writeComment(inputVal, null);
        } else {
            alert("You must search for a valid restaurant to write a comment.")
        }
    }
    
    searchButton.onclick = () => {
        var text = document.getElementById("restaurantName").value;
        searchRestaurant(text);
    }
    
   refreshButton.onclick = () => {
       refreshComments();
   }
    
    
    
});