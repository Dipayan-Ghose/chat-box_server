const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
var cors = require("cors");

require("dotenv").config();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("media api is running");
});

const uri = `mongodb+srv://${process.env.dbUser}:${process.env.password}@database.sgb0d3l.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
console.log(uri);

async function run() {
  try {
    const media = client.db("job-task").collection("media");

    app.post("/post", async (req, res) => {
      const informations = req.body;
      const push = await media.insertOne(informations);
      res.send(push);
    });
    
    app.post('/post/:id', async(req,res)=>{
      const id= req.params.id;
      const comment= req.body.comment;
      const query= {
         _id: ObjectId(id), 
  
         };
      const result = await media.insertOne(query);
      result.push(comment)
      // const sendPost= await media.insertOne({comment:comment});
      res.send(result);
    })

    app.get("/post", async (req, res) => {
      const query = {};
      const cursor = media.find(query).sort({ $natural: -1 });
      const getInfo = await cursor.toArray();
      res.send(getInfo);
    });

    app.get('/threeServices', async(req, res) =>{
        const query = {  };
        const options = {
          sort: { love: -1},
        };
        const cursor = media.find(query,options).limit(3);
        const services= await cursor.toArray();
        res.send(services); 
       });

    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const each = media.find((c) => c.id === id);
      res.send(each);
    });

    // app.get('/details/:id',async (req, res) =>{
        
    //     const id= req.params.id;
    //     const query = { _id: ObjectId(id) };
    //       const service =await media.findOne(query);
    //       res.send(service);
    // })


   
  } finally {
  }
}
run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`media api is running at port: ${port}`);
});
