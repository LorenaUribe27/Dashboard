import dataGeneralxsku from '../dataGeneralsku.js';
import device from '../dispositivo.js';

/** Variables */
let 
filtersValue = {} , 
arrayToGraphic=[] , 
arrayToTable=[], 
kpiActual = 'usabilidad';

/** Actualizar los valores del filtro */
function updateValuesFilters(){
    /** tomar los valores de los selects */
    filtersValue={
        Pais        : document.body.querySelector('.selectCountry').value,
        Mes         : document.body.querySelector('.selectDate').value,
        Categoria   : document.body.querySelector('.selectCategory').value,
        Sku         : document.body.querySelector('.selectSku').value
    };
};


/** Se filtra por País por Mes y por Categría */
function filterProcess(){

    /** Nuevo Array  */
    let filterArray=[];
    
    /** Actualizamos los valores de los filtros  */
    updateValuesFilters();

    /** Empezamos el proceso de filtrado */
    filtersValue.Pais       !== "null" && ( filterArray = dataGeneralxsku.filter( registry => registry.pais == filtersValue.Pais)           );
    
    /** Actualizamos el array para renderizar las gráficas */
    arrayToGraphic = filterArray;
    
    filtersValue.Categoria  !== "null" && ( filterArray = filterArray.filter    ( registry => registry.categoria == filtersValue.Categoria) );
    filtersValue.Mes        !== "null" && ( filterArray = filterArray.filter    ( registry => registry.Mes == filtersValue.Mes)             );  
    filtersValue.Sku        !== "null" && ( filterArray = filterArray.filter    ( registry => registry.sku == filtersValue.Sku)             );

    /** Actaulimos el array para renderizar la tabla */
    arrayToTable = filterArray;

    createOptionSku(arrayToTable)

    /** Se contruye la tabla de datos generales */
    buildTable()
};

/** función para creación de lista de SKUS */
function createOptionSku(array){

    document.body.querySelector('.selectSku').innerHTML=``;
    document.body.querySelector('.selectSku').innerHTML+=`<option value="null">Seleccione SKU</option>`

    array.map( registry =>{
        
        if (registry.sku == "null" || registry.sku == "Null" || registry.sku == "") { return };
        document.body.querySelector('.selectSku').innerHTML+=`<option value="${registry.sku}">${registry.sku}</option>`
    })

}


