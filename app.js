

const stitchClient = new stitch.StitchClient("test-stitch-kpnmk");
const mongoClient = stitchClient.service("mongodb", "mongodb-atlas");

const db = mongoClient.db("test-stitch");
const coll = db.collection("users");

 stitchClient.login().then( result => {
        console.log("authenticated");
        
    }).catch( err => {
        console.error("Error performing auth",err)
    });