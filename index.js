const axios = require("axios");
const url = "https://api.nasa.gov/";
const redis = require('redis');
const fs = require('fs');

async function getData(){
    
    //creación de clientes
    const cliente1 = redis.createClient({
        host: 'localhost',
        port: 6379
    });
    const cliente2 = redis.createClient({
        host: 'localhost',
        port: 6380
    });
    const cliente3 = redis.createClient({
        host: 'localhost',
        port: 6381
    });


    //creacion de fecha de inicio y final de asteroides
    let dia = Math.floor(Math.random() * 21) + 1; //dia aleatorio
    let diafinal = dia + 7;
    dia = dia.toString();
    let anio = Math.floor(Math.random() * (2011-2009+ 1)) + 2009; //año aleatorio
    anio = anio.toString();
    let start = anio + '-10-' + dia;
    start = start.toString();
    let end = anio + '-10-' + diafinal;
    end = end.toString();
    const ttl = 30;

try{
    if(anio==2009){ //cliente 1
        await cliente1.connect();
        // el cliente se conecta a redis y consulta si existe algo en el valor de id
        const reply = await cliente1.get(start);
       
        if(reply){
            // Si existe, entonces está en redis
            console.log("Está en cache, Redis 1");
            return;
        }else{
        // pide a la api
        const response = await axios.get('https://api.nasa.gov/neo/rest/v1/feed?start_date=' + start + '&end_date=' + end + '&api_key=l2MHAfTtOG050tVSsGYHmYV22HFeuhsWeBcg6l4U');
      
        console.log("Sacado desde API, Cliente 1");
            return response.data;   
        }
    }else if(anio==2010){ //cliente 2
        await cliente2.connect();
        const reply = await cliente2.get(start);
     
        if(reply){
            console.log("Está en cache, Redis 2");
            return;
        }else{

            const response = await axios.get('https://api.nasa.gov/neo/rest/v1/feed?start_date=' + start + '&end_date=' + end + '&api_key=l2MHAfTtOG050tVSsGYHmYV22HFeuhsWeBcg6l4U');
            await cliente2.setEx(start, ttl, JSON.stringify(response.data)); //insertar a cache y establecer ttl
        
            console.log("Sacado desde API, Cliente 2");
            return response.data;   
        }
    }else if(anio==2011){ //cliente 3
        await cliente3.connect();
        const reply = await cliente3.get(start);
      
        if(reply){
           console.log("Está en cache, Redis 3");
           return;
        }else{

           const response = await axios.get('https://api.nasa.gov/neo/rest/v1/feed?start_date=' + start + '&end_date=' + end + '&api_key=l2MHAfTtOG050tVSsGYHmYV22HFeuhsWeBcg6l4U');
           await cliente3.setEx(start, ttl, JSON.stringify(response.data)); //insertar a cache y establecer ttl
           
           console.log("Sacado desde API, Cliente 3");
           return response.data;   
        }
    }
}catch(error){
    console.log(error);
}
}

//tiempos
async function Tiempo(){
    const tiempo_res = [];
    for(let i=0; i<1000; i++){
        const inicio = Date.now();
        await getData();
        const final = Date.now();
        const tiempo = final - inicio;
        tiempo_res.push(tiempo);
    }
    return tiempo_res;
}

//pasar tiempo a un archivo para hacer gráficos
Tiempo().then(tiempo_res =>{
    const archivo = tiempo_res.join('\n');
    fs.writeFileSync('tiempo_respuesta_30 segundos.txt', archivo, error =>{
        if(error){
            console.error(error);
            return;
        }
    });
});