/** ___________________ Constructores _________________ */

    /** Función para construir la usabilidad apartir de un array de registros */
    function buildUsability(array){

        let elementToreturn = {
            with:0,
            withOut:0,
            diference:0
        };

        array.map((registry)=>{
            elementToreturn.with    += registry.conInteraccion;
            elementToreturn.withOut += registry.sinInteraccion;
        })

        elementToreturn.diference = (elementToreturn.with / ((elementToreturn.withOut + elementToreturn.with))*100).toFixed(2)
        return elementToreturn;
    };

    /** Función para construir el engagement apartir de un array de registros */
    function buildEngagement(array){

        let elementToReturn = { with:null , withFormat:null , withOut:null , withOutFormat:null, diference:null , diferenceFormat:null } ;
        let timeWI          = { hours:0, minutes:0, seconds:0 };
        let timeWOI         = { hours:0, minutes:0, seconds:0 };

        array.map(registry=>{
            
            let WregistryHour , WregistryMinute , WregistrySec;
            let WOregistryHour, WOregistryMinute, WOregistrySec;

            WregistryHour    =  parseInt(registry.tiempoConInteraccion.split(":")[0]);
            WregistryMinute  =  parseInt(registry.tiempoConInteraccion.split(":")[1]);
            WregistrySec     =  parseInt(registry.tiempoConInteraccion.split(":")[2]);

            WOregistryHour    =  parseInt(registry.tiempoSinInteraccion.split(":")[0]);
            WOregistryMinute  =  parseInt(registry.tiempoSinInteraccion.split(":")[1]);
            WOregistrySec     =  parseInt(registry.tiempoSinInteraccion.split(":")[2]);

            timeWI.hours      += WregistryHour*60*60;
            timeWI.minutes    += WregistryMinute*60;
            timeWI.seconds    += WregistrySec;

            timeWOI.hours     += WOregistryHour*60*60;
            timeWOI.minutes   += WOregistryMinute*60;
            timeWOI.seconds   += WOregistrySec;

        });

        elementToReturn.with             = Math.ceil((timeWI.hours+timeWI.minutes+timeWI.seconds) / array.length);
        elementToReturn.withFormat       = `${parseInt(elementToReturn.with/60)}:${parseInt(elementToReturn.with%60)}`;
    
        elementToReturn.withOut          = Math.ceil((timeWOI.hours+timeWOI.minutes+timeWOI.seconds) / array.length);
        elementToReturn.withOutFormat    = `${parseInt(elementToReturn.withOut/60)}:${parseInt(elementToReturn.withOut%60)}`;
    
        elementToReturn.diference        = parseInt( ((elementToReturn.with / elementToReturn.withOut)*100).toFixed(0) );
        elementToReturn.diferenceFormat  = `${parseInt(elementToReturn.diference/60)}:${parseInt(elementToReturn.diference%60)}`;

        return elementToReturn;
    };

    /** Función para construir el addToCar apartir de un array de resgistros */
    function buildAddToCar(array){

        let elementToReturn = {
            with: 0,
            withOut: 0,
            diference : null
        };

        array.forEach( registry => { 
            if(registry.AddToCartConInteraccion == 0 || registry.AddToCartSinInteraccion == 0){ return }
            elementToReturn.with    += parseFloat(registry.AddToCartConInteraccion.replace('%',''));   
            elementToReturn.withOut += parseFloat(registry.AddToCartSinInteraccion.replace('%',''));   
        });

        elementToReturn.with        = Math.ceil( elementToReturn.with    / array.length            );
        elementToReturn.withOut     = Math.ceil( elementToReturn.withOut / array.length            );
        elementToReturn.diference   = ((elementToReturn.with / elementToReturn.withOut)*100).toFixed(0);

        return elementToReturn;
    };

    /** Función para construir el purchase apartir de un array de registros */
    function buildPurchase(array){

        let elementToReturn = {
            with: 0,
            withOut: 0,
            diference :0
        }

        array.forEach(element => {    
            elementToReturn.with       += element.TransaccionesConInteraccion;
            elementToReturn.withOut    += element.TransaccionesSinInteraccion;
        })

        elementToReturn.with        = (elementToReturn.with/array.length).toFixed(3);
        elementToReturn.withOut     = (elementToReturn.withOut/array.length).toFixed(3);
        elementToReturn.diference   = (elementToReturn.with/elementToReturn.withOut*100).toFixed(0);

        return elementToReturn;
    };

    /** Función para construir la información del dispositivo */
    function buildInfoDevice(){

        let 
        elementToCreate = [],
        country         = document.body.querySelector('.selectCountry').value,
        countryArray    = Object.entries(device).filter( ([key,value]) => key == country ),
        kpiArray        = Object.entries(countryArray[0][1]).filter( ([key,value]) => key == kpiActual )    


        switch(kpiActual){

            case "usabilidad":
                elementToCreate.push( (kpiArray[0][1].desk   / ((kpiArray[0][1].Without_desk   + kpiArray[0][1].desk))   *100).toFixed(2) );
                elementToCreate.push( (kpiArray[0][1].tablet / ((kpiArray[0][1].Without_tablet + kpiArray[0][1].tablet)) *100).toFixed(2) );
                elementToCreate.push( (kpiArray[0][1].mobile / ((kpiArray[0][1].Without_mobile + kpiArray[0][1].mobile ))*100).toFixed(2) );
            break;

            case "duracion_sesion":
                elementToCreate.push(  parseInt( (( kpiArray[0][1].desk    / kpiArray[0][1].Without_desk    )*100).toFixed(0) ) );
                elementToCreate.push(  parseInt( (( kpiArray[0][1].tablet  / kpiArray[0][1].Without_tablet  )*100).toFixed(0) ) );
                elementToCreate.push(  parseInt( (( kpiArray[0][1].mobile  / kpiArray[0][1].Without_mobile  )*100).toFixed(0) ) );
            break;

            case "añadir_al_carrito":
                elementToCreate.push( (( kpiArray[0][1].desk   / kpiArray[0][1].Without_desk   )*100).toFixed(0) );
                elementToCreate.push( (( kpiArray[0][1].tablet / kpiArray[0][1].Without_tablet )*100).toFixed(0) );
                elementToCreate.push( (( kpiArray[0][1].mobile / kpiArray[0][1].Without_mobile )*100).toFixed(0) );
            break;

            case "conversion":
                elementToCreate.push( ( kpiArray[0][1].desk   / kpiArray[0][1].Without_desk  *100).toFixed(0) );
                elementToCreate.push( ( kpiArray[0][1].tablet / kpiArray[0][1].Without_tablet*100).toFixed(0) );
                elementToCreate.push( ( kpiArray[0][1].mobile / kpiArray[0][1].Without_mobile*100).toFixed(0) );
            break; 
        };

        graphicDevice(elementToCreate)
    };


    /** Función para construir la estructura de las gráficas */
    function buildStructureToGraphics(array){

        /** La gráfica acepta dos arreglos con valores para renderizar */
        let elementToReturn = {}

        array.map( registry => { 
            if( !(registry.Mes in elementToReturn) ) 
            elementToReturn[registry.Mes] = null;
        })

        Object.entries(elementToReturn).forEach( ([key,value])=>{
            let 
            registry = array.filter( registry => registry.Mes == key)
            elementToReturn[key] = registry
        });

        return elementToReturn;

    };

        /** Función para renderizar la grafica de la card usabilidad */
        function graphicUsability(object){

            document.body.querySelector('.graphicUsabilityRender').innerHTML = ``;

            const 
            canvas = document.createElement('CANVAS');
            canvas.id="chartUsability";
            canvas.classList.add('graphicTableKpi');

            document.body.querySelector('.graphicUsabilityRender').appendChild(canvas);

            const ctx = document.body.querySelector('#chartUsability').getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                  labels: ['Sin', 'Con'],
                  datasets: [{
                    label: 'Sin VS Con',
                    data: [object.withOut, object.with], // El primer valor es el valor de la referencia
                    borderWidth: 1,
                    backgroundColor: ['#ffaf00', '#0082ac'],
                    barThickness: 40,
                    borderWidth: 3,
                    borderRadius: 10
                  }]
                },
                options: {
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  },
                  plugins: {
                    legend: {
                      display: false, 
                      position: 'top' 
                    }
                  }
                }
            });
            
        };

        /** Función para renderizar la grafica de la card Engagement */
        function graphicEngagement(object){

            document.body.querySelector('.graphicEngagementRender').innerHTML = ``;

            const 
            canvas = document.createElement('CANVAS');
            canvas.id="chartEngagement";
            canvas.classList.add('graphicTableKpi');

            document.body.querySelector('.graphicEngagementRender').appendChild(canvas);

            const ctx = document.body.querySelector('#chartEngagement').getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Sin', `Con`],
                    datasets: [{
                    label: 'Sin VS Con',
                    data: [object.withOut, object.with], // El primer valor es el valor de la referencia
                    borderWidth: 1,
                    backgroundColor: ['#ffaf00', '#0082ac'],
                    barThickness: 40,
                    borderWidth: 3,
                    borderRadius: 10
                    }]
                },
                options: {
                    scales: {
                    y: {
                        beginAtZero: true
                    }
                    },
                    plugins: {
                        legend: {
                          display: false, 
                          position: 'top' 
                        }
                      }
                }
            });
            
        };

        /** Función para renderizar la gráfica de la card Add To Car*/
        function graphicAddToCar(object){

            document.body.querySelector('.graphicAddToCarRender').innerHTML = ``;

            const 
            canvas = document.createElement('CANVAS');
            canvas.id="chartAddToCar";
            canvas.classList.add('graphicTableKpi');

            document.body.querySelector('.graphicAddToCarRender').appendChild(canvas);

            const ctx = document.body.querySelector('#chartAddToCar').getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Sin', `Con`],
                    datasets: [{
                    label: 'Sin VS Con',
                    data: [object.withOut, object.with], // El primer valor es el valor de la referencia
                    borderWidth: 1,
                    backgroundColor: ['#ffaf00', '#0082ac'],
                    barThickness: 40,
                    borderWidth: 3,
                    borderRadius: 10
                    }]
                },
                options: {
                    scales: {
                    y: {
                        beginAtZero: true
                    }
                    },
                    plugins: {
                        legend: {
                          display: false, 
                          position: 'top' 
                        }
                      }
                }
            });

        };

        /** Función para renderizar la gráfica de Conversión */
        function graphicPurchase(object){

            document.body.querySelector('.graphicPurchaseRender').innerHTML = ``;

            const 
            canvas = document.createElement('CANVAS');
            canvas.id="chartPurchase";
            canvas.classList.add('graphicTableKpi');

            document.body.querySelector('.graphicPurchaseRender').appendChild(canvas);

            const ctx = document.body.querySelector('#chartPurchase').getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Sin', `Con`],
                    datasets: [{
                    label: 'Sin VS Con',
                    data: [object.withOut, object.with], // El primer valor es el valor de la referencia
                    borderWidth: 1,
                    backgroundColor: ['#ffaf00', '#0082ac'],
                    barThickness: 40,                    
                    borderWidth: 3,
                    borderRadius: 10
                    }]
                },
                options: {
                    scales: {
                    y: {
                        beginAtZero: true
                    }
                    },
                    plugins: {
                        legend: {
                          display: false, 
                          position: 'top' 
                        }
                      }
                }
            });
        };

        function graphicDevice(values){

            document.body.querySelector('.containerGraphicDevice').innerHTML = ``;

            const 
            canvas = document.createElement('CANVAS');
            canvas.id="chartDevice";
            canvas.classList.add('graphicTableKpiDevice');

            document.body.querySelector('.containerGraphicDevice').appendChild(canvas);

            const ctx = document.body.querySelector('#chartDevice').getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                  labels: ['Desk', 'Tablets', 'Mobile'],
                  datasets: [{
                    label: '',
                    data: [values[0], values[1],values[2] ], 
                    backgroundColor: ['#ff8604', '#0082ac', '#ffaf00'],
                    hoverOffset: 4,
                    barThickness: 80,
                    borderWidth: 3,
                    borderRadius: 15
                  }]
                },
                options: {
                  plugins: {
                    legend: {
                      display: false, 
                      position: 'top' 
                    },
                    title: {
                      display: true,
                      text: `Dispositivo por ${kpiActual}`,
                      color: '#0082ac' ,
                      font: {
                        size: 18 
                      },
                    }
                  }
                }
            });

        };


    /** Función para renderizar la gráfica para la comparación de HISTORICA  */
    function renderComparationGraphic(data,kpi){

        document.body.querySelector('#historicGraphic').remove()
        
        const 
        canvas = document.createElement('CANVAS');;
        canvas.id='historicGraphic';
        canvas.classList.add('historicGraphicClass')
        document.body.querySelector('.containerHistoricGraphic').appendChild(canvas);

        var ctx = document.getElementById('historicGraphic').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.months ,
                datasets: [{
                    data: data.diferences,
                    backgroundColor: [ '#007297', ' #f47920', '#ffaf00'] ,
                    pointRadius: 8, 
                    pointHoverRadius: 10
                }]
            },
            options: {
                plugins:{
                    legend: {
                        display: false, 
                        position: 'top' 
                      },
                      title: {
                        display: true,
                        text: `Histórico por ${kpi}`,
                        color: '#0082ac' ,
                        font: {
                          size: 18 
                        },
                      }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                barThickness: 100
            }
            
        });
    
    };


