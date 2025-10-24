import express from "express"
import axios from "axios"
import cors from "cors"


const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

//pkill -f node

type LD = {
    id: number
    filmName: string
    rotationType: string
    region: string,
    lengthMinutes: number,
    videoFormat: string
}

let lds : LD[] =[
    {id:1, filmName: "starwars",rotationType:"CAV", region:"united states",lengthMinutes : 160, videoFormat: "PAL"},
    {id:2, filmName: "avatar",rotationType:"CLV", region:"canada",lengthMinutes : 103, videoFormat: "PAL"},
    {id:3, filmName: "troya",rotationType:"CAV", region:"united states",lengthMinutes : 200, videoFormat: "NTSC"},

]

app.get("/lds",(_req,res)=>{  
    res.status(200).json(lds)
})

app.get("/lds/:id",(req,res)=>{
    const Id=Number(req.params.id)

    const encontrado=lds.find((elem)=>elem.id===Id)   
    
    if(encontrado){
        res.status(200).json(encontrado)    
    }else{
        res.status(404).json("“Disco no encontrado")
    }  
})

app.post("/lds",(req,res)=>{

    try{
        const newId=Date.now()  

        const newFilmName = req.body.filmName
        const newRotationType = req.body.rotationType
        const newRegion = req.body.region
        const newLengthMinutes = req.body.lengthMinutes
        const newVideoFormat = req.body.videoFormat

        //compruebo que se hayan llenado todos los parametros 
        if(!newFilmName || !newRotationType || !newRegion || !newLengthMinutes || !newVideoFormat){
            return res.status(400).send("Error, se necesitan todos los parametros")
        }

        //compruebo que rotattiontype y videoformat sean del tipo correcto
        if(newRotationType.toUpperCase() != "CAV" && newRotationType.toUpperCase() != "CLV"){
            return res.status(404).send("Error, tipo de rotationType no disponible")
    }
        if(newVideoFormat.toUpperCase() !="NTSC" && newVideoFormat.toUpperCase() !="PAL"){
            return res.status(404).send("Error,tipo de videoFormat no disponible")
        }

        const newLD:LD={
            id:newId,
            ...req.body
        }

        if(newFilmName && newRotationType && newRegion && newLengthMinutes && newVideoFormat && typeof(newFilmName) ==="string" && typeof(newRotationType)==="string" && typeof(newRegion)==="string" && typeof(newLengthMinutes) === "number" && typeof(newVideoFormat) == "string"){

            lds.push(newLD)
            return res.status(201).json(lds)
        }else{
            return res.status(404).send("Algo has mandado mal")
        }
    
    }catch(err:any){
        res
        .status(500)
        .json({ error: "Error al crear el nuevo LD", detail: err.message });

    }
})

app.delete("/lds/:id", (req, res) => {
    try {
        const existe = lds.find((elem) => elem.id === Number(req.params.id)); 
        if (!existe) {
            return res.json("Equipo no encontrado");
        }

        lds = lds.filter((elem) => elem.id !== Number(req.params.id));  

        res.json({message:"LD eliminado con exito ", lds});
    } catch (err: any) {
        res.status(500).json({ err: "Error al eliminarlo" })
    }
});



const testApi=async()=>{    
    try{
        const resAll=(await axios.get<LD[]>("http://localhost:3000/lds")).data  
        console.log("GET ALL LDS ", resAll)

        const resTeamId=(await axios.get<LD>("http://localhost:3000/lds/1")).data   
        console.log("GET  LD ", resTeamId)


        const resPost=(await axios.post<LD[]>("http://localhost:3000/lds",{     
            filmName : "seven",
            rotationType: "CAV",
            region: "united states",
            lengthMinutes: 140,
            videoFormat: "NTSC"
        })).data

        console.log("POST LD ", resPost)


        const resDelete=(await axios.delete<LD[]>("http://localhost:3000/lds/3")).data      
        console.log("Delete LD ", resDelete)


    }catch(err){

    if (axios.isAxiosError(err)) {
      console.log("Error en la petición:", err.message);
    } else {
      console.log("Error general:", err);
    }
    }

}

setTimeout(()=>{testApi()},1000)

app.listen(port,()=>console.log(`Conectado al puerto ${port}`)) 