/** _______________ Renderizadores _______________*/

    /** Función para construir la tabla de datos generales */
    function buildTable(){

        const usability     = buildUsability(arrayToTable);
        const engagement    = buildEngagement(arrayToTable);
        const addToCar      = buildAddToCar(arrayToTable);
        const purchase      = buildPurchase(arrayToTable);

        /** Imprimiendo la usabilidad Con y Sin interacción */
        document.body.querySelector('.usabilityWith').innerHTML     = `Con interacción: <span class="valorKPI">${usability.with}</span>`;
        document.body.querySelector('.usabilityWithOut').innerHTML  = `Sin interacción: <span class="valorKPI">${usability.withOut}</span>`;
        document.body.querySelector('.diferenceUsability').innerHTML= `% Diferencia : ${usability.diference}%`;

        /** Imprimiendo la usabilidad Con y Sin interacción */
        document.body.querySelector('.engagementWith').innerHTML    = `Con interacción: <span class="valorKPI">${engagement.withFormat}</span>`;
        document.body.querySelector('.engagementWithOut').innerHTML = `Sin interacción: <span class="valorKPI">${engagement.withOutFormat}</span>`;
        document.body.querySelector('.diferenceEngagement').innerHTML= `% Diferencia : ${engagement.diference}%`;

        /** Impirmiendo el add To Car Con y Ain interacción */
        document.body.querySelector('.addToCarWith').innerHTML      = `Con interacción: <span class="valorKPI">${addToCar.with}%</span>`;
        document.body.querySelector('.addToCarWithOut').innerHTML   = `Sin interacción: <span class="valorKPI">${addToCar.withOut}%</span>`;
        document.body.querySelector('.diferenceAddToCar').innerHTML = `% Diferencia : ${addToCar.diference}%`;

        /** Imprimiendo la conversión Con y Sin  interacción */
        document.body.querySelector('.purchaseWith').innerHTML      = `Con interacción: <span class="valorKPI">${purchase.with}%</span>`;
        document.body.querySelector('.purchaseWithOut').innerHTML   = `Sin interacción: <span class="valorKPI">${purchase.withOut}%</span>`;
        document.body.querySelector('.diferencePurchase').innerHTML = `% Diferencia : ${purchase.diference}%`;

        /** Renderizar la gráfica de usabilidad */
        graphicUsability(usability);

        /** Renderizar la gráfica de Engagement */
        graphicEngagement(engagement);

        /** Renderizar la gráfica de AddToCar */
        graphicAddToCar(addToCar);

        /** Renderizar la gráfica de Purchase */
        graphicPurchase(purchase);

    };

    /** Función para construir la gráfica de comparación */
    function buildGraphic( kpi ){

        kpiActual = kpi

        let elementToReturn = {
            months      :[],
            diferences  :[]
        }
        const createStructure = buildStructureToGraphics(arrayToGraphic);

        switch(kpi){
            case 'usabilidad':
                Object.entries(createStructure).forEach(([key])=>{
                    elementToReturn.months.push(key);
                    elementToReturn.diferences.push( buildUsability(createStructure[key]).diference )
                });
                break;
            case 'duracion_sesion':
                Object.entries(createStructure).forEach(([key])=>{
                    elementToReturn.months.push(key);
                    elementToReturn.diferences.push( buildEngagement(createStructure[key]).diference )
                });
                break;
            case 'añadir_al_carrito':
                Object.entries(createStructure).forEach(([key])=>{
                    elementToReturn.months.push(key);
                    elementToReturn.diferences.push( buildAddToCar(createStructure[key]).diference )
                });
                break;
            case 'conversion':
                Object.entries(createStructure).forEach(([key])=>{
                    elementToReturn.months.push(key);
                    elementToReturn.diferences.push( buildPurchase(createStructure[key]).diference )
                });
                break;
        }
        renderComparationGraphic(elementToReturn,kpi)
    };



/** Eventos que actualiza la información */
document.body.querySelector('.selectCountry' ).addEventListener('input', ()=>{filterProcess(); buildGraphic(kpiActual); buildInfoDevice()} , false);
document.body.querySelector('.selectDate'    ).addEventListener('input', filterProcess , false);
document.body.querySelector('.selectCategory').addEventListener('input', filterProcess , false);
document.body.querySelector('.selectSku').addEventListener('input', filterProcess , false);

/** Evento que construye la gráfica */
document.body.querySelector('.kpiSelect').addEventListener('input', (e)=>{buildGraphic(e.target.value);  buildInfoDevice();} , false);

filterProcess();
buildGraphic(kpiActual);
buildInfoDevice();
// buildComparationCountry()





